exigirSesion();
construirShell({ titulo: 'Transacciones', subtitulo: 'Historial completo de movimientos' });

const contenido = document.getElementById('contenido');
contenido.appendChild(document.getElementById('tpl-transacciones').content.cloneNode(true));
pintarIconos();

let TODAS = [];
let filtroActivo = 'todos';

function filaTransaccion(t) {
  const esCredito = t.kind === 'credit';
  return `
    <div class="transaccion">
      <div class="ico" style="background:${esc(t.iconBg || 'rgba(201,162,39,.12)')};color:${esc(t.iconFg || '#E7CE92')}">
        ${icono(esCredito ? 'arrowDown' : 'arrowUp', 18)}
      </div>
      <div class="info">
        <div class="nombre">${esc(t.name)}</div>
        <div class="meta">${esc(t.category || '')} · ${formatoFechaHora(t.createdAt)}</div>
      </div>
      <div class="monto ${esCredito ? 'credito' : 'debito'}">${esCredito ? '+' : '-'} ${formatoDinero(Math.abs(t.amount))}</div>
    </div>`;
}

function render() {
  const texto = document.getElementById('buscar').value.trim().toLowerCase();
  const lista = document.getElementById('lista-transacciones');

  const filtradas = TODAS.filter((t) => {
    const pasaFiltro = filtroActivo === 'todos' || t.kind === filtroActivo;
    const pasaBusqueda = !texto || t.name.toLowerCase().includes(texto) || (t.meta || '').toLowerCase().includes(texto);
    return pasaFiltro && pasaBusqueda;
  });

  lista.innerHTML = filtradas.length
    ? filtradas.map(filaTransaccion).join('')
    : `<div class="vacio">${icono('search', 32)}<p>No se encontraron movimientos con ese criterio.</p></div>`;
}

document.getElementById('buscar').addEventListener('input', render);
document.getElementById('filtros').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-filtro]');
  if (!btn) return;
  filtroActivo = btn.dataset.filtro;
  document.querySelectorAll('#filtros .btn').forEach((b) => b.classList.remove('btn-dorado'));
  document.querySelectorAll('#filtros .btn').forEach((b) => b.classList.add('btn-fantasma'));
  btn.classList.remove('btn-fantasma');
  btn.classList.add('btn-dorado');
  render();
});

document.getElementById('lista-transacciones').innerHTML = marcadorCarga(60) + marcadorCarga(60) + marcadorCarga(60);

transactionsApi.list(100)
  .then((items) => { TODAS = items; render(); })
  .catch((err) => {
    document.getElementById('lista-transacciones').innerHTML = `<div class="vacio">${icono('x', 32)}<p>${esc(mensajeError(err))}</p></div>`;
  });
