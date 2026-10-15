import 'server-only';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// A report as a PDF: headless Chrome prints the client's report page (/r/<token>), so the PDF matches what the client
// sees, charts included. On Vercel (Linux) it uses the bundled Chromium; locally, CHROME_PATH or the Mac's Chrome.
const MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function launch() {
  const local = process.env.CHROME_PATH || (process.platform === 'darwin' ? MAC_CHROME : '');
  if (local) return puppeteer.launch({ executablePath: local, headless: true });
  return puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
}

export async function reportPdf(token: string): Promise<Buffer> {
  const base = (process.env.APP_URL || '').replace(/\/$/, '');
  if (!base) throw new Error('APP_URL isn’t set, so the PDF can’t be made.');
  const browser = await launch();
  try {
    const page = await browser.newPage();
    // preview=1 so the agency's own PDF doesn't count as a client view.
    const res = await page.goto(base + '/r/' + token + '?preview=1&print=1', { waitUntil: 'networkidle0', timeout: 30000 });
    if (!res || !res.ok()) throw new Error('The report page didn’t load (' + (res ? res.status() : 'no response') + ').');
    await page.evaluate(() => document.fonts.ready);
    return Buffer.from(await page.pdf({ format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } }));
  } finally {
    await browser.close();
  }
}

// "Onnit – Weekly report · Oct 8 – Oct 14.pdf", safe for every mail app and file system.
export const pdfName = (client: string, title: string) => (client + ' – ' + title).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) + '.pdf';
