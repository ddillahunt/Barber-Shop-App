const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Load logo as base64
const logoBytes = fs.readFileSync(path.join(__dirname, 'src/assets/images/barber-Grandes Ligas logo.png'));
const logoDataUri = 'data:image/png;base64,' + logoBytes.toString('base64');

// Read template and inject logo
let html = fs.readFileSync(path.join(__dirname, 'ONBOARDING_TEMPLATE.html'), 'utf8');
html = html.replace('LOGO_PLACEHOLDER', logoDataUri);

// Write final HTML
const tempPath = path.join(__dirname, 'ONBOARDING_temp.html');
fs.writeFileSync(tempPath, html);

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file:///' + tempPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });
  await page.pdf({
    path: path.join(__dirname, 'Grandes_Ligas_Onboarding_Guide.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' }
  });
  await browser.close();
  fs.unlinkSync(tempPath);
  console.log('PDF created successfully');
})();
