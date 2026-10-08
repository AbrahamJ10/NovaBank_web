exigirAdmin().then(() => {
  construirShell({ titulo: 'Seguridad', subtitulo: 'Sesiones, accesos fallidos y bloqueos' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-seguridad').content.cloneNode(true));
  pintarIconos();
  inicializar();
});

let ESTADO = { correo: '', resultado: '', ip: '', desde: '', hasta: '', pagina: 1, limite: 20 };

function filaEvento(e) {
  const r = RESULTADO_LOGIN_LABEL[e.result] || { texto: e.result, clase: 'insignia-ambar' };
  return `
    <tr>
      <td>
        <div class="celda-usuario">
          <div class="avatar">${esc(iniciales(e.userName || e.email))}</div>
          <div>
            <div class="nombre">${esc(e.userName || 'Sin cuenta')}</div>
            <div class="correo">${esc(e.email)}</div>
          </div>
        </div>
      </td>
      <td><span class="insignia ${r.clase}">${r.texto}</span></td>
      <td class="celda-mono">${esc(e.ip || '—')}</td>
      <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink-faint);font-size:12px">${esc(e.userAgent || '—')}</td>
      <td style="color:var(--ink-faint)">${formatoFechaHora(e.createdAt)}</td>
    </tr>`;
}

async function cargarTabla() {
  const tbody = document.getElementById('tabla-eventos');
  tbody.innerHTML = `<tr><td colspan="5" style="padding:8px 16px">${marcadorCarga(40)}</td></tr>`;

  try {
    const r = await adminApi.eventosLogin(ESTADO);
    tbody.innerHTML = r.items.length
      ? r.items.map(filaEvento).join('')
      : `<tr><td colspan="5"><div class="vacio">${icono('shield', 32)}<p>No se encontraron eventos con esos filtros.</p></div></td></tr>`;

    const host = document.getElementById('paginacion-host');
    host.innerHTML = '';
    host.appendChild(renderPaginacion(r.total, r.pagina, r.limite, (p) => { ESTADO.pagina = p; cargarTabla(); }));
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="vacio">${icono('x', 28)}<p>${esc(mensajeError(err))}</p></div></td></tr>`;
  }
}

function actualizarContadorFiltros() {
  const n = ['ip', 'desde', 'hasta'].filter((k) => ESTADO[k]).length;
  const chip = document.getElementById('cuenta-filtros-activos');
  chip.textContent = n;
  chip.classList.toggle('oculto', n === 0);
}

function inicializar() {
  cargarTabla();

  document.getElementById('buscar').addEventListener('input', conDebounce((e) => {
    ESTADO.correo = e.target.value.trim();
    ESTADO.pagina = 1;
    cargarTabla();
  }));
  document.getElementById('filtro-resultado').addEventListener('change', (e) => {
    ESTADO.resultado = e.target.value;
    ESTADO.pagina = 1;
    cargarTabla();
  });

  const btnToggle = document.getElementById('btn-toggle-avanzados');
  const panel = document.getElementById('filtros-avanzados');
  btnToggle.addEventListener('click', () => {
    panel.classList.toggle('abierto');
    btnToggle.classList.toggle('abierto');
  });

  const aplicarAvanzado = conDebounce(() => {
    ESTADO.ip = document.getElementById('filtro-ip').value.trim();
    ESTADO.desde = document.getElementById('filtro-desde').value;
    ESTADO.hasta = document.getElementById('filtro-hasta').value;
    ESTADO.pagina = 1;
    actualizarContadorFiltros();
    cargarTabla();
  }, 350);

  document.getElementById('filtro-ip').addEventListener('input', aplicarAvanzado);
  document.getElementById('filtro-desde').addEventListener('change', aplicarAvanzado);
  document.getElementById('filtro-hasta').addEventListener('change', aplicarAvanzado);

  document.getElementById('btn-limpiar-filtros').addEventListener('click', () => {
    document.getElementById('filtro-ip').value = '';
    document.getElementById('filtro-desde').value = '';
    document.getElementById('filtro-hasta').value = '';
    ESTADO.ip = ESTADO.desde = ESTADO.hasta = '';
    ESTADO.pagina = 1;
    actualizarContadorFiltros();
    cargarTabla();
  });
}
