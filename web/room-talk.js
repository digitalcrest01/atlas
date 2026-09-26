/* Live country conversation. Device voices only. No scripted tour queue. */
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
    fr: {
      greet: [['Bonjour', 'bon-ZHOOR', 'Hello'], ['Bonsoir', 'bon-SWAR', 'Good evening'], ['Comment allez-vous ?', 'kom-ahn tal-ay VOO', 'How are you?']],
      polite: [["S'il vous plaît", 'seel voo PLEH', 'Please'], ['Merci', 'mair-SEE', 'Thank you'], ['Excusez-moi', 'ex-koo-zay MWAH', 'Excuse me'], ['Pardon', 'par-DOHN', 'Sorry']],
      talk: [['Vous parlez anglais ?', 'voo par-lay ahn-GLEH', 'Do you speak English?'], ['Je ne comprends pas', 'zhuh nuh kom-prahn PAH', "I don't understand"], ['Plus lentement, s\'il vous plaît', 'ploo lahnt-mahn seel voo PLEH', 'More slowly, please']],
      nav: [['Où est la gare ?', 'oo eh la GAR', 'Where is the station?'], ['Où sont les toilettes ?', 'oo sohn lay twa-LET', 'Where is the bathroom?'], ["C'est loin ?", 'seh LWAN', 'Is it far?']],
      food: [["Je voudrais ceci", 'zhuh voo-dreh suh-SEE', "I'd like this"], ["L'addition, s'il vous plaît", 'la-dee-SYON seel voo PLEH', 'The bill, please'], ["Une eau, s'il vous plaît", 'oon OH seel voo PLEH', 'Water, please']],
      shop: [['C\'est combien ?', 'seh kom-BYAN', 'How much is this?'], ['Je peux payer par carte ?', 'zhuh puh pay-ay par KART', 'Can I pay by card?']],
      taxi: [['Où est le taxi ?', 'oo eh luh tak-SEE', 'Where is a taxi?'], ['Je voudrais aller ici', 'zhuh voo-dreh ah-lay ee-SEE', "I'd like to go here"]],
      help: [['Vous pouvez m\'aider ?', 'voo poo-vay may-DAY', 'Can you help me?'], ["J'ai besoin d'aide", 'zhay buh-ZWAN ded', 'I need help']],
      social: [['Je visite', 'zhuh vee-ZEET', "I'm visiting"], ["C'est ma première fois", 'seh ma pruh-mee-AIR FWAH', 'This is my first time']]
    },
    es: {
      greet: [['Hola', 'OH-lah', 'Hello'], ['Buenos días', 'BWEH-nos DEE-as', 'Good morning'], ['¿Cómo estás?', 'KO-mo es-TAHS', 'How are you?'], ['¿Cómo está?', 'KO-mo es-TAH', 'How are you? (formal)']],
      polite: [['Por favor', 'por fa-VOR', 'Please'], ['Gracias', 'GRAH-see-as', 'Thank you'], ['Perdón', 'per-DON', 'Sorry']],
      talk: [['¿Habla inglés?', 'AH-blah een-GLAYS', 'Do you speak English?'], ['No entiendo', 'no en-tee-EN-do', "I don't understand"], ['Más despacio, por favor', 'mas des-PAH-see-o por fa-VOR', 'More slowly, please']],
      nav: [['¿Dónde está la estación?', 'DON-deh es-TAH la es-ta-see-ON', 'Where is the station?'], ['¿Dónde está el baño?', 'DON-deh es-TAH el BAH-nyo', 'Where is the bathroom?'], ['¿Está lejos?', 'es-TAH LEH-hos', 'Is it far?']],
      food: [['La cuenta, por favor', 'la KWEN-ta por fa-VOR', 'The bill, please'], ['Agua, por favor', 'AH-gwa por fa-VOR', 'Water, please'], ['Quisiera esto', 'kee-see-AIR-ah ES-toh', "I'd like this"]],
      shop: [['¿Cuánto cuesta?', 'KWAN-to KWES-ta', 'How much is this?'], ['¿Puedo pagar con tarjeta?', 'PWEH-do pa-GAR kon tar-HEH-ta', 'Can I pay by card?']],
      taxi: [['¿Dónde hay un taxi?', 'DON-deh eye oon TAK-see', 'Where is a taxi?'], ['Quiero ir aquí', 'kee-AIR-oh eer ah-KEE', "I'd like to go here"]],
      help: [['¿Puede ayudarme?', 'PWEH-deh ah-yoo-DAR-meh', 'Can you help me?'], ['Necesito ayuda', 'neh-seh-SEE-toh ah-YOO-dah', 'I need help']],
      social: [['Estoy de visita', 'es-TOY deh vee-SEE-tah', "I'm visiting"], ['Es mi primera vez', 'es mee pree-MAIR-ah ves', 'This is my first time']]
    },
    pt: {
      greet: [['Olá', 'oh-LAH', 'Hello'], ['Bom dia', 'bom JEE-ah', 'Good morning']],
      polite: [['Por favor', 'por fa-VOR', 'Please'], ['Obrigado', 'oh-bree-GAH-doo', 'Thank you']],
      talk: [['Fala inglês?', 'FAH-lah een-GLAYSH', 'Do you speak English?'], ['Não entendo', 'now en-TEN-doo', "I don't understand"]],
      nav: [['Onde fica a estação?', 'ON-jee FEE-kah a es-ta-SOWN', 'Where is the station?'], ['Onde fica o banheiro?', 'ON-jee FEE-kah oo bahn-YAY-roo', 'Where is the bathroom?']],
      food: [['A conta, por favor', 'a KON-tah por fa-VOR', 'The bill, please'], ['Água, por favor', 'AH-gwah por fa-VOR', 'Water, please']],
      shop: [['Quanto custa?', 'KWAN-too KOOS-tah', 'How much is this?']],
      taxi: [['Onde pego um táxi?', 'ON-jee PEH-goo oom TAK-see', 'Where can I get a taxi?'], ['Quero ir aqui', 'KEH-roo eer ah-KEE', "I'd like to go here"]],
      help: [['Pode me ajudar?', 'PO-jee mee ah-zhoo-DAR', 'Can you help me?']],
      social: [['Estou visitando', 'es-TOH vee-zee-TAN-doo', "I'm visiting"]]
    },
    de: {
      greet: [['Hallo', 'HAH-loh', 'Hello'], ['Guten Morgen', 'GOO-ten MOR-gen', 'Good morning']],
      polite: [['Bitte', 'BIT-teh', 'Please'], ['Danke', 'DAHN-kuh', 'Thank you'], ['Entschuldigung', 'ent-SHOOL-dee-goong', 'Excuse me']],
      talk: [['Sprechen Sie Englisch?', 'SHPREH-khen zee ENG-lish', 'Do you speak English?'], ['Ich verstehe nicht', 'ikh fer-SHTAY-eh nikht', "I don't understand"]],
      nav: [['Wo ist der Bahnhof?', 'vo ist dair BAHN-hof', 'Where is the station?'], ['Wo ist die Toilette?', 'vo ist dee to-ah-LET-eh', 'Where is the bathroom?']],
      food: [['Die Rechnung, bitte', 'dee REKH-noong BIT-teh', 'The bill, please'], ['Wasser, bitte', 'VAH-ser BIT-teh', 'Water, please']],
      shop: [['Was kostet das?', 'vas KOS-tet dahs', 'How much is this?']],
      taxi: [['Wo bekomme ich ein Taxi?', 'vo be-KOM-eh ikh ine TAK-see', 'Where can I get a taxi?']],
      help: [['Können Sie mir helfen?', 'KER-nen zee meer HEL-fen', 'Can you help me?']],
      social: [['Ich bin zu Besuch', 'ikh bin tsoo beh-ZOOKH', "I'm visiting"]]
    },
    it: {
      greet: [['Ciao', 'CHOW', 'Hello'], ['Buongiorno', 'bwon-JOR-no', 'Good morning']],
      polite: [['Per favore', 'pair fa-VO-reh', 'Please'], ['Grazie', 'GRAH-tsee-eh', 'Thank you']],
      talk: [['Parla inglese?', 'PAR-lah een-GLEH-zeh', 'Do you speak English?'], ['Non capisco', 'non ka-PEES-ko', "I don't understand"]],
      nav: [['Dov\'è la stazione?', 'doh-VEH la sta-tsee-OH-neh', 'Where is the station?'], ['Dov\'è il bagno?', 'doh-VEH eel BAH-nyo', 'Where is the bathroom?']],
      food: [['Il conto, per favore', 'eel KON-toh pair fa-VO-reh', 'The bill, please'], ['Acqua, per favore', 'AH-kwah pair fa-VO-reh', 'Water, please']],
      shop: [['Quanto costa?', 'KWAN-toh KOS-tah', 'How much is this?']],
      taxi: [['Dove prendo un taxi?', 'DOH-veh PREN-doh oon TAK-see', 'Where can I get a taxi?']],
      help: [['Può aiutarmi?', 'pwoh ah-yoo-TAR-mee', 'Can you help me?']],
      social: [['Sono in visita', 'SO-no een VEE-zee-tah', "I'm visiting"]]
    },
    ja: {
      greet: [['Konnichiwa', 'kon-nee-chee-WAH', 'Hello'], ['Ohayō gozaimasu', 'oh-hah-YOH go-zah-ee-mahs', 'Good morning']],
      polite: [['Onegaishimasu', 'oh-neh-gah-ee-shee-MAHS', 'Please'], ['Arigatō', 'ah-ree-GAH-toh', 'Thank you'], ['Sumimasen', 'soo-mee-mah-SEN', 'Excuse me']],
      talk: [['Eigo wa hanasemasu ka?', 'AY-goh wah hah-nah-seh-mahs kah', 'Do you speak English?'], ['Wakarimasen', 'wah-kah-ree-mah-SEN', "I don't understand"]],
      nav: [['Eki wa doko desu ka?', 'EH-kee wah DOH-koh dess kah', 'Where is the station?'], ['Toire wa doko desu ka?', 'TOY-reh wah DOH-koh dess kah', 'Where is the bathroom?']],
      food: [['Okaikei onegaishimasu', 'oh-kah-ee-KAY oh-neh-gah-ee-shee-mahs', 'The bill, please'], ['Mizu onegaishimasu', 'MEE-zoo oh-neh-gah-ee-shee-mahs', 'Water, please']],
      shop: [['Ikura desu ka?', 'ee-KOO-rah dess kah', 'How much is this?']],
      taxi: [['Takushii wa doko desu ka?', 'tak-SHEE wah DOH-koh dess kah', 'Where is a taxi?'], ['Koko e ikitai desu', 'KOH-koh eh ee-kee-TAH-ee dess', "I'd like to go here"]],
      help: [['Tasukete kudasai', 'tah-soo-keh-teh koo-dah-SAH-ee', 'Please help me']],
      social: [['Kankō de kimashita', 'kahn-KOH deh kee-mahsh-tah', "I'm visiting"]]
    },
    th: {
      greet: [['Sawasdee', 'sah-wah-DEE', 'Hello']],
      polite: [['Khop khun', 'kop koon', 'Thank you'], ['Khor thot', 'kor TOT', 'Sorry']],
      talk: [['Khun phuut phaa-saa ang-grit dai mai?', 'koon poot pah-sah ang-GRIT die my', 'Do you speak English?'], ['Mai khao jai', 'my kow jai', "I don't understand"]],
      nav: [['Sathaanii yuu thee nai?', 'sah-tah-nee yoo tee nai', 'Where is the station?'], ['Hong nam yuu thee nai?', 'hong nahm yoo tee nai', 'Where is the bathroom?']],
      food: [['Chek bin', 'chek bin', 'The bill, please'], ['Nam plao', 'nahm plow', 'Water, please']],
      shop: [['Tao rai?', 'tao rye', 'How much is this?']],
      taxi: [['Mee taxi thee nai?', 'mee TAK-see tee nai', 'Where is a taxi?']],
      help: [['Chuay duay', 'choo-ay doo-ay', 'Can you help me?']],
      social: [['Maa thiao', 'mah tee-ow', "I'm visiting"]]
    },
    ar: {
      greet: [['Marhaba', 'mar-HA-bah', 'Hello'], ['Sabah al-khayr', 'sah-BAH al khayr', 'Good morning']],
      polite: [['Min fadlak', 'min FAD-lak', 'Please'], ['Shukran', 'SHOOK-ran', 'Thank you']],
      talk: [['Hal tatahadath al-ingliziyya?', 'hal ta-ta-HA-dath al een-glee-ZEE-yah', 'Do you speak English?'], ['La afham', 'lah AF-ham', "I don't understand"]],
      nav: [['Ayna al-mahatta?', 'AY-na al ma-HAT-tah', 'Where is the station?'], ['Ayna al-hammam?', 'AY-na al ham-MAM', 'Where is the bathroom?']],
      food: [['Al-hisab, min fadlak', 'al hee-SAB min FAD-lak', 'The bill, please'], ['Mai, min fadlak', 'MY min FAD-lak', 'Water, please']],
      shop: [['Bikam hatha?', 'bee-KAM HA-tha', 'How much is this?']],
      taxi: [['Ayna ajid taxi?', 'AY-na AH-jid TAK-see', 'Where can I get a taxi?']],
      help: [['Mumkin tusa\'idni?', 'MOOM-kin too-SA-id-nee', 'Can you help me?']],
      social: [['Ana za\'ir', 'AH-na ZAH-ir', "I'm visiting"]]
    },
    zh: {
      greet: [['Nǐ hǎo', 'nee-HOW', 'Hello']],
      polite: [['Qǐng', 'ching', 'Please'], ['Xièxie', 'shyeh-shyeh', 'Thank you']],
      talk: [['Nǐ huì shuō yīngyǔ ma?', 'nee hway shwoh ying-yoo mah', 'Do you speak English?'], ['Wǒ tīng bù dǒng', 'woh ting boo dong', "I don't understand"]],
      nav: [['Huǒchē zhàn zài nǎlǐ?', 'hwoh-chuh jahn zye nah-lee', 'Where is the station?'], ['Xǐshǒujiān zài nǎlǐ?', 'shee-show-jyen zye nah-lee', 'Where is the bathroom?']],
      food: [['Mǎidān', 'my-dahn', 'The bill, please'], ['Shuǐ', 'shway', 'Water']],
      shop: [['Zhège duōshao qián?', 'juh-guh dwoh-shaow chyen', 'How much is this?']],
      taxi: [['Nǎlǐ yǒu chūzūchē?', 'nah-lee yoh choo-zoo-chuh', 'Where is a taxi?']],
      help: [['Qǐng bāng wǒ', 'ching bahng woh', 'Please help me']],
      social: [['Wǒ lái lǚyóu', 'woh lye lyoo-yoh', "I'm visiting"]]
    },
    ja_alias: null
  };
  BANK.ko = {
    greet: [['Annyeonghaseyo', 'ahn-nyung-ha-SEH-yo', 'Hello']],
    polite: [['Juseyo', 'joo-SEH-yo', 'Please'], ['Gamsahamnida', 'gam-sa-ham-nee-da', 'Thank you']],
    talk: [['Yeongeo haseyo?', 'yung-uh ha-SEH-yo', 'Do you speak English?'], ['Molla yo', 'mol-la yo', "I don't understand"]],
    nav: [['Yeok-i eodi-eyo?', 'yuk ee uh-dee-eh-yo', 'Where is the station?']],
    food: [['Gyesanseo juseyo', 'gye-san-suh joo-seh-yo', 'The bill, please']],
    shop: [['Eolma-eyo?', 'ul-ma-eh-yo', 'How much is this?']],
    taxi: [['Taeksi eodi-eyo?', 'tek-shee uh-dee-eh-yo', 'Where is a taxi?']],
    help: [['Dowajuseyo', 'doh-wah-joo-seh-yo', 'Please help me']],
    social: [['Yeohaeng wasseoyo', 'yuh-hang wah-ssuh-yo', "I'm visiting"]]
  };
  BANK.hi = {
    greet: [['Namaste', 'nuh-muh-STAY', 'Hello']],
    polite: [['Kripaya', 'KRIP-ah-yah', 'Please'], ['Dhanyavaad', 'DHUN-ya-vaad', 'Thank you']],
    talk: [['Kya aap angrezi bolte hain?', 'kya ahp un-GRAY-zee BOL-teh hain', 'Do you speak English?']],
    nav: [['Station kahan hai?', 'STAY-shun kah-HAHN hai', 'Where is the station?']],
    food: [['Bill dijiye', 'bill DEE-jee-yeh', 'The bill, please']],
    shop: [['Yeh kitne ka hai?', 'yeh KIT-neh kah hai', 'How much is this?']],
    taxi: [['Taxi kahan milegi?', 'TAK-see kah-HAHN mil-eh-gee', 'Where is a taxi?']],
    help: [['Madad kijiye', 'MA-dad KEE-jee-yeh', 'Please help me']],
    social: [['Main ghumne aaya hoon', 'main GOOM-neh ah-yah hoon', "I'm visiting"]]
  };
  BANK.sw = {
    greet: [['Jambo', 'JAHM-bo', 'Hello']],
    polite: [['Tafadhali', 'tah-fah-DAH-lee', 'Please'], ['Asante', 'ah-SAHN-teh', 'Thank you']],
    talk: [['Unazungumza Kiingereza?', 'oo-nah-zoon-GOOM-zah kee-een-geh-REH-zah', 'Do you speak English?']],
    nav: [['Kituo kiko wapi?', 'kee-TOO-oh KEE-koh WAH-pee', 'Where is the station?']],
    food: [['Bili tafadhali', 'BEE-lee tah-fah-DAH-lee', 'The bill, please']],
    shop: [['Bei gani?', 'BAY GAH-nee', 'How much is this?']],
    taxi: [['Taxi iko wapi?', 'TAK-see EE-koh WAH-pee', 'Where is a taxi?']],
    help: [['Naomba msaada', 'nah-OM-bah m-sah-AH-dah', 'I need help']],
    social: [['Niko matembezini', 'NEE-koh mah-tem-beh-ZEE-nee', "I'm visiting"]]
  };
  BANK.ru = {
    greet: [['Zdravstvuyte', 'ZDRAST-vooy-tyeh', 'Hello']],
    polite: [['Pozhaluysta', 'pah-ZHA-loo-sta', 'Please'], ['Spasibo', 'spah-SEE-ba', 'Thank you']],
    talk: [['Vy govorite po-angliyski?', 'vi ga-va-REE-teh pah an-GLEE-skee', 'Do you speak English?']],
    nav: [['Gde vokzal?', 'gdye vak-ZAL', 'Where is the station?']],
    food: [['Schet, pozhaluysta', 'shyot pah-ZHA-loo-sta', 'The bill, please']],
    shop: [['Skolko eto stoit?', 'SKOL-ka EH-ta STO-it', 'How much is this?']],
    taxi: [['Gde taxi?', 'gdye tak-SEE', 'Where is a taxi?']],
    help: [['Pomogite, pozhaluysta', 'pa-ma-GEE-teh pah-ZHA-loo-sta', 'Please help me']],
    social: [['Ya v gostyakh', 'ya v gos-TYAKH', "I'm visiting"]]
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
  function bankFor(key) {
    return BANK[key] || BANK.en;
  }
  function phraseLine(p, lead) {
    const leads = Array.isArray(lead) ? lead : (lead ? [lead] : ['You\'ll hear this one a lot.', 'Here\'s one worth remembering.', 'A useful expression here is', 'If you only remember one, make it this.', 'Listen to how this sounds.', 'You can use this when you need it.', 'If someone says this, they mean']);
    const head = String(leads[hash(p[0] + String(lead || '')) % leads.length]).replace(/\.$/, '');
    const meaning = String(p[2] || '').replace(/\.$/, '');
    const said = '{{p:' + p[0] + '}}';
    const sound = '{{s:' + p[1] + '}}';
    const end = /[.!?。？]$/.test(String(p[0] || '')) ? ' ' : '. ';
    const styles = [
      head + '. ' + said + end + 'That means ' + meaning + '. It sounds like ' + sound + '.',
      said + end + 'Meaning, ' + meaning + '. The sound is ' + sound + '.',
      head + ': ' + said + end + meaning + '.'
    ];
    return styles[hash(p[1]) % styles.length];
  }
  function unused(session, cat) {
    const bank = bankFor(session.langKey);
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
    if (/what was that phrase for paying|phrase for paying|ask for the bill|the check/.test(t)) {
      return { lines: [teach(session, 'food', ['For paying, use this.'])] };
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

  function profile(name, locale, voices, robotic) {
    const lang = (locale || 'en-US').toLowerCase().split('-')[0];
    const list = (voices || []).filter(function (v) { return !(robotic && robotic(v)); });
    const regional = list.filter(function (v) {
      return (v.lang || '').toLowerCase().replace('_', '-').split('-')[0] === lang;
    });
    const english = list.filter(function (v) { return (v.lang || '').toLowerCase().indexOf('en') === 0; });
    let pool = regional.length ? regional : (english.length ? english : list);
    const wantWoman = hash(name + 'g') % 2 === 0;
    const gendered = pool.filter(function (v) {
      const blob = ((v.name || '') + ' ' + (v.voiceURI || '')).toLowerCase();
      const woman = /female|woman|\b(samantha|allison|ava|zoe|serena|karen|moira|kate|martha|amelie|amélie|audrey|monica|mónica|paulina|anna|alice|kyoko|tingting|ting-ting|yuna|luciana|joana)\b/.test(blob);
      const man = /male|\bman\b|\b(daniel|alex|aaron|evan|nathan|thomas|jorge|diego|luca|otoya|markus|felipe|xander)\b/.test(blob);
      if (wantWoman) return woman;
      return man;
    });
    if (gendered.length) pool = gendered;
    const lively = pool.filter(function (v) {
      const blob = ((v.name || '') + ' ' + (v.voiceURI || '')).toLowerCase();
      return !/\bflo\b|\breed\b|\bgrandma\b|\bgrandpa\b|\bshelley\b|\bsandy\b/.test(blob);
    });
    if (lively.length) pool = lively;
    const voice = pool.length ? pool[hash(name) % pool.length] : null;
    const personalities = [
      { id: 'warm guide', rate: 0.98 },
      { id: 'relaxed traveler', rate: 0.96 },
      { id: 'calm narrator', rate: 0.94 },
      { id: 'practical companion', rate: 1 },
      { id: 'curious teacher', rate: 1.02 }
    ];
    const personality = personalities[hash(name + 'p') % personalities.length];
    const fallback = (english[0] || list[0] || null);
    const chosen = voice || fallback;
    const idOf = function (v) { return v ? (v.voiceURI || v.name || '') : ''; };
    return {
      country: name,
      language: lang,
      voiceProvider: 'grok',
      voice: chosen,
      voiceId: idOf(chosen),
      locale: chosen && chosen.lang ? chosen.lang : (locale || 'en-US'),
      gender: wantWoman ? 'woman' : 'man',
      personality: personality.id,
      speakingRate: personality.rate,
      rate: personality.rate,
      energy: personality.rate > 1 ? 'brighter' : 'steady',
      fallbackVoice: fallback,
      fallbackVoiceId: idOf(fallback)
    };
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
      voice: info.voice || null,
      voiceLocale: (info.voice && info.voice.lang) || info.locale || 'en-US',
      rate: info.rate || 1
    };
    session.plan = opening(session);
    return session;
  }

  function book(langKey) {
    const bank = bankFor(langKey);
    const cats = ['greet', 'polite', 'talk', 'nav', 'food', 'shop', 'taxi', 'help', 'social'];
    const out = [];
    const seen = {};
    cats.forEach(function (cat) {
      (bank[cat] || []).forEach(function (p, i) {
        const en = String(p[2] || '').trim();
        if (!en || seen[en]) return;
        seen[en] = true;
        out.push({ key: cat + '-' + i, label: en, t: p[0], p: p[1] });
      });
    });
    return out;
  }

  window.RoomTalk = {
    boot: boot,
    opening: opening,
    reply: reply,
    profile: profile,
    choosePattern: choosePattern,
    matchCountry: matchCountry,
    book: book,
    patterns: PATTERNS
  };
})();
