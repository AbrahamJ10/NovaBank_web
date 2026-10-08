exigirAdmin().then(() => {
  construirShell({ titulo: 'Panel', subtitulo: 'Visión general de NovaBank' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-dashboard').content.cloneNode(true));
  pintarIconos();
  cargar();
});

function filaEventoAuditoria(a) {
  const ok = a.success;
  return `
    <div class="evento-tl">
      <span class="punto ${ok ? 'ok' : 'fallo'}"></span>
      <div class="contenido-tl">
        <div class="accion-tl">${esc(a.action.replace(/_/g, ' '))}</div>
        <div class="meta-tl">${esc(a.userName || a.userEmail || 'Sistema')} · ${esc(CATEGORIA_AUDITORIA_LABEL[a.category] || a.category)} · ${formatoFechaHora(a.createdAt)}</div>
      </div>
    </div>`;
}

function filaLogin(e) {
  const r = RESULTADO_LOGIN_LABEL[e.result] || { texto: e.result, clase: 'insignia-ambar' };
  return `
    <div class="fila-lista" style="padding:12px 4px">
      <div class="avatar">${esc(iniciales(e.userName || e.email))}</div>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--f-heading);font-weight:700;font-size:13px">${esc(e.userName || e.email)}</div>
        <div style="font-size:11.5px;color:var(--ink-faint);margin-top:1px">${esc(e.ip || 'IP desconocida')} · ${formatoFechaHora(e.createdAt)}</div>
      </div>
      <span class="insignia ${r.clase}">${r.texto}</span>
    </div>`;
}

async function cargar() {
  try {
    const stats = await adminApi.stats();
    contarNumero(document.getElementById('kpi-total'), stats.totalUsuarios, { decimales: 0 });
    contarNumero(document.getElementById('kpi-activos'), stats.usuariosActivos, { decimales: 0 });
    contarNumero(document.getElementById('kpi-suspendidos'), stats.usuariosSuspendidos, { decimales: 0 });
    contarNumero(document.getElementById('kpi-bloqueados'), stats.cuentasBloqueadas, { decimales: 0 });
    contarNumero(document.getElementById('kpi-nuevos'), stats.nuevosHoy, { decimales: 0 });
    contarNumero(document.getElementById('kpi-logins'), stats.loginsHoy, { decimales: 0 });
    contarNumero(document.getElementById('kpi-logins-fallidos'), stats.loginsFallidosHoy, { decimales: 0 });
    contarNumero(document.getElementById('kpi-balance'), stats.balanceTotal, { prefijo: 'S/ ' });
  } catch (err) {
    toast(mensajeError(err), 'error');
  }

  try {
    const [auditoria, logins] = await Promise.all([
      adminApi.auditoria({ limite: 8 }),
      adminApi.eventosLogin({ limite: 6 }),
    ]);

    const tl = document.getElementById('actividad-reciente');
    tl.innerHTML = auditoria.items.length
      ? auditoria.items.map(filaEventoAuditoria).join('')
      : `<div class="vacio">${icono('activity', 28)}<p>Sin actividad todavía.</p></div>`;

    const lr = document.getElementById('logins-recientes');
    lr.innerHTML = logins.items.length
      ? logins.items.map(filaLogin).join('')
      : `<div class="vacio">${icono('key', 28)}<p>Sin inicios de sesión todavía.</p></div>`;
  } catch (err) {
    toast(mensajeError(err), 'error');
  }
}
