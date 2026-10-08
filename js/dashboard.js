exigirSesion();
construirShell({ titulo: 'Inicio', subtitulo: 'Resumen de tu cuenta' });

const contenido = document.getElementById('contenido');
contenido.appendChild(document.getElementById('tpl-dashboard').content.cloneNode(true));
pintarIconos();

const CATEGORIA_ICONO = {
  comida: 'wallet', compras: 'wallet', transporte: 'zap', servicios: 'building',
  transferencia: 'send', salario: 'arrowDown', default: 'wallet',
};

function filaTransaccion(t) {
  const esCredito = t.kind === 'credit';
  return `
    <div class="transaccion">
      <div class="ico" style="background:${esc(t.iconBg || 'rgba(201,162,39,.12)')};color:${esc(t.iconFg || '#E7CE92')}">
        ${icono(esCredito ? 'arrowDown' : 'arrowUp', 18)}
      </div>
      <div class="info">
        <div class="nombre">${esc(t.name)}</div>
        <div class="meta">${esc(t.meta || formatoFecha(t.createdAt))}</div>
      </div>
      <div class="monto ${esCredito ? 'credito' : 'debito'}">${esCredito ? '+' : '-'} ${formatoDinero(Math.abs(t.amount))}</div>
    </div>`;
}

async function cargar() {
  const [cuenta, transacciones] = await Promise.all([
    accountApi.get().catch(() => null),
    transactionsApi.list(6).catch(() => []),
  ]);

  if (cuenta) {
    contarNumero(document.getElementById('saldo-valor'), Number(cuenta.availableBalance));
    document.getElementById('meta-cuenta').textContent = cuenta.accountNumber;
    document.getElementById('meta-cci').textContent = cuenta.cci;
    document.getElementById('meta-desde').textContent = formatoFecha(cuenta.memberSince);

    document.getElementById('resumen-tarjeta').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">N.º de tarjeta</span><b>${esc(enmascararNumero(cuenta.cardNumber))}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Línea de crédito</span><b>${formatoDinero(cuenta.creditLine)}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Deuda actual</span><b style="color:var(--rojo)">${formatoDinero(cuenta.cardDebt)}</b></div>
        <div class="fila entre"><span style="color:var(--ink-faint);font-size:13px">Pago mínimo</span><b>${formatoDinero(cuenta.minPayment)}</b></div>
        <div class="divisor"></div>
        <div class="fila entre">
          <span style="color:var(--ink-faint);font-size:13px">Estado</span>
          <span class="insignia ${cuenta.cardBlocked ? 'insignia-rojo' : 'insignia-verde'}">${cuenta.cardBlocked ? 'Bloqueada' : 'Activa'}</span>
        </div>
        <a href="tarjeta.html" class="btn btn-linea btn-sm btn-block">Administrar tarjeta</a>
      </div>`;
  } else {
    document.getElementById('resumen-tarjeta').innerHTML = `<div class="vacio">${icono('card', 32)}<p>No se pudo cargar tu tarjeta.</p></div>`;
  }

  const lista = document.getElementById('lista-transacciones');
  if (transacciones.length === 0) {
    lista.innerHTML = `<div class="vacio">${icono('list', 32)}<p>Todavía no tienes movimientos.</p></div>`;
  } else {
    lista.innerHTML = transacciones.map(filaTransaccion).join('');
  }

  if (transacciones.length >= 2) {
    const serie = [...transacciones].reverse().reduce((acc, t) => {
      const previo = acc.length ? acc[acc.length - 1] : 0;
      acc.push(previo + (t.kind === 'credit' ? t.amount : -t.amount));
      return acc;
    }, []);
    dibujarSparkline(document.getElementById('grafica-actividad'), serie);
  }
}

cargar().catch((err) => toast(mensajeError(err), 'error'));
