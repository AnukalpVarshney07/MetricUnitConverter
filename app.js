const el = (id) => document.getElementById(id);

const category = el("category");
const fromUnit = el("fromUnit");
const toUnit = el("toUnit");
const inputValue = el("inputValue");
const result = el("result");
const swapBtn = el("swapBtn");

/* ================= DATA ================= */
const units = {
  Length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    mile: 0.000621371,
    yard: 1.09361,
    foot: 3.28084,
    inch: 39.3701
  },

  Weight: {
    kilogram: 1,
    gram: 1000,
    milligram: 1e6,
    pound: 2.20462,
    ounce: 35.274
  },

  Time: {
    second: 1,
    minute: 1/60,
    hour: 1/3600,
    day: 1/86400
  },

  Speed: {
    "m/s": 1,
    "km/h": 3.6,
    "mph": 2.23694
  },

  Temperature: {
    celsius: "temp",
    fahrenheit: "temp",
    kelvin: "temp"
  },

  Area: {
    "sq meter": 1,
    "sq km": 1e-6,
    hectare: 1e-4,
    acre: 0.000247105
  },

  Volume: {
    liter: 1,
    milliliter: 1000,
    "cubic meter": 0.001
  }
};

/* ================= INIT ================= */
function init() {
  Object.keys(units).forEach(cat => {
    let opt = new Option(cat, cat);
    category.add(opt);
  });

  loadUnits();
  convert();
}

/* ================= LOAD UNITS ================= */
function loadUnits() {
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  Object.keys(units[category.value]).forEach(unit => {
    fromUnit.add(new Option(unit, unit));
    toUnit.add(new Option(unit, unit));
  });
}

/* ================= FORMAT ================= */
function formatNumber(num) {
  if (!isFinite(num)) return "--";

  // Large numbers
  if (Math.abs(num) > 1e6) return num.toExponential(4);

  // Small numbers
  if (Math.abs(num) < 0.0001 && num !== 0) return num.toExponential(4);

  return parseFloat(num.toFixed(6));
}

/* ================= TEMP ================= */
function convertTemp(v, from, to) {
  let c;

  if (from === "fahrenheit") c = (v - 32) * 5/9;
  else if (from === "kelvin") c = v - 273.15;
  else c = v;

  if (to === "fahrenheit") return c * 9/5 + 32;
  if (to === "kelvin") return c + 273.15;

  return c;
}

/* ================= CONVERT ================= */
function convert() {
  let val = parseFloat(inputValue.value);

  if (isNaN(val)) {
    result.textContent = "--";
    return;
  }

  let cat = category.value;
  let from = fromUnit.value;
  let to = toUnit.value;

  let output;

  if (cat === "Temperature") {
    output = convertTemp(val, from, to);
  } else {
    let base = val / units[cat][from];
    output = base * units[cat][to];
  }

  result.textContent = formatNumber(output) + " " + to;
}

/* ================= SWAP ================= */
swapBtn.addEventListener("click", () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
  convert();
});

/* ================= EVENTS ================= */
category.addEventListener("change", () => {
  loadUnits();
  convert();
});

inputValue.addEventListener("input", debounce(convert, 150));
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

/* ================= DEBOUNCE ================= */
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/* ================= START ================= */
init();