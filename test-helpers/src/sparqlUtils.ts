import { querySudo } from "@lblod/mu-auth-sudo";
import { expect } from "@jest/globals";
import { getSession } from "./requestUtils";

export type Term = { type: string; value: string; dataType?: string };
export type Quad = {
  graph: Term;
  subject: Term;
  object: Term;
  predicate: Term;
};

declare global {
  var deltas: { inserts: Quad[]; deletes: Quad[] }[];
}

const deltaPropagationTimeout = parseInt(
  process.env.DELTA_PROPAGATION_TIMEOUT || "200"
);

export async function expectQueryToHaveResults(
  query: string,
  extraHeaders = {} as Record<string, string>
) {
  const result = await querySudo(query, extraHeaders);
  expect(result.results.bindings.length).toBeGreaterThan(0);
}

export async function runSudoQuery(
  query: string,
  extraHeaders = {} as Record<string, string>
) {
  const result = await querySudo(query, extraHeaders);
  return result.results.bindings;
}

export async function expectQueryToHaveNoResults(
  query: string,
  extraHeaders = {} as Record<string, string>
) {
  const result = await querySudo(query, extraHeaders);
  expect(result.results.bindings.length).toBe(0);
}

export async function expectUserQueryToHaveResults(query: string) {
  const result = await querySudo(query, {
    "mu-auth-sudo": "false",
    "mu-session-id": getSession(),
  });
  expect(result.results.bindings.length).toBeGreaterThan(0);
}

export async function runUserQuery(query: string) {
  const result = await querySudo(query, {
    "mu-auth-sudo": "false",
    "mu-session-id": getSession(),
  });
  return result.results.bindings;
}

export async function expectUserQueryToHaveNoResults(query: string) {
  const result = await querySudo(query, {
    "mu-auth-sudo": "false",
    "mu-session-id": getSession(),
  });
  expect(result.results.bindings.length).toBe(0);
}

export async function getDeltas() {
  await new Promise((resolve) => setTimeout(resolve, deltaPropagationTimeout));
  return globalThis.deltas;
}

export async function getDeltaInserts() {
  const deltas = await getDeltas();
  return deltas
    .flat()
    .map((delta) => delta.inserts)
    .flat();
}

export async function getDeltaDeletes() {
  const deltas = await getDeltas();
  return deltas
    .flat()
    .map((delta) => delta.deletes)
    .flat();
}

export async function expectDeltaInsert(partialQuad: Partial<Quad>) {
  const inserts = await getDeltaInserts();
  expect(inserts).toContainEqual(expect.objectContaining(partialQuad));
}

export async function expectDeltaDelete(partialQuad: Partial<Quad>) {
  const deletes = await getDeltaDeletes();
  expect(deletes).toContainEqual(expect.objectContaining(partialQuad));
}

export async function clearDeltas() {
  await new Promise((resolve) => setTimeout(resolve, deltaPropagationTimeout));
  globalThis.deltas.splice(0, globalThis.deltas.length);
}
