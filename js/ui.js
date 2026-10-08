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
  users: '<path d="M11 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M3.5 20c1.3-3.6 4.2-5.5 7.5-5.5s6.2 1.9 7.5 5.5"/><path d="M16.5 7a3 3 0 1 1 2.2 5"/><path d="M19 14.3c1.8.7 3.2 2.2 4 4.4"/>',
  activity: '<path d="M3 12h4l2.5-7L13 19l2.5-7H21"/>',
  ban: '<circle cx="12" cy="12" r="8.5"/><path d="m6.3 6.3 11.4 11.4"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7"/><path d="M6 7l1 12.2c0 .9.8 1.6 1.7 1.6h6.6c.9 0 1.7-.7 1.7-1.6L18 7"/><path d="M10 11v6M14 11v6"/>',
  key: '<circle cx="8" cy="15" r="3.5"/><path d="M10.5 12.5 20 3"/><path d="M16.5 6.5 19 9"/><path d="M13.5 9.5 16 12"/>',
  unlock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 7.5-2"/>',
  edit: '<path d="M4 20h4L19.5 8.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Z"/><path d="M13.5 6.5 17.5 10.5"/>',
  external: '<path d="M18 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5.5"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v5.5h5.5"/><path d="M12 8v4.5l3 2"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  filter: '<path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/>',
  alertTriangle: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
  clipboard: '<rect x="5" y="4.5" width="14" height="17" rx="2.3"/><path d="M9 4.5V3.8a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 3.8v.7"/><path d="M8.5 11h7M8.5 15h7M8.5 7h7"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v5.5h5.5"/><path d="M12 7v5l3.5 2"/>',
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

// ---------- Shell del panel (sidebar + topbar) ----------
const NAV_ITEMS = [
  { href: 'dashboard.html', icono: 'home', label: 'Panel' },
  { href: 'usuarios.html', icono: 'users', label: 'Usuarios' },
  { href: 'casos.html', icono: 'alertTriangle', label: 'Casos de seguridad' },
  { href: 'seguridad.html', icono: 'shield', label: 'Accesos' },
  { href: 'auditoria.html', icono: 'activity', label: 'Auditoría' },
  { href: 'transacciones.html', icono: 'wallet', label: 'Transacciones' },
  { href: 'acciones-admin.html', icono: 'history', label: 'Acciones de staff' },
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
      <div class="insignia insignia-dorado" style="margin:0 10px 18px;align-self:flex-start">${icono('shield', 12)} Panel administrativo</div>
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
            <div class="nombre">${esc(usuario?.fullName || 'Administrador')}</div>
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
          <span class="insignia insignia-verde" id="estado-sistema"><span class="punto-vivo"></span> Sistema operativo</span>
        </div>
      </header>
      <main class="contenido" id="contenido"></main>
    </div>
  `;

  document.getElementById('btn-salir').addEventListener('click', async () => {
    await authApi.cerrarSesion();
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

// ---------- Guardia de sesión admin ----------
// Además de exigir un token, confirma con /api/auth/me que el rol siga
// siendo ADMIN — si alguien pierde ese rol (o nunca lo tuvo) se le cierra
// la sesión de inmediato en vez de dejarlo ver un panel que de todas
// formas le devolverá 403 en cada llamada.
async function exigirAdmin() {
  exigirSesion();
  try {
    const usuario = await authApi.me();
    if (usuario.role !== 'ADMIN') {
      await authApi.cerrarSesion();
      window.location.href = 'index.html?error=sin_permiso';
      return;
    }
    localStorage.setItem('nb_user', JSON.stringify(usuario));
  } catch (err) {
    await authApi.cerrarSesion();
    window.location.href = 'index.html';
  }
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

// ---------- Conteo animado de números ----------
// Detalle de pulido: el saldo no aparece de golpe, sube desde 0 con una
// curva de desaceleración — el tipo de micro-interacción que distingue un
// panel bancario "terminado" de uno recién armado.
function contarNumero(el, valorFinal, { decimales = 2, duracion = 900, prefijo = '' } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = prefijo + valorFinal.toLocaleString('es-PE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
    return;
  }
  const inicio = performance.now();
  const facilitar = (t) => 1 - Math.pow(1 - t, 3);
  function paso(ahora) {
    const progreso = Math.min(1, (ahora - inicio) / duracion);
    const valor = valorFinal * facilitar(progreso);
    el.textContent = prefijo + valor.toLocaleString('es-PE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
    if (progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

// ---------- Mini-gráfica de actividad (sin librerías) ----------
function dibujarSparkline(canvas, valores, { color = '#C9A227', relleno = 'rgba(201,162,39,.14)' } = {}) {
  if (!canvas || valores.length < 2) return;
  const dpr = window.devicePixelRatio || 1;
  const ancho = canvas.clientWidth, alto = canvas.clientHeight;
  canvas.width = ancho * dpr;
  canvas.height = alto * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const max = Math.max(...valores), min = Math.min(...valores);
  const rango = max - min || 1;
  const pad = 6;
  const puntos = valores.map((v, i) => ({
    x: pad + (i / (valores.length - 1)) * (ancho - pad * 2),
    y: pad + (1 - (v - min) / rango) * (alto - pad * 2),
  }));

  function curva(ctx, pts) {
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < pts.length - 1; i++) {
      const xm = (pts[i].x + pts[i + 1].x) / 2;
      const ym = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, xm, ym);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  }

  ctx.clearRect(0, 0, ancho, alto);

  ctx.beginPath();
  curva(ctx, puntos);
  ctx.lineTo(puntos[puntos.length - 1].x, alto);
  ctx.lineTo(puntos[0].x, alto);
  ctx.closePath();
  ctx.fillStyle = relleno;
  ctx.fill();

  ctx.beginPath();
  curva(ctx, puntos);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  const ultimo = puntos[puntos.length - 1];
  ctx.beginPath();
  ctx.arc(ultimo.x, ultimo.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ultimo.x, ultimo.y, 6, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.globalAlpha = .35;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ---------- Insignia de estado de cuenta ----------
function badgeEstadoUsuario(u) {
  if (u.deletedAt) return `<span class="insignia insignia-rojo">${icono('trash', 12)} Eliminada</span>`;
  if (u.lockedUntil && new Date(u.lockedUntil) > new Date()) return `<span class="insignia insignia-ambar">${icono('lock', 12)} Bloqueada</span>`;
  if (!u.isActive) return `<span class="insignia insignia-rojo">${icono('ban', 12)} Suspendida</span>`;
  return `<span class="insignia insignia-verde">${icono('check', 12)} Activa</span>`;
}

const RESULTADO_LOGIN_LABEL = {
  SUCCESS: { texto: 'Exitoso', clase: 'insignia-verde' },
  INVALID_CREDENTIALS: { texto: 'Credenciales inválidas', clase: 'insignia-rojo' },
  ACCOUNT_LOCKED: { texto: 'Cuenta bloqueada', clase: 'insignia-ambar' },
  ACCOUNT_INACTIVE: { texto: 'Cuenta inactiva', clase: 'insignia-rojo' },
};

const CATEGORIA_AUDITORIA_LABEL = {
  SESION: 'Sesión', NAVEGACION: 'Navegación', TRANSFERENCIA: 'Transferencia', PAGO_SERVICIO: 'Pago de servicio',
  TARJETA: 'Tarjeta', QR: 'QR', PERFIL: 'Perfil', SEGURIDAD: 'Seguridad',
};

const CATEGORIA_TRANSACCION_LABEL = {
  COMPRAS: 'Compras', TRANSFERENCIAS: 'Transferencias', QR: 'QR', INGRESOS: 'Ingresos',
  SERVICIOS: 'Servicios', PAGO_TARJETA: 'Pago de tarjeta',
};

const CATEGORIA_CASO_LABEL = {
  FRAUDE: 'Fraude', CUENTA_COMPROMETIDA: 'Cuenta comprometida', ACTIVIDAD_SOSPECHOSA: 'Actividad sospechosa', OTRO: 'Otro',
};
const ESTADO_CASO_LABEL = {
  ABIERTO: { texto: 'Abierto', clase: 'insignia-rojo' },
  EN_REVISION: { texto: 'En revisión', clase: 'insignia-ambar' },
  CERRADO: { texto: 'Cerrado', clase: 'insignia-verde' },
};
const PRIORIDAD_CASO_LABEL = {
  BAJA: { texto: 'Baja', clase: 'insignia-azul' },
  MEDIA: { texto: 'Media', clase: 'insignia-ambar' },
  ALTA: { texto: 'Alta', clase: 'insignia-rojo' },
};

// ---------- Panel lateral deslizante ----------
function abrirDrawer(contenidoHtml) {
  let fondo = document.getElementById('drawer-fondo');
  if (!fondo) {
    fondo = document.createElement('div');
    fondo.id = 'drawer-fondo';
    fondo.className = 'drawer-fondo';
    document.body.appendChild(fondo);
    fondo.addEventListener('click', (e) => { if (e.target === fondo) cerrarDrawer(); });
  }
  fondo.innerHTML = `<aside class="drawer">${contenidoHtml}</aside>`;
  pintarIconos(fondo);
  requestAnimationFrame(() => fondo.classList.add('abierto'));
  fondo.querySelectorAll('[data-cerrar-drawer]').forEach((el) => el.addEventListener('click', cerrarDrawer));
  return fondo;
}
function cerrarDrawer() {
  document.getElementById('drawer-fondo')?.classList.remove('abierto');
}

// ---------- Paginación ----------
function renderPaginacion(total, pagina, limite, alCambiar) {
  const totalPaginas = Math.max(1, Math.ceil(total / limite));
  const desde = total === 0 ? 0 : (pagina - 1) * limite + 1;
  const hasta = Math.min(total, pagina * limite);

  const cont = document.createElement('div');
  cont.className = 'paginacion';
  cont.innerHTML = `
    <span class="resumen">Mostrando ${desde}–${hasta} de ${total}</span>
    <div class="controles">
      <button class="btn btn-sm btn-fantasma" id="pg-prev" ${pagina <= 1 ? 'disabled' : ''}>← Anterior</button>
      <button class="btn btn-sm btn-fantasma" id="pg-next" ${pagina >= totalPaginas ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
  cont.querySelector('#pg-prev').addEventListener('click', () => alCambiar(pagina - 1));
  cont.querySelector('#pg-next').addEventListener('click', () => alCambiar(pagina + 1));
  return cont;
}

// ---------- Debounce (barras de búsqueda) ----------
function conDebounce(fn, espera = 350) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
}
