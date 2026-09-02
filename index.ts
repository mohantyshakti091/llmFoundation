import { getEncoding } from "js-tiktoken";

const enc = getEncoding("o200k_base");

const samples: string[] = [
  "orchestration",
  "The invoice total is $1,240.55.",
  "SELECT customer_id FROM orders WHERE status = 'PENDING';",
  "ପ୍ରତିଷ୍ଠାନ",
  "550e8400-e29b-41d4-a716-446655440000",
];

for (const s of samples) {
  const ids: number[] = enc.encode(s);
  console.log("IDS", ids);
  const pieces: string[] = ids.map((i) => enc.decode([i]));
  console.log("PIECES", pieces);
  console.log(
    `${String(ids.length).padStart(3)} tokens | ${JSON.stringify(s.slice(0, 45))}`,
  );
  console.log(`      ${JSON.stringify(pieces)}\n`);
}
