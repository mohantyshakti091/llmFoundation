import { fileURLToPath } from "url";
import { resolve } from "path";

type M = number[][];

const matmul = (A: M, B: M): M =>
  A.map((row) =>
    B[0].map((_, j) => row.reduce((s, v, k) => s + v * B[k][j], 0)),
  );

const transpose = (A: M): M => A[0].map((_, j) => A.map((r) => r[j]));

const softmaxRow = (row: number[]): number[] => {
  const m = Math.max(...row.filter((v) => Number.isFinite(v)));
  const e = row.map((v) => (Number.isFinite(v) ? Math.exp(v - m) : 0));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
};

export function causalSelfAttention(
  X: M,
  Wq: M,
  Wk: M,
  Wv: M,
): { out: M; A: M } {
  const Q = matmul(X, Wq),
    K = matmul(X, Wk),
    V = matmul(X, Wv);
  const dk = K[0].length;
  const scores = matmul(Q, transpose(K)).map((row, i) =>
    row.map((v, j) => (j > i ? -Infinity : v / Math.sqrt(dk))),
  );
  const A = scores.map(softmaxRow);
  return { out: matmul(A, V), A };
}

export const rand = (r: number, c: number, s = 0.3): M =>
  Array.from({ length: r }, () =>
    Array.from({ length: c }, () => (Math.random() * 2 - 1) * s),
  );

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  const [n, dModel, dK] = [6, 8, 4];
  const { A } = causalSelfAttention(
    rand(n, dModel, 1),
    rand(dModel, dK),
    rand(dModel, dK),
    rand(dModel, dK),
  );
  console.table(A.map((r) => r.map((v) => +v.toFixed(3))));
}
