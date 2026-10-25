import { parse } from 'csv-parse/sync';
import { createHash } from 'node:crypto';

export const hash = value => '0x' + createHash('sha256').update(value).digest('hex');
const median = a => { const s = [...a].sort((x,y)=>x-y); const m = Math.floor(s.length/2); return s.length % 2 ? s[m] : (s[m-1]+s[m])/2; };
export function analyze(csv) {
  if (typeof csv !== 'string' || Buffer.byteLength(csv) > 1000000) throw new Error('Use a CSV smaller than 1 MB.');
  const data = parse(csv, {columns:true, skip_empty_lines:true, trim:true, bom:true});
  if (data.length < 8 || data.length > 5000) throw new Error('Upload 8–5,000 observations.');
  const seen = new Set();
  const rows = data.map((r,i) => {
    if (!r.timestamp || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(r.timestamp) || !Number.isFinite(Date.parse(r.timestamp))) throw new Error(`Row ${i+2}: timestamp must be ISO 8601 with timezone.`);
    if (r.temperature_c === undefined || r.temperature_c.trim() === '' || !Number.isFinite(Number(r.temperature_c))) throw new Error(`Row ${i+2}: temperature_c must be a number.`);
    const timestamp = new Date(r.timestamp).toISOString();
    if (seen.has(timestamp)) throw new Error(`Row ${i+2}: duplicate timestamp.`);
    seen.add(timestamp);
    const value = Number(r.temperature_c);
    if (value < -100 || value > 100) throw new Error(`Row ${i+2}: temperature outside supported range -100 to 100 °C.`);
    return {timestamp, temperature_c:value};
  }).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));
  const center = median(rows.map(r=>r.temperature_c));
  const mad = median(rows.map(r=>Math.abs(r.temperature_c-center)));
  // A 0.5°C floor avoids dividing by zero for flat sensor series.
  const scale = Math.max(mad,0.5);
  const observations = rows.map(r=>{const score=0.6745*Math.abs(r.temperature_c-center)/scale;return {...r,score:Number(score.toFixed(3)),flagged:score>3.5};});
  const canonical = JSON.stringify({schema:'traceclimate.temperature.v1',observations:rows});
  const report = {method:'median-mad-v1',threshold:3.5,madFloorC:0.5,medianC:center,madC:mad,count:rows.length,flagged:observations.filter(r=>r.flagged).length};
  return {datasetHash:hash(canonical),reportHash:hash(JSON.stringify(report)),report,observations,canonical};
}
