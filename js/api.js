// ============================================================
// NovaBank — cliente de API (igual contrato que usa la app móvil)
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
      'X-Platform': 'web',
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

// ---------- Auth ----------
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

// ---------- Cuenta ----------
const accountApi = {
  async get() { return authedRequest('/api/account'); },
  async setCardBlocked(blocked) { return authedRequest('/api/account/card-block', { method: 'POST', body: JSON.stringify({ blocked }) }); },
  async pagarTarjeta(amount) { return authedRequest('/api/account/pay-card', { method: 'POST', body: JSON.stringify({ amount }) }); },
  async revelarCvv(otpCode) { return authedRequest('/api/account/reveal-cvv', { method: 'POST', body: JSON.stringify({ otpCode }) }); },
};

// ---------- Transacciones ----------
const transactionsApi = {
  async list(limit = 50) {
    const data = await authedRequest(`/api/transactions?limit=${limit}`);
    return data.items;
  },
};

// ---------- Notificaciones ----------
const notificationsApi = {
  async list(limit = 50) {
    const data = await authedRequest(`/api/notifications?limit=${limit}`);
    return data.items;
  },
  async markAllRead() { await authedRequest('/api/notifications/read-all', { method: 'POST' }); },
  async markRead(id) { await authedRequest(`/api/notifications/${id}/read`, { method: 'POST' }); },
};

// ---------- Destinatarios ----------
const payeesApi = {
  async list() {
    const data = await authedRequest('/api/payees');
    return data.items;
  },
  async create(input) { return authedRequest('/api/payees', { method: 'POST', body: JSON.stringify(input) }); },
};

// ---------- Transferencias ----------
const transfersApi = {
  async requestOtp() { await authedRequest('/api/transfers/otp/request', { method: 'POST' }); },
  async execute(input) { return authedRequest('/api/transfers', { method: 'POST', body: JSON.stringify(input) }); },
};

// ---------- Perfil ----------
const profileApi = {
  async requestOtp() { await authedRequest('/api/profile/otp/request', { method: 'POST' }); },
  async updateEmail(newEmail, otpCode) {
    const data = await authedRequest('/api/profile/email', { method: 'POST', body: JSON.stringify({ newEmail, otpCode }) });
    return data.user;
  },
  async updatePhone(newPhone, otpCode) {
    const data = await authedRequest('/api/profile/phone', { method: 'POST', body: JSON.stringify({ newPhone, otpCode }) });
    return data.user;
  },
  async updatePassword(currentPassword, newPassword, otpCode) {
    await authedRequest('/api/profile/password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword, otpCode }) });
  },
};

// ---------- Seguridad ----------
const securityApi = {
  async getAlerts() { return authedRequest('/api/security/alerts'); },
  async updateAlerts(alertas) { return authedRequest('/api/security/alerts', { method: 'PUT', body: JSON.stringify(alertas) }); },
  async getLimits() { return authedRequest('/api/security/limits'); },
  async updateLimits(limits) { return authedRequest('/api/security/limits', { method: 'PUT', body: JSON.stringify(limits) }); },
  async listSessions(refreshToken) {
    const data = await authedRequest('/api/security/sessions', { method: 'POST', body: JSON.stringify({ refreshToken }) });
    return data.items;
  },
  async revocarSesion(id) { await authedRequest(`/api/security/sessions/${id}`, { method: 'DELETE' }); },
};

// ---------- Estados de cuenta ----------
const statementsApi = {
  async send(month, year) { await authedRequest('/api/statements/send', { method: 'POST', body: JSON.stringify({ month, year }) }); },
};
