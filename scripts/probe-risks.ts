// Read-only probe used to verify AI risk claims (Task #04). Run: npx vite-node scripts/probe-risks.ts
import { checkAvailability, minutesToLabel, type Booking } from '../src/lib/booking';
const intro: Booking[] = [{ id: 'b1', start: 600, end: 660, label: 'Intro CS' }];
const show = (name: string, v: unknown) => console.log(`${name.padEnd(58)} -> ${JSON.stringify(v)}`);
show("AI-01 parseInt('6e2') / Number('6e2')", [parseInt('6e2', 10), Number('6e2')]);
show("AI-01 parseInt('660.9')", parseInt('660.9', 10));
show('AI-01 check(6,7,now=0) as UI computes for 6e2/7e2', checkAvailability(6, 7, 0, false, intro));
show('AI-01 check(600,700,now=0) what the user meant', checkAvailability(600, 700, 0, false, intro));
show('AI-02 check(660.5, 720, 540)', checkAvailability(660.5, 720, 540, false, intro));
show('AI-02 minutesToLabel(660.5)', minutesToLabel(660.5));
show('AI-03 check(660, 720, now=-100)', checkAvailability(660, 720, -100, false, intro));
show('AI-03 check(660, 720, now=5000)', checkAvailability(660, 720, 5000, false, intro));
show('AI-03 malformed booking {start:700,end:650}, req 660-720', checkAvailability(660, 720, 540, false, [{ id: 'x', start: 700, end: 650, label: 'Bad' }]));
show('extra check(-1, 30, now=-10) negative start', checkAvailability(-1, 30, -10, false, []));
// Added with M1 (src/lib/time.ts did not exist at baseline):
import('../src/lib/time').then(({ parseMinutes }) =>
  show("M1 parseMinutes('6e2'), ('660.9'), ('600')", [parseMinutes('6e2'), parseMinutes('660.9'), parseMinutes('600')]),
);
