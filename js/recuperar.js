redirigirSiYaHaySesion();
pintarIconos();

let correoActual = '';

const otpInput = document.getElementById('otp-input');
const otpCajas = document.querySelectorAll('#otp-cajas span');

function pintarOtp() {
  const valor = otpInput.value;
  otpCajas.forEach((span, i) => {
    span.textContent = valor[i] || '';
    span.classList.toggle('lleno', !!valor[i]);
  });
}
document.querySelectorAll('.otp-caja').forEach((c) => c.addEventListener('click', () => otpInput.focus()));
otpInput.addEventListener('input', () => {
  otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
  pintarOtp();
});

document.getElementById('form-paso-1').addEventListener('submit', async (e) => {
  e.preventDefault();
  const error1 = document.getElementById('error-1');
  error1.classList.add('oculto');

  const correo = document.getElementById('correo').value.trim();
  if (!correo) return;

  const btn = document.getElementById('btn-paso-1');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Enviando…';
  try {
    await authApi.requestPasswordReset(correo);
    correoActual = correo;
    document.getElementById('form-paso-1').classList.add('oculto');
    document.getElementById('form-paso-2').classList.remove('oculto');
    document.getElementById('paso-titulo').textContent = 'Revisa tu correo';
    document.getElementById('paso-sub').textContent = `Ingresa el código que enviamos a ${correo} y tu nueva contraseña.`;
    setTimeout(() => otpInput.focus(), 50);
  } catch (err) {
    error1.textContent = mensajeError(err);
    error1.classList.remove('oculto');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar código';
  }
});

document.getElementById('form-paso-2').addEventListener('submit', async (e) => {
  e.preventDefault();
  const error2 = document.getElementById('error-2');
  error2.classList.add('oculto');

  const codigo = otpInput.value;
  const nueva = document.getElementById('clave-nueva').value;

  if (codigo.length !== 6) { error2.textContent = 'Ingresa el código de 6 dígitos.'; error2.classList.remove('oculto'); return; }
  if (nueva.length < 10) { error2.textContent = 'La contraseña debe tener al menos 10 caracteres.'; error2.classList.remove('oculto'); return; }

  const btn = document.getElementById('btn-paso-2');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Guardando…';
  try {
    await authApi.confirmPasswordReset(correoActual, codigo, nueva);
    document.getElementById('form-paso-2').classList.add('oculto');
    document.getElementById('paso-exito').classList.remove('oculto');
    document.getElementById('paso-titulo').textContent = 'Listo';
    document.getElementById('paso-sub').classList.add('oculto');
  } catch (err) {
    error2.textContent = mensajeError(err, 'Código incorrecto o expirado.');
    error2.classList.remove('oculto');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Restablecer contraseña';
  }
});
