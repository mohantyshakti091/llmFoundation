import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPENAI_ADMIN_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

const prompt =
  "Give one plausible root cause for an intermittent 502 in a Kubernetes ingress.";

async function getCompletion(temperature: number, i: number): Promise<string> {
  if (client) {
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature,
      max_tokens: 40,
      messages: [{ role: "user", content: prompt }],
    });
    return r.choices[0].message.content?.trim().replace(/\n/g, " ") ?? "";
  }
  return `(dry-run) plausible cause for 502 at temperature=${temperature} #${i}`;
}

(async () => {
  for (const temperature of [0.0, 0.7, 1.3]) {
    console.log(`\n--- temperature=${temperature} ---`);
    for (let i = 0; i < 3; i++) {
      const content = await getCompletion(temperature, i);
      console.log(" •", content.slice(0, 110));
    }
  }
})();
