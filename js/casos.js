exigirAdmin().then(() => {
  construirShell({ titulo: 'Casos de seguridad', subtitulo: 'Seguimiento de fraude y cuentas comprometidas' });
  const contenido = document.getElementById('contenido');
  contenido.appendChild(document.getElementById('tpl-casos').content.cloneNode(true));
  pintarIconos();
  inicializar();
});

let ESTADO = { busqueda: '', estado: '', prioridad: '', pagina: 1, limite: 20 };

function filaCaso(c) {
  return `
    <tr class="clickeable" data-id="${esc(c.id)}">
      <td>
        <div class="celda-usuario">
          <div class="avatar">${esc(iniciales(c.usuarioNombre))}</div>
          <div>
            <div class="nombre">${esc(c.usuarioNombre)}</div>
            <div class="correo">${esc(c.usuarioEmail)}</div>
          </div>
        </div>
      </td>
      <td><span class="insignia insignia-dorado">${esc(CATEGORIA_CASO_LABEL[c.categoria] || c.categoria)}</span></td>
      <td><span class="insignia ${PRIORIDAD_CASO_LABEL[c.prioridad].clase}">${PRIORIDAD_CASO_LABEL[c.prioridad].texto}</span></td>
      <td><span class="insignia ${ESTADO_CASO_LABEL[c.estado].clase}">${ESTADO_CASO_LABEL[c.estado].texto}</span></td>
      <td style="color:var(--ink-faint)">${esc(c.adminAsignadoNombre || '—')}</td>
      <td style="color:var(--ink-faint)">${formatoFecha(c.createdAt)}</td>
      <td><button class="tabla-accion-btn" title="Ver / actualizar">${icono('external', 15)}</button></td>
    </tr>`;
}

async function cargarTabla() {
  const tbody = document.getElementById('tabla-casos');
  tbody.innerHTML = `<tr><td colspan="7" style="padding:8px 16px">${marcadorCarga(40)}</td></tr>`;

  try {
    const r = await adminApi.listarCasos(ESTADO);
    tbody.innerHTML = r.items.length
      ? r.items.map(filaCaso).join('')
      : `<tr><td colspan="7"><div class="vacio">${icono('alertTriangle', 32)}<p>No hay casos con esos filtros.</p></div></td></tr>`;

    tbody.querySelectorAll('tr[data-id]').forEach((tr) => tr.addEventListener('click', () => abrirCaso(tr.dataset.id, r.items.find((c) => c.id === tr.dataset.id))));

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
  document.getElementById('filtro-prioridad').addEventListener('change', (e) => {
    ESTADO.prioridad = e.target.value;
    ESTADO.pagina = 1;
    cargarTabla();
  });

  document.getElementById('cerrar-modal-caso').addEventListener('click', cerrarModalCaso);
  document.getElementById('modal-caso').addEventListener('click', (e) => {
    if (e.target.id === 'modal-caso') cerrarModalCaso();
  });
}

function cerrarModalCaso() {
  document.getElementById('modal-caso').classList.add('oculto');
}

function abrirCaso(id, resumen) {
  const host = document.getElementById('detalle-caso-host');
  host.innerHTML = `
    <div class="fila gap-m" style="margin-bottom:6px">
      <div class="avatar">${esc(iniciales(resumen.usuarioNombre))}</div>
      <div>
        <div style="font-family:var(--f-heading);font-weight:700;font-size:14px">${esc(resumen.usuarioNombre)}</div>
        <div style="font-size:11.5px;color:var(--ink-faint)">${esc(resumen.usuarioEmail)}</div>
      </div>
    </div>
    <div class="divisor" style="margin:16px 0"></div>
    <form id="form-caso" style="display:flex;flex-direction:column;gap:14px">
      <div class="campo">
        <label>Estado</label>
        <select class="select-filtro" id="caso-estado" style="width:100%">
          <option value="ABIERTO" ${resumen.estado === 'ABIERTO' ? 'selected' : ''}>Abierto</option>
          <option value="EN_REVISION" ${resumen.estado === 'EN_REVISION' ? 'selected' : ''}>En revisión</option>
          <option value="CERRADO" ${resumen.estado === 'CERRADO' ? 'selected' : ''}>Cerrado</option>
        </select>
      </div>
      <div class="campo">
        <label>Prioridad</label>
        <select class="select-filtro" id="caso-prioridad-edit" style="width:100%">
          <option value="BAJA" ${resumen.prioridad === 'BAJA' ? 'selected' : ''}>Baja</option>
          <option value="MEDIA" ${resumen.prioridad === 'MEDIA' ? 'selected' : ''}>Media</option>
          <option value="ALTA" ${resumen.prioridad === 'ALTA' ? 'selected' : ''}>Alta</option>
        </select>
      </div>
      <div class="campo">
        <label>Resolución</label>
        <div class="campo-caja" style="align-items:flex-start;padding:10px 12px;height:auto">
          <textarea id="caso-resolucion" rows="3" placeholder="Qué se encontró / cómo se resolvió…" style="flex:1;background:transparent;border:none;outline:none;color:var(--ink);font-family:var(--f-body);font-size:13px;resize:vertical"></textarea>
        </div>
      </div>
      <button type="submit" class="btn btn-dorado btn-block">Guardar cambios</button>
    </form>
  `;
  document.getElementById('modal-caso').classList.remove('oculto');

  document.getElementById('form-caso').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await adminApi.actualizarCaso(id, {
        estado: document.getElementById('caso-estado').value,
        prioridad: document.getElementById('caso-prioridad-edit').value,
        resolucion: document.getElementById('caso-resolucion').value.trim() || undefined,
      });
      toast('Caso actualizado.');
      cerrarModalCaso();
      cargarTabla();
    } catch (err) {
      toast(mensajeError(err), 'error');
    }
  });
}
