exigirSesion();
construirShell({ titulo: 'Perfil', subtitulo: 'Tus datos y preferencias de seguridad' });

const contenido = document.getElementById('contenido');
contenido.appendChild(document.getElementById('tpl-perfil').content.cloneNode(true));
pintarIconos();

const ALERTAS_LABEL = {
  compra: ['Alertas de compra', 'Te avisamos ante cada consumo con tu tarjeta'],
  retiro: ['Alertas de retiro', 'Te avisamos ante cada retiro en cajero'],
  login: ['Inicios de sesión', 'Te avisamos cuando alguien entra a tu cuenta'],
  promo: ['Promociones', 'Ofertas y novedades de NovaBank'],
};
const GEO_LABEL = {
  geoPeru: ['Consumos en Perú', 'Permite operaciones dentro del país'],
  geoIntl: ['Consumos internacionales', 'Permite operaciones fuera de Perú'],
};

function pintarUsuario(u) {
  document.getElementById('perfil-avatar').textContent = iniciales(u.fullName);
  document.getElementById('perfil-nombre').textContent = u.fullName || '—';
  document.getElementById('perfil-dni').textContent = u.dni ? `DNI ${u.dni}` : 'Sin DNI registrado';
  document.getElementById('perfil-correo').textContent = u.email || '—';
  document.getElementById('perfil-telefono').textContent = u.phone || 'No registrado';
}

async function cargar() {
  const [usuario, alertas, limites] = await Promise.all([
    authApi.me(),
    securityApi.getAlerts().catch(() => null),
    securityApi.getLimits().catch(() => null),
  ]);

  localStorage.setItem('nb_user', JSON.stringify(usuario));
  pintarUsuario(usuario);

  if (alertas) {
    document.getElementById('lista-alertas').innerHTML = Object.entries(ALERTAS_LABEL)
      .map(([clave, [titulo, sub]]) => filaInterruptor('alerta-' + clave, titulo, sub, alertas[clave]))
      .join('');
    Object.keys(ALERTAS_LABEL).forEach((clave) => {
      document.getElementById('alerta-' + clave).addEventListener('change', async (e) => {
        try {
          const nuevas = { ...alertas, [clave]: e.target.checked };
          await securityApi.updateAlerts(nuevas);
          alertas[clave] = e.target.checked;
          toast('Preferencia actualizada.');
        } catch (err) {
          e.target.checked = !e.target.checked;
          toast(mensajeError(err), 'error');
        }
      });
    });
  }

  if (limites) {
    document.getElementById('limite-online').value = limites.limitOnline;
    document.getElementById('limite-atm').value = limites.limitAtm;
    document.getElementById('lista-geo').innerHTML = Object.entries(GEO_LABEL)
      .map(([clave, [titulo, sub]]) => filaInterruptor('geo-' + clave, titulo, sub, limites[clave]))
      .join('');

    document.getElementById('btn-guardar-limites').addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      try {
        await securityApi.updateLimits({
          limitOnline: Number(document.getElementById('limite-online').value),
          limitAtm: Number(document.getElementById('limite-atm').value),
          geoPeru: document.getElementById('geo-geoPeru').checked,
          geoIntl: document.getElementById('geo-geoIntl').checked,
        });
        toast('Límites actualizados.');
      } catch (err) {
        toast(mensajeError(err), 'error');
      } finally {
        btn.disabled = false;
      }
    });
  }
}

function filaInterruptor(id, titulo, sub, valor) {
  return `
    <div class="fila entre">
      <div style="padding-right:14px">
        <div style="font-weight:600;font-size:13.5px">${esc(titulo)}</div>
        <div style="font-size:11.5px;color:var(--ink-faint);margin-top:2px">${esc(sub)}</div>
      </div>
      <label class="interruptor"><input type="checkbox" id="${id}" ${valor ? 'checked' : ''} /><span class="slider"></span></label>
    </div>`;
}

cargar().catch((err) => toast(mensajeError(err), 'error'));

// ---------- Modal OTP genérico (correo / teléfono / contraseña) ----------
const modalOtp = document.getElementById('modal-otp');
const otpInput = document.getElementById('otp-input');
const otpCajas = document.querySelectorAll('#otp-cajas span');
const otpError = document.getElementById('otp-error');
const campoExtra = document.getElementById('otp-campo-extra');

let accionActual = null;

function abrirOtp(accion) {
  accionActual = accion;
  otpInput.value = '';
  otpError.classList.add('oculto');
  pintarOtp();

  if (accion === 'correo') {
    document.getElementById('otp-titulo').textContent = 'Cambiar correo';
    document.getElementById('otp-sub').textContent = 'Ingresa tu nuevo correo y el código que te enviamos.';
    campoExtra.innerHTML = `<label>Nuevo correo</label><div class="campo-caja"><span data-icon="mail"></span><input id="valor-nuevo" type="email" placeholder="nuevo@correo.com" /></div>`;
  } else if (accion === 'telefono') {
    document.getElementById('otp-titulo').textContent = 'Cambiar teléfono';
    document.getElementById('otp-sub').textContent = 'Ingresa tu nuevo número y el código que te enviamos.';
    campoExtra.innerHTML = `<label>Nuevo teléfono</label><div class="campo-caja"><span data-icon="phone"></span><input id="valor-nuevo" type="tel" placeholder="987654321" /></div>`;
  } else {
    document.getElementById('otp-titulo').textContent = 'Cambiar contraseña';
    document.getElementById('otp-sub').textContent = 'Ingresa tu contraseña actual, la nueva, y el código enviado.';
    campoExtra.innerHTML = `
      <label>Contraseña actual</label>
      <div class="campo-caja" style="margin-bottom:12px"><span data-icon="lock"></span><input id="valor-actual" type="password" /></div>
      <label>Nueva contraseña</label>
      <div class="campo-caja"><span data-icon="lock"></span><input id="valor-nuevo" type="password" placeholder="Mín. 10, 1 mayúscula, 1 número" /></div>`;
  }
  campoExtra.classList.remove('oculto');
  pintarIconos(campoExtra);
  modalOtp.classList.remove('oculto');
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
});

async function iniciarAccion(accion) {
  try {
    await profileApi.requestOtp();
    abrirOtp(accion);
  } catch (err) {
    toast(mensajeError(err), 'error');
  }
}
document.getElementById('btn-editar-correo').addEventListener('click', () => iniciarAccion('correo'));
document.getElementById('btn-editar-telefono').addEventListener('click', () => iniciarAccion('telefono'));
document.getElementById('btn-editar-clave').addEventListener('click', () => iniciarAccion('clave'));

document.getElementById('btn-confirmar-otp').addEventListener('click', async () => {
  const btn = document.getElementById('btn-confirmar-otp');
  otpError.classList.add('oculto');

  if (otpInput.value.length !== 6) { otpError.textContent = 'Ingresa el código de 6 dígitos.'; otpError.classList.remove('oculto'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Confirmando…';
  try {
    if (accionActual === 'correo') {
      const nuevo = document.getElementById('valor-nuevo').value.trim();
      if (!nuevo) throw new Error('Ingresa el nuevo correo.');
      const u = await profileApi.updateEmail(nuevo, otpInput.value);
      localStorage.setItem('nb_user', JSON.stringify(u));
      pintarUsuario(u);
      toast('Correo actualizado.');
    } else if (accionActual === 'telefono') {
      const nuevo = document.getElementById('valor-nuevo').value.trim();
      if (!nuevo) throw new Error('Ingresa el nuevo teléfono.');
      const u = await profileApi.updatePhone(nuevo, otpInput.value);
      localStorage.setItem('nb_user', JSON.stringify(u));
      pintarUsuario(u);
      toast('Teléfono actualizado.');
    } else {
      const actual = document.getElementById('valor-actual').value;
      const nueva = document.getElementById('valor-nuevo').value;
      if (!actual || !nueva) throw new Error('Completa ambas contraseñas.');
      await profileApi.updatePassword(actual, nueva, otpInput.value);
      toast('Contraseña actualizada.');
    }
    cerrarOtp();
  } catch (err) {
    otpError.textContent = mensajeError(err, 'No se pudo confirmar.');
    otpError.classList.remove('oculto');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirmar';
  }
});

document.getElementById('btn-cerrar-sesion-2').addEventListener('click', async () => {
  await authApi.cerrarSesion();
  localStorage.removeItem('nb_user');
  window.location.href = 'index.html';
});
