const fs = require('fs');
const { JSDOM } = require('jsdom');
const jquery = require('jquery/factory').jQueryFactory || require('jquery');

// read the saved canvas page and print each assignment
function getAssignments() {
  if (!fs.existsSync('dom.html')) {
    console.log('dom.html not found. Save the Canvas page as dom.html first.');
    return;
  }

  const html = fs.readFileSync('dom.html', 'utf-8');
  const dom = new JSDOM(html);
  const $ = jquery(dom.window);

  const assignments = [];

  // go through each assignment row on the page
  $('.assignment, .ig-row').each(function () {
    const row = $(this);
    const linkTag = row.find('a[href*="/assignments/"]').first();

    const title = linkTag.text().trim();
    let link = linkTag.attr('href');

    // skip rows with no title or link
    if (!title || !link) return;

    // make the link a full url
    if (!link.startsWith('http')) {
      link = 'https://alueducation.instructure.com' + link;
    }

    // get due date (use a default if it's missing)
    let dueDate = row.find('.assignment-date-due, .due_date_display, .date_text').first().text();
    dueDate = dueDate.replace(/\s+/g, ' ').trim();
    if (!dueDate) dueDate = 'No due date';

    // get status (use a default if it's missing)
    let status = row.find('.submission-status, .status, .submission_status').first().text();
    status = status.replace(/\s+/g, ' ').trim();
    if (!status) status = 'Not available';

    // don't add the same assignment twice
    let alreadyAdded = false;
    for (const a of assignments) {
      if (a.link === link) alreadyAdded = true;
    }

    if (!alreadyAdded) {
      assignments.push({ title, status, dueDate, link });
    }
  });

  console.log('=== CANVAS ASSIGNMENTS ===\n');

  for (let i = 0; i < assignments.length; i++) {
    const a = assignments[i];
    console.log(`${i + 1}. Assignment Title: ${a.title}`);
    console.log(`   Status: ${a.status}`);
    console.log(`   Due Date: ${a.dueDate}`);
    console.log(`   Link: ${a.link}\n`);
  }

  console.log(`Total: ${assignments.length} assignments found.`);
}

getAssignments(); 