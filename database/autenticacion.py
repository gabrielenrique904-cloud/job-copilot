import bcrypt
from datetime import datetime, timedelta
from database.modelos import Usuario, IntentoLogin, SessionLocal

MAXIMO_INTENTOS_FALLIDOS = 5
MINUTOS_VENTANA_BLOQUEO = 15


def registrar_usuario(email: str, password: str) -> dict:
    """
    Registra un nuevo usuario, guardando su contraseña hasheada
    (nunca en texto plano). Devuelve un dict con éxito o error.
    """
    sesion = SessionLocal()

    try:
        usuario_existente = sesion.query(Usuario).filter(Usuario.email == email).first()
        if usuario_existente:
            return {"exito": False, "mensaje": "Ya existe una cuenta con ese email."}

        password_bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password_bytes, salt)

        nuevo_usuario = Usuario(
            email=email,
            password_hash=password_hash.decode("utf-8")
        )
        sesion.add(nuevo_usuario)
        sesion.commit()

        return {"exito": True, "mensaje": "Cuenta creada correctamente."}

    except Exception as error:
        from core.manejo_errores import registrar_error
        registrar_error("Registro de usuario", str(error))
        return {"exito": False, "mensaje": "No pudimos crear la cuenta. Inténtalo de nuevo."}

    finally:
        sesion.close()


def verificar_login(email: str, password: str) -> dict:
    """
    Verifica las credenciales de un usuario al iniciar sesión.
    Nunca compara la contraseña en texto plano: usa bcrypt para
    comparar el hash guardado con lo que el usuario escribió.
    Bloquea temporalmente el login si hay demasiados intentos
    fallidos recientes, protegiendo contra fuerza bruta.
    """
    sesion = SessionLocal()

    try:
        limite_ventana = datetime.utcnow() - timedelta(minutes=MINUTOS_VENTANA_BLOQUEO)

        intentos_recientes = (
            sesion.query(IntentoLogin)
            .filter(IntentoLogin.email == email, IntentoLogin.fecha_intento >= limite_ventana)
            .count()
        )

        if intentos_recientes >= MAXIMO_INTENTOS_FALLIDOS:
            return {
                "exito": False,
                "mensaje": f"Demasiados intentos fallidos. Espera {MINUTOS_VENTANA_BLOQUEO} minutos antes de volver a intentarlo.",
            }

        usuario = sesion.query(Usuario).filter(Usuario.email == email).first()

        if not usuario:
            sesion.add(IntentoLogin(email=email))
            sesion.commit()
            return {"exito": False, "mensaje": "Email o contraseña incorrectos."}

        password_bytes = password.encode("utf-8")
        hash_guardado = usuario.password_hash.encode("utf-8")

        if bcrypt.checkpw(password_bytes, hash_guardado):
            return {"exito": True, "mensaje": "Login correcto.", "usuario_id": usuario.id}
        else:
            sesion.add(IntentoLogin(email=email))
            sesion.commit()
            return {"exito": False, "mensaje": "Email o contraseña incorrectos."}

    except Exception as error:
        from core.manejo_errores import registrar_error
        registrar_error("Login de usuario", str(error))
        return {"exito": False, "mensaje": "No pudimos verificar tus credenciales. Inténtalo de nuevo."}

    finally:
        sesion.close()