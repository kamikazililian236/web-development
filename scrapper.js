 { chromium } = require('playwright');
const fs = require('fs');

async function getAssignments() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Opening Canvas...');
  await page.constgoto('https://alueducation.instructure.com', { waitUntil: 'domcontentloaded' });

  console.log('Please log in in the browser window...');
  await page.waitForURL(url => url.pathname.includes('/courses') || (!url.pathname.includes('login') && url.hostname.includes('instructure.com')), { timeout: 0 });

  // Go to assignments page
  try {
    await page.locator('text=Frontend Web development').first().click();
    await page.locator('text=Assignments').click();
  } catch {
    await page.goto('https://alueducation.instructure.com/courses/3130/assignments', { waitUntil: 'domcontentloaded' });
  }

  await page.waitForSelector('.assignment-list, .ig-row');

  // Get all assignment links
  const links = await page.$$eval('a[href*="/assignments/"]', tags => {
    const list = [];
    tags.forEach(a => {
      const url = a.href.split('?')[0];
      if (/\/assignments\/\d+$/.test(url) && !list.includes(url)) {
        list.push(url);
      }
    });
    return list;
  });

  console.log(`Found ${links.length} assignments.\n`);

  const results = [];

  // Check each assignment one by one
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log(`Checking [${i + 1}/${links.length}]: ${link}`);

    try {
      // Faster load that won't freeze
      await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(1000);

      const text = await page.locator('body').innerText();

      // Get title
      let title = 'Assignment';
      try {
        title = await page.locator('h1').first().innerText();
      } catch {
        title = await page.title();
      }

      // Get due date
      const match = text.match(/Due\s+([A-Za-z]{3}\s+\d+\s+(?:at|by)\s+\d+:\d+[ap]m)/);
      const dueDate = match ? match[1] : 'No due date';

      // Check status
      let status = 'Not Submitted';
      if (text.includes('Submitted!')) {
        const date = text.match(/Submitted!\s*([A-Za-z]{3}\s+\d+\s+at\s+\d+:\d+[ap]m)/);
        status = date ? `Submitted (${date[1]})` : 'Submitted';
      } else if (text.toLowerCase().includes('locked')) {
        status = 'Locked';
      }

      const type = title.toLowerCase().includes('read and watch') ? 'Reading' : 'Assignment';

      results.push({
        title: title.replace(/\s+/g, ' ').trim(),
        type: type,
        dueDate: dueDate,
        status: status,
        link: link
      });

    } catch (e) {
      console.log(`Skipping slow link: ${link}`);
      continue;
    }
  }

  // Print results
  const tasks = results.filter(r => r.type === 'Assignment');
  const reading = results.filter(r => r.type === 'Reading');

  console.log('\n--- ASSIGNMENTS ---');
  console.table(tasks.map(t => ({ title: t.title, status: t.status, due: t.dueDate })));

  console.log('\n--- READINGS ---');
  console.table(reading.map(r => ({ title: r.title, status: r.status })));

  // Save to JSON
  fs.writeFileSync('canvas_assignments.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to canvas_assignments.json');

  await page.waitForTimeout(2000);
  await browser.close();
}

getAssignments();