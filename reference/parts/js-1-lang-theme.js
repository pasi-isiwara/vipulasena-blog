<script>
/* ===== Language (English / Sinhala) and dark mode ===== */
(function(){
  var root=document.documentElement;

  var SI={
    skip:'අන්තර්ගතයට යන්න',
    name:'විපුලසේන පතිරාජගේ',
    navHome:'මුල් පිටුව',
    navEdu:'අධ්‍යාපනය',
    navAcad:'ශාස්ත්‍රීය ලිපි',
    navKids:'ළමා පොත්',
    navMedia:'මාධ්‍ය',
    role:'හිටපු විද්‍යා අධ්‍යාපන අධ්‍යක්ෂ<br>අධ්‍යාපන අමාත්‍යාංශය, ශ්‍රී ලංකාව',
    bio1:'මම කැලණිය විශ්වවිද්‍යාලයෙන් මගේ ප්‍රථම උපාධිය සම්පූර්ණ කළ අතර, ඉන් ඉක්බිතිව ශ්‍රී ලංකා අධ්‍යාපන පරිපාලන සේවයට බැඳුණෙමි. මගේ පළමු පත්වීම ජාතික පාසලක විදුහල්පති ලෙසය. ඉන්පසු උතුරු මැද පළාතේ විද්‍යා අධ්‍යාපනය සඳහා සහකාර අධ්‍යක්ෂ ලෙස පත් කරනු ලැබූ මම, 1999 දී කැකිරාව කලාප අධ්‍යාපන අධ්‍යක්ෂ ලෙස පත් වීමි. පසුව විභාග දෙපාර්තමේන්තුවේ නියෝජ්‍ය විභාග කොමසාරිස් ලෙස සේවය කළ අතර, 2004 දී අධ්‍යාපන ගුණාත්මකභාව තහවුරු කිරීමේ අධ්‍යක්ෂ ලෙස පත් කරනු ලැබීමි. මගේ අවසාන පත්වීම විද්‍යා අධ්‍යාපන අධ්‍යක්ෂ ලෙසය.',
    bio2:'අධ්‍යාපන ක්ෂේත්‍රයේ බොහෝ අංශවල සේවය කළ අත්දැකීම් ඇසුරින්, විෂයමාලා, සංවර්ධන වැඩසටහන් සහ පෙළපොත් ඇතුළුව ශ්‍රී ලංකාවේ විද්‍යා අධ්‍යාපනයට සැලකිය යුතු දායකත්වයක් ලබා දීමට මට හැකි විය. එසේම දිවයින පුරා ගුරු අධ්‍යාපන වැඩමුළු රැසක් පැවැත්වීමි. විශ්‍රාම ගිය පසු, මගේ මෙම අත්දැකීම් මහජනතාව සමඟ බෙදා ගැනීම වටිනා බව මට හැඟුණි. ඒ සඳහා මා බලාපොරොත්තු වන්නේ මෙම බ්ලොග් අඩවිය හරහාය.',
    explore:'එකතු ගවේෂණය කරන්න',
    howCite:'මෙම කෘති උපුටා දක්වන ආකාරය',
    colIntro:'මෙම බ්ලොග් අඩවියේ සියලු අන්තර්ගතය එකතු හතරකට වර්ග කර ඇත. කියවීම ආරම්භ කිරීමට එකක් තෝරන්න.',
    eduDesc:'විද්‍යා අධ්‍යාපනය පිළිබඳ ප්‍රකාශන: ගුරුවරුන්, සිසුන් සහ විෂයමාලා සංවර්ධකයින් සඳහා ලිපි, ඉගැන්වීම් සම්පත් සහ ලේඛන.',
    eduMore:'ප්‍රකාශන බලන්න',
    acadDesc:'ඉගැන්වීම සහ ඉගෙනීම පිළිබඳ ශාස්ත්‍රීය ලේඛන, පර්යේෂණ සටහන් සහ විවරණ.',
    acadMore:'ශාස්ත්‍රීය ලිපි කියවන්න',
    kidsDesc:'නිවසේදී සහ පන්තිකාමරයේදී රස විඳීමට, කුඩා පාඨකයින් සඳහා ලියූ පොත් සහ කතා.',
    kidsMore:'පොත් බලන්න',
    mediaDesc:'අද මගේ ජීවිතයේ ඡායාරූප: මා කරන නව දේවල් සහ විවේක කාලයේ මා රස විඳින ක්‍රියාකාරකම්.',
    mediaMore:'ඡායාරූප සහ මාධ්‍ය බලන්න',
    freeTitle:'නොමිලේ භාවිත කරන්න, මූලාශ්‍රය සඳහන් කරන්න',
    freeText:'ලිපි, ප්‍රකාශන, පොත් සහ ඡායාරූප ඇතුළු මෙම බ්ලොග් අඩවියේ සියලු අන්තර්ගතය ඉගැන්වීම, අධ්‍යයනය සහ පර්යේෂණ සඳහා ඔබට නොමිලේ භාවිත කළ හැකිය. ඔබ එය භාවිත කරන විට, කරුණාකර මෙම බ්ලොග් අඩවිය මූලාශ්‍රය ලෙස සඳහන් කරන්න.',
    citeLabel:'යෝජිත උපුටා දැක්වීම',
    citeText:'පතිරාජගේ, වි. (වර්ෂය). <em>ලිපියේ හෝ ප්‍රකාශනයේ මාතෘකාව</em>. විපුලසේන පතිරාජගේ [බ්ලොග්]. පිටුවේ සබැඳිය.',
    citeHint:'ඔබ භාවිත කරන පිටුවේ වර්ෂය, මාතෘකාව සහ සබැඳිය මෙහි යොදන්න.',
    footerSub:'BSc, PGDE, MA. හිටපු විද්‍යා අධ්‍යාපන අධ්‍යක්ෂ, අධ්‍යාපන අමාත්‍යාංශය, ශ්‍රී ලංකාව',
    legal:'© 2026 විපුලසේන පතිරාජගේ. මූලාශ්‍රය සඳහන් කර නොමිලේ භාවිත කළ හැකිය.',
    navAsk:'ප්‍රශ්නයක් අසන්න',
    chipArticles:'ලිපි',
    chipTeaching:'ඉගැන්වීම් සම්පත්',
    chipCurriculum:'විෂයමාලා',
    chipResearch:'පර්යේෂණ සටහන්',
    chipCommentary:'විවරණ',
    chipStories:'කතා',
    chipYoung:'කුඩා පාඨකයින්',
    chipRecent:'මෑත දින',
    chipNew:'නව දේවල්',
    chipLeisure:'විවේකය',
    askTitle:'ප්‍රශ්නයක් අසන්න',
    askText:'මෙහි කියවූ දෙයක් ගැන සැකයක් තිබේද, නැතහොත් විද්‍යා අධ්‍යාපන මාතෘකාවක් පිළිබඳ පැහැදිලි කිරීමක් අවශ්‍යද? ඔබගේ ප්‍රශ්නය මා වෙත එවන්න. එය ලැබෙන්නේ මට පමණක් වන අතර, මම ඔබට කෙලින්ම පිළිතුරු දෙන්නෙමි.',
    askDirect:'නැතහොත් මා හා කෙලින්ම සම්බන්ධ වන්න:',
    fName:'ඔබගේ නම',
    fContact:'විද්‍යුත් තැපෑල හෝ දුරකථන අංකය (පිළිතුරු දීමට)',
    fQuestion:'ඔබගේ ප්‍රශ්නය',
    fAsk:'ප්‍රශ්නය යවන්න',
    backHome:'මුල් පිටුවට ආපසු'
  };
  var SI_ARIA={
    navMain:'ප්‍රධාන මෙනුව',
    navFooter:'පාදක මෙනුව',
    quals:'සුදුසුකම්',
    lang:'භාෂාව',
    scrollCue:'එකතු වෙත පහළට යන්න',
    contact:'සම්බන්ධ වන්න'
  };
  var SI_ALT={
    portrait:'උද්‍යානයක සිටින විපුලසේන පතිරාජගේ මහතාගේ ඡායාරූපය'
  };
  var TITLE={
    en:document.title,
    si:'විපුලසේන පතිරාජගේ | විද්‍යා අධ්‍යාපනය, ලේඛන සහ සම්පත්'
  };

  function all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel));}
  var textNodes=all('[data-i18n]');
  var ariaNodes=all('[data-i18n-aria]');
  var altNodes=all('[data-i18n-alt]');
  textNodes.forEach(function(n){n.setAttribute('data-en',n.innerHTML);});
  ariaNodes.forEach(function(n){n.setAttribute('data-en-aria',n.getAttribute('aria-label'));});
  altNodes.forEach(function(n){n.setAttribute('data-en-alt',n.getAttribute('alt'));});

  var langButtons=all('.lang button');
  var themeBtn=document.querySelector('.theme-toggle');
  var darkQuery=window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme(){
    var t=root.getAttribute('data-theme');
    if(t==='dark'||t==='light')return t;
    return darkQuery.matches?'dark':'light';
  }
  function updateThemeButton(){
    var dark=currentTheme()==='dark';
    var si=root.lang==='si';
    var label=dark
      ?(si?'ආලෝක ප්‍රකාරයට මාරු වන්න':'Switch to light mode')
      :(si?'අඳුරු ප්‍රකාරයට මාරු වන්න':'Switch to dark mode');
    themeBtn.classList.toggle('is-dark',dark);
    themeBtn.setAttribute('aria-label',label);
    themeBtn.setAttribute('title',label);
  }
  function setLang(lang,save){
    var si=lang==='si';
    textNodes.forEach(function(n){var k=n.getAttribute('data-i18n');n.innerHTML=(si&&SI[k])?SI[k]:n.getAttribute('data-en');});
    ariaNodes.forEach(function(n){var k=n.getAttribute('data-i18n-aria');n.setAttribute('aria-label',(si&&SI_ARIA[k])?SI_ARIA[k]:n.getAttribute('data-en-aria'));});
    altNodes.forEach(function(n){var k=n.getAttribute('data-i18n-alt');n.setAttribute('alt',(si&&SI_ALT[k])?SI_ALT[k]:n.getAttribute('data-en-alt'));});
    root.lang=si?'si':'en';
    document.title=si?TITLE.si:TITLE.en;
    langButtons.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===lang));});
    updateThemeButton();
    document.dispatchEvent(new CustomEvent('vp:lang'));
    if(save){try{localStorage.setItem('vp-lang',lang);}catch(e){}}
  }

  langButtons.forEach(function(b){
    b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'),true);});
  });
  themeBtn.addEventListener('click',function(){
    var next=currentTheme()==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('vp-theme',next);}catch(e){}
    updateThemeButton();
  });
  if(darkQuery.addEventListener)darkQuery.addEventListener('change',updateThemeButton);

  setLang(root.lang==='si'?'si':'en',false);
})();
</script>
