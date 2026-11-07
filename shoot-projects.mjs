import puppeteer from 'puppeteer-core';
const ids = ['project-lifeguard360','project-signal','project-orbit','project-ledger','project-portfolio-v1'];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--hide-scrollbars'], defaultViewport: null });
const page = await browser.newPage();
await page.setViewport({ width: 1536, height: 960 });
await page.goto('http://127.0.0.1:4399/', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 3000));
for (const id of ids) {
  const y = await page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top + window.scrollY, id);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise(r => setTimeout(r, 2200));
  const info = await page.evaluate((i) => {
    const el = document.getElementById(i);
    const shot = el.querySelector('img.pj-shot');
    if (!shot) return { title: el.querySelector('h2').textContent.trim(), mockup: true };
    const r = shot.getBoundingClientRect();
    return { title: el.querySelector('h2').textContent.trim(), natural: [shot.naturalWidth, shot.naturalHeight], box: [Math.round(r.width), Math.round(r.height)], ratioMatch: (shot.naturalWidth / shot.naturalHeight).toFixed(3) + ' vs ' + (r.width / r.height).toFixed(3) };
  }, id);
  await page.screenshot({ path: `screenshots/${id}.png` });
  console.log(id, JSON.stringify(info));
}
await browser.close();
