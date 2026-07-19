from datetime import date
from database.modelos import UsoDiario, SessionLocal

LIMITES_DIARIOS = {
    "analizar": 20,
    "generar_cv": 15,
    "buscar_ofertas": 10,
    "sugerir_inclusion": 20,
}


def verificar_y_registrar_uso(usuario_id: int, tipo_accion: str) -> dict:
    """
    Verifica si el usuario aun tiene cuota disponible para esta accion hoy.
    Si tiene cuota, registra el uso (incrementa el contador) y permite continuar.
    Si no tiene cuota, devuelve un error sin incrementar nada.
    """
    limite = LIMITES_DIARIOS.get(tipo_accion, 20)
    hoy = date.today()

    sesion = SessionLocal()
    try:
        registro = (
            sesion.query(UsoDiario)
            .filter(
                UsoDiario.usuario_id == usuario_id,
                UsoDiario.tipo_accion == tipo_accion,
                UsoDiario.fecha == hoy,
            )
            .first()
        )

        if not registro:
            registro = UsoDiario(
                usuario_id=usuario_id, tipo_accion=tipo_accion, fecha=hoy, contador=0
            )
            sesion.add(registro)

        if registro.contador >= limite:
            return {
                "permitido": False,
                "mensaje": f"Has alcanzado el limite diario de {limite} usos para esta funcion. "
                f"Vuelve a intentarlo mañana.",
            }

        registro.contador += 1
        sesion.commit()

        return {"permitido": True, "mensaje": ""}

    finally:
        sesion.close()