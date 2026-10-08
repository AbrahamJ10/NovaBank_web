exigirAdmin().then(() => {
  construirShell({ titulo: 'Acciones de staff', subtitulo: 'Bitácora de lo que hace cada administrador' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-acciones').content.cloneNode(true));
  pintarIconos();
  inicializar();
});

let ESTADO = { pagina: 1, limite: 25 };

function detalleAccion(a) {
  if (a.valoresAntes || a.valoresDespues) {
    const antes = a.valoresAntes ? JSON.stringify(a.valoresAntes) : '—';
    const despues = a.valoresDespues ? JSON.stringify(a.valoresDespues) : '—';
    return `<span style="font-size:11px">${esc(antes)} → ${esc(despues)}</span>`;
  }
  if (a.descripcion) return `<span style="font-size:12px">${esc(a.descripcion)}</span>`;
  return '—';
}

function filaAccion(a) {
  return `
    <tr>
      <td>
        <div class="celda-usuario">
          <div class="avatar">${esc(iniciales(a.adminNombre))}</div>
          <div>
            <div class="nombre">${esc(a.adminNombre)}</div>
            <div class="correo">${esc(a.adminEmail)}</div>
          </div>
        </div>
      </td>
      <td style="font-weight:600">${esc(a.accion.replace(/_/g, ' '))}</td>
      <td style="color:var(--ink-mid);font-size:12.5px">${esc(a.usuarioAfectadoNombre || '—')}</td>
      <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink-faint)">${detalleAccion(a)}</td>
      <td style="color:var(--ink-faint)">${formatoFechaHora(a.createdAt)}</td>
    </tr>`;
}

async function cargarTabla() {
  const tbody = document.getElementById('tabla-acciones');
  tbody.innerHTML = `<tr><td colspan="5" style="padding:8px 16px">${marcadorCarga(40)}</td></tr>`;

  try {
    const r = await adminApi.accionesAdmin(ESTADO);
    tbody.innerHTML = r.items.length
      ? r.items.map(filaAccion).join('')
      : `<tr><td colspan="5"><div class="vacio">${icono('history', 32)}<p>Todavía no hay acciones registradas.</p></div></td></tr>`;

    const host = document.getElementById('paginacion-host');
    host.innerHTML = '';
    host.appendChild(renderPaginacion(r.total, r.pagina, r.limite, (p) => { ESTADO.pagina = p; cargarTabla(); }));
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="vacio">${icono('x', 28)}<p>${esc(mensajeError(err))}</p></div></td></tr>`;
  }
}

function inicializar() {
  cargarTabla();
}
