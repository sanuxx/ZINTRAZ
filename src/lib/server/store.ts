// Blueprint submissions, stored as one JSON file each under BLUEPRINT_DIR (default ./data/blueprints).
// Plain files keep the production server dependency-free; back the folder up with the rest of the server.
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { Blueprint } from "@/lib/builder";

export type Status = "new" | "reviewing" | "replied" | "archived";
export const STATUSES: Status[] = ["new", "reviewing", "replied", "archived"];
export type Submission = { id: string; ref: string; createdAt: string; updatedAt: string; status: Status; note: string; ip: string; blueprint: Blueprint };

const DIR = path.resolve(process.env.BLUEPRINT_DIR || path.join(process.cwd(), "data", "blueprints"));
const ID = /^[a-z0-9]{12}$/;
const file = (id: string) => path.join(DIR, `${id}.json`);

/** A short, human-friendly reference for emails and calls, e.g. BP-7K3Q9X. */
const refOf = (id: string) => `BP-${id.slice(0, 6).toUpperCase()}`;

export async function create(blueprint: Blueprint, ip: string): Promise<Submission> {
  await fs.mkdir(DIR, { recursive: true });
  const id = randomBytes(9).toString("base64url").toLowerCase().replace(/[^a-z0-9]/g, "").padEnd(12, "0").slice(0, 12);
  const now = new Date().toISOString();
  const sub: Submission = { id, ref: refOf(id), createdAt: now, updatedAt: now, status: "new", note: "", ip, blueprint };
  await fs.writeFile(file(id), JSON.stringify(sub, null, 2), { flag: "wx" });
  return sub;
}

export async function get(id: string): Promise<Submission | null> {
  if (!ID.test(id)) return null;
  try { return JSON.parse(await fs.readFile(file(id), "utf8")) as Submission; } catch { return null; }
}

export async function list(): Promise<Submission[]> {
  let names: string[] = [];
  try { names = await fs.readdir(DIR); } catch { return []; }
  const subs = await Promise.all(names.filter((n) => n.endsWith(".json")).map((n) => get(n.slice(0, -5))));
  return subs.filter((s): s is Submission => !!s).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function update(id: string, patch: Partial<Pick<Submission, "status" | "note">>): Promise<Submission | null> {
  const cur = await get(id);
  if (!cur) return null;
  const next = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  await fs.writeFile(file(id), JSON.stringify(next, null, 2));
  return next;
}
