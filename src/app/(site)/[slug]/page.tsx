import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PAGES } from './content';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: (PAGES[slug]?.title ?? 'Clario') + ' · Clario' };
}

const ink = '#0b1626', muted = '#5a6474', blue = '#1f6be2';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: ink, fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", fontSize: 16, lineHeight: 1.5, letterSpacing: '-0.4px' }}>
      <style>{'body{margin:0}'}</style>
      <header style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: ink, textDecoration: 'none', fontSize: 20, fontWeight: 700, letterSpacing: '-0.7px', minHeight: 44 }}>
          <img src="/assets/clario-mark-v2.png" alt="" width={30} height={30} />Clario
        </a>
        <a href="/login" style={{ color: ink, fontWeight: 600, textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center' }}>Log in</a>
      </header>
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px,5vw,48px)', fontWeight: 700, letterSpacing: '-1.6px', lineHeight: 1.1 }}>{page.title}</h1>
          <p style={{ margin: 0, fontSize: 19, color: muted, textWrap: 'pretty' }}>{page.lead}</p>
        </div>
        {page.sections.map(s => (
          <section key={s.heading} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>{s.heading}</h2>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, color: '#45505f' }}>
              {s.items.map(i => <li key={i}>{i}</li>)}
            </ul>
          </section>
        ))}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {page.cta ? <a href={page.cta.href} style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 20px', background: blue, color: '#ffffff', borderRadius: 16, fontWeight: 600, textDecoration: 'none' }}>{page.cta.label}</a> : null}
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 20px', border: '1px solid ' + ink, color: ink, borderRadius: 16, fontWeight: 600, textDecoration: 'none' }}>Back to the homepage</a>
        </div>
      </main>
    </div>
  );
}
