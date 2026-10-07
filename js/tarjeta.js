exigirSesion();
construirShell({ titulo: 'Mi tarjeta', subtitulo: 'Administra tu tarjeta de crédito' });

const contenido = document.getElementById('contenido');
contenido.appendChild(document.getElementById('tpl-tarjeta').content.cloneNode(true));
pintarIconos();

let CUENTA = null;
const usuario = JSON.parse(localStorage.getItem('nb_user') || 'null');

function pintarTarjeta() {
  document.getElementById('tarjeta-numero').textContent = enmascararNumero(CUENTA.cardNumber);
  document.getElementById('tarjeta-titular').textContent = usuario?.fullName || '—';
  document.getElementById('tarjeta-vence').textContent = CUENTA.cardExpiry;
  document.getElementById('tarjeta-visual').classList.toggle('bloqueada', CUENTA.cardBlocked);
  document.getElementById('switch-bloqueo').checked = CUENTA.cardBlocked;

  document.getElementById('resumen-cuenta').innerHTML = `
    <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Línea de crédito</span><b>${formatoDinero(CUENTA.creditLine)}</b></div>
    <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Deuda actual</span><b style="color:var(--rojo)">${formatoDinero(CUENTA.cardDebt)}</b></div>
    <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Pago mínimo</span><b>${formatoDinero(CUENTA.minPayment)}</b></div>
    <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Fecha de corte</span><b>${formatoFecha(CUENTA.cutDate)}</b></div>`;
}

async function cargar() {
  CUENTA = await accountApi.get();
  pintarTarjeta();
}
cargar().catch((err) => toast(mensajeError(err), 'error'));

// ---------- Bloqueo ----------
document.getElementById('switch-bloqueo').addEventListener('change', async (e) => {
  const bloquear = e.target.checked;
  e.target.disabled = true;
  try {
    const r = await accountApi.setCardBlocked(bloquear);
    CUENTA.cardBlocked = r.cardBlocked;
    document.getElementById('tarjeta-visual').classList.toggle('bloqueada', CUENTA.cardBlocked);
    toast(bloquear ? 'Tarjeta bloqueada.' : 'Tarjeta desbloqueada.');
  } catch (err) {
    e.target.checked = !bloquear;
    toast(mensajeError(err), 'error');
  } finally {
    e.target.disabled = false;
  }
});

// ---------- Pago de tarjeta ----------
document.getElementById('btn-pagar').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const monto = Number(document.getElementById('monto-pago').value);
  if (!monto || monto <= 0) { toast('Ingresa un monto válido.', 'error'); return; }

  btn.disabled = true;
  try {
    CUENTA = await accountApi.pagarTarjeta(monto);
    pintarTarjeta();
    document.getElementById('monto-pago').value = '';
    toast('Pago aplicado a tu tarjeta.');
  } catch (err) {
    toast(mensajeError(err), 'error');
  } finally {
    btn.disabled = false;
  }
});

// ---------- Revelar CVV ----------
const modalOtp = document.getElementById('modal-otp');
const otpInput = document.getElementById('otp-input');
const otpCajas = document.querySelectorAll('#otp-cajas span');
const otpError = document.getElementById('otp-error');
const cvvResultado = document.getElementById('cvv-resultado');

document.getElementById('btn-ver-cvv').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Enviando código…';
  try {
    await profileApi.requestOtp();
    abrirOtp();
  } catch (err) {
    toast(mensajeError(err), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Solicitar código de seguridad';
  }
});

function abrirOtp() {
  otpInput.value = '';
  otpError.classList.add('oculto');
  cvvResultado.classList.add('oculto');
  document.getElementById('btn-confirmar-otp').classList.remove('oculto');
  pintarOtp();
  modalOtp.classList.remove('oculto');
  setTimeout(() => otpInput.focus(), 50);
}
document.getElementById('cerrar-otp').addEventListener('click', () => modalOtp.classList.add('oculto'));
modalOtp.addEventListener('click', (e) => { if (e.target === modalOtp) modalOtp.classList.add('oculto'); });

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
  if (otpInput.value.length === 6) confirmarOtp();
});

async function confirmarOtp() {
  const btn = document.getElementById('btn-confirmar-otp');
  btn.disabled = true;
  otpError.classList.add('oculto');
  try {
    const { cvv } = await accountApi.revelarCvv(otpInput.value);
    cvvResultado.textContent = cvv;
    cvvResultado.classList.remove('oculto');
    btn.classList.add('oculto');
  } catch (err) {
    otpError.textContent = mensajeError(err, 'Código incorrecto.');
    otpError.classList.remove('oculto');
    otpInput.value = '';
    pintarOtp();
  } finally {
    btn.disabled = false;
  }
}
document.getElementById('btn-confirmar-otp').addEventListener('click', confirmarOtp);
