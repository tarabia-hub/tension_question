function readNumber(id) {
  return Number(document.getElementById(id).value);
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function toKN(forceN) {
  return forceN / 1000;
}

function solve() {
  const errorEl = document.getElementById('error');
  errorEl.textContent = '';

  const input = {
    Ag: readNumber('Ag'),
    t: readNumber('t'),
    b: readNumber('b'),
    g: readNumber('g'),
    dh: readNumber('dh'),
    n: readNumber('n'),
    s: readNumber('s'),
    e: readNumber('e'),
    Fy: readNumber('Fy'),
    Fu: readNumber('Fu'),
    U: readNumber('U'),
    phiY: readNumber('phiY'),
    phiU: readNumber('phiU'),
    ut: readNumber('ut')
  };

  const allPositive = Object.values(input).every((v) => Number.isFinite(v) && v > 0);
  if (!allPositive || !Number.isInteger(input.n) || input.n < 2) {
    errorEl.textContent = 'Please provide valid positive values (n must be an integer ≥ 2).';
    return;
  }

  const { Ag, t, b, g, dh, n, s, e, Fy, Fu, U, phiY, phiU, ut } = input;

  // Limit State 1: Cross-section yielding
  // Tr = φy * Ag * Fy
  const TrYield = phiY * Ag * Fy;

  // Limit State 2: Net section fracture (single fracture path as in provided solution)
  // An = Ag - dh*t
  // Ane = U*An
  // Tr = φu * Ane * Fu
  const An = Ag - dh * t;
  const Ane = U * An;
  const TrFracture = phiU * Ane * Fu;

  // Limit State 3: Block shear failure (matching shown expression)
  // Lv = e + (n-1)s
  // Ant = (b - g - 0.5dh)t
  // Agv = Lv*t
  // Tr = φu [ ut*Ant*Fu + 0.6*Agv*(Fy+Fu)/2 ]
  const Lv = e + (n - 1) * s;
  const Ant = (b - g - 0.5 * dh) * t;
  const Agv = Lv * t;
  const TrBlock = phiU * (ut * Ant * Fu + 0.6 * Agv * ((Fy + Fu) / 2));

  const options = [
    { label: 'Cross-section yielding', value: TrYield },
    { label: 'Net section fracture', value: TrFracture },
    { label: 'Block shear failure', value: TrBlock }
  ];
  const governing = options.reduce((min, item) => item.value < min.value ? item : min, options[0]);

  const resultCards = document.getElementById('resultCards');
  resultCards.innerHTML = '';

  options.forEach((item) => {
    const div = document.createElement('article');
    div.className = 'result';
    div.innerHTML = `
      <h4>${item.label}</h4>
      <p class="value">${round(toKN(item.value), 1)} kN</p>
      <p class="small">Raw: ${round(item.value, 0)} N</p>
    `;
    resultCards.appendChild(div);
  });

  document.getElementById('governing').textContent =
    `Governing tensile resistance Tr = ${round(toKN(governing.value), 1)} kN (${governing.label})`;

  document.getElementById('steps').textContent =
`Formulas used (same form as your provided solution):
1) Yielding: Tr = φy·Ag·Fy = ${phiY}×${Ag}×${Fy} = ${round(toKN(TrYield), 1)} kN
2) Fracture: An = Ag - dh·t = ${Ag} - ${dh}×${t} = ${round(An, 2)} mm²
             Ane = U·An = ${U}×${round(An, 2)} = ${round(Ane, 2)} mm²
             Tr = φu·Ane·Fu = ${phiU}×${round(Ane, 2)}×${Fu} = ${round(toKN(TrFracture), 1)} kN
3) Block shear: Lv = e + (n-1)·s = ${e} + (${n}-1)×${s} = ${round(Lv, 2)} mm
                Ant = (b-g-0.5dh)·t = (${b}-${g}-0.5×${dh})×${t} = ${round(Ant, 2)} mm²
                Agv = Lv·t = ${round(Lv, 2)}×${t} = ${round(Agv, 2)} mm²
                Tr = φu[ut·Ant·Fu + 0.6·Agv·(Fy+Fu)/2]
                   = ${phiU}[${ut}×${round(Ant, 2)}×${Fu} + 0.6×${round(Agv, 2)}×(${Fy}+${Fu})/2]
                   = ${round(toKN(TrBlock), 1)} kN`;
}

document.getElementById('solveBtn').addEventListener('click', solve);
solve();
