/* Loads phrasebooks and country narrations on demand, once each.
   Files live next to this script: voice/phrasebook/<book>.json and
   voice/narration/<slug>.json. */
(function (root) {
  const Locales = root.MyatlasticLocales;
  const books = new Map();
  const narrations = new Map();

  function load(map, key, path) {
    if (map.has(key)) return map.get(key);
    const job = fetch(path).then(r => (r.ok ? r.json() : null)).catch(() => null).then(data => {
      if (!data) map.delete(key);
      return data;
    });
    map.set(key, job);
    return job;
  }

  function book(key) {
    if (!key || key === 'en') return Promise.resolve(null);
    return load(books, key, 'voice/phrasebook/' + key + '.json');
  }

  function narration(country) {
    return load(narrations, country, 'voice/narration/' + Locales.slugOf(country) + '.json');
  }

  root.MyatlasticContent = { book: book, narration: narration };
})(typeof window !== 'undefined' ? window : this);
