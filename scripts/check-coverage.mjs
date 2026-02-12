import fs from 'fs';
import path from 'path';

const coverageFile = path.resolve(process.cwd(), 'coverage', 'coverage-summary.json');
if (!fs.existsSync(coverageFile)) {
  console.error('No se encontró coverage-summary.json. Ejecuta tests con --coverage primero.');
  process.exit(2);
}

const summary = JSON.parse(fs.readFileSync(coverageFile, 'utf8')).total;

const THRESHOLDS = {
  statements: 69,
  branches: 68,
  functions: 67,
  lines: 72,
};

let ok = true;
for (const key of Object.keys(THRESHOLDS)) {
  const actual = summary[key].pct;
  const expected = THRESHOLDS[key];
  if (actual < expected) {
    console.error(`Coverage insuficiente: ${key} ${actual}% < ${expected}%`);
    ok = false;
  } else {
    console.log(`OK: ${key} ${actual}% >= ${expected}%`);
  }
}

if (!ok) process.exit(1);
console.log('Thresholds de coverage cumplidos.');