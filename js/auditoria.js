exigirAdmin().then(() => {
  construirShell({ titulo: 'Auditoría', subtitulo: 'Rastro completo de acciones en la plataforma' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-auditoria').content.cloneNode(true));
  pintarIconos();
  inicializar();
});

let ESTADO = { busqueda: '', categoria: '', ip: '', desde: '', hasta: '', soloFallidos: false, pagina: 1, limite: 25 };

function filaAuditoria(a) {
  const ubicacion = [a.city, a.country].filter(Boolean).join(', ') || a.ip || '—';
  return `
    <tr>
      <td>
        <div class="celda-usuario">
          <div class="avatar">${esc(iniciales(a.userName || a.userEmail))}</div>
          <div>
            <div class="nombre">${esc(a.userName || 'Sistema')}</div>
            <div class="correo">${esc(a.userEmail || '')}</div>
          </div>
        </div>
      </td>
      <td style="font-weight:600">${esc(a.action.replace(/_/g, ' '))}</td>
      <td><span class="insignia insignia-dorado">${esc(CATEGORIA_AUDITORIA_LABEL[a.category] || a.category)}</span></td>
      <td class="celda-mono" style="font-size:12.5px">${esc(ubicacion)}</td>
      <td>${a.success ? `<span class="insignia insignia-verde">${icono('check', 11)} OK</span>` : `<span class="insignia insignia-rojo">${icono('x', 11)} Falló</span>`}</td>
      <td style="color:var(--ink-faint)">${formatoFechaHora(a.createdAt)}</td>
    </tr>`;
}

async function cargarTabla() {
  const tbody = document.getElementById('tabla-auditoria');
  tbody.innerHTML = `<tr><td colspan="6" style="padding:8px 16px">${marcadorCarga(40)}</td></tr>`;

  try {
    const r = await adminApi.auditoria(ESTADO);
    tbody.innerHTML = r.items.length
      ? r.items.map(filaAuditoria).join('')
      : `<tr><td colspan="6"><div class="vacio">${icono('activity', 32)}<p>No se encontraron eventos con esos filtros.</p></div></td></tr>`;

    const host = document.getElementById('paginacion-host');
    host.innerHTML = '';
    host.appendChild(renderPaginacion(r.total, r.pagina, r.limite, (p) => { ESTADO.pagina = p; cargarTabla(); }));
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="vacio">${icono('x', 28)}<p>${esc(mensajeError(err))}</p></div></td></tr>`;
  }
}

function actualizarContadorFiltros() {
  const n = ['ip', 'desde', 'hasta'].filter((k) => ESTADO[k]).length + (ESTADO.soloFallidos ? 1 : 0);
  const chip = document.getElementById('cuenta-filtros-activos');
  chip.textContent = n;
  chip.classList.toggle('oculto', n === 0);
}

function inicializar() {
  cargarTabla();

  document.getElementById('buscar').addEventListener('input', conDebounce((e) => {
    ESTADO.busqueda = e.target.value.trim();
    ESTADO.pagina = 1;
    cargarTabla();
  }));
  document.getElementById('filtro-categoria').addEventListener('change', (e) => {
    ESTADO.categoria = e.target.value;
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
  document.getElementById('filtro-solo-fallidos').addEventListener('change', (e) => {
    ESTADO.soloFallidos = e.target.checked;
    ESTADO.pagina = 1;
    actualizarContadorFiltros();
    cargarTabla();
  });

  document.getElementById('btn-limpiar-filtros').addEventListener('click', () => {
    document.getElementById('filtro-ip').value = '';
    document.getElementById('filtro-desde').value = '';
    document.getElementById('filtro-hasta').value = '';
    document.getElementById('filtro-solo-fallidos').checked = false;
    ESTADO.ip = ESTADO.desde = ESTADO.hasta = '';
    ESTADO.soloFallidos = false;
    ESTADO.pagina = 1;
    actualizarContadorFiltros();
    cargarTabla();
  });
}
