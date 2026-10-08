exigirAdmin().then(() => {
  construirShell({ titulo: 'Transacciones', subtitulo: 'Vista global de movimientos de dinero' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-transacciones').content.cloneNode(true));
  pintarIconos();
  inicializar();
});

let ESTADO = { pagina: 1, limite: 25 };

function filaTransaccion(t) {
  const esCredito = t.kind === 'CREDIT';
  return `
    <tr>
      <td>
        <div class="celda-usuario">
          <div class="avatar">${esc(iniciales(t.userName))}</div>
          <div>
            <div class="nombre">${esc(t.userName || 'Cuenta eliminada')}</div>
            <div class="correo">${esc(t.userEmail || '')}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-weight:600">${esc(t.name)}</div>
        ${t.meta ? `<div style="font-size:11.5px;color:var(--ink-faint);margin-top:1px">${esc(t.meta)}</div>` : ''}
      </td>
      <td><span class="insignia insignia-dorado">${esc(CATEGORIA_TRANSACCION_LABEL[t.category] || t.category)}</span></td>
      <td>${esCredito ? `<span class="insignia insignia-verde">${icono('arrowDown', 11)} Ingreso</span>` : `<span class="insignia insignia-rojo">${icono('arrowUp', 11)} Egreso</span>`}</td>
      <td class="celda-mono" style="font-weight:700;color:${esCredito ? 'var(--verde)' : 'var(--ink)'}">${esCredito ? '+' : '-'} ${formatoDinero(Math.abs(t.amount))}</td>
      <td style="color:var(--ink-faint)">${formatoFechaHora(t.createdAt)}</td>
    </tr>`;
}

async function cargarTabla() {
  const tbody = document.getElementById('tabla-transacciones');
  tbody.innerHTML = `<tr><td colspan="6" style="padding:8px 16px">${marcadorCarga(40)}</td></tr>`;

  try {
    const r = await adminApi.transacciones(ESTADO);
    tbody.innerHTML = r.items.length
      ? r.items.map(filaTransaccion).join('')
      : `<tr><td colspan="6"><div class="vacio">${icono('wallet', 32)}<p>No hay transacciones todavía.</p></div></td></tr>`;

    const host = document.getElementById('paginacion-host');
    host.innerHTML = '';
    host.appendChild(renderPaginacion(r.total, r.pagina, r.limite, (p) => { ESTADO.pagina = p; cargarTabla(); }));
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="vacio">${icono('x', 28)}<p>${esc(mensajeError(err))}</p></div></td></tr>`;
  }
}

function inicializar() {
  cargarTabla();
}
