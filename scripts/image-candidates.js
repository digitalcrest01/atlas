#!/usr/bin/env node
/* Photo candidates for a tour line, for choosing each line's picture by hand.
   node scripts/image-candidates.js "Wat Pho" "Thailand"
   Prints Wikipedia pages about the subject with a lead JPEG photo:
     file | page title | page description
   Pages about people, conflict, politics or adult themes are left out, as are
   maps, flags and diagrams. Requests are spaced out to respect Wikipedia. */
const [subject, country] = process.argv.slice(2);
if (!subject) {
  console.error('usage: node scripts/image-candidates.js "<subject>" ["<country>"]');
  process.exit(1);
}

const SAFE = /\b(city|town|village|capital|port|river|lake|mountains?|volcano|island|archipelago|bay|beach|coast|desert|forest|rainforest|park|reserve|temple|church|cathedral|basilica|mosque|monastery|shrine|pagoda|palace|castle|fortress|fort|citadel|monument|statue|museum|square|plaza|bridge|market|bazaar|dish|food|cuisine|soup|stew|drink|beverage|tea|coffee|bread|cake|dessert|pastry|sweet|snack|fruit|rice|noodles?|festival|holiday|celebration|carnival|dance|music|instrument|sport|game|species|animal|bird|mammal|reptile|fish|antelope|region|province|district|landmark|building|tower|skyscraper|garden|valley|waterfall|falls|canyon|gorge|cave|sea|gulf|glacier|fjord|plateau|savanna|wetland|marsh|reef|lagoon|oasis|site|ruins|archaeological|heritage|tradition|craft|textile|fabric|weaving|pottery|costume|dress|garment|boat|train|railway|street|neighbourhood|neighborhood|quarter|old town|harbour|harbor)\b/i;
const UNSAFE = /\b(born|died|people|person|actor|actress|singer|rapper|musician|politician|president|minister|dictator|leader|king|queen|emperor|general|officer|footballer|player|athlete|writer|author|poet|painter|model|businessman|criminal|war|wars|battle|siege|massacre|genocide|holocaust|nazi|concentration|camp|cemetery|grave|memorial|attack|bombing|invasion|occupation|revolution|uprising|coup|terror|murder|execution|assassination|disaster|earthquake|tsunami|famine|crash|shooting|riot|protest|conflict|military|army|navy|weapon|prison|slavery|bondage|erotic|sex|sexual|nude|adult|party|election|film|album|novel|band|television|video game|company|corporation|brand|pipeline|mining|program|programme|charity|organi[sz]ation|software|feature|website|satellite|flag|coat of arms|map)\b/i;
const UNSAFE_FILE = /hitler|nazi|war|krig|battle|bomb|attack|massacre|genocide|corpse|dead|death|grave|cemetery|memorial|camp|execut|weapon|gun|rifle|tank|soldier|army|military|navy|uss_|colonel|general|protest|banner|riot|prison|skull|blood|nude|kinbaku|bondage|erotic|portrait|headshot|speech|ceremony|satellite|nasa|noaa|haze|map|flag|chart|diagram|logo|screenshot|share_sent/i;

const wait = ms => new Promise(r => setTimeout(r, ms));

async function search(q) {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0' +
    '&gsrlimit=6&prop=pageimages|description&piprop=name&gsrsearch=' + encodeURIComponent(q);
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url, { headers: { 'User-Agent': 'myatlastic-content/1.0 (support@myatlastic.com)' } });
    const text = await r.text();
    if (r.ok && text[0] === '{') {
      const j = JSON.parse(text);
      return Object.values((j.query && j.query.pages) || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    }
    await wait(1500 * (attempt + 1));
  }
  return [];
}

(async () => {
  const seen = new Set();
  const queries = country ? [subject + ' ' + country, subject] : [subject];
  for (const q of queries) {
    const pages = await search(q);
    for (const p of pages) {
      const file = p.pageimage || '';
      const desc = p.description || '';
      if (!file || seen.has(file)) continue;
      if (!/\.jpe?g$/i.test(file) || UNSAFE_FILE.test(file)) continue;
      if (!SAFE.test(desc) || UNSAFE.test(desc + ' ' + p.title)) continue;
      seen.add(file);
      console.log(file + ' | ' + p.title + ' | ' + desc);
    }
    await wait(350);
  }
  if (!seen.size) console.log('(no safe photo found)');
})();
