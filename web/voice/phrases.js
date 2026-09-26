/* The phrasebook's fixed list of phrases. Each language's book
   (voice/phrasebook/<book>.json) translates every id here. */
(function (root) {
  const CATEGORIES = [
    { id: 'greet', label: 'Greetings' },
    { id: 'polite', label: 'Polite words' },
    { id: 'talk', label: 'Talking' },
    { id: 'around', label: 'Getting around' },
    { id: 'food', label: 'Food & drink' },
    { id: 'shop', label: 'Shopping' },
    { id: 'help', label: 'Help' },
    { id: 'numbers', label: 'Numbers' }
  ];

  const PHRASES = [
    { id: 'hello', cat: 'greet', en: 'Hello' },
    { id: 'good_morning', cat: 'greet', en: 'Good morning' },
    { id: 'good_evening', cat: 'greet', en: 'Good evening' },
    { id: 'goodbye', cat: 'greet', en: 'Goodbye' },
    { id: 'how_are_you', cat: 'greet', en: 'How are you?' },
    { id: 'nice_to_meet', cat: 'greet', en: 'Nice to meet you' },
    { id: 'please', cat: 'polite', en: 'Please' },
    { id: 'thank_you', cat: 'polite', en: 'Thank you' },
    { id: 'youre_welcome', cat: 'polite', en: "You're welcome" },
    { id: 'excuse_me', cat: 'polite', en: 'Excuse me' },
    { id: 'sorry', cat: 'polite', en: 'Sorry' },
    { id: 'yes', cat: 'polite', en: 'Yes' },
    { id: 'no', cat: 'polite', en: 'No' },
    { id: 'speak_english', cat: 'talk', en: 'Do you speak English?' },
    { id: 'dont_understand', cat: 'talk', en: "I don't understand" },
    { id: 'slowly', cat: 'talk', en: 'Please speak more slowly' },
    { id: 'repeat', cat: 'talk', en: 'Could you say that again?' },
    { id: 'where_station', cat: 'around', en: 'Where is the train station?' },
    { id: 'where_toilet', cat: 'around', en: 'Where is the restroom?' },
    { id: 'is_it_far', cat: 'around', en: 'Is it far?' },
    { id: 'left', cat: 'around', en: 'Left' },
    { id: 'right', cat: 'around', en: 'Right' },
    { id: 'straight', cat: 'around', en: 'Straight ahead' },
    { id: 'menu', cat: 'food', en: 'The menu, please' },
    { id: 'water', cat: 'food', en: 'Water, please' },
    { id: 'bill', cat: 'food', en: 'The bill, please' },
    { id: 'delicious', cat: 'food', en: 'Delicious!' },
    { id: 'vegetarian', cat: 'food', en: "I'm vegetarian" },
    { id: 'how_much', cat: 'shop', en: 'How much is it?' },
    { id: 'too_expensive', cat: 'shop', en: "That's too expensive" },
    { id: 'pay_card', cat: 'shop', en: 'Can I pay by card?' },
    { id: 'help', cat: 'help', en: 'Help!' },
    { id: 'need_doctor', cat: 'help', en: 'I need a doctor' },
    { id: 'lost', cat: 'help', en: "I'm lost" },
    { id: 'n1', cat: 'numbers', en: 'One', n: 1 },
    { id: 'n2', cat: 'numbers', en: 'Two', n: 2 },
    { id: 'n3', cat: 'numbers', en: 'Three', n: 3 },
    { id: 'n4', cat: 'numbers', en: 'Four', n: 4 },
    { id: 'n5', cat: 'numbers', en: 'Five', n: 5 },
    { id: 'n6', cat: 'numbers', en: 'Six', n: 6 },
    { id: 'n7', cat: 'numbers', en: 'Seven', n: 7 },
    { id: 'n8', cat: 'numbers', en: 'Eight', n: 8 },
    { id: 'n9', cat: 'numbers', en: 'Nine', n: 9 },
    { id: 'n10', cat: 'numbers', en: 'Ten', n: 10 }
  ];

  // Books written in a Latin alphabet need no romanization line.
  const LATIN_BOOKS = [
    'af', 'az', 'bs', 'ca', 'cs', 'da', 'de', 'es-419', 'es-ES', 'et', 'fi', 'fil', 'fr', 'ga',
    'hr', 'hu', 'id', 'is', 'it', 'lt', 'lv', 'ms', 'mt', 'nb', 'nl', 'pl', 'pt-BR', 'pt-PT',
    'ro', 'sk', 'sl', 'so', 'sq', 'sr-Latn', 'sv', 'sw', 'tr', 'uz', 'vi', 'zu'
  ];

  const api = { CATEGORIES: CATEGORIES, PHRASES: PHRASES, LATIN_BOOKS: LATIN_BOOKS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MyatlasticPhrases = api;
})(typeof window !== 'undefined' ? window : this);
