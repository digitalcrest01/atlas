/* Live country conversation during a tour: the listener interrupts, asks,
   or names another country, and the guide answers. Phrases it teaches come
   from the country's phrasebook (voice/phrasebook/*.json), in native script. */
(function () {
  const PATTERNS = ['story', 'practical', 'culture', 'question', 'guide', 'language', 'cafe', 'taxi', 'hotel', 'shop', 'meet', 'survival'];
  const ALIAS = {
    'england': 'United Kingdom', 'uk': 'United Kingdom', 'britain': 'United Kingdom',
    'usa': 'United States', 'america': 'United States', 'u.s.': 'United States',
    'holland': 'Netherlands', 'uae': 'United Arab Emirates'
  };
  const BANK = {
    en: {
      greet: [['Hello', 'heh-LOH', 'Hello'], ['Good morning', 'good MOR-ning', 'Good morning'], ['Good evening', 'good EEV-ning', 'Good evening'], ['How are you?', 'how are YOU', 'How are you?'], ['Nice to meet you', 'nice to MEET you', 'Nice to meet you'], ["What's your name?", 'whats your NAYM', "What's your name?"]],
      polite: [['Please', 'pleez', 'Please'], ['Thank you', 'THANK you', 'Thank you'], ["You're welcome", 'yor WEL-kum', "You're welcome"], ['Excuse me', 'ex-KYOOZ me', 'Excuse me'], ['Sorry', 'SOR-ee', 'Sorry'], ['No problem', 'no PROB-lem', 'No problem']],
      talk: [["I don't understand", 'I dont un-der-STAND', "I don't understand"], ['Do you speak English?', 'do you speak ING-glish', 'Do you speak English?'], ['Could you say that again?', 'could you say that a-GEN', 'Could you say that again?'], ['Could you speak more slowly?', 'could you speak more SLOW-lee', 'Could you speak more slowly?'], ['What does that mean?', 'what does that MEAN', 'What does that mean?']],
      nav: [['Where is the station?', 'where is the STAY-shun', 'Where is the station?'], ['How do I get there?', 'how do I get THERE', 'How do I get there?'], ['Is it far?', 'iz it FAR', 'Is it far?'], ['Left', 'LEFT', 'Left'], ['Right', 'RYTE', 'Right'], ['Straight ahead', 'strayt a-HED', 'Straight ahead'], ['Where is the bathroom?', 'where is the BATH-room', 'Where is the bathroom?']],
      food: [["I'd like this, please", "I'd like this PLEEZ", "I'd like this, please"], ['Can I see the menu?', 'can I see the MEN-yoo', 'Can I see the menu?'], ['What do you recommend?', 'what do you rek-uh-MEND', 'What do you recommend?'], ['Water, please', 'WAW-ter pleez', 'Water, please'], ['The check, please', 'the CHEK pleez', 'The check, please'], ['Is this spicy?', 'iz this SPY-see', 'Is this spicy?']],
      shop: [['How much is this?', 'how much is THIS', 'How much is this?'], ["That's too expensive", 'thats too ex-PEN-siv', "That's too expensive"], ['Can I pay by card?', 'can I pay by CARD', 'Can I pay by card?'], ['Do you have another size?', 'do you have another SIZE', 'Do you have another size?']],
      taxi: [['Where can I get a taxi?', 'where can I get a TAK-see', 'Where can I get a taxi?'], ['How much is the fare?', 'how much is the FAIR', 'How much is the fare?'], ["I'd like to go here", "I'd like to go HERE", "I'd like to go here"], ['What time does the train leave?', 'what time does the train LEEV', 'What time does the train leave?']],
      help: [['Can you help me?', 'can you HELP me', 'Can you help me?'], ['I need help', 'I need HELP', 'I need help'], ['Where is the hospital?', 'where is the HOS-pi-tal', 'Where is the hospital?'], ['Please call the police', 'pleez call the puh-LEES', 'Please call the police']],
      social: [["I'm visiting", "I'm VIZ-it-ing", "I'm visiting"], ['This is my first time here', 'this is my first time HERE', 'This is my first time here'], ['Where are you from?', 'where are you FROM', 'Where are you from?'], ['I really like it here', 'I really LIKE it here', 'I really like it here'], ['What do you recommend seeing?', 'what do you rek-uh-MEND SEE-ing', 'What do you recommend seeing?']]
    },
  };

  function hash(s) {
    let h = 0;
    const t = String(s || '');
    for (let i = 0; i < t.length; i++) h = (h * 33 + t.charCodeAt(i)) >>> 0;
    return h;
  }
  function pick(list, n) {
    if (!list || !list.length) return null;
    return list[Math.abs(n) % list.length];
  }
  // Phrasebook ids behind each conversation topic.
  const TOPIC_IDS = {
    greet: ['hello', 'good_morning', 'how_are_you', 'nice_to_meet', 'good_evening', 'goodbye'],
    polite: ['please', 'thank_you', 'youre_welcome', 'excuse_me', 'sorry'],
    talk: ['speak_english', 'dont_understand', 'slowly', 'repeat'],
    nav: ['where_station', 'where_toilet', 'is_it_far', 'left', 'right', 'straight'],
    food: ['menu', 'water', 'bill', 'delicious', 'vegetarian'],
    shop: ['how_much', 'too_expensive', 'pay_card'],
    taxi: ['where_station', 'is_it_far', 'straight'],
    help: ['help', 'need_doctor', 'lost'],
    social: ['nice_to_meet', 'how_are_you', 'goodbye']
  };

  // [native text, pronunciation shown on screen, English meaning] per topic.
  function bankFromBook(book, locale, catalog) {
    if (!book || !book.phrases || !catalog) return null;
    const english = {};
    catalog.PHRASES.forEach(function (p) { english[p.id] = p.en; });
    const bank = {};
    Object.keys(TOPIC_IDS).forEach(function (topic) {
      bank[topic] = TOPIC_IDS[topic].map(function (id) {
        const v = book.variants && book.variants[locale] && book.variants[locale][id];
        const e = v || book.phrases[id];
        return e && e.text ? [e.text, e.say || e.roman || '', english[id] || '', id] : null;
      }).filter(Boolean);
    });
    return bank;
  }
  function bankFor(session) {
    return session.bank || BANK.en;
  }
  function phraseLine(p, lead) {
    const leads = Array.isArray(lead) ? lead : (lead ? [lead] : ['You\'ll hear this one a lot.', 'Here\'s one worth remembering.', 'A useful expression here is', 'If you only remember one, make it this.', 'Listen to how this sounds.', 'You can use this when you need it.', 'If someone says this, they mean']);
    const head = String(leads[hash(p[0] + String(lead || '')) % leads.length]).replace(/\.$/, '');
    const meaning = String(p[2] || '').replace(/\.$/, '');
    const meant = meaning + (/[.!?]$/.test(meaning) ? '' : '.');
    const said = '{{p:' + p[0] + '}}';
    const sound = '{{s:' + p[1] + '}}';
    const end = /[.!?。？！؟]$/.test(String(p[0] || '')) ? ' ' : '. ';
    const styles = [
      head + '. ' + said + end + 'That means ' + meant + ' It sounds like ' + sound + '.',
      said + end + 'Meaning, ' + meant + ' The sound is ' + sound + '.',
      head + ': ' + said + end + meant
    ];
    return styles[hash(p[1]) % styles.length];
  }
  function unused(session, cat) {
    const bank = bankFor(session);
    const list = (bank[cat] && bank[cat].length) ? bank[cat] : ((BANK.en[cat] && BANK.en[cat].length) ? BANK.en[cat] : (bank.greet || BANK.en.greet));
    for (let i = 0; i < list.length; i++) {
      const p = list[(hash(session.country) + session.seed + i) % list.length];
      const id = cat + ':' + p[0];
      if (!session.taught[id]) return { p: p, id: id, cat: cat };
    }
    const p = list[0];
    return { p: p, id: cat + ':' + p[0], cat: cat };
  }
  function teach(session, cat, lead) {
    const u = unused(session, cat);
    session.taught[u.id] = true;
    session.lastPhrase = { native: u.p[0], phon: u.p[1], en: u.p[2], cat: u.cat };
    return phraseLine(u.p, lead);
  }
  // The exact phrase someone asked for ("how do I ask for the bill?").
  function teachExact(session, id, cat, lead) {
    if (!session.bank) {
      const en = session.catalog && session.catalog.PHRASES.find(function (p) { return p.id === id; });
      if (en) {
        session.lastPhrase = { native: en.en, phon: '', en: en.en, cat: cat };
        return 'English works here, so just say it plainly: {{p:' + en.en + '}}.';
      }
    }
    const bank = bankFor(session);
    const cats = [cat].concat(Object.keys(bank));
    for (let c = 0; c < cats.length; c++) {
      const hit = (bank[cats[c]] || []).find(function (p) { return p[3] === id; });
      if (hit) {
        session.taught[cats[c] + ':' + hit[0]] = true;
        session.lastPhrase = { native: hit[0], phon: hit[1], en: hit[2], cat: cat };
        return phraseLine(hit, lead);
      }
    }
    return teach(session, cat, lead);
  }
  const WANTS = [
    [/\bbill\b|the check|pay(ing)? (for|at) (the )?(meal|restaurant)|for paying/, 'bill', 'food', 'When you are ready to pay, say this.'],
    [/\bmenu\b/, 'menu', 'food', 'To see what they have, ask for the menu.'],
    [/\bwater\b/, 'water', 'food', 'For water, just say this.'],
    [/vegetarian|don'?t eat meat/, 'vegetarian', 'food', 'If you don\'t eat meat, say this.'],
    [/delicious|tasty|compliment the (food|cook)/, 'delicious', 'food', 'To tell the cook you loved it, say this.'],
    [/how much|price|what does (it|this) cost/, 'how_much', 'shop', 'To ask the price, say this.'],
    [/too expensive|cheaper|bargain|haggle/, 'too_expensive', 'shop', 'If the price feels high, try this.'],
    [/by card|credit card|pay with (a )?card/, 'pay_card', 'shop', 'To check if they take cards, ask this.'],
    [/toilet|bathroom|restroom|\bloo\b|washroom/, 'where_toilet', 'nav', 'To find the restroom, ask this.'],
    [/station|train/, 'where_station', 'nav', 'To find the station, ask this.'],
    [/\bfar\b/, 'is_it_far', 'nav', 'To ask if it\'s far, say this.'],
    [/doctor|feel (sick|ill)|hospital/, 'need_doctor', 'help', 'If you need a doctor, say this.'],
    [/\blost\b/, 'lost', 'help', 'If you\'re lost, say this.'],
    [/\bhelp\b/, 'help', 'help', 'To call for help, say this.'],
    [/thank/, 'thank_you', 'polite', 'To say thank you, say this.'],
    [/\bsorry\b|apologi/, 'sorry', 'polite', 'To say sorry, say this.'],
    [/excuse me|get (someone'?s|their) attention/, 'excuse_me', 'polite', 'To get someone\'s attention, say this.'],
    [/\bplease\b/, 'please', 'polite', 'For please, say this.'],
    [/goodbye|\bbye\b/, 'goodbye', 'greet', 'To say goodbye, say this.'],
    [/good morning/, 'good_morning', 'greet', 'In the morning, say this.'],
    [/good evening/, 'good_evening', 'greet', 'In the evening, say this.'],
    [/how are you/, 'how_are_you', 'greet', 'To ask how someone is, say this.'],
    [/nice to meet|introduce/, 'nice_to_meet', 'greet', 'When you meet someone, say this.'],
    [/\bhello\b|\bhi\b|greet/, 'hello', 'greet', 'To say hello, say this.'],
    [/speak english/, 'speak_english', 'talk', 'To ask if they speak English, say this.'],
    [/don'?t understand/, 'dont_understand', 'talk', 'If you don\'t understand, say this.']
  ];
  function wantedPhrase(t) {
    if (!/how (do|would|can|should) (i|you)|what (do|should) i say|how to say|say .+ in|phrase|word for|teach me|what'?s the word/.test(t)) return null;
    for (let i = 0; i < WANTS.length; i++) if (WANTS[i][0].test(t)) return WANTS[i];
    return null;
  }

  function cityOf(session) {
    return session.city || 'the capital';
  }

  function opening(session) {
    const city = cityOf(session);
    const place = session.place || city;
    const fact = session.fact || '';
    const food = session.food || 'the local food';
    const lines = [];
    const p = session.pattern;
    if (p === 'story') {
      lines.push('If you\'re arriving in ' + city + ' for the first time, one thing stands out pretty quickly. ' + (fact || place + ' is the place people come to see.'));
      lines.push(teach(session, 'greet'));
    } else if (p === 'practical') {
      lines.push('Okay. You\'re in ' + city + '. Before you head out, a few phrases will do more than a long list.');
      lines.push(teach(session, 'polite'));
      lines.push(teach(session, 'talk'));
    } else if (p === 'culture') {
      lines.push('Language and politeness sit close together here. A greeting before the request changes the whole conversation.');
      lines.push(teach(session, 'greet'));
    } else if (p === 'question') {
      lines.push('Ever wondered what you should actually say when you walk into a café in ' + city + '?');
      lines.push(teach(session, 'food'));
    } else if (p === 'guide') {
      lines.push('Alright, imagine you\'ve just landed and you need one useful thing, not a lecture.');
      lines.push(teach(session, 'help'));
    } else if (p === 'language') {
      lines.push('People here mostly use ' + (session.langName || 'the local language') + '. English shows up in tourist spots, and one local phrase still carries you further.');
      lines.push(teach(session, 'talk'));
    } else if (p === 'cafe' || p === 'hotel') {
      lines.push('Picture this. You\'ve just sat down in ' + city + '. You don\'t need twenty phrases. Start with a greeting, then the thing you actually want.');
      lines.push(teach(session, p === 'hotel' ? 'polite' : 'food'));
    } else if (p === 'taxi') {
      lines.push('You\'re leaving the airport and you need a ride into ' + city + '.');
      lines.push(teach(session, 'taxi'));
    } else if (p === 'shop') {
      lines.push('A market stall, a price, and you. This is the bit worth knowing.');
      lines.push(teach(session, 'shop'));
    } else if (p === 'meet') {
      lines.push('You\'re meeting someone for the first time. Keep it short and warm.');
      lines.push(teach(session, 'social'));
    } else {
      lines.push('If you only learn a handful of things for getting around, start here.');
      lines.push(teach(session, 'nav'));
    }
    if (food && p !== 'question' && p !== 'cafe') {
      lines.push('When food comes up, ' + food + ' is the one people will point you toward.');
    }
    const closers = [
      'Jump in whenever you want.',
      'Stop me if you want a different phrase.',
      'Ask about food, a taxi, or another country.',
      'I can slow down, skip, or switch.'
    ];
    lines.push(closers[hash(session.country + session.pattern) % closers.length]);
    return lines;
  }

  function continuation(session) {
    const order = ['greet', 'polite', 'talk', 'nav', 'food', 'shop', 'taxi', 'help', 'social'];
    const current = (session.lastPhrase && session.lastPhrase.cat) || session.topic || 'greet';
    const at = order.indexOf(current);
    const nextCat = order[(at + 1 + session.turns) % order.length];
    session.topic = nextCat;
    return [teach(session, nextCat, ['So.', 'Here\'s the next useful piece.', 'One more, then you can steer.', 'The next one that actually helps.'])];
  }

  function resumeLines(session) {
    const bridges = ['So.', 'Right, where we were.', 'Picking that up.', 'One thing you\'ll notice pretty quickly.'];
    const bridge = bridges[hash(String(session.turns) + session.country) % bridges.length];
    const rest = (session.paused || []).slice();
    if (!rest.length) return continuation(session);
    if (rest[0] === bridge) return rest;
    return [bridge].concat(rest);
  }

  function explainPhrase(session) {
    const p = session.lastPhrase;
    if (!p) return ['We hadn\'t landed on a phrase yet. Tell me if you want food, a taxi, or just getting around.'];
    return ['{{p:' + p.native + '}} means ' + p.en.replace(/\.$/, '') + '. It sounds like {{s:' + p.phon + '}}.'];
  }

  function categoryFor(text) {
    const t = text.toLowerCase();
    if (/get(ting)? around|direction|where is|navigat|station|bathroom|toilet|left|right/.test(t)) return 'nav';
    if (/taxi|cab|fare|ride|airport/.test(t)) return 'taxi';
    if (/food|order|menu|restaurant|eat|bill|check|water|cafe|café|hungry|spicy/.test(t)) return 'food';
    if (/shop|price|expensive|how much|pay|card/.test(t)) return 'shop';
    if (/help|hospital|police|emergency|lost/.test(t)) return 'help';
    if (/hello|greet|good morning|meet someone|introduce/.test(t)) return 'greet';
    if (/please|thank|sorry|polite|excuse/.test(t)) return 'polite';
    if (/english|understand|again|slowly|what does that mean|don'?t understand/.test(t) && /phrase|say|how do i/.test(t)) return 'talk';
    return '';
  }

  function reply(text, session) {
    const raw = String(text || '').trim();
    const t = raw.toLowerCase();
    if (!raw) return { lines: ['I\'m here. Ask for a phrase, the food, or another country.'] };
    session.asked = session.asked || [];
    session.asked.push(raw);
    if (session.asked.length > 12) session.asked.shift();
    if (/previous country|go back|back to the last/.test(t) && !/\bto [a-z]/.test(t.replace('go back to the', ''))) {
      if (session.prevCountry) return { switchTo: session.prevCountry, lines: [] };
      return { lines: ['We haven\'t left anywhere yet.'] };
    }
    if (/^(go back to|back to|return to)\b/.test(t) && session.prevCountry && !matchCountry(t, session.roster)) {
      return { switchTo: session.prevCountry, lines: [] };
    }
    const named = matchCountry(t, session.roster);
    if (named && named !== session.country && /go to|let's|lets |head to|switch|take me|how about|next stop|jump/.test(t)) {
      return { switchTo: named, lines: [] };
    }
    const want = wantedPhrase(t);
    if (want) {
      session.topic = want[2];
      return { lines: [teachExact(session, want[1], want[2], [want[3]])] };
    }
    if (/^(yes|yeah|yep|got it|exactly|nice|cool|great|right|okay|ok)\b[.! ]*$/.test(t)) {
      const shorts = ['Exactly.', 'Yep, that works.', 'Right.', 'Good.'];
      return { lines: [shorts[hash(raw + session.turns) % shorts.length]] };
    }
    if (/^(ok(ay)?[,. ]*)?(continue|go on|carry on|keep going|pick (it|that) up)\b/.test(t) || /\bcontinue\b/.test(t)) {
      return { lines: resumeLines(session), resume: true };
    }
    if (/slow down|say that again|repeat that|one more time/.test(t)) {
      if (session.lastPhrase) return { lines: ['Once more. {{p:' + session.lastPhrase.native + '}}. It sounds like {{s:' + session.lastPhrase.phon + '}}.'] };
      if (session.spoken.length) return { lines: [session.spoken[session.spoken.length - 1]] };
      return { lines: ['Say which part, and I\'ll take it slowly.'] };
    }
    if (/pronounc|how do i say|how does that sound/.test(t)) {
      if (!session.lastPhrase) return { lines: [teach(session, 'greet', ['Here\'s the sound.'])] };
      return { lines: ['You\'re aiming for {{p:' + session.lastPhrase.native + '}}. It sounds like {{s:' + session.lastPhrase.phon + '}}.'] };
    }
    if (/what does that (phrase |word )?mean|what did that mean|what was that phrase/.test(t)) {
      return { lines: explainPhrase(session) };
    }
    if (/another (useful )?phrase|something locals|one more phrase|give me another/.test(t)) {
      const cat = categoryFor(session.topic || '') || 'social';
      return { lines: [teach(session, cat)] };
    }
    if (/shouldn'?t i say|avoid saying|rude/.test(t)) {
      return { lines: ['Lead with a greeting, then the request. Jumping straight to the demand is the part that lands badly. ' + teach(session, 'greet', ['So start with'])] };
    }
    const cat = categoryFor(t);
    if (cat && /phrase|useful|how do i|give me|what do i say|teach|show me/.test(t)) {
      session.topic = cat;
      const a = teach(session, cat);
      const b = teach(session, cat === 'nav' ? 'taxi' : cat);
      return { lines: a === b ? [a] : [a, b] };
    }
    if (/what language|which language|do they speak|speak there|speak here/.test(t)) {
      return { lines: ['Mostly ' + (session.langName || 'the local language') + '. You\'ll hear English in the obvious tourist spots. A few local words still change how people answer you.'] };
    }
    if (/food|what should i eat|what do people eat|local dish/.test(t)) {
      session.topic = 'food';
      return { lines: [(session.food ? 'People will point you toward ' + session.food + '. ' : '') + teach(session, 'food', ['When you\'re ordering'])] };
    }
    if (/^skip\b|skip this|next topic|something else/.test(t)) {
      const order = ['food', 'taxi', 'shop', 'nav', 'help'];
      const cat2 = order[(hash(session.pattern) + session.turns) % order.length];
      session.topic = cat2;
      return { lines: ['Skipping that. ' + teach(session, cat2, ['Try this instead.'])] };
    }
    if (/^wait\b|hold on|hang on/.test(t)) {
      if (/language|speak/.test(t)) return { lines: ['Mostly ' + (session.langName || 'the local language') + '. English turns up in tourist areas too.'] };
      if (session.lastPhrase) return { lines: explainPhrase(session) };
      return { lines: ['Go ahead.'] };
    }
    if (named && named !== session.country) return { switchTo: named, lines: [] };
    if (session.lastPhrase) {
      const bits = session.lastPhrase.native.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 3; });
      const tried = bits.some(function (w) { return t.indexOf(w) !== -1; });
      if (tried) {
        const notes = [
          'Yep, that works.',
          'Close. Soften the ending a little. {{p:' + session.lastPhrase.native + '}}.',
          'You\'re aiming for {{p:' + session.lastPhrase.native + '}}. It sounds like {{s:' + session.lastPhrase.phon + '}}.',
          'You\'re close. Listen once more. {{p:' + session.lastPhrase.native + '}}.'
        ];
        return { lines: [notes[hash(raw + session.turns) % notes.length]] };
      }
    }
    session.topic = session.topic || 'greet';
    return { lines: [teach(session, session.topic, ['Here\'s a practical one for that.'])] };
  }

  function matchCountry(text, roster) {
    const blob = ' ' + String(text || '').toLowerCase().replace(/[?.!,]/g, ' ') + ' ';
    let best = '';
    (roster || []).forEach(function (n) {
      if (blob.indexOf(n.toLowerCase()) !== -1 && n.length > best.length) best = n;
    });
    if (best) return best;
    const keys = Object.keys(ALIAS);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (blob.indexOf(' ' + k + ' ') !== -1) {
        const name = ALIAS[k];
        if (!roster || roster.indexOf(name) !== -1) return name;
      }
    }
    return '';
  }

  function choosePattern(name, seed, previous) {
    let i = 0;
    let p = PATTERNS[(hash(name) + seed + i) % PATTERNS.length];
    while (p === previous && i < PATTERNS.length) {
      i++;
      p = PATTERNS[(hash(name) + seed + i) % PATTERNS.length];
    }
    return p;
  }

  function boot(info) {
    const seed = info.seed != null ? info.seed : Math.floor(Math.random() * 997);
    const pattern = choosePattern(info.name, seed, info.prevPattern || '');
    const session = {
      country: info.name,
      prevCountry: info.prevName || '',
      city: info.city,
      place: info.place,
      fact: info.fact,
      food: info.food,
      langName: info.langName,
      langKey: info.langKey || 'en',
      locale: info.locale || 'en-US',
      seed: seed,
      pattern: pattern,
      taught: {},
      lastPhrase: null,
      paused: [],
      spoken: [],
      topic: '',
      turns: 0,
      roster: info.roster || [],
      bank: bankFromBook(info.book, info.locale, info.catalog),
      catalog: info.catalog || null
    };
    session.plan = opening(session);
    return session;
  }

  window.RoomTalk = {
    boot: boot,
    opening: opening,
    reply: reply,
    choosePattern: choosePattern,
    matchCountry: matchCountry,
    patterns: PATTERNS
  };
})();
