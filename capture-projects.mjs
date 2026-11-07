import puppeteer from 'puppeteer-core';
// 1440 x 954 matches the device frame's 16 / 10.6 aspect exactly, so the
// screenshot fills the screen with no cropping.
const targets = [
  ['siignal-firebase', 'https://wisdomvision001.github.io/siignal-firebase/'],
  ['orbit', 'https://wisdomvision001.github.io/ORBIT/'],
  ['expense-tracker', 'https://wisdomvision001.github.io/expense-tracker/'],
  ['my-portfolio', 'https://wisdomvision001.github.io/my-portfolio/'],
];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--hide-scrollbars'], defaultViewport: null });
for (const [name, url] of targets) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 954, deviceScaleFactor: 1 });
  try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 }); }
  catch (e) { console.log(name, 'nav warn:', e.message.split('\n')[0]); }
  await new Promise(r => setTimeout(r, 3000));
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: `public/assets/projects/${name}.jpg`, type: 'jpeg', quality: 88 });
  console.log('captured', name);
  await page.close();
}
await browser.close();
