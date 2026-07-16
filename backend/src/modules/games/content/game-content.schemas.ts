import { z } from 'zod';

const impostorContentSchema = z.object({
  themes: z.array(z.string().trim().min(1).max(80)).min(1).max(500),
});

const contatoContentSchema = z.object({
  words: z.array(z.string().trim().min(2).max(80)).min(1).max(2_000),
});

const quemEstaMentindoContentSchema = z.object({
  questions: z.array(z.object({
    category: z.enum(['Cotidiano', 'Preferências', 'Situações absurdas', 'Relacionamentos', 'Trabalho e estudos', 'Constrangedoras']),
    text: z.string().trim().min(10).max(220),
    personal: z.boolean(),
    difficulty: z.enum(['Leve', 'Médio', 'Sem filtro']),
  })).min(12).max(500),
});

const genericContentSchema = z.record(z.string(), z.unknown());

export function parseGameContent(slug: string, payload: unknown): unknown {
  if (slug === 'impostor') return impostorContentSchema.parse(payload);
  if (slug === 'contato') return contatoContentSchema.parse(payload);
  if (slug === 'quem-esta-mentindo') return quemEstaMentindoContentSchema.parse(payload);
  return genericContentSchema.parse(payload);
}
