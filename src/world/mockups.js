// Stylised Lifeguard360 interface illustrations for the device screen.
// They reflect only the platform's verified capabilities: first-aid guidance
// across emergency categories and location-based assistance to nearby
// healthcare facilities. Nothing invented is shown.

const pin = (x, y, c, r = 7) =>
  `<g transform="translate(${x} ${y})"><circle r="${r * 2.2}" fill="${c}" opacity="0.18"/><circle r="${r}" fill="${c}" stroke="#fff" stroke-width="2"/></g>`;

function baseMap(extra = '') {
  return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="400" height="240" fill="#e7ecf3"/>
    <path d="M-10 168 C 60 148 110 198 190 178 S 330 128 410 158 L410 250 L-10 250Z" fill="#bcd3ea"/>
    <g fill="#d6dde7">
      <rect x="20" y="18" width="70" height="46" rx="4"/><rect x="112" y="28" width="58" height="38" rx="4"/>
      <rect x="200" y="12" width="92" height="52" rx="4"/><rect x="312" y="24" width="68" height="44" rx="4"/>
      <rect x="30" y="90" width="60" height="44" rx="4"/><rect x="122" y="94" width="78" height="40" rx="4"/>
      <rect x="228" y="90" width="52" height="46" rx="4"/><rect x="300" y="94" width="82" height="40" rx="4"/>
    </g>
    <g stroke="#fff" fill="none" stroke-linecap="round">
      <path d="M0 76 H400" stroke-width="5"/><path d="M0 144 H400" stroke-width="5"/>
      <path d="M100 0 V240" stroke-width="5"/><path d="M292 0 V240" stroke-width="5"/>
      <path d="M0 38 L400 118" stroke-width="3"/><path d="M0 200 H400" stroke-width="2.5"/>
    </g>
    ${extra}
  </svg>`;
}

const nearestHelpRow = (name, dist, dot) =>
  `<div class="row"><i class="dot ${dot}"></i><span>${name}</span><em>${dist}</em></div>`;

// View 1 — map with nearby healthcare facilities.
export const viewMap = () => `
<div class="ui">
  <div class="side"><i></i><i class="on"></i><i></i><i></i><i></i><i></i></div>
  <div class="main">
    <div class="bar"><b></b><span class="pill">Nearby Help</span><span class="pill red">Alert</span></div>
    <div class="split">
      <div class="mapwrap">${baseMap(
        pin(122, 92, '#e5484d') + pin(222, 58, '#2eaa6a', 5) + pin(312, 112, '#2eaa6a', 5) + pin(74, 152, '#2eaa6a', 5)
      )}</div>
      <div class="panel"><h6>Healthcare nearby</h6>
        ${nearestHelpRow('City General', '1.2 km', 'g')}
        ${nearestHelpRow('Riverside Clinic', '2.4 km', 'g')}
        ${nearestHelpRow('St. Mary Hospital', '3.1 km', 'g')}
        <div class="btn">Send Alert</div>
      </div>
    </div>
  </div>
</div>`;

// View 2 — first-aid guidance across emergency categories.
export const viewGuide = () => `
<div class="ui">
  <div class="side"><i></i><i></i><i class="on"></i><i></i><i></i><i></i></div>
  <div class="main">
    <div class="bar"><b></b><span class="pill">First Aid Guide</span></div>
    <div class="cats">
      ${[
        ['Burns', '#f08a3c'],
        ['Bleeding', '#e5484d'],
        ['Choking', '#3b82f6'],
        ['Snake Bite', '#2eaa6a'],
        ['Road Accident', '#8b5cf6'],
        ['Fractures', '#14a3b8'],
      ].map(([t, c]) => `<div class="cat"><i style="background:${c}"></i><span>${t}</span><u></u><u class="s"></u></div>`).join('')}
    </div>
  </div>
</div>`;

export const VIEWS = [viewMap, viewGuide];
