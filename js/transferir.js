exigirSesion();
construirShell({ titulo: 'Transferir', subtitulo: 'Envía dinero a tus contactos guardados' });

const contenido = document.getElementById('contenido');
contenido.appendChild(document.getElementById('tpl-transferir').content.cloneNode(true));
pintarIconos();

let DESTINATARIOS = [];
let destinatarioElegido = null;

function filaDestinatario(d) {
  const activo = destinatarioElegido?.id === d.id;
  return `
    <div class="fila-lista" data-id="${esc(d.id)}" style="cursor:pointer;border-radius:12px;padding:12px;${activo ? 'background:rgba(201,162,39,.08)' : ''}">
      <div class="avatar">${esc(d.initials)}</div>
      <div class="info" style="flex:1;min-width:0">
        <div class="nombre">${esc(d.name)}</div>
        <div class="meta">${esc(d.bank)} · ${esc(enmascararNumero(d.accountNumber))}</div>
      </div>
      ${activo ? icono('check', 18) : ''}
    </div>`;
}

function renderDestinatarios() {
  const host = document.getElementById('lista-destinatarios');
  host.innerHTML = DESTINATARIOS.length
    ? DESTINATARIOS.map(filaDestinatario).join('')
    : `<div class="vacio" style="padding:24px 10px">${icono('user', 28)}<p>Aún no tienes destinatarios guardados.</p></div>`;

  host.querySelectorAll('[data-id]').forEach((el) => {
    el.addEventListener('click', () => {
      destinatarioElegido = DESTINATARIOS.find((d) => d.id === el.dataset.id);
      renderDestinatarios();
      mostrarElegido();
    });
  });
}

function mostrarElegido() {
  const box = document.getElementById('destinatario-elegido');
  if (!destinatarioElegido) { box.style.display = 'none'; return; }
  box.style.display = 'block';
  box.innerHTML = `
    <div class="fila gap-m">
      <div class="avatar">${esc(destinatarioElegido.initials)}</div>
      <div>
        <div style="font-family:var(--f-heading);font-weight:700;font-size:13.5px">${esc(destinatarioElegido.name)}</div>
        <div style="font-size:12px;color:var(--ink-faint)">${esc(destinatarioElegido.bank)} · ${esc(enmascararNumero(destinatarioElegido.accountNumber))}</div>
      </div>
    </div>`;
}

document.getElementById('btn-nuevo-destinatario').addEventListener('click', () => {
  document.getElementById('form-nuevo').classList.toggle('oculto');
});

document.getElementById('btn-guardar-destinatario').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const name = document.getElementById('nd-nombre').value.trim();
  const bank = document.getElementById('nd-banco').value.trim();
  const accountNumber = document.getElementById('nd-cuenta').value.trim();
  if (!name || !bank || !accountNumber) { toast('Completa todos los campos del destinatario.', 'error'); return; }

  btn.disabled = true;
  try {
    const nuevo = await payeesApi.create({ name, bank, accountNumber });
    DESTINATARIOS.unshift(nuevo);
    destinatarioElegido = nuevo;
    renderDestinatarios();
    mostrarElegido();
    document.getElementById('form-nuevo').classList.add('oculto');
    document.getElementById('nd-nombre').value = '';
    document.getElementById('nd-banco').value = '';
    document.getElementById('nd-cuenta').value = '';
    toast('Destinatario agregado.');
  } catch (err) {
    toast(mensajeError(err), 'error');
  } finally {
    btn.disabled = false;
  }
});

payeesApi.list().then((items) => { DESTINATARIOS = items; renderDestinatarios(); }).catch((err) => toast(mensajeError(err), 'error'));

// ---------- Paso 2: continuar -> pedir OTP ----------
const modalOtp = document.getElementById('modal-otp');
const otpInput = document.getElementById('otp-input');
const otpCajas = document.querySelectorAll('#otp-cajas span');
const otpError = document.getElementById('otp-error');

let transferenciaPendiente = null;

document.getElementById('btn-continuar').addEventListener('click', async () => {
  const monto = Number(document.getElementById('monto').value);
  const concepto = document.getElementById('concepto').value.trim();

  if (!destinatarioElegido) { toast('Elige un destinatario primero.', 'error'); return; }
  if (!monto || monto <= 0) { toast('Ingresa un monto válido.', 'error'); return; }
  if (!concepto) { toast('Escribe un concepto para la transferencia.', 'error'); return; }

  transferenciaPendiente = { payeeId: destinatarioElegido.id, amount: monto, concept: concepto };

  const boton = document.getElementById('btn-continuar');
  boton.disabled = true;
  boton.innerHTML = '<span class="spinner"></span> Enviando código…';
  try {
    await transfersApi.requestOtp();
    abrirOtp();
  } catch (err) {
    toast(mensajeError(err), 'error');
  } finally {
    boton.disabled = false;
    boton.textContent = 'Continuar';
  }
});

function abrirOtp() {
  otpInput.value = '';
  otpError.classList.add('oculto');
  pintarOtp();
  modalOtp.classList.remove('oculto');
  setTimeout(() => otpInput.focus(), 50);
}
function cerrarOtp() { modalOtp.classList.add('oculto'); }

document.getElementById('cerrar-otp').addEventListener('click', cerrarOtp);
modalOtp.addEventListener('click', (e) => { if (e.target === modalOtp) cerrarOtp(); });

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

document.getElementById('btn-reenviar-otp').addEventListener('click', async () => {
  try {
    await transfersApi.requestOtp();
    toast('Te enviamos un nuevo código.');
  } catch (err) {
    toast(mensajeError(err), 'error');
  }
});

async function confirmarOtp() {
  const btn = document.getElementById('btn-confirmar-otp');
  btn.disabled = true;
  otpError.classList.add('oculto');
  try {
    const recibo = await transfersApi.execute({ ...transferenciaPendiente, otpCode: otpInput.value });
    cerrarOtp();
    mostrarRecibo(recibo);
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

// ---------- Recibo ----------
const modalRecibo = document.getElementById('modal-recibo');
function mostrarRecibo(r) {
  document.getElementById('detalle-recibo').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Monto</span><b style="font-family:var(--f-heading)">${formatoDinero(r.amount)}</b></div>
      <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Destinatario</span><b>${esc(r.payee.name)}</b></div>
      <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Banco</span><b>${esc(r.payee.bank)}</b></div>
      <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Concepto</span><b>${esc(r.concept)}</b></div>
      <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">N.º de operación</span><b>${esc(r.reference)}</b></div>
      <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Fecha</span><b>${formatoFechaHora(r.createdAt)}</b></div>
    </div>`;
  modalRecibo.classList.remove('oculto');
}
document.getElementById('cerrar-recibo').addEventListener('click', () => { window.location.href = 'dashboard.html'; });
