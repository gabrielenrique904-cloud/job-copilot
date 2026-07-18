export function iniciarContadorEspera(setAviso, segundosIniciales) {
  let segundos = segundosIniciales;
  setAviso(`Espera ${segundos} segundos antes de volver a intentarlo.`);

  const intervalo = setInterval(() => {
    segundos -= 1;
    if (segundos <= 0) {
      clearInterval(intervalo);
      setAviso("");
    } else {
      setAviso(`Espera ${segundos} segundos antes de volver a intentarlo.`);
    }
  }, 1000);
}