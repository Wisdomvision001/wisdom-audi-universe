// Stylised interface illustrations for each project's device. They are drawn in
// HTML/CSS (not screenshots) and size themselves with container-query units.

const ICON_SIDE = (n, on = 0) =>
  Array.from({ length: n }, (_, i) => `<i class="${i === on ? 'on' : ''}"></i>`).join('');

function mapSvg(extra = '') {
  return `<svg class="mk-map" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="400" height="240" class="m-bg"/>
    <path class="m-water" d="M-10 170 C 60 150 110 200 190 180 S 330 130 410 160 L410 250 L-10 250Z"/>
    <g class="m-block"><rect x="20" y="20" width="70" height="46" rx="4"/><rect x="110" y="30" width="60" height="38" rx="4"/><rect x="200" y="14" width="90" height="52" rx="4"/><rect x="310" y="24" width="70" height="44" rx="4"/>
    <rect x="30" y="92" width="60" height="44" rx="4"/><rect x="120" y="96" width="80" height="40" rx="4"/><rect x="230" y="92" width="50" height="46" rx="4"/><rect x="300" y="96" width="80" height="40" rx="4"/></g>
    <g class="m-road" fill="none" stroke-linecap="round"><path d="M0 78 H400" stroke-width="5"/><path d="M0 146 H400" stroke-width="5"/><path d="M100 0 V240" stroke-width="5"/><path d="M290 0 V240" stroke-width="5"/>
    <path d="M0 40 L400 120" stroke-width="3"/><path d="M190 0 C 170 90 230 150 210 240" stroke-width="3"/><path d="M0 200 H400" stroke-width="2.5"/></g>
    ${extra}
  </svg>`;
}

const pin = (x, y, c, r = 7) =>
  `<g transform="translate(${x} ${y})"><circle r="${r * 2.4}" fill="${c}" opacity=".18"/><circle r="${r}" fill="${c}" stroke="#fff" stroke-width="2"/></g>`;

function phone(inner, cls = '') {
  return `<div class="mk-phone ${cls}"><div class="mk-notch"></div>${inner}</div>`;
}

/* ---------------------------- Lifeguard360 ---------------------------- */
function lifeguard(v) {
  if (v === 0)
    return `<div class="ui light"><div class="side">${ICON_SIDE(7, 2)}</div>
      <div class="main"><div class="bar"><b></b><span class="pill">Hospitals nearby</span><span class="pill red">Alert</span></div>
      <div class="split"><div class="mapwrap">${mapSvg(pin(120, 96, '#e5484d') + pin(210, 60, '#2eaa6a', 5) + pin(300, 120, '#2eaa6a', 5) + pin(70, 160, '#2eaa6a', 5))}</div>
      <div class="panel"><h6>Nearest help</h6>${['City General', 'Riverside Clinic', 'St. Mary Hospital'].map((t, i) => `<div class="row"><i class="dot g"></i><span>${t}</span><em>${((i + 1) * 1.2).toFixed(1)}km</em></div>`).join('')}<div class="btn red">Send Alert</div></div></div></div></div>`;
  if (v === 1)
    return `<div class="ui light"><div class="side">${ICON_SIDE(7, 1)}</div><div class="main"><div class="bar"><b></b><span class="pill">First Aid Guide</span></div>
      <div class="cards">${[['Burns', '#f08a3c'], ['Bleeding', '#e5484d'], ['Choking', '#3b82f6'], ['Snake Bite', '#2eaa6a'], ['Road Accident', '#8b5cf6'], ['Fractures', '#14a3b8']]
        .map(([t, c]) => `<div class="card"><i style="background:${c}"></i><span>${t}</span><u></u><u class="s"></u></div>`).join('')}</div></div></div>`;
  return `<div class="ui light solo"><div class="main">${phone(`<div class="pbar"></div><h6>Emergency</h6><div class="sos"><span>SOS</span></div><div class="pl"><div></div><div></div><div></div></div>`, 'big')}</div></div>`;
}

/* -------------------------------- Signal ------------------------------- */
function signal(v) {
  if (v === 0)
    return `<div class="ui dark"><div class="side">${ICON_SIDE(6, 0)}</div><div class="main"><div class="bar"><b></b><span class="pill">Live reports</span><span class="pill grn">Online</span></div>
      <div class="split"><div class="mapwrap dark">${mapSvg(pin(110, 80, '#f5a524') + pin(240, 120, '#3b82f6', 5) + pin(320, 70, '#3b82f6', 5) + '<path d="M110 80 Q 170 120 240 120" stroke="#f5a524" stroke-width="2" fill="none" stroke-dasharray="5 4"/>')}</div>
      <div class="panel"><h6>Responders</h6>${['Unit A · En route', 'Unit B · Available', 'Unit C · On scene'].map((t) => `<div class="row"><i class="dot b"></i><span>${t}</span></div>`).join('')}<div class="btn blue">Assign</div></div></div></div></div>`;
  if (v === 1)
    return `<div class="ui dark"><div class="side">${ICON_SIDE(6, 2)}</div><div class="main"><div class="bar"><b></b><span class="pill">New report</span></div>
      <div class="form"><div class="fld"><s></s></div><div class="fld"><s class="m"></s></div><div class="chips"><span>Fire</span><span class="on">Medical</span><span>Road</span><span>Other</span></div><div class="fld tall"><s></s><s class="m"></s></div><div class="btn red">Submit report</div></div></div></div>`;
  return `<div class="ui dark solo"><div class="main">${phone(`<h6>Report status</h6><div class="tl">${['Reported', 'Acknowledged', 'Responder en route', 'Arrived'].map((t, i) => `<div class="step ${i < 3 ? 'done' : ''}"><i></i><span>${t}</span></div>`).join('')}</div>`, 'big')}</div></div>`;
}

/* ---------------------------- Wisdom's Kitchen -------------------------- */
const dish = (c1, c2) => `<div class="dish"><i style="background:radial-gradient(circle at 38% 34%, ${c1}, ${c2} 62%, #1a0a08 100%)"></i><span></span><em></em></div>`;
function kitchen(v) {
  if (v === 0)
    return `<div class="ui dark kit"><div class="side">${ICON_SIDE(6, 1)}</div><div class="main"><div class="bar"><b></b><span class="pill">Menu</span><span class="pill red">Cart</span></div>
      <div class="banner"><i></i><div><h6>Fresh. Fast. Delivered.</h6><u></u><div class="btn red sm">Order now</div></div></div>
      <div class="dishes">${dish('#e0a45a', '#8a4b1f')}${dish('#c9d36b', '#41612b')}${dish('#f08a5d', '#8b2b1c')}${dish('#e9c46a', '#8b5a1f')}${dish('#d9b38c', '#6b4226')}${dish('#d55', '#5a1414')}</div></div></div>`;
  if (v === 1)
    return `<div class="ui dark kit"><div class="side">${ICON_SIDE(6, 3)}</div><div class="main"><div class="bar"><b></b><span class="pill">Checkout</span></div>
      <div class="split"><div class="list">${[0, 1, 2].map(() => `<div class="row big"><i class="thumb"></i><span></span><em></em></div>`).join('')}</div>
      <div class="panel"><h6>Summary</h6><div class="row"><span>Subtotal</span><em></em></div><div class="row"><span>Delivery</span><em></em></div><div class="btn red">Pay now</div></div></div></div></div>`;
  return `<div class="ui dark kit"><div class="side">${ICON_SIDE(6, 4)}</div><div class="main"><div class="bar"><b></b><span class="pill">Orders</span></div>
    <div class="table">${['Preparing', 'Ready', 'Delivered', 'Preparing', 'Delivered'].map((s) => `<div class="tr"><span></span><span class="s"></span><em class="${s === 'Ready' ? 'ok' : s === 'Preparing' ? 'wait' : 'done'}">${s}</em></div>`).join('')}</div></div></div>`;
}

/* ------------------------------ Expense Tracker ------------------------ */
function expense(v) {
  if (v === 0)
    return `<div class="ui dark exp"><div class="side">${ICON_SIDE(6, 0)}</div><div class="main"><div class="bar"><b></b><span class="pill">Dashboard</span><span class="pill grn">Add</span></div>
      <div class="stats"><div class="stat"><u></u><b class="c1"></b></div><div class="stat"><u></u><b class="c2"></b></div><div class="stat"><u></u><b class="c3"></b></div></div>
      <div class="split"><svg class="chart" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 100 L30 84 L60 92 L90 60 L120 70 L150 40 L180 52 L210 28 L240 36 L270 12 L300 20 L300 120 L0 120Z" fill="rgba(79,124,255,.28)"/><path d="M0 100 L30 84 L60 92 L90 60 L120 70 L150 40 L180 52 L210 28 L240 36 L270 12 L300 20" fill="none" stroke="#7aa2ff" stroke-width="2.5"/></svg>
      <div class="panel"><div class="donut"></div></div></div></div></div>`;
  if (v === 1)
    return `<div class="ui dark exp"><div class="side">${ICON_SIDE(6, 2)}</div><div class="main"><div class="bar"><b></b><span class="pill">Transactions</span></div>
      <div class="table">${[0, 1, 2, 3, 4, 5].map((i) => `<div class="tr"><span></span><span class="s"></span><em class="${i % 3 ? 'neg' : 'pos'}"></em></div>`).join('')}</div></div></div>`;
  return `<div class="ui dark exp"><div class="side">${ICON_SIDE(6, 3)}</div><div class="main"><div class="bar"><b></b><span class="pill">Budgets</span></div>
    <div class="bars">${[78, 54, 91, 36, 62].map((w, i) => `<div class="brow"><span></span><div class="track"><i style="width:${w}%" class="${w > 85 ? 'hot' : ''}"></i></div></div>`).join('')}</div></div></div>`;
}

const BUILDERS = { lifeguard, signal, kitchen, expense };
export const VARIANTS = 3;
export const screen = (kind, v) => BUILDERS[kind](v);

// Small phone that sits in front of the laptop on some projects.
export function frontPhone(kind) {
  if (kind === 'signal')
    return phone(`<div class="mapwrap dark tiny">${mapSvg(pin(150, 100, '#f5a524'))}</div><div class="pl"><div></div><div></div></div><div class="btn red sm">Report</div>`, 'dark');
  if (kind === 'kitchen')
    return phone(`<div class="banner mini"><i></i></div><div class="dishes two">${dish('#e0a45a', '#8a4b1f')}${dish('#c9d36b', '#41612b')}</div><div class="btn red sm">Add to cart</div>`, 'dark kit');
  return '';
}
