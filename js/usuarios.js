exigirAdmin().then(() => {
  construirShell({ titulo: 'Usuarios', subtitulo: 'Gestión y control de cuentas de clientes' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-usuarios').content.cloneNode(true));
  pintarIconos();
  inicializar();
});

let ESTADO = { busqueda: '', estado: '', pagina: 1, limite: 15 };

function filaUsuario(u) {
  return `
    <tr class="clickeable" data-id="${esc(u.id)}">
      <td>
        <div class="celda-usuario">
          <div class="avatar">${esc(iniciales(u.fullName))}</div>
          <div>
            <div class="nombre">${esc(u.fullName)}</div>
            <div class="correo">${esc(u.email)}</div>
          </div>
        </div>
      </td>
      <td class="celda-mono">${esc(u.dni || '—')}</td>
      <td class="celda-mono">${esc(u.phone || '—')}</td>
      <td class="celda-mono">${u.availableBalance != null ? formatoDinero(u.availableBalance) : '—'}</td>
      <td>${badgeEstadoUsuario(u)}</td>
      <td style="color:var(--ink-faint)">${formatoFecha(u.createdAt)}</td>
      <td><button class="tabla-accion-btn" data-ver="${esc(u.id)}" title="Ver detalle">${icono('external', 15)}</button></td>
    </tr>`;
}

async function cargarTabla() {
  const tbody = document.getElementById('tabla-usuarios');
  tbody.innerHTML = `<tr><td colspan="7" style="padding:8px 16px">${marcadorCarga(40)}</td></tr>`.repeat(1);

  try {
    const r = await adminApi.listarUsuarios(ESTADO);
    tbody.innerHTML = r.items.length
      ? r.items.map(filaUsuario).join('')
      : `<tr><td colspan="7"><div class="vacio">${icono('users', 32)}<p>No se encontraron usuarios con ese criterio.</p></div></td></tr>`;

    tbody.querySelectorAll('tr[data-id]').forEach((tr) => tr.addEventListener('click', () => abrirDetalle(tr.dataset.id)));

    const host = document.getElementById('paginacion-host');
    host.innerHTML = '';
    host.appendChild(renderPaginacion(r.total, r.pagina, r.limite, (p) => { ESTADO.pagina = p; cargarTabla(); }));
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="vacio">${icono('x', 28)}<p>${esc(mensajeError(err))}</p></div></td></tr>`;
  }
}

function inicializar() {
  cargarTabla();

  document.getElementById('buscar').addEventListener('input', conDebounce((e) => {
    ESTADO.busqueda = e.target.value.trim();
    ESTADO.pagina = 1;
    cargarTabla();
  }));

  document.getElementById('filtro-estado').addEventListener('change', (e) => {
    ESTADO.estado = e.target.value;
    ESTADO.pagina = 1;
    cargarTabla();
  });
}

// ============================================================
// Panel lateral de detalle
// ============================================================
async function abrirDetalle(id) {
  const fondo = abrirDrawer(`
    <div class="drawer-header"><h3>Detalle del usuario</h3><span data-cerrar-drawer data-icon="x" style="cursor:pointer;opacity:.6"></span></div>
    <div class="drawer-body" id="drawer-body" style="display:flex;align-items:center;justify-content:center"><span class="spinner"></span></div>
  `);

  try {
    const d = await adminApi.detalleUsuario(id);
    pintarDetalle(d);
  } catch (err) {
    document.getElementById('drawer-body').innerHTML = `<div class="vacio">${icono('x', 28)}<p>${esc(mensajeError(err))}</p></div>`;
  }
}

function pintarDetalle(d) {
  const u = d.usuario;
  const body = document.getElementById('drawer-body');
  const eliminado = !!u.deletedAt;

  body.style.display = 'block';
  body.innerHTML = `
    <div class="fila gap-m" style="margin-bottom:18px">
      <div class="avatar" style="width:54px;height:54px;font-size:18px">${esc(iniciales(u.fullName))}</div>
      <div style="min-width:0;flex:1">
        <div style="font-family:var(--f-heading);font-weight:800;font-size:16px">${esc(u.fullName)}</div>
        <div style="font-size:12.5px;color:var(--ink-faint)">${esc(u.email)}</div>
      </div>
      ${badgeEstadoUsuario(u)}
    </div>

    <div class="card card-pad" style="background:rgba(255,255,255,.02);margin-bottom:18px">
      <div class="fila entre" style="margin-bottom:14px">
        <span style="font-family:var(--f-heading);font-weight:700;font-size:13px">Datos personales</span>
        <button class="tabla-accion-btn" id="btn-editar" title="Editar">${icono('edit', 14)}</button>
      </div>
      <div id="vista-datos" style="display:flex;flex-direction:column;gap:11px;font-size:13px">
        <div class="fila entre"><span style="color:var(--ink-faint)">DNI</span><b>${esc(u.dni || '—')}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Teléfono</span><b>${esc(u.phone || '—')}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Intentos fallidos</span><b>${u.failedLoginAttempts}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Cliente desde</span><b>${formatoFecha(u.createdAt)}</b></div>
      </div>
      <form id="form-editar" class="oculto" style="display:flex;flex-direction:column;gap:12px;margin-top:4px">
        <div class="campo"><label>Nombre completo</label><div class="campo-caja"><input id="ed-nombre" value="${esc(u.fullName)}" /></div></div>
        <div class="campo"><label>Correo</label><div class="campo-caja"><input id="ed-correo" type="email" value="${esc(u.email)}" /></div></div>
        <div class="campo"><label>Teléfono</label><div class="campo-caja"><input id="ed-telefono" value="${esc(u.phone || '')}" /></div></div>
        <div class="campo"><label>DNI</label><div class="campo-caja"><input id="ed-dni" value="${esc(u.dni || '')}" /></div></div>
        <div class="fila gap-s">
          <button type="submit" class="btn btn-dorado btn-sm" style="flex:1">Guardar cambios</button>
          <button type="button" class="btn btn-fantasma btn-sm" id="btn-cancelar-editar">Cancelar</button>
        </div>
      </form>
    </div>

    ${d.cuenta ? `
    <div class="card card-pad" style="background:rgba(255,255,255,.02);margin-bottom:18px">
      <div style="font-family:var(--f-heading);font-weight:700;font-size:13px;margin-bottom:14px">Cuenta bancaria</div>
      <div style="display:flex;flex-direction:column;gap:11px;font-size:13px">
        <div class="fila entre"><span style="color:var(--ink-faint)">N.º de cuenta</span><b>${esc(d.cuenta.accountNumber)}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Saldo disponible</span><b>${formatoDinero(d.cuenta.availableBalance)}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Línea de crédito</span><b>${formatoDinero(d.cuenta.creditLine)}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Deuda de tarjeta</span><b style="color:var(--rojo)">${formatoDinero(d.cuenta.cardDebt)}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint)">Tarjeta</span><span class="insignia ${d.cuenta.cardBlocked ? 'insignia-rojo' : 'insignia-verde'}">${d.cuenta.cardBlocked ? 'Bloqueada' : 'Activa'}</span></div>
      </div>
    </div>` : ''}

    <div style="margin-bottom:8px;font-family:var(--f-heading);font-weight:700;font-size:13px">Accesos recientes</div>
    <div class="linea-tiempo" style="margin-bottom:20px">
      ${d.eventosLogin.length ? d.eventosLogin.map((e) => `
        <div class="evento-tl">
          <span class="punto ${e.result === 'SUCCESS' ? 'ok' : 'fallo'}"></span>
          <div class="contenido-tl">
            <div class="accion-tl">${esc((RESULTADO_LOGIN_LABEL[e.result] || {}).texto || e.result)}</div>
            <div class="meta-tl">${esc(e.ip || 'IP desconocida')} · ${formatoFechaHora(e.createdAt)}</div>
          </div>
        </div>`).join('') : `<p style="font-size:12.5px;color:var(--ink-faint)">Sin accesos registrados.</p>`}
    </div>

    <div style="margin-bottom:8px;font-family:var(--f-heading);font-weight:700;font-size:13px">Auditoría</div>
    <div class="linea-tiempo" style="margin-bottom:20px">
      ${d.auditoria.length ? d.auditoria.map((a) => `
        <div class="evento-tl">
          <span class="punto ${a.success ? 'ok' : 'fallo'}"></span>
          <div class="contenido-tl">
            <div class="accion-tl">${esc(a.action.replace(/_/g, ' '))}</div>
            <div class="meta-tl">${esc(CATEGORIA_AUDITORIA_LABEL[a.category] || a.category)}${a.city ? ' · ' + esc(a.city) : ''}${a.country ? ', ' + esc(a.country) : ''} · ${formatoFechaHora(a.createdAt)}</div>
          </div>
        </div>`).join('') : `<p style="font-size:12.5px;color:var(--ink-faint)">Sin eventos de auditoría.</p>`}
    </div>

    <div style="margin-bottom:8px;font-family:var(--f-heading);font-weight:700;font-size:13px">Transacciones recientes</div>
    <div>
      ${d.transacciones.length ? d.transacciones.map((t) => `
        <div class="transaccion">
          <div class="info"><div class="nombre">${esc(t.name)}</div><div class="meta">${formatoFechaHora(t.createdAt)}</div></div>
          <div class="monto ${t.kind === 'CREDIT' ? 'credito' : 'debito'}">${t.kind === 'CREDIT' ? '+' : '-'} ${formatoDinero(Math.abs(t.amount))}</div>
        </div>`).join('') : `<p style="font-size:12.5px;color:var(--ink-faint)">Sin transacciones.</p>`}
    </div>
  `;

  pintarIconos(body);

  // ---- editar ----
  document.getElementById('btn-editar').addEventListener('click', () => {
    document.getElementById('vista-datos').classList.add('oculto');
    document.getElementById('form-editar').classList.remove('oculto');
  });
  document.getElementById('btn-cancelar-editar').addEventListener('click', () => {
    document.getElementById('form-editar').classList.add('oculto');
    document.getElementById('vista-datos').classList.remove('oculto');
  });
  document.getElementById('form-editar').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await adminApi.actualizarUsuario(u.id, {
        fullName: document.getElementById('ed-nombre').value.trim(),
        email: document.getElementById('ed-correo').value.trim(),
        phone: document.getElementById('ed-telefono').value.trim() || null,
        dni: document.getElementById('ed-dni').value.trim() || null,
      });
      toast('Datos actualizados.');
      cerrarDrawer();
      cargarTabla();
    } catch (err) {
      toast(mensajeError(err), 'error');
    }
  });

  // ---- footer de acciones ----
  const footer = document.createElement('div');
  footer.className = 'drawer-footer';
  const botones = [];

  if (eliminado) {
    botones.push(`<button class="btn btn-dorado btn-sm" data-accion="restaurar">${icono('restore', 15)} Restaurar cuenta</button>`);
  } else {
    botones.push(
      u.isActive
        ? `<button class="btn btn-peligro btn-sm" data-accion="suspender">${icono('ban', 15)} Suspender</button>`
        : `<button class="btn btn-dorado btn-sm" data-accion="activar">${icono('check', 15)} Reactivar</button>`
    );
    if (u.lockedUntil && new Date(u.lockedUntil) > new Date()) {
      botones.push(`<button class="btn btn-fantasma btn-sm" data-accion="desbloquear">${icono('unlock', 15)} Desbloquear</button>`);
    }
    botones.push(`<button class="btn btn-fantasma btn-sm" data-accion="reset">${icono('key', 15)} Restablecer contraseña</button>`);
    botones.push(`<button class="btn btn-peligro btn-sm" data-accion="eliminar">${icono('trash', 15)} Eliminar cuenta</button>`);
  }

  footer.innerHTML = botones.join('');
  document.querySelector('#drawer-fondo .drawer').appendChild(footer);
  pintarIconos(footer);

  footer.querySelectorAll('[data-accion]').forEach((btn) => {
    btn.addEventListener('click', () => ejecutarAccion(btn.dataset.accion, u, btn));
  });
}

async function ejecutarAccion(accion, u, btn) {
  const confirmaciones = {
    suspender: `¿Suspender la cuenta de ${u.fullName}? No podrá iniciar sesión hasta que la reactives.`,
    eliminar: `¿Eliminar la cuenta de ${u.fullName}? Quedará inaccesible; podrás restaurarla después.`,
    reset: `¿Generar una contraseña nueva para ${u.fullName}? La actual dejará de funcionar.`,
  };
  if (confirmaciones[accion] && !confirm(confirmaciones[accion])) return;

  btn.disabled = true;
  try {
    if (accion === 'suspender') { await adminApi.suspenderUsuario(u.id); toast('Cuenta suspendida.'); }
    else if (accion === 'activar') { await adminApi.activarUsuario(u.id); toast('Cuenta reactivada.'); }
    else if (accion === 'desbloquear') { await adminApi.desbloquearUsuario(u.id); toast('Cuenta desbloqueada.'); }
    else if (accion === 'restaurar') { await adminApi.restaurarUsuario(u.id); toast('Cuenta restaurada.'); }
    else if (accion === 'eliminar') { await adminApi.eliminarUsuario(u.id); toast('Cuenta eliminada.'); }
    else if (accion === 'reset') {
      const r = await adminApi.restablecerContrasena(u.id);
      mostrarContrasenaTemporal(r.temporaryPassword, u.email);
    }
    cerrarDrawer();
    cargarTabla();
  } catch (err) {
    toast(mensajeError(err), 'error');
    btn.disabled = false;
  }
}

function mostrarContrasenaTemporal(pass, correo) {
  const fondo = document.createElement('div');
  fondo.className = 'modal-fondo';
  fondo.innerHTML = `
    <div class="card modal" style="position:relative;text-align:center">
      <span class="modal-cerrar" style="cursor:pointer" id="cerrar-pass-temp">${icono('x', 18)}</span>
      <div style="width:56px;height:56px;border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;background:rgba(201,162,39,.12);color:var(--gold-soft)">${icono('key', 24)}</div>
      <h2 style="font-size:18px">Contraseña temporal generada</h2>
      <p style="color:var(--ink-faint);font-size:12.5px;margin-top:8px">Compártela con ${esc(correo)} por un canal seguro. No volverá a mostrarse.</p>
      <div style="margin:18px 0;padding:16px;background:rgba(255,255,255,.04);border-radius:12px;font-family:var(--f-heading);font-size:20px;letter-spacing:.06em;color:var(--gold-soft)">${esc(pass)}</div>
      <button class="btn btn-dorado btn-block" id="copiar-pass-temp">Copiar al portapapeles</button>
    </div>`;
  document.body.appendChild(fondo);
  fondo.querySelector('#cerrar-pass-temp').addEventListener('click', () => fondo.remove());
  fondo.addEventListener('click', (e) => { if (e.target === fondo) fondo.remove(); });
  fondo.querySelector('#copiar-pass-temp').addEventListener('click', () => {
    navigator.clipboard?.writeText(pass).then(() => toast('Contraseña copiada.'));
  });
}
