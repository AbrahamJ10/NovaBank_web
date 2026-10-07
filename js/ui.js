// ============================================================
// NovaBank — utilidades de interfaz compartidas (iconos, toasts,
// formato, shell de la app, guardia de sesión)
// ============================================================

const ICONOS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"/>',
  list: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M11 13 22 2"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M7 15h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>',
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 6.5 8 6 8-6"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.6A10.5 10.5 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.6 16.6 0 0 1-3.3 4.2M6.6 6.7C3.9 8.6 2.5 12 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 3.9-.8"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  arrowUp: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  arrowDown: '<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',
  shield: '<path d="M12 3 4.5 6v6c0 5 3.3 8.3 7.5 9.5 4.2-1.2 7.5-4.5 7.5-9.5V6L12 3Z"/>',
  check: '<path d="M4 12.5 9.5 18 20 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 3v12"/><path d="m6.5 10.5 5.5 5 5.5-5"/><path d="M5 21h14"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
  fingerprint: '<path d="M12 3a8 8 0 0 0-8 8c0 4 2 6 2 9"/><path d="M12 3a8 8 0 0 1 8 8c0 2-.3 3.5-1 5"/><path d="M8.5 20a14 14 0 0 1-1.5-9 5 5 0 0 1 10 0c0 1 0 2-.3 3"/><path d="M12 9a4 4 0 0 0-4 4c0 3 1 5 2 7"/><path d="M14.5 19a16 16 0 0 1-2-7 2.5 2.5 0 0 1 5 0 10 10 0 0 1-.2 2"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
  wallet: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5V8H5.5A2.5 2.5 0 0 1 3 5.5"/><rect x="3" y="8" width="18" height="11" rx="2.5"/><circle cx="16" cy="13.5" r="1.3"/>',
  building: '<path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/><path d="M9 11h.01M12 11h.01M15 11h.01"/>',
  zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  idCard: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="12" r="2.2"/><path d="M5.8 16.3c.5-1.4 1.6-2.1 2.7-2.1s2.2.7 2.7 2.1"/><path d="M14.5 10h4M14.5 13h4"/>',
};

function icono(nombre, tam = 18) {
  const path = ICONOS[nombre] || ICONOS.chevron;
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

function formatoDinero(valor, moneda = 'S/') {
  const n = Number(valor || 0);
  return `${moneda} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatoFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatoFechaHora(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Todo dato que haya pasado por una entrada de usuario (nombre, correo,
// concepto de transferencia, nombre de destinatario, etc.) se escapa antes
// de interpolarlo en innerHTML — evita que un valor guardado con HTML/script
// se ejecute al renderizarlo.
function esc(valor) {
  const div = document.createElement('div');
  div.textContent = valor ?? '';
  return div.innerHTML;
}

function iniciales(nombre) {
  if (!nombre) return '?';
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase();
}

function enmascararNumero(numero) {
  if (!numero) return '•••• •••• •••• ••••';
  const limpio = String(numero).replace(/\s/g, '');
  const ultimos = limpio.slice(-4);
  return `•••• •••• •••• ${ultimos}`;
}

// ---------- Toasts ----------
function toast(mensaje, tipo = 'exito') {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = `toast ${tipo}`;
  el.innerHTML = `${icono(tipo === 'exito' ? 'check' : 'x', 17)}<span>${esc(mensaje)}</span>`;
  host.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 250);
  }, 3400);
}

function mensajeError(err, fallback = 'Ocurrió un error inesperado. Intenta de nuevo.') {
  return err && err.message ? err.message : fallback;
}

// ---------- Sesión ----------
function sesionActiva() {
  return !!localStorage.getItem('nb_access');
}

function exigirSesion() {
  if (!sesionActiva()) {
    window.location.href = 'index.html';
  }
}

function redirigirSiYaHaySesion() {
  if (sesionActiva()) {
    window.location.href = 'dashboard.html';
  }
}

// ---------- Shell de la app (sidebar + topbar) ----------
const NAV_ITEMS = [
  { href: 'dashboard.html', icono: 'home', label: 'Inicio' },
  { href: 'transacciones.html', icono: 'list', label: 'Transacciones' },
  { href: 'transferir.html', icono: 'send', label: 'Transferir' },
  { href: 'tarjeta.html', icono: 'card', label: 'Mi tarjeta' },
  { href: 'perfil.html', icono: 'user', label: 'Perfil' },
];

function construirShell({ titulo, subtitulo }) {
  const paginaActual = window.location.pathname.split('/').pop() || 'dashboard.html';
  const app = document.getElementById('app');
  if (!app) return;

  const usuario = JSON.parse(localStorage.getItem('nb_user') || 'null');

  app.innerHTML = `
    <div class="sidebar-overlay" id="overlay-sidebar"></div>
    <aside class="sidebar" id="sidebar">
      <a href="dashboard.html" class="marca">
        <img src="img/logo-banco.png" alt="NovaBank" />
        <span>Nova<b>Bank</b></span>
      </a>
      <nav class="nav-lista">
        ${NAV_ITEMS.map(
          (it) => `
          <a href="${it.href}" class="nav-item ${paginaActual === it.href ? 'activo' : ''}">
            ${icono(it.icono, 19)}<span>${it.label}</span>
          </a>`
        ).join('')}
      </nav>
      <div class="nav-pie">
        <div class="user-mini">
          <div class="avatar">${esc(iniciales(usuario?.fullName))}</div>
          <div style="min-width:0">
            <div class="nombre">${esc(usuario?.fullName || 'Cliente NovaBank')}</div>
            <div class="correo">${esc(usuario?.email || '')}</div>
          </div>
        </div>
        <button class="btn btn-fantasma btn-sm btn-block" id="btn-salir">${icono('logout', 16)} Cerrar sesión</button>
      </div>
    </aside>
    <div class="main">
      <header class="topbar">
        <div class="fila gap-m">
          <button class="btn btn-icono btn-fantasma menu-movil" id="btn-menu">${icono('menu', 19)}</button>
          <div>
            <h1>${titulo}</h1>
            ${subtitulo ? `<div class="sub">${subtitulo}</div>` : ''}
          </div>
        </div>
        <div class="fila gap-m">
          <a href="transacciones.html" class="btn btn-icono btn-fantasma" title="Notificaciones">${icono('bell', 18)}</a>
        </div>
      </header>
      <main class="contenido" id="contenido"></main>
    </div>
  `;

  document.getElementById('btn-salir').addEventListener('click', async () => {
    await authApi.cerrarSesion();
    localStorage.removeItem('nb_user');
    window.location.href = 'index.html';
  });

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay-sidebar');
  document.getElementById('btn-menu')?.addEventListener('click', () => {
    sidebar.classList.add('abierto');
    overlay.classList.add('visible');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('abierto');
    overlay.classList.remove('visible');
  });
}

function pintarIconos(raiz = document) {
  raiz.querySelectorAll('[data-icon]').forEach((el) => {
    const tam = Number(el.getAttribute('data-size') || 18);
    el.innerHTML = icono(el.getAttribute('data-icon'), tam);
  });
}

function marcadorCarga(alto = 54) {
  return `<div class="skeleton" style="height:${alto}px;border-radius:14px"></div>`;
}
