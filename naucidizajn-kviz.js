/* Nauči Dizajn — 1-minut kviz */
/* Verzija: 1.8.0 */

(function() {
  'use strict';

  // ====================================================================
  // KONFIGURACIJA — promeni pre deploy-a
  // ====================================================================
  var ND_CONFIG = {
    webhookUrl: 'https://hook.eu2.make.com/REPLACE_WITH_YOUR_WEBHOOK',
    formId: 'naucidizajn-1minut-kviz',
    fbPixelId: '415729519579969',
    redirectAfterSubmit: true,
    submitTimeoutMs: 8000,
    sendOnExit: true // šalji webhook i ako korisnik napusti formu (partial response)
  };

  // ====================================================================
  // PODACI FORME (1:1 mapirano iz Typeform JSON-a)
  // ====================================================================
  var FORM = {
    welcome: {
      title: 'Za 1-2 minuta, ovaj brzi kviz će ti pomoći da saznaš koja IT veština je idealna za tebe ☺️',
      paragraphs: [
        'Na osnovu tvojih odgovora, saznaćemo koji si tip ličnosti i koja oblast bi ti najbolje legla.',
        'Na kraju ćeš dobiti i <strong>besplatan video trening</strong> iz te veštine koja je najbolja za tebe 😊 🚀'
      ],
      buttonText: 'Kreni',
      timeText: 'Takes 2 minutes'
    },

    // Outcome definicije (4 kviz rezultata)
    outcomes: {
      'web-design':  { title: 'Web Design',  redirect: 'https://www.naucidizajn.com/web-design-kviz-rezultat'  },
      'logo-design': { title: 'Logo Design', redirect: 'https://www.naucidizajn.com/logo-design-kviz-rezultat' },
      'ui-ux':       { title: 'UI/UX',       redirect: 'https://www.naucidizajn.com/ui-ux-kviz-rezultat'       },
      'webflow':     { title: 'Webflow',     redirect: 'https://www.naucidizajn.com/webflow-kviz-rezultat'     }
    },

    // Pitanja po redu
    fields: [
      // ---- Q1-Q6 Quiz pitanja (boduju outcome) ----
      {
        key: 'q1_zadatak', num: 1, type: 'choice',
        title: 'Kad dobiješ novi zadatak na poslu, šta ti je najbitnije?',
        required: true,
        choices: [
          { label: 'Da imam slobodu da ga uradim na svoj način', score: 'logo-design' },
          { label: 'Da razumem zašto se to radi i kako utiče na druge', score: 'ui-ux' },
          { label: 'Da mogu da ga upakujem tako da izgleda i "prodaje" se dobro', score: 'web-design' },
          { label: 'Da dobijem tačna uputstva šta treba da se uradi', score: 'webflow' }
        ]
      },
      {
        key: 'q2_vecera', num: 2, type: 'choice',
        title: 'Dolaze ti prijatelji na večeru. Kako pristupaš pripremi?',
        required: true,
        choices: [
          { label: 'Spremiću nešto što znam da nikada nisu probali. Volim da ih iznenadim novim ukusima.', score: 'logo-design' },
          { label: 'Razmišljam kome bi se šta svidelo i pravim po tome.', score: 'ui-ux' },
          { label: 'Bitno mi je da izgleda lepo i da ostavi utisak', score: 'web-design' },
          { label: 'Pitam njih šta hoće da jedu i spremim to. Ne volim da spremam ono što ne vole.', score: 'webflow' }
        ]
      },
      {
        key: 'q3_nervira', num: 3, type: 'choice',
        title: 'Šta te najviše nervira kod loših proizvoda ili usluga?',
        required: true,
        choices: [
          { label: 'Kad izgledaju ružno', score: 'logo-design' },
          { label: 'Kad ne znam odmah šta treba da uradim ili gde da kliknem', score: 'ui-ux' },
          { label: 'Kad deluju dosadno, generički ili "bez duše"', score: 'web-design' },
          { label: 'Kad nešto ne radi kako treba', score: 'webflow' }
        ]
      },
      {
        key: 'q4_ucenje', num: 4, type: 'choice',
        title: 'Kad učiš nešto novo, kako ti je najlakše?',
        required: true,
        choices: [
          { label: 'Kroz slike, primere i inspiraciju', score: 'logo-design' },
          { label: 'Kroz objašnjenje "zašto" i "kako ljudi razmišljaju"', score: 'ui-ux' },
          { label: 'Kroz konkretne primere iz prakse i realne projekte', score: 'web-design' },
          { label: 'Korak po korak, jasno, bez viška priče', score: 'webflow' }
        ]
      },
      {
        key: 'q5_stan', num: 5, type: 'choice',
        title: 'Kada sređuješ stan bitno ti je:',
        required: true,
        choices: [
          { label: 'Najbitnije mi je da je stan estetičan i unikatan', score: 'logo-design' },
          { label: 'Volim da mi je stan praktičan i da je sve na svom logičnom mestu', score: 'ui-ux' },
          { label: 'Važno mi je da stan bude funkcionalan ali mi je još važnije da je estetski lep', score: 'web-design' },
          { label: 'Nije mi presudno kako izgleda, bitno mi je da sve radi kako treba', score: 'webflow' }
        ]
      },
      {
        key: 'q6_zabavno', num: 6, type: 'choice',
        title: 'Šta bi ti bilo zabavnije da radiš?',
        required: true,
        choices: [
          { label: 'Dođe ti klijent sa svojim biznisom, recimo otvorio je kafić, i traži ti da mu dizajniraš logo i celokupan brending.', score: 'logo-design' },
          { label: 'Klijent dođe sa idejom za aplikaciju. Ti treba da uklopiš sve elemente tako da aplikacija bude jednostavna za korišćenje.', score: 'ui-ux' },
          { label: 'Dizajniraš sajtove gde ćeš ti svojim dizajnom podizati prodaju proizvoda i usluga klijenata.', score: 'web-design' },
          { label: 'Dobiješ gotov dizajn od dizajnera, a tvoj posao je da ga kao programer kodiraš i staviš na sajt.', score: 'webflow' }
        ]
      },

      // ---- Q7 Mid-quiz prekidač ----
      {
        key: 'q7_continue', num: 7, type: 'choice',
        title: '*Sjajno!* Na osnovu tvojih odgovora već znamo koja IT veština ti najviše leži.',
        description: 'Pre nego što ti je otkrijemo, imamo još par brzih pitanja da vidimo da li ti možemo dati i konkretan plan kako da je naučiš. Da li želiš?',
        required: true,
        choices: [
          { label: 'DA, idemo dalje', value: 'da_dalje' },
          { label: 'NE, pokaži mi rezultat odmah', value: 'ne_rezultat', skipToEnd: true }
        ]
      },

      // ---- Q8-Q15 Lead kvalifikacija ----
      {
        key: 'q8_situacija', num: 8, type: 'choice',
        title: 'Koja je tvoja trenutna situacija?',
        required: true,
        choices: [
          { label: 'Full-time zaposlen/a' },
          { label: 'Radim part-time' },
          { label: 'Studiram' },
          { label: 'Nezaposlen/a' }
        ]
      },
      {
        key: 'q9_vreme_dnevno', num: 9, type: 'choice',
        title: 'Koliko vremena dnevno imaš za učenje nove veštine?',
        required: true,
        choices: [
          { label: 'Manje od 1h' },
          { label: '1-3' },
          { label: '3-5' },
          { label: '5+' }
        ]
      },
      {
        key: 'q10_kada_zarada', num: 10, type: 'choice',
        title: 'Kada bi da zarađuješ od IT veštine / dizajna?',
        required: true,
        choices: [
          { label: 'Za manje od 6 meseci' },
          { label: '6-12 meseci' },
          { label: '12-24 meseca' },
          { label: 'Jednog dana, sada samo istražujem.' }
        ]
      },
      {
        key: 'q11_zarada_cilj', num: 11, type: 'choice',
        title: 'Koja mesečna zarada bi za tebe bila pobeda?',
        required: true,
        choices: [
          { label: '1.000–2.000€' },
          { label: '2.000–3.000€' },
          { label: '3.000–5.000€' },
          { label: '5.000+€' }
        ]
      },
      {
        key: 'q12_motivacija', num: 12, type: 'scale',
        title: 'Koliko ti je bitno da promeniš karijeru u narednih 12 meseci?',
        required: true,
        scale: { min: 0, max: 10 }
      },
      {
        key: 'q13_budzet', num: 13, type: 'choice',
        title: 'Ako postoji program koji može da te dovede do cilja, šta te najbolje opisuje?',
        required: true,
        choices: [
          { label: 'Imam pristup 1.500-2.000€ za najbolju edukaciju' },
          { label: 'Nemam ušteđevinu ali bih mogao/la da platim na mesečne rate' },
          { label: 'Mogu da investiram ali manji iznos' },
          { label: 'Ne mogu da investiram ništa u svoje znanje trenutno' }
        ]
      },
      {
        key: 'q14_vec_kod_nas', num: 14, type: 'choice',
        title: 'Da li si već kod nas na edukaciji?',
        required: true,
        choices: [
          { label: 'Da, jesam', skipToEnd: true },
          { label: 'Nisam' }
        ]
      },
      {
        key: 'q15_60_dana', num: 15, type: 'choice',
        title: 'Da li želiš da kreneš sa edukacijom u narednih 60 dana?',
        required: true,
        choices: [
          { label: 'Da, želim da krenem u narednih 60 dana' },
          { label: 'Nisam siguran/na' },
          { label: 'Ne, samo istražujem' }
        ]
      },

      // ---- Q16 Instagram (uslovno) ----
      {
        key: 'q16_instagram', num: 16, type: 'text',
        title: 'Unesi svoj Instagram username (nije obavezno)',
        description: 'Ako odlučiš da uneseš svoj Instagram, naš tim će ti poslati poruku da vidim možemo li ti pomoći oko karijere.',
        required: false,
        placeholder: '@username'
      },

      // ---- Q17 Telefon (uslovno) ----
      {
        key: 'q17_phone', num: 17, type: 'phone',
        title: 'Unesi svoj broj telefona (nije obavezno)',
        description: 'Ako ostaviš broj, naš tim će ti pisati na WhatsApp / Viber da ti pomognemo da pronađeš najbolji put za sebe.',
        required: false,
        placeholder: '6X XXX XXXX'
      },

      // ---- Q18 Podaci (email/ime) ----
      {
        key: 'q18_kontakt', num: 18, type: 'contact',
        title: 'Podaci',
        description: 'Na email će ti stići rezultat kviza, kao i dodatne lekcije koje će ti pomoći da kreneš.',
        required: true
      }
    ]
  };

  // ====================================================================
  // STATE & SESSION
  // ====================================================================
  var state = {
    currentIdx: -1,            // -1 = welcome
    answers: {},
    visitedKeys: [],           // redosled kojim su pitanja zaista prikazana (za progress)
    scores: { 'web-design': 0, 'logo-design': 0, 'ui-ux': 0, 'webflow': 0 },
    sessionId: generateSessionId(),
    startedAt: new Date().toISOString(),
    submitted: false,
    exitedEarly: false
  };

  function generateSessionId() {
    return 'nd_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  // ====================================================================
  // UTM / hidden fields
  // ====================================================================
  function captureUtm() {
    var p = new URLSearchParams(window.location.search);
    var utm = {};
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'].forEach(function(k){
      var v = p.get(k);
      if (v) utm[k] = v;
    });
    return utm;
  }
  var utmData = captureUtm();

  // ====================================================================
  // FACEBOOK PIXEL
  // ====================================================================
  function initFbPixel() {
    if (!ND_CONFIG.fbPixelId) return;
    if (window.fbq) return; // već učitan
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', ND_CONFIG.fbPixelId);
    window.fbq('track', 'PageView');
  }

  function fbqEvent(name, params) {
    if (window.fbq) {
      try { window.fbq('track', name, params || {}); } catch(e) {}
    }
  }

  // ====================================================================
  // LEAD QUALITY ENGINE (1:1 replika Make.com formule)
  // ====================================================================
  function computeLeadQuality(a) {
    var q9  = a.q9_vreme_dnevno;
    var q10 = a.q10_kada_zarada;
    var q12 = parseInt(a.q12_motivacija, 10);
    var q13 = a.q13_budzet;
    var q15 = a.q15_60_dana;

    // RED — diskvalifikacija (early exit)
    if (q9  === 'Manje od 1h') return { quality: 'red', reason: 'Manje od 1h dnevno' };
    if (q10 === 'Jednog dana, sada samo istražujem.') return { quality: 'red', reason: 'Samo istražuje (Q10)' };
    if (q13 === 'Ne mogu da investiram ništa u svoje znanje trenutno') return { quality: 'red', reason: 'Bez budžeta' };
    if (q15 === 'Ne, samo istražujem') return { quality: 'red', reason: 'Samo istražuje (Q15)' };

    // < 6 meseci grane
    if (q10 === 'Za manje od 6 meseci') {
      if (q12 >= 8) {
        if (q13 === 'Imam pristup 1.500-2.000€ za najbolju edukaciju') {
          if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'green', reason: '<6m + mot≥8 + 1500-2000€ + Da 60d' };
          if (q15 === 'Nisam siguran/na') return { quality: 'yellow', reason: '<6m + mot≥8 + 1500-2000€ + Nisam siguran' };
          return { quality: 'white', reason: 'fallback (<6m branch)' };
        }
        if (q13 === 'Nemam ušteđevinu ali bih mogao/la da platim na mesečne rate') {
          if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'green', reason: '<6m + mot≥8 + rate + Da 60d' };
          return { quality: 'white', reason: 'fallback (<6m rate)' };
        }
        if (q13 === 'Mogu da investiram ali manji iznos') {
          if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'yellow', reason: '<6m + mot≥8 + manji + Da 60d' };
          return { quality: 'white', reason: 'fallback (<6m manji)' };
        }
        return { quality: 'white', reason: 'fallback (<6m mot≥8)' };
      }
      // q12 < 8
      if (q13 === 'Imam pristup 1.500-2.000€ za najbolju edukaciju') {
        if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'yellow', reason: '<6m + mot<8 + 1500-2000€ + Da 60d' };
        return { quality: 'white', reason: 'fallback (<6m mot<8)' };
      }
      return { quality: 'white', reason: 'fallback (<6m mot<8 no 2k)' };
    }

    // 6-12 meseci grane
    if (q10 === '6-12 meseci') {
      if (q12 >= 8) {
        if (q13 === 'Imam pristup 1.500-2.000€ za najbolju edukaciju') {
          if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'green', reason: '6-12m + mot≥8 + 1500-2000€ + Da 60d' };
          return { quality: 'white', reason: 'fallback (6-12m 2k no 60d)' };
        }
        if (q13 === 'Nemam ušteđevinu ali bih mogao/la da platim na mesečne rate') {
          if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'green', reason: '6-12m + mot≥8 + rate + Da 60d' };
          return { quality: 'white', reason: 'fallback (6-12m rate)' };
        }
        return { quality: 'white', reason: 'fallback (6-12m mot≥8)' };
      }
      return { quality: 'white', reason: 'fallback (6-12m mot<8)' };
    }

    // 12-24 meseca grane
    if (q10 === '12-24 meseca') {
      if (q12 >= 8) {
        if (q13 === 'Imam pristup 1.500-2.000€ za najbolju edukaciju') {
          if (q15 === 'Da, želim da krenem u narednih 60 dana') return { quality: 'yellow', reason: '12-24m + mot≥8 + 1500-2000€ + Da 60d' };
        }
      }
      return { quality: 'white', reason: 'fallback (12-24m)' };
    }

    // Default
    return { quality: 'white', reason: 'fallback (default)' };
  }

  // ====================================================================
  // OUTCOME WINNER
  // ====================================================================
  function computeWinningOutcome() {
    var max = -1, winner = null;
    Object.keys(state.scores).forEach(function(k) {
      if (state.scores[k] > max) { max = state.scores[k]; winner = k; }
    });
    return winner || 'web-design'; // fallback
  }

  // ====================================================================
  // FLOW ROUTING (1:1 Typeform logic)
  // ====================================================================
  // Q15 routing: HOT lead -> Q17 (telefon), ostali -> Q16 (Instagram)
  function isHotLeadAfterQ15(a) {
    var q10 = a.q10_kada_zarada;
    var q12 = parseInt(a.q12_motivacija, 10);
    var q13 = a.q13_budzet;
    var q15 = a.q15_60_dana;

    if (q10 === 'Za manje od 6 meseci') return true;
    if (q10 === '6-12 meseci' && q13 === 'Imam pristup 1.500-2.000€ za najbolju edukaciju') return true;
    if (q10 === '6-12 meseci' && q12 >= 8 && q13 === 'Mogu da investiram ali manji iznos' && q15 === 'Da, želim da krenem u narednih 60 dana') return true;
    if (q13 === 'Nemam ušteđevinu ali bih mogao/la da platim na mesečne rate' &&
        (q15 === 'Da, želim da krenem u narednih 60 dana' || q15 === 'Nisam siguran/na')) return true;
    if (q10 === '12-24 meseca' && q12 >= 8 && q13 === 'Imam pristup 1.500-2.000€ za najbolju edukaciju') return true;
    return false;
  }

  // Predviđa ukupan broj koraka na osnovu trenutnih odgovora.
  // Logika: koristi NAJKRAĆU moguću putanju dok ne stignemo do branching point-a.
  // Pre Q7 odgovora: pretpostavlja 'NE, pokaži rezultat' = 8 koraka (kratka putanja)
  // Posle Q7 'NE': ostaje 8 koraka
  // Posle Q7 'DA': pretpostavlja Q14 = 'Da, jesam' = 15 koraka (sledeća kratka putanja)
  // Posle Q14 'Da, jesam': ostaje 15
  // Posle Q14 'Nisam': 17 koraka (Q15 + Q16/Q17 + Q18)
  function predictTotalSteps() {
    var a = state.answers;

    // Q7 odgovor poznat?
    if (a.q7_continue) {
      if (a.q7_continue.skipToEnd) {
        // 'NE, pokaži rezultat' -> Q1...Q7 + Q18 = 8 koraka
        return 8;
      }
      // 'DA, idemo dalje' - Q14 odgovor poznat?
      if (a.q14_vec_kod_nas) {
        if (a.q14_vec_kod_nas.skipToEnd) {
          // 'Da, jesam' -> Q1...Q14 + Q18 = 15 koraka
          return 15;
        }
        // 'Nisam' -> Q1...Q15 + (Q16 ili Q17) + Q18 = 17 koraka
        return 17;
      }
      // Q7 'DA', Q14 nije odgovoreno: pretpostavi 'Da, jesam' (kraća putanja) = 15
      return 15;
    }

    // Pre Q7: pretpostavi 'NE' (najkraća putanja) = 8 koraka
    // Tako Q7 dolazi na poziciju 7/8 = ~87% (kao u originalnom Typeformu)
    return 8;
  }

  // Vraća redni broj trenutnog koraka u predviđenoj putanji
  function getStepNumberInPath() {
    if (state.currentIdx < 0) return 0;
    var key = FORM.fields[state.currentIdx].key;

    // Mapiranje: koja pozicija u putanji?
    // Q1-Q7 = pozicije 1-7 u svim putanjama
    var idx = state.currentIdx;
    if (idx <= 6) return idx + 1; // Q1-Q7

    // Q8-Q14 = pozicije 8-14 u dugim putanjama
    if (idx <= 13) return idx + 1;

    // Q15 = pozicija 15
    if (key === 'q15_60_dana') return 15;

    // Q16 ili Q17 = pozicija 16
    if (key === 'q16_instagram' || key === 'q17_phone') return 16;

    // Q18 = poslednja pozicija (zavisi od putanje)
    if (key === 'q18_kontakt') return predictTotalSteps();

    return idx + 1;
  }
  function getNextKey(currentKey) {
    var a = state.answers;

    // Q7: skip-to-end (NE pokaži rezultat odmah)
    if (currentKey === 'q7_continue' && a.q7_continue && a.q7_continue.skipToEnd) return 'q18_kontakt';

    // Q14: već je na edukaciji -> pravo na Q18
    if (currentKey === 'q14_vec_kod_nas' && a.q14_vec_kod_nas && a.q14_vec_kod_nas.skipToEnd) return 'q18_kontakt';

    // Q15: smart routing
    if (currentKey === 'q15_60_dana') {
      return isHotLeadAfterQ15(a) ? 'q17_phone' : 'q16_instagram';
    }

    // Q16 (Instagram) -> Q18 direktno (preskoči Q17)
    if (currentKey === 'q16_instagram') return 'q18_kontakt';

    // Q17 (Phone) -> Q18 direktno
    if (currentKey === 'q17_phone') return 'q18_kontakt';

    // Q18 -> kraj
    if (currentKey === 'q18_kontakt') return 'END';

    // Default: linearno sledeći u nizu
    var idx = FORM.fields.findIndex(function(f) { return f.key === currentKey; });
    if (idx === -1 || idx === FORM.fields.length - 1) return 'END';
    return FORM.fields[idx + 1].key;
  }

  // ====================================================================
  // RENDERING
  // ====================================================================
  var stage = document.getElementById('nd-stage');
  var progressFill = document.querySelector('#nd-quiz .nd-progress-fill');
  var stepEls = {}; // key -> HTMLElement

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function renderTitle(field) {
    // Replace *text* with <em>text</em>
    var html = escapeHtml(field.title).replace(/\*([^*]+)\*/g, '<em>$1</em>');
    var req = field.required ? '<span class="nd-q-required">*</span>' : '';
    return '<h2 class="nd-q-title">' + html + req + '</h2>';
  }

  function renderQuestionHeader(field) {
    var num = '<span class="nd-q-num" aria-hidden="true">' + field.num + '</span>';
    var desc = field.description ? '<p class="nd-q-desc">' + escapeHtml(field.description) + '</p>' : '';
    return '<div class="nd-q-row">' + num + renderTitle(field) + '</div>' + desc;
  }

  function letterFor(i) { return String.fromCharCode(65 + i); /* A,B,C,D */ }

  function renderChoice(choice, idx) {
    return '<button type="button" class="nd-choice" data-idx="' + idx + '">' +
             '<span class="nd-choice-key">' + letterFor(idx) + '</span>' +
             '<span class="nd-choice-label">' + escapeHtml(choice.label) + '</span>' +
           '</button>';
  }

  function renderEnterHint() {
    return '<span class="nd-enter-hint">pritisni <kbd>Enter ↵</kbd></span>';
  }

  function buildStepHtml(field) {
    var inner = '';

    if (field.type === 'choice') {
      inner = renderQuestionHeader(field) +
              '<div class="nd-choices">' + field.choices.map(renderChoice).join('') + '</div>' +
              '<div class="nd-actions"><button type="button" class="nd-btn-primary" disabled><span class="nd-btn-label">OK</span></button></div>';
    }
    else if (field.type === 'scale') {
      var btns = '';
      for (var i = field.scale.min; i <= field.scale.max; i++) {
        btns += '<button type="button" class="nd-scale-btn" data-val="' + i + '">' + i + '</button>';
      }
      inner = renderQuestionHeader(field) +
              '<div class="nd-scale">' + btns + '</div>' +
              '<div class="nd-actions"><button type="button" class="nd-btn-primary" disabled><span class="nd-btn-label">OK</span></button></div>';
    }
    else if (field.type === 'text') {
      inner = renderQuestionHeader(field) +
              '<div class="nd-input-wrap">' +
                '<input type="text" class="nd-input" placeholder="' + escapeHtml(field.placeholder || '') + '" autocomplete="off">' +
              '</div>' +
              '<div class="nd-actions"><button type="button" class="nd-btn-primary"><span class="nd-btn-label">OK</span></button></div>';
    }
    else if (field.type === 'phone') {
      inner = renderQuestionHeader(field) +
              '<div class="nd-phone-row">' +
                '<span class="nd-phone-cc">+381</span>' +
                '<div class="nd-input-wrap" style="flex:1;"><input type="tel" class="nd-input" placeholder="' + escapeHtml(field.placeholder || '') + '" inputmode="tel" autocomplete="tel-national"></div>' +
              '</div>' +
              '<div class="nd-actions"><button type="button" class="nd-btn-primary"><span class="nd-btn-label">OK</span></button></div>';
    }
    else if (field.type === 'contact') {
      inner = renderQuestionHeader(field) +
              '<div class="nd-contact-grid">' +
                '<div>' +
                  '<label class="nd-input-label">Ime i prezime *</label>' +
                  '<div class="nd-input-wrap"><input type="text" class="nd-input" data-name autocomplete="name"></div>' +
                '</div>' +
                '<div>' +
                  '<label class="nd-input-label">Email *</label>' +
                  '<div class="nd-input-wrap"><input type="email" class="nd-input" data-email autocomplete="email" inputmode="email"></div>' +
                '</div>' +
              '</div>' +
              '<div class="nd-actions"><button type="button" class="nd-btn-primary" disabled><span class="nd-btn-label">POŠALJI</span></button></div>' +
              '<div class="nd-error" hidden></div>';
    }

    var stepEl = document.createElement('div');
    stepEl.className = 'nd-step';
    stepEl.dataset.key = field.key;
    stepEl.innerHTML = '<div class="nd-step-inner">' + inner + '</div>';
    return stepEl;
  }

  function buildWelcomeStep() {
    var paragraphsHtml = (FORM.welcome.paragraphs || []).map(function(p) {
      // p može sadržati <strong> tagove — ne escape-ujemo u potpunosti
      return '<p class="nd-welcome-desc">' + p + '</p>';
    }).join('');

    var clockSvg = '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>' +
      '<path d="M8 4.5V8L10 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    var inner =
      '<div class="nd-welcome">' +
        '<h1 class="nd-welcome-title">' + escapeHtml(FORM.welcome.title) + '</h1>' +
        paragraphsHtml +
        '<div class="nd-actions"><button type="button" class="nd-btn-primary" data-welcome-start><span class="nd-btn-label">' + escapeHtml(FORM.welcome.buttonText) + '</span></button></div>' +
        '<div class="nd-time-pill">' + clockSvg + ' ' + escapeHtml(FORM.welcome.timeText) + '</div>' +
      '</div>';
    var el = document.createElement('div');
    el.className = 'nd-step';
    el.dataset.key = '__welcome';
    el.innerHTML = '<div class="nd-step-inner">' + inner + '</div>';
    return el;
  }

  function buildLoadingStep() {
    var el = document.createElement('div');
    el.className = 'nd-step';
    el.dataset.key = '__loading';
    el.innerHTML =
      '<div class="nd-step-inner"><div class="nd-loading">' +
        '<div class="nd-spinner"></div>' +
        '<div class="nd-loading-title">Tvoj rezultat se priprema...</div>' +
        '<div class="nd-error" hidden></div>' +
      '</div></div>';
    return el;
  }

  function mountAllSteps() {
    var welcome = buildWelcomeStep();
    stage.appendChild(welcome);
    stepEls.__welcome = welcome;

    FORM.fields.forEach(function(f) {
      var el = buildStepHtml(f);
      stage.appendChild(el);
      stepEls[f.key] = el;
      attachStepBehavior(f, el);
    });

    var loading = buildLoadingStep();
    stage.appendChild(loading);
    stepEls.__loading = loading;

    // Welcome start button
    welcome.querySelector('[data-welcome-start]').addEventListener('click', function() {
      fbqEvent('Lead', { content_name: 'Quiz Started' });
      document.getElementById('nd-quiz').classList.add('nd-quiz-started');
      goToKey(FORM.fields[0].key);
    });

    showStepEl(welcome);
  }

  // ====================================================================
  // STEP BEHAVIOR (per type)
  // ====================================================================
  function attachStepBehavior(field, el) {
    if (field.type === 'choice') {
      var btns = Array.from(el.querySelectorAll('.nd-choice'));
      var ok   = el.querySelector('.nd-btn-primary');

      btns.forEach(function(b, i) {
        b.addEventListener('click', function() {
          btns.forEach(function(x){ x.classList.remove('nd-selected'); });
          b.classList.add('nd-selected');
          ok.removeAttribute('disabled');
          // Auto-advance for choice questions (Typeform behavior)
          setTimeout(function(){ submitChoice(field, i); }, 280);
        });
      });

      ok.addEventListener('click', function() {
        var sel = el.querySelector('.nd-choice.nd-selected');
        if (sel) submitChoice(field, parseInt(sel.dataset.idx, 10));
      });
    }
    else if (field.type === 'scale') {
      var sbtns = Array.from(el.querySelectorAll('.nd-scale-btn'));
      var sok   = el.querySelector('.nd-btn-primary');
      var sval  = null;

      sbtns.forEach(function(b) {
        b.addEventListener('click', function() {
          sbtns.forEach(function(x){ x.classList.remove('nd-selected'); });
          b.classList.add('nd-selected');
          sval = parseInt(b.dataset.val, 10);
          sok.removeAttribute('disabled');
        });
      });

      sok.addEventListener('click', function() {
        if (sval == null) return;
        state.answers[field.key] = sval;
        advance(field.key);
      });
    }
    else if (field.type === 'text') {
      var tin = el.querySelector('.nd-input');
      var tok = el.querySelector('.nd-btn-primary');
      tok.addEventListener('click', function() {
        var v = (tin.value || '').trim();
        state.answers[field.key] = v; // može biti prazno (opciono)
        advance(field.key);
      });
      tin.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); tok.click(); }
      });
    }
    else if (field.type === 'phone') {
      var pin = el.querySelector('.nd-input');
      var pok = el.querySelector('.nd-btn-primary');
      pok.addEventListener('click', function() {
        var raw = (pin.value || '').trim();
        // sklanjamo razmake / crte
        var cleaned = raw.replace(/[\s\-\(\)]/g, '');
        var full = cleaned ? ('+381' + cleaned.replace(/^0+/, '')) : '';
        state.answers[field.key] = full;
        advance(field.key);
      });
      pin.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); pok.click(); }
      });
    }
    else if (field.type === 'contact') {
      var nameIn  = el.querySelector('input[data-name]');
      var emailIn = el.querySelector('input[data-email]');
      var ok2     = el.querySelector('.nd-btn-primary');
      var errEl   = el.querySelector('.nd-error');

      function valid() {
        var n = (nameIn.value || '').trim();
        var em = (emailIn.value || '').trim();
        var emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
        return n.length >= 2 && emOk;
      }
      function refresh() { ok2.disabled = !valid(); }
      nameIn.addEventListener('input', refresh);
      emailIn.addEventListener('input', refresh);

      ok2.addEventListener('click', function() {
        if (!valid()) return;
        state.answers[field.key] = {
          name: nameIn.value.trim(),
          email: emailIn.value.trim()
        };
        ok2.disabled = true;
        errEl.hidden = true;
        finalize().catch(function(err) {
          errEl.textContent = 'Greška pri slanju. Pokušaj ponovo.';
          errEl.hidden = false;
          ok2.disabled = false;
          console.error('[ND-Quiz] submit error:', err);
        });
      });
      emailIn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && valid()) { e.preventDefault(); ok2.click(); }
      });
    }
  }

  function submitChoice(field, idx) {
    var choice = field.choices[idx];
    state.answers[field.key] = {
      label: choice.label,
      value: choice.value || choice.label,
      score: choice.score || null,
      skipToEnd: !!choice.skipToEnd
    };
    // Update outcome scores za Q1-Q6
    if (choice.score && state.scores[choice.score] != null) {
      state.scores[choice.score] += 1;
    }
    advance(field.key);
  }

  function advance(currentKey) {
    var nextKey = getNextKey(currentKey);
    if (nextKey === 'END') {
      // ovo se dešava samo nakon Q18
      return;
    }
    goToKey(nextKey);
  }

  // ====================================================================
  // STEP TRANSITIONS
  // ====================================================================
  var activeKey = '__welcome';

  function showStepEl(el) {
    el.classList.add('nd-active');
  }

  function goToKey(key) {
    var prevEl = stepEls[activeKey];
    var nextEl = stepEls[key];
    if (!nextEl) { console.warn('[ND-Quiz] unknown step key:', key); return; }

    if (prevEl && prevEl !== nextEl) {
      prevEl.classList.add('nd-leaving');
      prevEl.classList.remove('nd-active');
      // čisti leaving klasu nakon tranzicije
      setTimeout(function() { prevEl.classList.remove('nd-leaving'); }, 600);
    }

    activeKey = key;
    state.visitedKeys.push(key);
    nextEl.classList.add('nd-active');

    // Focus prvi interaktivni element
    setTimeout(function() {
      var input = nextEl.querySelector('input');
      if (input) input.focus();
    }, 200);

    updateProgress();
    updateCurrentIdx(key);
  }

  function updateCurrentIdx(key) {
    state.currentIdx = FORM.fields.findIndex(function(f) { return f.key === key; });
  }

  function updateProgress() {
    // Dinamičko računanje na osnovu predviđene putanje (1:1 Typeform behavior)
    var idx = state.currentIdx;
    if (idx < 0) {
      progressFill.style.width = '0%';
      progressFill.style.minWidth = '0';
      return;
    }
    var stepNumber = getStepNumberInPath();
    var totalSteps = predictTotalSteps();
    var pct = Math.min(100, Math.round((stepNumber / totalSteps) * 100));
    // Ostavi gap od 8px između fill i track
    progressFill.style.width = 'calc(' + pct + '% - 4px)';
    progressFill.style.minWidth = pct > 0 ? '8px' : '0';
  }

  // ====================================================================
  // KEYBOARD NAV
  // ====================================================================
  document.addEventListener('keydown', function(e) {
    var activeEl = stepEls[activeKey];
    if (!activeEl) return;

    var key = activeKey;
    var field = FORM.fields.find(function(f) { return f.key === key; });

    // A/B/C/D shortcut za choice
    if (field && field.type === 'choice' && /^[a-zA-Z]$/.test(e.key)) {
      var letter = e.key.toUpperCase().charCodeAt(0) - 65;
      var choices = activeEl.querySelectorAll('.nd-choice');
      if (letter >= 0 && letter < choices.length) {
        e.preventDefault();
        choices[letter].click();
        return;
      }
    }

    // Enter na choice (ako je izabrano) -> OK
    if (field && field.type === 'choice' && e.key === 'Enter') {
      var sel = activeEl.querySelector('.nd-choice.nd-selected');
      if (sel) {
        e.preventDefault();
        activeEl.querySelector('.nd-btn-primary').click();
      }
    }

    // Enter na scale (ako je izabran broj) -> OK
    if (field && field.type === 'scale' && e.key === 'Enter') {
      var ssel = activeEl.querySelector('.nd-scale-btn.nd-selected');
      if (ssel) {
        e.preventDefault();
        activeEl.querySelector('.nd-btn-primary').click();
      }
      // brojčani shortcut 0-9 (10 = e + 0)
    }
    if (field && field.type === 'scale' && /^[0-9]$/.test(e.key)) {
      var v = parseInt(e.key, 10);
      var b = activeEl.querySelector('.nd-scale-btn[data-val="' + v + '"]');
      if (b) { e.preventDefault(); b.click(); }
    }

    // Enter na welcome -> kreni
    if (key === '__welcome' && e.key === 'Enter') {
      e.preventDefault();
      activeEl.querySelector('[data-welcome-start]').click();
    }
  });

  // ====================================================================
  // PARTIAL EXIT TRACKING (sendBeacon)
  // ====================================================================
  function buildPayload(opts) {
    opts = opts || {};
    var winner = computeWinningOutcome();
    var lq = computeLeadQuality(getFlatAnswers());

    // Kontakt podaci ako su uneti
    var contact = state.answers.q18_kontakt || {};
    var instagram = state.answers.q16_instagram || '';
    var phone = state.answers.q17_phone || '';

    return {
      submitted_at: new Date().toISOString(),
      started_at: state.startedAt,
      form_id: ND_CONFIG.formId,
      session_id: state.sessionId,

      outcome: {
        id: winner,
        title: FORM.outcomes[winner].title,
        redirect_url: FORM.outcomes[winner].redirect
      },
      scores: state.scores,

      lead_quality: lq.quality,
      lead_quality_reason: lq.reason,

      completed_full_quiz: !!opts.complete,
      exited_early: !!opts.exitedEarly,
      visited_count: state.visitedKeys.length,

      contact: {
        name: contact.name || '',
        email: contact.email || '',
        phone: phone,
        instagram: instagram
      },

      answers: getFlatAnswers(),

      utm: utmData,
      page_url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent
    };
  }

  function getFlatAnswers() {
    var out = {};
    Object.keys(state.answers).forEach(function(k) {
      var v = state.answers[k];
      if (v && typeof v === 'object' && 'label' in v) {
        out[k] = v.label;
      } else {
        out[k] = v;
      }
    });
    return out;
  }

  function sendBeaconJson(url, payload) {
    if (!url || url.indexOf('REPLACE') !== -1) return false; // nije konfigurisano
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      return navigator.sendBeacon(url, blob);
    } catch(e) { return false; }
  }

  function sendFetch(url, payload, timeoutMs) {
    if (!url || url.indexOf('REPLACE') !== -1) return Promise.reject(new Error('Webhook URL not configured'));
    var ctrl = new AbortController();
    var t = setTimeout(function(){ ctrl.abort(); }, timeoutMs || 8000);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      keepalive: true
    }).finally(function(){ clearTimeout(t); });
  }

  // Partial response slanje pri napuštanju (visibilitychange + beforeunload)
  function maybeSendPartial() {
    if (!ND_CONFIG.sendOnExit) return;
    if (state.submitted) return;
    if (state.visitedKeys.length === 0) return;
    state.exitedEarly = true;
    var payload = buildPayload({ complete: false, exitedEarly: true });
    sendBeaconJson(ND_CONFIG.webhookUrl, payload);
  }

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') maybeSendPartial();
  });
  window.addEventListener('pagehide', maybeSendPartial);

  // ====================================================================
  // FINAL SUBMIT
  // ====================================================================
  function finalize() {
    state.submitted = true;
    fbqEvent('Lead', { content_name: 'Quiz Completed' });

    // Prikaži loading screen
    var prev = stepEls[activeKey];
    if (prev) { prev.classList.add('nd-leaving'); prev.classList.remove('nd-active'); }
    activeKey = '__loading';
    stepEls.__loading.classList.add('nd-active');
    progressFill.style.width = '100%';

    var payload = buildPayload({ complete: true, exitedEarly: false });

    return sendFetch(ND_CONFIG.webhookUrl, payload, ND_CONFIG.submitTimeoutMs)
      .catch(function(err) {
        // Ako fetch ne uspe, beacon kao backup
        sendBeaconJson(ND_CONFIG.webhookUrl, payload);
        // Ne bacamo grešku korisniku — i dalje ga redirektujemo (lead je već zabeležen ili će se zabeležiti)
        console.warn('[ND-Quiz] webhook fetch failed, beacon attempted:', err);
      })
      .then(function() {
        if (ND_CONFIG.redirectAfterSubmit) {
          var url = payload.outcome.redirect_url;
          // Prosleđujemo session i outcome u URL-u (za rezultat stranicu)
          var sep = url.indexOf('?') === -1 ? '?' : '&';
          var extra = 'sid=' + encodeURIComponent(state.sessionId) +
                      '&lq=' + encodeURIComponent(payload.lead_quality);
          setTimeout(function() {
            window.location.href = url + sep + extra;
          }, 600);
        }
      });
  }

  // ====================================================================
  // INIT
  // ====================================================================
  function init() {
    initFbPixel();
    mountAllSteps();
    updateProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
