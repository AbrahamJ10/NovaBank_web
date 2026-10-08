// ============================================================
// NovaBank — cliente de API del panel de administración
// ============================================================

const API_URL = 'https://novabank-api-o6dx.onrender.com';

const ALMACEN = {
  get accessToken() { return localStorage.getItem('nb_access'); },
  get refreshToken() { return localStorage.getItem('nb_refresh'); },
  guardar(accessToken, refreshToken) {
    localStorage.setItem('nb_access', accessToken);
    localStorage.setItem('nb_refresh', refreshToken);
  },
  limpiar() {
    localStorage.removeItem('nb_access');
    localStorage.removeItem('nb_refresh');
    localStorage.removeItem('nb_user');
  },
};

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

class SessionExpiredError extends Error {}

async function rawRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Platform': 'web-admin',
      'X-App-Version': '1.0.0',
      ...(options.headers || {}),
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? 'Ocurrió un error inesperado', body ?? undefined);
  }
  return body;
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = ALMACEN.refreshToken;
      if (!refreshToken) throw new SessionExpiredError('No hay sesión activa');
      try {
        const data = await rawRequest('/api/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
        ALMACEN.guardar(data.accessToken, data.refreshToken);
        return data.accessToken;
      } catch (err) {
        ALMACEN.limpiar();
        throw new SessionExpiredError('Tu sesión expiró, inicia sesión nuevamente');
      }
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function authedRequest(path, options = {}) {
  let accessToken = ALMACEN.accessToken;

  const attempt = (token) =>
    rawRequest(path, {
      ...options,
      headers: { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });

  try {
    return await attempt(accessToken);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      accessToken = await refreshAccessToken();
      return attempt(accessToken);
    }
    throw err;
  }
}

function construirQuery(params) {
  const limpio = Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  const qs = new URLSearchParams(limpio).toString();
  return qs ? `?${qs}` : '';
}

// ---------- Auth (acceso del propio administrador) ----------
const authApi = {
  async iniciarSesion(email, password) {
    const data = await rawRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    ALMACEN.guardar(data.accessToken, data.refreshToken);
    return data.user;
  },
  async me() {
    return authedRequest('/api/auth/me');
  },
  async cerrarSesion() {
    const refreshToken = ALMACEN.refreshToken;
    ALMACEN.limpiar();
    if (refreshToken) {
      await rawRequest('/api/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }).catch(() => {});
    }
  },
  async requestPasswordReset(email) {
    await rawRequest('/api/auth/password-reset/request', { method: 'POST', body: JSON.stringify({ email }) });
  },
  async confirmPasswordReset(email, code, newPassword) {
    await rawRequest('/api/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) });
  },
};

// ---------- Administración ----------
const adminApi = {
  async stats() {
    return authedRequest('/api/admin/stats');
  },

  async listarUsuarios({ busqueda, estado, desde, hasta, saldoMin, saldoMax, pagina = 1, limite = 20 } = {}) {
    return authedRequest(`/api/admin/users${construirQuery({ busqueda, estado, desde, hasta, saldoMin, saldoMax, pagina, limite })}`);
  },
  async detalleUsuario(id) {
    return authedRequest(`/api/admin/users/${id}`);
  },
  async actualizarUsuario(id, datos) {
    return authedRequest(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(datos) });
  },
  async suspenderUsuario(id) {
    return authedRequest(`/api/admin/users/${id}/suspend`, { method: 'POST' });
  },
  async activarUsuario(id) {
    return authedRequest(`/api/admin/users/${id}/activate`, { method: 'POST' });
  },
  async desbloquearUsuario(id) {
    return authedRequest(`/api/admin/users/${id}/unlock`, { method: 'POST' });
  },
  async eliminarUsuario(id) {
    return authedRequest(`/api/admin/users/${id}`, { method: 'DELETE' });
  },
  async restaurarUsuario(id) {
    return authedRequest(`/api/admin/users/${id}/restore`, { method: 'POST' });
  },
  async restablecerContrasena(id) {
    return authedRequest(`/api/admin/users/${id}/reset-password`, { method: 'POST' });
  },

  async eventosLogin({ resultado, correo, ip, desde, hasta, pagina = 1, limite = 20 } = {}) {
    return authedRequest(`/api/admin/login-events${construirQuery({ resultado, correo, ip, desde, hasta, pagina, limite })}`);
  },
  async auditoria({ categoria, busqueda, ip, desde, hasta, soloFallidos, pagina = 1, limite = 20 } = {}) {
    return authedRequest(`/api/admin/audit-logs${construirQuery({ categoria, busqueda, ip, desde, hasta, soloFallidos: soloFallidos ? '1' : undefined, pagina, limite })}`);
  },
  async transacciones({ tipo, categoria, busqueda, desde, hasta, pagina = 1, limite = 20 } = {}) {
    return authedRequest(`/api/admin/transactions${construirQuery({ tipo, categoria, busqueda, desde, hasta, pagina, limite })}`);
  },
};
