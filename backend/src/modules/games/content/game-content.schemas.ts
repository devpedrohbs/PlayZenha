import { z } from 'zod';

const impostorContentSchema = z.object({
  themes: z.array(z.string().trim().min(1).max(80)).min(1).max(500),
});

const contatoContentSchema = z.object({
  words: z.array(z.string().trim().min(2).max(80)).min(1).max(2_000),
});

const genericContentSchema = z.record(z.string(), z.unknown());

export function parseGameContent(slug: string, payload: unknown): unknown {
  if (slug === 'impostor') return impostorContentSchema.parse(payload);
  if (slug === 'contato') return contatoContentSchema.parse(payload);
  return genericContentSchema.parse(payload);
}
