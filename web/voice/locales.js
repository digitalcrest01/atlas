/* Which languages each country speaks, and which neural voice says them.

   One file, loaded by the page (window.MyatlasticLocales) and by the voice
   API (require). Countries list BCP-47 locales, local language first. A
   locale is only offered for playback when a configured provider can voice
   it, so nothing ever falls back to a device voice. */
(function (root) {
  // language subtag -> names shown in the language picker.
  const LANGUAGES = {
    af: ['Afrikaans', 'Afrikaans'], am: ['Amharic', 'አማርኛ'], ar: ['Arabic', 'العربية'],
    az: ['Azerbaijani', 'Azərbaycanca'], bg: ['Bulgarian', 'Български'], bn: ['Bengali', 'বাংলা'],
    bs: ['Bosnian', 'Bosanski'], ca: ['Catalan', 'Català'], cs: ['Czech', 'Čeština'],
    da: ['Danish', 'Dansk'], de: ['German', 'Deutsch'], el: ['Greek', 'Ελληνικά'],
    en: ['English', 'English'], es: ['Spanish', 'Español'], et: ['Estonian', 'Eesti'],
    fa: ['Persian', 'فارسی'], fi: ['Finnish', 'Suomi'], fil: ['Filipino (Tagalog)', 'Filipino'],
    fr: ['French', 'Français'], ga: ['Irish', 'Gaeilge'], he: ['Hebrew', 'עברית'],
    hi: ['Hindi', 'हिन्दी'], hr: ['Croatian', 'Hrvatski'], hu: ['Hungarian', 'Magyar'],
    hy: ['Armenian', 'Հայերեն'], id: ['Indonesian', 'Bahasa Indonesia'], is: ['Icelandic', 'Íslenska'],
    it: ['Italian', 'Italiano'], ja: ['Japanese', '日本語'], ka: ['Georgian', 'ქართული'],
    kk: ['Kazakh', 'Қазақша'], km: ['Khmer', 'ខ្មែរ'], ko: ['Korean', '한국어'],
    lo: ['Lao', 'ລາວ'], lt: ['Lithuanian', 'Lietuvių'], lv: ['Latvian', 'Latviešu'],
    mk: ['Macedonian', 'Македонски'], mn: ['Mongolian', 'Монгол'], ms: ['Malay', 'Bahasa Melayu'],
    mt: ['Maltese', 'Malti'], my: ['Burmese', 'မြန်မာ'], nb: ['Norwegian', 'Norsk'],
    ne: ['Nepali', 'नेपाली'], nl: ['Dutch', 'Nederlands'], pl: ['Polish', 'Polski'],
    ps: ['Pashto', 'پښتو'], pt: ['Portuguese', 'Português'], ro: ['Romanian', 'Română'],
    ru: ['Russian', 'Русский'], si: ['Sinhala', 'සිංහල'], sk: ['Slovak', 'Slovenčina'],
    sl: ['Slovene', 'Slovenščina'], so: ['Somali', 'Soomaali'], sq: ['Albanian', 'Shqip'],
    sr: ['Serbian', 'Српски'], sv: ['Swedish', 'Svenska'], sw: ['Swahili', 'Kiswahili'],
    ta: ['Tamil', 'தமிழ்'], th: ['Thai', 'ไทย'], tr: ['Turkish', 'Türkçe'],
    uk: ['Ukrainian', 'Українська'], ur: ['Urdu', 'اردو'], uz: ['Uzbek', 'Oʻzbekcha'],
    vi: ['Vietnamese', 'Tiếng Việt'], zh: ['Mandarin', '中文'], zu: ['Zulu', 'isiZulu']
  };

  // Where a country's name for a language differs from the plain one.
  const LOCALE_NAMES = {
    'fa-AF': ['Dari', 'دری'],
    'sr-Latn-ME': ['Montenegrin', 'Crnogorski'],
    'pt-BR': ['Brazilian Portuguese', 'Português do Brasil'],
    'es-MX': ['Mexican Spanish', 'Español de México'],
    'fr-CA': ['Canadian French', 'Français canadien'],
    'zh-TW': ['Mandarin (Taiwan)', '中文（台灣）']
  };

  // Local language first. English appears where it is official or the
  // everyday language most visitors meet.
  const COUNTRY_LOCALES = {
    'Afghanistan': ['ps-AF', 'fa-AF'],
    'Albania': ['sq-AL'],
    'Algeria': ['ar-DZ', 'fr-DZ'],
    'Andorra': ['ca-AD'],
    'Angola': ['pt-AO'],
    'Antigua and Barbuda': ['en-AG'],
    'Argentina': ['es-AR'],
    'Armenia': ['hy-AM'],
    'Australia': ['en-AU'],
    'Austria': ['de-AT'],
    'Azerbaijan': ['az-AZ'],
    'Bahamas': ['en-BS'],
    'Bahrain': ['ar-BH'],
    'Bangladesh': ['bn-BD'],
    'Barbados': ['en-BB'],
    'Belarus': ['ru-BY'],
    'Belgium': ['nl-BE', 'fr-BE', 'de-BE'],
    'Belize': ['en-BZ', 'es-BZ'],
    'Benin': ['fr-BJ'],
    'Bhutan': ['en-BT'],
    'Bolivia': ['es-BO'],
    'Bosnia and Herzegovina': ['bs-BA', 'hr-BA', 'sr-BA'],
    'Botswana': ['en-BW'],
    'Brazil': ['pt-BR'],
    'Brunei': ['ms-BN'],
    'Bulgaria': ['bg-BG'],
    'Burkina Faso': ['fr-BF'],
    'Burundi': ['fr-BI', 'en-BI'],
    'Cambodia': ['km-KH'],
    'Cameroon': ['fr-CM', 'en-CM'],
    'Canada': ['en-CA', 'fr-CA'],
    'Cape Verde': ['pt-CV'],
    'Central African Republic': ['fr-CF'],
    'Chad': ['fr-TD', 'ar-TD'],
    'Chile': ['es-CL'],
    'China': ['zh-CN'],
    'Colombia': ['es-CO'],
    'Comoros': ['fr-KM', 'ar-KM'],
    'Congo (DRC)': ['fr-CD', 'sw-CD'],
    'Congo (Republic)': ['fr-CG'],
    'Costa Rica': ['es-CR'],
    "Côte d'Ivoire": ['fr-CI'],
    'Croatia': ['hr-HR'],
    'Cuba': ['es-CU'],
    'Cyprus': ['el-CY', 'tr-CY'],
    'Czech Republic': ['cs-CZ'],
    'Denmark': ['da-DK'],
    'Djibouti': ['fr-DJ', 'ar-DJ', 'so-DJ'],
    'Dominica': ['en-DM'],
    'Dominican Republic': ['es-DO'],
    'Ecuador': ['es-EC'],
    'Egypt': ['ar-EG'],
    'El Salvador': ['es-SV'],
    'Equatorial Guinea': ['es-GQ', 'fr-GQ', 'pt-GQ'],
    'Eritrea': ['ar-ER', 'en-ER'],
    'Estonia': ['et-EE'],
    'Eswatini': ['en-SZ'],
    'Ethiopia': ['am-ET'],
    'Fiji': ['en-FJ', 'hi-FJ'],
    'Finland': ['fi-FI', 'sv-FI'],
    'France': ['fr-FR'],
    'Gabon': ['fr-GA'],
    'Gambia': ['en-GM'],
    'Georgia': ['ka-GE'],
    'Germany': ['de-DE'],
    'Ghana': ['en-GH'],
    'Greece': ['el-GR'],
    'Grenada': ['en-GD'],
    'Guatemala': ['es-GT'],
    'Guinea': ['fr-GN'],
    'Guinea-Bissau': ['pt-GW'],
    'Guyana': ['en-GY'],
    'Haiti': ['fr-HT'],
    'Honduras': ['es-HN'],
    'Hungary': ['hu-HU'],
    'Iceland': ['is-IS'],
    'India': ['hi-IN', 'en-IN', 'ta-IN', 'bn-IN'],
    'Indonesia': ['id-ID'],
    'Iran': ['fa-IR'],
    'Iraq': ['ar-IQ'],
    'Ireland': ['en-IE', 'ga-IE'],
    'Israel': ['he-IL', 'ar-IL'],
    'Italy': ['it-IT'],
    'Jamaica': ['en-JM'],
    'Japan': ['ja-JP'],
    'Jordan': ['ar-JO'],
    'Kazakhstan': ['kk-KZ', 'ru-KZ'],
    'Kenya': ['sw-KE', 'en-KE'],
    'Kiribati': ['en-KI'],
    'Kosovo': ['sq-XK', 'sr-XK'],
    'Kuwait': ['ar-KW'],
    'Kyrgyzstan': ['ru-KG'],
    'Laos': ['lo-LA'],
    'Latvia': ['lv-LV'],
    'Lebanon': ['ar-LB', 'fr-LB'],
    'Lesotho': ['en-LS'],
    'Liberia': ['en-LR'],
    'Libya': ['ar-LY'],
    'Liechtenstein': ['de-LI'],
    'Lithuania': ['lt-LT'],
    'Luxembourg': ['fr-LU', 'de-LU'],
    'Madagascar': ['fr-MG'],
    'Malawi': ['en-MW'],
    'Malaysia': ['ms-MY', 'en-MY'],
    'Maldives': ['en-MV'],
    'Mali': ['fr-ML'],
    'Malta': ['mt-MT', 'en-MT'],
    'Marshall Islands': ['en-MH'],
    'Mauritania': ['ar-MR', 'fr-MR'],
    'Mauritius': ['en-MU', 'fr-MU'],
    'Mexico': ['es-MX'],
    'Micronesia': ['en-FM'],
    'Moldova': ['ro-MD', 'ru-MD'],
    'Monaco': ['fr-MC'],
    'Mongolia': ['mn-MN'],
    'Montenegro': ['sr-Latn-ME'],
    'Morocco': ['ar-MA', 'fr-MA'],
    'Mozambique': ['pt-MZ'],
    'Myanmar': ['my-MM'],
    'Namibia': ['en-NA', 'af-NA'],
    'Nauru': ['en-NR'],
    'Nepal': ['ne-NP'],
    'Netherlands': ['nl-NL'],
    'New Zealand': ['en-NZ'],
    'Nicaragua': ['es-NI'],
    'Niger': ['fr-NE'],
    'Nigeria': ['en-NG'],
    'North Korea': ['ko-KP'],
    'North Macedonia': ['mk-MK', 'sq-MK'],
    'Norway': ['nb-NO'],
    'Oman': ['ar-OM'],
    'Pakistan': ['ur-PK', 'en-PK'],
    'Palau': ['en-PW'],
    'Palestine': ['ar-PS'],
    'Panama': ['es-PA'],
    'Papua New Guinea': ['en-PG'],
    'Paraguay': ['es-PY'],
    'Peru': ['es-PE'],
    'Philippines': ['fil-PH', 'en-PH'],
    'Poland': ['pl-PL'],
    'Portugal': ['pt-PT'],
    'Qatar': ['ar-QA'],
    'Romania': ['ro-RO'],
    'Russia': ['ru-RU'],
    'Rwanda': ['fr-RW', 'en-RW', 'sw-RW'],
    'Saint Kitts and Nevis': ['en-KN'],
    'Saint Lucia': ['en-LC'],
    'Saint Vincent and the Grenadines': ['en-VC'],
    'Samoa': ['en-WS'],
    'San Marino': ['it-SM'],
    'São Tomé and Príncipe': ['pt-ST'],
    'Saudi Arabia': ['ar-SA'],
    'Senegal': ['fr-SN'],
    'Serbia': ['sr-RS'],
    'Seychelles': ['en-SC', 'fr-SC'],
    'Sierra Leone': ['en-SL'],
    'Singapore': ['en-SG', 'zh-SG', 'ms-SG', 'ta-SG'],
    'Slovakia': ['sk-SK'],
    'Slovenia': ['sl-SI'],
    'Solomon Islands': ['en-SB'],
    'Somalia': ['so-SO', 'ar-SO'],
    'South Africa': ['en-ZA', 'zu-ZA', 'af-ZA'],
    'South Korea': ['ko-KR'],
    'South Sudan': ['en-SS', 'ar-SS'],
    'Spain': ['es-ES', 'ca-ES'],
    'Sri Lanka': ['si-LK', 'ta-LK'],
    'Sudan': ['ar-SD', 'en-SD'],
    'Suriname': ['nl-SR'],
    'Sweden': ['sv-SE'],
    'Switzerland': ['de-CH', 'fr-CH', 'it-CH'],
    'Syria': ['ar-SY'],
    'Taiwan': ['zh-TW'],
    'Tajikistan': ['ru-TJ'],
    'Tanzania': ['sw-TZ', 'en-TZ'],
    'Thailand': ['th-TH'],
    'Timor-Leste': ['pt-TL'],
    'Togo': ['fr-TG'],
    'Tonga': ['en-TO'],
    'Trinidad and Tobago': ['en-TT'],
    'Tunisia': ['ar-TN', 'fr-TN'],
    'Turkey': ['tr-TR'],
    'Turkmenistan': ['ru-TM'],
    'Tuvalu': ['en-TV'],
    'Uganda': ['en-UG', 'sw-UG'],
    'Ukraine': ['uk-UA'],
    'United Arab Emirates': ['ar-AE', 'en-AE'],
    'United Kingdom': ['en-GB'],
    'United States': ['en-US', 'es-US'],
    'Uruguay': ['es-UY'],
    'Uzbekistan': ['uz-UZ', 'ru-UZ'],
    'Vanuatu': ['en-VU', 'fr-VU'],
    'Vatican City': ['it-VA'],
    'Venezuela': ['es-VE'],
    'Vietnam': ['vi-VN'],
    'Yemen': ['ar-YE'],
    'Zambia': ['en-ZM'],
    'Zimbabwe': ['en-ZW']
  };

  // Phrasebook / narration text key. Script matters more than region.
  function bookFor(locale) {
    const tag = String(locale || '');
    if (/^zh-(TW|HK|MO)/i.test(tag)) return 'zh-Hant';
    if (/^zh/i.test(tag)) return 'zh-Hans';
    if (/^sr-Latn/i.test(tag)) return 'sr-Latn';
    if (/^pt-BR/i.test(tag)) return 'pt-BR';
    if (/^pt/i.test(tag)) return 'pt-PT';
    if (/^es-ES/i.test(tag)) return 'es-ES';
    if (/^es/i.test(tag)) return 'es-419';
    return tag.split('-')[0].toLowerCase();
  }

  /* Neural voices by locale. xai = language code for api.x.ai/v1/tts
     (20 languages). azure = Azure Neural voice name. A locale not listed
     here uses its language default (the entry keyed by the bare subtag). */
  const VOICES = {
    en: { xai: 'en', azure: 'en-US-AvaNeural' },
    'en-GB': { xai: 'en', azure: 'en-GB-SoniaNeural' },
    'en-AU': { xai: 'en', azure: 'en-AU-NatashaNeural' },
    'en-CA': { xai: 'en', azure: 'en-CA-ClaraNeural' },
    'en-IE': { xai: 'en', azure: 'en-IE-EmilyNeural' },
    'en-IN': { xai: 'en', azure: 'en-IN-NeerjaNeural' },
    'en-NZ': { xai: 'en', azure: 'en-NZ-MollyNeural' },
    'en-ZA': { xai: 'en', azure: 'en-ZA-LeahNeural' },
    'en-NG': { xai: 'en', azure: 'en-NG-EzinneNeural' },
    'en-KE': { xai: 'en', azure: 'en-KE-AsiliaNeural' },
    'en-TZ': { xai: 'en', azure: 'en-TZ-ImaniNeural' },
    'en-SG': { xai: 'en', azure: 'en-SG-LunaNeural' },
    'en-PH': { xai: 'en', azure: 'en-PH-RosaNeural' },
    fr: { xai: 'fr', azure: 'fr-FR-DeniseNeural' },
    'fr-CA': { xai: 'fr', azure: 'fr-CA-SylvieNeural' },
    'fr-BE': { xai: 'fr', azure: 'fr-BE-CharlineNeural' },
    'fr-CH': { xai: 'fr', azure: 'fr-CH-ArianeNeural' },
    de: { xai: 'de', azure: 'de-DE-KatjaNeural' },
    'de-AT': { xai: 'de', azure: 'de-AT-IngridNeural' },
    'de-CH': { xai: 'de', azure: 'de-CH-LeniNeural' },
    it: { xai: 'it', azure: 'it-IT-ElsaNeural' },
    es: { xai: 'es-MX', azure: 'es-MX-DaliaNeural' },
    'es-ES': { xai: 'es-ES', azure: 'es-ES-ElviraNeural' },
    'es-AR': { xai: 'es-MX', azure: 'es-AR-ElenaNeural' },
    'es-BO': { xai: 'es-MX', azure: 'es-BO-SofiaNeural' },
    'es-CL': { xai: 'es-MX', azure: 'es-CL-CatalinaNeural' },
    'es-CO': { xai: 'es-MX', azure: 'es-CO-SalomeNeural' },
    'es-CR': { xai: 'es-MX', azure: 'es-CR-MariaNeural' },
    'es-CU': { xai: 'es-MX', azure: 'es-CU-BelkysNeural' },
    'es-DO': { xai: 'es-MX', azure: 'es-DO-RamonaNeural' },
    'es-EC': { xai: 'es-MX', azure: 'es-EC-AndreaNeural' },
    'es-GQ': { xai: 'es-ES', azure: 'es-GQ-TeresaNeural' },
    'es-GT': { xai: 'es-MX', azure: 'es-GT-MartaNeural' },
    'es-HN': { xai: 'es-MX', azure: 'es-HN-KarlaNeural' },
    'es-NI': { xai: 'es-MX', azure: 'es-NI-YolandaNeural' },
    'es-PA': { xai: 'es-MX', azure: 'es-PA-MargaritaNeural' },
    'es-PE': { xai: 'es-MX', azure: 'es-PE-CamilaNeural' },
    'es-PY': { xai: 'es-MX', azure: 'es-PY-TaniaNeural' },
    'es-SV': { xai: 'es-MX', azure: 'es-SV-LorenaNeural' },
    'es-US': { xai: 'es-MX', azure: 'es-US-PalomaNeural' },
    'es-UY': { xai: 'es-MX', azure: 'es-UY-ValentinaNeural' },
    'es-VE': { xai: 'es-MX', azure: 'es-VE-PaolaNeural' },
    pt: { xai: 'pt-PT', azure: 'pt-PT-RaquelNeural' },
    'pt-BR': { xai: 'pt-BR', azure: 'pt-BR-FranciscaNeural' },
    ar: { xai: 'ar-SA', azure: 'ar-SA-ZariyahNeural' },
    'ar-EG': { xai: 'ar-EG', azure: 'ar-EG-SalmaNeural' },
    'ar-SD': { xai: 'ar-EG', azure: 'ar-EG-SalmaNeural' },
    'ar-LY': { xai: 'ar-EG', azure: 'ar-LY-ImanNeural' },
    'ar-AE': { xai: 'ar-AE', azure: 'ar-AE-FatimaNeural' },
    'ar-BH': { xai: 'ar-AE', azure: 'ar-BH-LailaNeural' },
    'ar-KW': { xai: 'ar-AE', azure: 'ar-KW-NouraNeural' },
    'ar-OM': { xai: 'ar-AE', azure: 'ar-OM-AyshaNeural' },
    'ar-QA': { xai: 'ar-AE', azure: 'ar-QA-AmalNeural' },
    'ar-DZ': { xai: 'ar-SA', azure: 'ar-DZ-AminaNeural' },
    'ar-IQ': { xai: 'ar-SA', azure: 'ar-IQ-RanaNeural' },
    'ar-JO': { xai: 'ar-SA', azure: 'ar-JO-SanaNeural' },
    'ar-LB': { xai: 'ar-SA', azure: 'ar-LB-LaylaNeural' },
    'ar-MA': { xai: 'ar-SA', azure: 'ar-MA-MounaNeural' },
    'ar-SY': { xai: 'ar-SA', azure: 'ar-SY-AmanyNeural' },
    'ar-TN': { xai: 'ar-SA', azure: 'ar-TN-ReemNeural' },
    'ar-YE': { xai: 'ar-SA', azure: 'ar-YE-MaryamNeural' },
    zh: { xai: 'zh', azure: 'zh-CN-XiaoxiaoNeural' },
    'zh-TW': { xai: 'zh', azure: 'zh-TW-HsiaoChenNeural' },
    ja: { xai: 'ja', azure: 'ja-JP-NanamiNeural' },
    ko: { xai: 'ko', azure: 'ko-KR-SunHiNeural' },
    hi: { xai: 'hi', azure: 'hi-IN-SwaraNeural' },
    bn: { xai: 'bn', azure: 'bn-BD-NabanitaNeural' },
    'bn-IN': { xai: 'bn', azure: 'bn-IN-TanishaaNeural' },
    id: { xai: 'id', azure: 'id-ID-GadisNeural' },
    ru: { xai: 'ru', azure: 'ru-RU-SvetlanaNeural' },
    tr: { xai: 'tr', azure: 'tr-TR-EmelNeural' },
    vi: { xai: 'vi', azure: 'vi-VN-HoaiMyNeural' },
    af: { azure: 'af-ZA-AdriNeural' },
    am: { azure: 'am-ET-MekdesNeural' },
    az: { azure: 'az-AZ-BanuNeural' },
    bg: { azure: 'bg-BG-KalinaNeural' },
    bs: { azure: 'bs-BA-VesnaNeural' },
    ca: { azure: 'ca-ES-JoanaNeural' },
    cs: { azure: 'cs-CZ-VlastaNeural' },
    da: { azure: 'da-DK-ChristelNeural' },
    el: { azure: 'el-GR-AthinaNeural' },
    et: { azure: 'et-EE-AnuNeural' },
    fa: { azure: 'fa-IR-DilaraNeural' },
    fi: { azure: 'fi-FI-NooraNeural' },
    fil: { azure: 'fil-PH-BlessicaNeural' },
    ga: { azure: 'ga-IE-OrlaNeural' },
    he: { azure: 'he-IL-HilaNeural' },
    hr: { azure: 'hr-HR-GabrijelaNeural' },
    hu: { azure: 'hu-HU-NoemiNeural' },
    hy: { azure: 'hy-AM-AnahitNeural' },
    is: { azure: 'is-IS-GudrunNeural' },
    ka: { azure: 'ka-GE-EkaNeural' },
    kk: { azure: 'kk-KZ-AigulNeural' },
    km: { azure: 'km-KH-SreymomNeural' },
    lo: { azure: 'lo-LA-KeomanyNeural' },
    lt: { azure: 'lt-LT-OnaNeural' },
    lv: { azure: 'lv-LV-EveritaNeural' },
    mk: { azure: 'mk-MK-MarijaNeural' },
    mn: { azure: 'mn-MN-YesuiNeural' },
    ms: { azure: 'ms-MY-YasminNeural' },
    mt: { azure: 'mt-MT-GraceNeural' },
    my: { azure: 'my-MM-NilarNeural' },
    nb: { azure: 'nb-NO-PernilleNeural' },
    ne: { azure: 'ne-NP-HemkalaNeural' },
    nl: { azure: 'nl-NL-FennaNeural' },
    'nl-BE': { azure: 'nl-BE-DenaNeural' },
    pl: { azure: 'pl-PL-AgnieszkaNeural' },
    ps: { azure: 'ps-AF-LatifaNeural' },
    ro: { azure: 'ro-RO-AlinaNeural' },
    si: { azure: 'si-LK-ThiliniNeural' },
    sk: { azure: 'sk-SK-ViktoriaNeural' },
    sl: { azure: 'sl-SI-PetraNeural' },
    so: { azure: 'so-SO-UbaxNeural' },
    sq: { azure: 'sq-AL-AnilaNeural' },
    sr: { azure: 'sr-RS-SophieNeural' },
    'sr-Latn-ME': { azure: 'sr-Latn-RS-NicholasNeural' },
    sv: { azure: 'sv-SE-SofieNeural' },
    sw: { azure: 'sw-KE-ZuriNeural' },
    'sw-TZ': { azure: 'sw-TZ-RehemaNeural' },
    ta: { azure: 'ta-IN-PallaviNeural' },
    'ta-LK': { azure: 'ta-LK-SaranyaNeural' },
    'ta-SG': { azure: 'ta-SG-VenbaNeural' },
    th: { azure: 'th-TH-PremwadeeNeural' },
    uk: { azure: 'uk-UA-PolinaNeural' },
    ur: { azure: 'ur-PK-UzmaNeural' },
    uz: { azure: 'uz-UZ-MadinaNeural' },
    zu: { azure: 'zu-ZA-ThandoNeural' }
  };

  function langOf(locale) {
    return String(locale || '').split('-')[0].toLowerCase();
  }

  function voicesFor(locale) {
    const tag = String(locale || '');
    return VOICES[tag] || VOICES[langOf(tag)] || null;
  }

  // Providers that can say this locale, best first.
  function providersFor(locale, configured) {
    const v = voicesFor(locale);
    if (!v) return [];
    const on = configured || { xai: true, azure: true };
    const out = [];
    if (v.xai && on.xai) out.push('xai');
    if (v.azure && on.azure) out.push('azure');
    return out;
  }

  function nameOf(locale) {
    const own = LOCALE_NAMES[locale];
    if (own) return { name: own[0], native: own[1] };
    const l = LANGUAGES[langOf(locale)];
    return l ? { name: l[0], native: l[1] } : { name: locale, native: locale };
  }

  // Everything a country offers: [{ locale, lang, book, name, native }].
  function languagesFor(country) {
    const list = COUNTRY_LOCALES[country] || ['en-US'];
    return list.map(function (locale) {
      const n = nameOf(locale);
      return { locale: locale, lang: langOf(locale), book: bookFor(locale), name: n.name, native: n.native };
    });
  }

  function isEnglishFirst(country) {
    const list = COUNTRY_LOCALES[country];
    return !list || langOf(list[0]) === 'en';
  }

  // Countries whose narration is also written in a second or third local
  // language. Everywhere else: English plus the first local language.
  const NARRATION_EXTRA = {
    'Belgium': ['fr-BE'],
    'Switzerland': ['fr-CH', 'it-CH'],
    'Canada': ['fr-CA'],
    'Singapore': ['zh-SG'],
    'India': ['hi-IN'],
    'South Africa': ['zu-ZA']
  };

  // Narration text keys for a country: 'en' first, then local books.
  function narrationBooks(country) {
    const list = COUNTRY_LOCALES[country] || [];
    const out = ['en'];
    const add = function (locale) {
      const b = bookFor(locale);
      if (b !== 'en' && voicesFor(locale) && out.indexOf(b) === -1) out.push(b);
    };
    if (list[0] && langOf(list[0]) !== 'en') add(list[0]);
    (NARRATION_EXTRA[country] || []).forEach(add);
    return out;
  }

  // File name for a country's narration: "Côte d'Ivoire" -> "cote-d-ivoire".
  function slugOf(country) {
    return String(country || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const api = {
    narrationBooks: narrationBooks,
    slugOf: slugOf,
    LANGUAGES: LANGUAGES,
    COUNTRY_LOCALES: COUNTRY_LOCALES,
    VOICES: VOICES,
    bookFor: bookFor,
    langOf: langOf,
    voicesFor: voicesFor,
    providersFor: providersFor,
    nameOf: nameOf,
    languagesFor: languagesFor,
    isEnglishFirst: isEnglishFirst
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MyatlasticLocales = api;
})(typeof window !== 'undefined' ? window : this);
