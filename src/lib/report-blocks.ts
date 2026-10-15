// A report's body is a list of blocks. Shared by the server (validation, templates) and the report editor.
import { z } from 'zod';

const Id = z.string().min(1).max(40);
// Width as a share of the page: one third, half, two thirds or full.
export const WIDTHS = [1 / 3, 1 / 2, 2 / 3, 1] as const;
const W = z.number().min(0.3).max(1);
const H = z.number().min(100).max(560);

export const Block = z.discriminatedUnion('t', [
  z.object({ id: Id, t: z.literal('title'), text: z.string().max(200) }),
  z.object({ id: Id, t: z.literal('heading'), text: z.string().max(200) }),
  z.object({ id: Id, t: z.literal('text'), text: z.string().max(4000) }),
  z.object({ id: Id, t: z.literal('list'), items: z.array(z.string().max(600)).max(12) }),
  z.object({ id: Id, t: z.literal('kpis'), w: W }),
  z.object({ id: Id, t: z.literal('chart'), w: W, h: H, metric: z.enum(['sessions', 'leads', 'engaged', 'pageViews']) }),
  z.object({ id: Id, t: z.literal('breakdown'), w: W, h: H, dim: z.enum(['channel', 'device']), metric: z.enum(['sessions', 'leads']), style: z.enum(['bars', 'donut']) }),
  z.object({ id: Id, t: z.literal('table'), w: W, source: z.enum(['channels', 'pages', 'campaigns']) }),
]);
export type Block = z.infer<typeof Block>;
export const Content = z.object({ blocks: z.array(Block).max(80) });
export type Content = z.infer<typeof Content>;

// What Claude writes for a template: the words only. Templates decide where they go.
export type Written = { headline: string; summary: string; sections: { heading: string; body: string }[]; nextSteps: string[] };

let seq = 0;
export const newId = () => 'b' + Date.now().toString(36) + (seq++).toString(36);

type FactsLike = { totals?: { adCost?: number } } | null | undefined;

export const TEMPLATES = [
  { id: 'weekly', label: 'Weekly update', desc: 'Summary, key numbers, the trend and next steps.', focus: '' },
  { id: 'traffic', label: 'Website traffic', desc: 'Visits, where they came from, devices and top pages.', focus: 'Focus the writing on visits: how many, where they came from, which devices and pages.' },
  { id: 'leads', label: 'Lead sources', desc: 'Leads, which channels brought them and conversion.', focus: 'Focus the writing on leads: how many, which channels brought them, and conversion rate.' },
] as const;
export type TemplateId = (typeof TEMPLATES)[number]['id'];

// Lays out a template's blocks around what Claude wrote.
export function layoutTemplate(tpl: TemplateId, wr: Written, facts: FactsLike): Content {
  const b = (x: Record<string, unknown>) => ({ id: newId(), ...x }) as Block;
  const words = [b({ t: 'title', text: wr.headline }), b({ t: 'text', text: wr.summary })];
  const sections = wr.sections.flatMap(s => [b({ t: 'heading', text: s.heading }), b({ t: 'text', text: s.body })]);
  const steps = [b({ t: 'heading', text: 'Next steps' }), b({ t: 'list', items: wr.nextSteps })];
  const ads = facts?.totals?.adCost ? [b({ t: 'table', w: 1, source: 'campaigns' })] : [];
  const blocks: Block[] =
    tpl === 'traffic' ? [...words, b({ t: 'kpis', w: 1 }), b({ t: 'chart', w: 1, h: 180, metric: 'sessions' }),
      b({ t: 'breakdown', w: 1 / 2, h: 220, dim: 'channel', metric: 'sessions', style: 'donut' }), b({ t: 'breakdown', w: 1 / 2, h: 220, dim: 'device', metric: 'sessions', style: 'bars' }),
      ...sections, b({ t: 'table', w: 1, source: 'pages' }), ...ads, ...steps]
    : tpl === 'leads' ? [...words, b({ t: 'kpis', w: 1 }), b({ t: 'chart', w: 1, h: 180, metric: 'leads' }),
      b({ t: 'breakdown', w: 1, h: 220, dim: 'channel', metric: 'leads', style: 'bars' }), b({ t: 'table', w: 1, source: 'channels' }), ...sections, ...steps]
    : [...words, b({ t: 'kpis', w: 1 }), b({ t: 'chart', w: 1, h: 180, metric: 'sessions' }), ...sections, b({ t: 'table', w: 1, source: 'channels' }), ...ads, ...steps];
  return { blocks };
}

export const blankContent = (title: string): Content => ({ blocks: [{ id: newId(), t: 'title', text: title }] });

// Reports written before blocks existed stored { headline, summary, sections, nextSteps }.
export function normalizeContent(c: unknown, facts: FactsLike): Content {
  const x = c as Partial<Written> & Partial<Content>;
  if (x && Array.isArray(x.blocks)) return { blocks: x.blocks };
  if (x && typeof x.headline === 'string') return layoutTemplate('weekly', { headline: x.headline, summary: x.summary || '', sections: x.sections || [], nextSteps: x.nextSteps || [] }, facts);
  return { blocks: [] };
}

// Text a part of the report holds: "blocks.3" (title, heading or paragraph) or "blocks.3.items.1" (a list item).
export const PART = /^blocks\.\d+(\.items\.\d+)?$/;
export function getPart(c: Content, path: string): string | undefined {
  const [, i, , j] = path.split('.');
  const blk = c.blocks[Number(i)];
  if (!blk) return undefined;
  if (j !== undefined) return blk.t === 'list' ? blk.items[Number(j)] : undefined;
  return 'text' in blk ? blk.text : undefined;
}
export function partKind(c: Content, path: string): 'headline' | 'heading' | 'paragraph' | 'list item' {
  const [, i, , j] = path.split('.');
  if (j !== undefined) return 'list item';
  const t = c.blocks[Number(i)]?.t;
  return t === 'title' ? 'headline' : t === 'heading' ? 'heading' : 'paragraph';
}
export function setPart(c: Content, path: string, text: string) {
  const [, i, , j] = path.split('.');
  const blk = c.blocks[Number(i)];
  if (!blk) return;
  if (j !== undefined) { if (blk.t === 'list') blk.items[Number(j)] = text; }
  else if ('text' in blk) blk.text = text;
}
