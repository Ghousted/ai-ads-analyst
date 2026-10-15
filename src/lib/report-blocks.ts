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
// What a report stores: a Tiptap (ProseMirror) document. Charts and tables are "dataBlock" nodes inside it.
const PMNode: z.ZodType<unknown> = z.lazy(() => z.object({ type: z.string().max(40), attrs: z.record(z.string(), z.unknown()).optional(), content: z.array(PMNode).max(400).optional(), text: z.string().max(8000).optional(), marks: z.array(z.object({ type: z.string().max(40), attrs: z.record(z.string(), z.unknown()).optional() })).max(10).optional() }));
export const Content = z.object({ doc: z.object({ type: z.literal('doc'), content: z.array(PMNode).max(400) }) });
export type Doc = { type: 'doc'; content: PMJson[] };
export type PMJson = { type: string; attrs?: Record<string, unknown>; content?: PMJson[]; text?: string; marks?: { type: string; attrs?: Record<string, unknown> }[] };
export type Content = { doc: Doc };

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
  return { doc: blocksToDoc(templateBlocks(tpl, wr, facts)) };
}

export function templateBlocks(tpl: TemplateId, wr: Written, facts: FactsLike): Block[] {
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
  return blocks;
}

export const blankContent = (title: string): Content => ({ doc: { type: 'doc', content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: title }] }, { type: 'paragraph' }] } });

const txt = (t: string) => (t ? [{ type: 'text', text: t }] : undefined);
const para = (t: string): PMJson => ({ type: 'paragraph', ...(t ? { content: txt(t) } : {}) });

// Blocks (templates, and reports saved before the document editor) to a Tiptap document.
export function blocksToDoc(blocks: Block[]): Doc {
  const content: PMJson[] = blocks.flatMap((b): PMJson[] => {
    if (b.t === 'title') return [{ type: 'heading', attrs: { level: 1 }, content: txt(b.text) }];
    if (b.t === 'heading') return [{ type: 'heading', attrs: { level: 2 }, content: txt(b.text) }];
    if (b.t === 'text') return (b.text || '').split(/\n+/).map(para);
    if (b.t === 'list') return [{ type: 'orderedList', content: b.items.map(x => ({ type: 'listItem', content: [para(x)] })) }];
    const { id, t, ...rest } = b as Block & Record<string, unknown>;
    void id;
    return [{ type: 'dataBlock', attrs: { kind: t, ...rest } }];
  });
  return { type: 'doc', content: content.length ? content : [para('')] };
}

// Older formats: { headline, summary, sections, nextSteps } (first AI reports), then { blocks }.
export function normalizeContent(c: unknown, facts: FactsLike): Content {
  const x = c as Partial<Written> & { blocks?: Block[]; doc?: Doc };
  if (x && x.doc && x.doc.type === 'doc') return { doc: x.doc };
  if (x && Array.isArray(x.blocks)) return { doc: blocksToDoc(x.blocks) };
  if (x && typeof x.headline === 'string') return layoutTemplate('weekly', { headline: x.headline, summary: x.summary || '', sections: x.sections || [], nextSteps: x.nextSteps || [] }, facts);
  return { doc: { type: 'doc', content: [para('')] } };
}

// Plain text of a document, for giving Claude the rest of the report as context.
export function docText(doc: Doc): string {
  const walk = (n: PMJson): string => n.text ?? (n.type === 'dataBlock' ? '[' + String(n.attrs?.kind) + ']' : (n.content || []).map(walk).join(n.type === 'doc' || n.type === 'orderedList' || n.type === 'bulletList' ? '\n\n' : ''));
  return walk(doc);
}
