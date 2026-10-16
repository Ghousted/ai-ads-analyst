import type { Metadata } from 'next';
import { findConnectLink } from '@/lib/client-connect';

// The page a client opens from an ask-to-connect email. They sign in to Google with their own login; the properties
// it can see are linked to them in their agency's workspace.
export const metadata: Metadata = { title: 'Connect Google Analytics', robots: { index: false, follow: false } };

const RESULT: Record<string, [string, string]> = {
  cancelled: ['Google sign-in was cancelled', 'Nothing was connected. You can try again whenever you’re ready.'],
  noscope: ['Google didn’t share Analytics access', 'Sign in again and tick the box that lets us see your Google Analytics data.'],
  failed: ['Google didn’t finish connecting', 'Something went wrong on the way back from Google. Try again in a minute.'],
  apidisabled: ['Google didn’t finish connecting', 'Something went wrong on the way back from Google. Try again in a minute.'],
  expired: ['This link has expired', 'Ask your agency to send you a new one.'],
};

const font = "'DM Sans',ui-sans-serif,system-ui,sans-serif";

export default async function Page({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ result?: string; found?: string }> }) {
  const [{ token }, q] = await Promise.all([params, searchParams]);
  const link = await findConnectLink(token);
  const n = Number(q.found || 0), done = q.result === 'connected';
  const [title, body] = !link ? RESULT.expired
    : done ? (n ? ['You’re connected', 'Thanks. ' + n + (n === 1 ? ' Google Analytics property is' : ' Google Analytics properties are') + ' now linked to ' + link.client.name + ', and ' + link.agency.name + ' can see the results. You can close this page.']
      : ['You’re connected, but nothing new was found', 'That Google login has no Google Analytics properties that aren’t already linked. If your Analytics is under a different Google login, connect that one.'])
    : RESULT[q.result || ''] || ['Connect your Google Analytics', link.agency.name + ' asked you to connect ' + link.client.name + '’s Google Analytics, so your reports show your website’s results.'];
  return (
    <main style={{ minHeight: '100vh', background: '#f4f7fb', padding: '48px 16px', fontFamily: font, letterSpacing: '-0.4px', color: '#0b1626' }}>
      <section style={{ maxWidth: '560px', margin: '0 auto', background: '#ffffff', padding: 'clamp(24px,5vw,40px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {link ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            {link.agency.brandLogo ? <img src={link.agency.brandLogo} alt={link.agency.name + ' logo'} style={{ height: '32px', maxWidth: '160px', objectFit: 'contain', display: 'block' }} /> : null}
            <strong>{link.agency.name}</strong>
          </span>
        ) : null}
        <h1 style={{ margin: '0', fontSize: '26px', lineHeight: '1.25', letterSpacing: '-0.8px' }}>{title}</h1>
        <p style={{ margin: '0', fontSize: '16px', lineHeight: '1.55', color: '#45505f' }}>{body}</p>
        {link && !done ? (
          <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.55', color: '#45505f' }}>{'Sign in with the Google login that has your Analytics. ' + link.agency.name + ' gets read-only access and can’t change anything. You can remove access any time in your Google account.'}</p>
        ) : null}
        {link ? (
          <a href={'/api/integrations/google/start?connect=' + encodeURIComponent(token)} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', height: '48px', padding: '0 22px', marginTop: '8px', background: done ? '#ffffff' : '#1f6be2', color: done ? '#0b1626' : '#ffffff', border: done ? '1px solid #d3dbe6' : '0', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>
            {done ? 'Connect another Google login' : 'Sign in with Google'}
          </a>
        ) : null}
      </section>
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#5a6474', marginTop: '16px' }}>{link ? 'Sent by ' + link.agency.name + ' with AI Ads Analyst' : 'AI Ads Analyst'}</p>
    </main>
  );
}
