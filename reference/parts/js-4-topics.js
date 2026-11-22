<script>
/* ===== Topic pages: Education, Academic posts and Children's books =====
   Each page lists its articles from TOPICS below. To add a real article,
   replace a sample entry: en / si hold [title, short description], and doc
   holds the link to the document (leave it empty until the document is ready). */
(function(){
  var root=document.documentElement;
  var ARROW='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var TOPICS={
    education:{
      view:'education',title:{en:'Education',si:'අධ්‍යාපනය'},
      type:{en:'Article',si:'ලිපිය'},noun:{en:['article','articles'],si:'ලිපි'},
      search:{en:'Search in Education',si:'අධ්‍යාපනය තුළ සොයන්න'},
      items:[
        {doc:'',en:['Inquiry-based learning in the science classroom','How questions, not answers, can lead students to understand science more deeply.'],si:['විද්‍යා පන්තිකාමරයේ විමර්ශන පාදක ඉගෙනීම','පිළිතුරු නොව ප්‍රශ්න, සිසුන් විද්‍යාව ගැඹුරින් අවබෝධ කර ගැනීමට මඟ පාදන ආකාරය.']},
        {doc:'',en:['Making practical work meaningful','Simple ways to turn school experiments into real learning experiences.'],si:['ප්‍රායෝගික ක්‍රියාකාරකම් අර්ථවත් කිරීම','පාසල් පරීක්ෂණ සැබෑ ඉගෙනුම් අත්දැකීම් බවට පත් කිරීමට සරල ක්‍රම.']},
        {doc:'',en:['Assessing scientific thinking, not just recall','Ideas for questions that show how students reason, not only what they remember.'],si:['මතකය පමණක් නොව විද්‍යාත්මක චින්තනය ඇගයීම','සිසුන් මතක තබා ගන්නා දේ පමණක් නොව, ඔවුන් තර්ක කරන ආකාරය පෙන්වන ප්‍රශ්න සඳහා අදහස්.']},
        {doc:'',en:['Teaching chemistry with everyday materials','Low-cost activities using things found at home and in the market.'],si:['එදිනෙදා ද්‍රව්‍ය භාවිතයෙන් රසායන විද්‍යාව ඉගැන්වීම','නිවසේ සහ වෙළඳපොළේ ඇති දේ භාවිත කරන අඩු වියදම් ක්‍රියාකාරකම්.']},
        {doc:'',en:['Supporting new science teachers','Guidance for the first years in the classroom.'],si:['නව විද්‍යා ගුරුවරුන්ට සහාය වීම','පන්තිකාමරයේ මුල් වසර සඳහා මඟපෙන්වීම.']},
        {doc:'',en:['From syllabus to lesson plan','A step-by-step approach to planning a complete science unit.'],si:['විෂය නිර්දේශයේ සිට පාඩම් සැලැස්ම දක්වා','සම්පූර්ණ විද්‍යා ඒකකයක් සැලසුම් කිරීමට පියවරෙන් පියවර ප්‍රවේශයක්.']}
      ]
    },
    academic:{
      view:'academic-posts',title:{en:'Academic posts',si:'ශාස්ත්‍රීය ලිපි'},
      type:{en:'Academic post',si:'ශාස්ත්‍රීය ලිපිය'},noun:{en:['post','posts'],si:'ලිපි'},
      search:{en:'Search in Academic posts',si:'ශාස්ත්‍රීය ලිපි තුළ සොයන්න'},
      items:[
        {doc:'',en:['Notes on science curriculum reform','Reflections on how curricula change, and what helps the change reach classrooms.'],si:['විද්‍යා විෂයමාලා ප්‍රතිසංස්කරණ පිළිබඳ සටහන්','විෂයමාලා වෙනස් වන ආකාරය සහ එම වෙනස පන්තිකාමරයට ළඟා වීමට උපකාරී වන දේ පිළිබඳ ආවර්ජන.']},
        {doc:'',en:['What examination results can tell us','Reading national results to understand learning, not only to rank schools.'],si:['විභාග ප්‍රතිඵල අපට පවසන දේ','පාසල් ශ්‍රේණිගත කිරීමට පමණක් නොව, ඉගෙනීම තේරුම් ගැනීමට ජාතික ප්‍රතිඵල කියවීම.']},
        {doc:'',en:['Quality assurance in schools','Lessons from the field on supporting schools to improve.'],si:['පාසල්වල ගුණාත්මකභාවය තහවුරු කිරීම','පාසල් දියුණු කිරීමට සහාය වීම පිළිබඳ ක්ෂේත්‍රයෙන් ලත් පාඩම්.']},
        {doc:'',en:['Teacher development as a lifelong process','Why professional growth works best when it continues throughout a career.'],si:['ජීවිත කාලය පුරා ගුරු සංවර්ධනය','වෘත්තීය වර්ධනය සේවා කාලය පුරා අඛණ්ඩව පවතින විට වඩාත් සාර්ථක වන්නේ ඇයි.']},
        {doc:'',en:['Reading research: a guide for teachers','How busy teachers can find, read and use educational research.'],si:['පර්යේෂණ කියවීම: ගුරුවරුන් සඳහා මඟපෙන්වීමක්','කාර්යබහුල ගුරුවරුන්ට අධ්‍යාපන පර්යේෂණ සොයා, කියවා, භාවිත කළ හැකි ආකාරය.']},
        {doc:'',en:['Language and understanding in science','The role of everyday and scientific language in how students learn.'],si:['විද්‍යාවේ භාෂාව සහ අවබෝධය','සිසුන් ඉගෙන ගන්නා ආකාරයට එදිනෙදා සහ විද්‍යාත්මක භාෂාවේ බලපෑම.']}
      ]
    },
    kids:{
      view:'childrens-books',title:{en:'Children’s books',si:'ළමා පොත්'},
      type:{en:'Story book',si:'කතා පොත'},noun:{en:['book','books'],si:'පොත්'},
      search:{en:'Search in Children’s books',si:'ළමා පොත් තුළ සොයන්න'},
      items:[
        {doc:'',en:['The little seed that wanted to see the sky','A gentle story about how plants grow, for readers aged 5 to 8.'],si:['අහස දකින්නට ආශා කළ පුංචි බීජය','ශාක වැඩෙන ආකාරය ගැන මෘදු කතාවක්, වයස 5 සිට 8 දක්වා පාඨකයින් සඳහා.']},
        {doc:'',en:['Why does the moon change its shape?','A bedtime story that explains the phases of the moon.'],si:['හඳ හැඩය වෙනස් කරන්නේ ඇයි?','සඳෙහි කලා පැහැදිලි කරන නින්දට පෙර කතාවක්.']},
        {doc:'',en:['Raindrop’s long journey','Follow a single raindrop all the way around the water cycle.'],si:['වැහි බිංදුවේ දිගු ගමන','ජල චක්‍රය වටා එක් වැහි බිංදුවක් අනුගමනය කරන්න.']},
        {doc:'',en:['A day with the busy bees','Discover how bees help flowers, fruit and farmers.'],si:['කාර්යබහුල මී මැස්සන් සමඟ දවසක්','මී මැස්සන් මල්, පලතුරු සහ ගොවීන්ට උපකාර කරන ආකාරය සොයා ගන්න.']},
        {doc:'',en:['The star counter','A curious child tries to count the stars and learns about the night sky.'],si:['තරු ගණන් කරන්නා','තරු ගණන් කිරීමට තැත් කරන කුතුහලයෙන් පිරුණු දරුවෙක් රාත්‍රී අහස ගැන ඉගෙන ගනී.']},
        {doc:'',en:['Where does the river go?','A journey from the mountains all the way to the sea.'],si:['ගඟ ගලා යන්නේ කොහේද?','කඳුකරයේ සිට මුහුද දක්වා ගමනක්.']}
      ]
    }
  };

  /* Small line drawings used as preview images until real images are added */
  var MOTIFS={
    education:[
      '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
      '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 15h9"/>',
      '<path d="M3 20h18M3 20V4M5 15c2-6 4-6 6 0s4 6 6 0 2-4 3-4"/>',
      '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>',
      '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15zM5 19l9-9"/>',
      '<path d="M5 3h4v8a3 3 0 0 0 6 0V3h4v8a7 7 0 0 1-14 0zM5 7h4M15 7h4"/>'
    ],
    academic:[
      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4"/>',
      '<path d="M4 20h16M7 20v-6M11 20V9M15 20v-9M19 20V5"/>',
      '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
      '<path d="M20 3C12 4 7 9 5 20M20 3c-1 6-5 10-11 11M5 20l-1.5 1.5"/>',
      '<path d="M12 7C10.3 5.7 7.8 5 4 5v13c3.8 0 6.3.7 8 2 1.7-1.3 4.2-2 8-2V5c-3.8 0-6.3.7-8 2zM12 7v13"/>',
      '<path d="M5 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6"/>'
    ],
    kids:[
      '<path d="M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-4 3-6 7-6 0 4-3 6-7 6zM6 21h12"/>',
      '<path d="M15 4a7 7 0 1 0 5 11 6 6 0 0 1-5-11zM6 4l.8 1.7 1.7.8-1.7.8L6 9l-.8-1.7-1.7-.8 1.7-.8z"/>',
      '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11zM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
      '<ellipse cx="12" cy="14" rx="6" ry="4.5"/><path d="M10 9.7v8.6M14 9.7v8.6M9.5 10C8 6 4.5 6.5 5 8.5s3.5 2.5 4.5 1.5M14.5 10C16 6 19.5 6.5 19 8.5s-3.5 2.5-4.5 1.5"/>',
      '<path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5zM18 14l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9zM6 15l.7 1.5 1.5.7-1.5.7L6 19.4l-.7-1.5-1.5-.7 1.5-.7z"/>',
      '<path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>'
    ]
  };
  var DECO={
    education:'<path class="th-grid" d="M0 15h120M0 30h120M0 45h120M0 60h120M0 75h120M15 0v90M30 0v90M45 0v90M60 0v90M75 0v90M90 0v90M105 0v90"/><circle class="th-deco" cx="60" cy="45" r="34"/>',
    academic:'<path class="th-rule" d="M0 18h120M0 30h120M0 42h120M0 54h120M0 66h120M0 78h120"/><path class="th-margin" d="M16 0v90"/>',
    kids:'<circle class="th-dot" cx="18" cy="16" r="3"/><circle class="th-dot" cx="104" cy="74" r="4"/><circle class="th-dot" cx="100" cy="16" r="2"/><circle class="th-dot" cx="14" cy="72" r="2.5"/>'
  };
  var UI={
    en:{none:'No articles have been added here yet.',empty:'No articles match your search.',soon:'This document will be available soon.',sample:'These are sample entries showing the layout. Your own articles will replace them.',site:'Vipulasena Pathirajage',home:'Vipulasena Pathirajage | Science education, writing and resources'},
    si:{none:'මෙහි තවම ලිපි එක් කර නැත.',empty:'ඔබගේ සෙවීමට ගැළපෙන ලිපි නැත.',soon:'මෙම ලේඛනය ළඟදීම ලබා ගත හැකි වේ.',sample:'මේවා පිරිසැලසුම පෙන්වීමට යොදා ඇති නියැදි ඇතුළත් කිරීම් වේ. ඔබගේ සැබෑ ලිපි මේවා වෙනුවට යොදනු ඇත.',site:'විපුලසේන පතිරාජගේ',home:'විපුලසේන පතිරාජගේ | විද්‍යා අධ්‍යාපනය, ලේඛන සහ සම්පත්'}
  };
  function lang(){return root.lang==='si'?'si':'en';}
  function thumb(key,i){
    var bg=key==='kids'?'th-bg th-k'+(i%4+1):'th-bg';
    return '<svg viewBox="0 0 120 90" aria-hidden="true" focusable="false"><rect class="'+bg+'" width="120" height="90"/>'+DECO[key]+'<g class="th-ln" transform="translate(36 21) scale(2)">'+MOTIFS[key][i%MOTIFS[key].length]+'</g></svg>';
  }

  /* Live content from the site's database (managed from the admin page).
     Where the database isn't available, the sample entries above are shown. */
  var live={education:null,academic:null,kids:null};
  function isAssetId(x){return typeof x==='string'&&/^[0-9a-f]{32}$/.test(x);}
  function safeLink(u){u=typeof u==='string'?u.trim():'';return /^https?:\/\//i.test(u)?u:'';}
  function toItem(v){
    var en=[(v.en&&v.en.title)||'',(v.en&&v.en.desc)||''];
    var si=[(v.si&&v.si.title)||en[0],(v.si&&v.si.desc)||en[1]];
    return {en:en,si:si,doc:isAssetId(v.docAsset)?'/_blob/'+v.docAsset:safeLink(v.docLink),image:isAssetId(v.image)?'/_blob/'+v.image:'',sample:!!v.sample};
  }
  function itemsOf(key){return live[key]||TOPICS[key].items;}
  if(window.claude&&typeof window.claude.use==='function'){
    window.claude.use('db').then(function(db){
      if(!db)return;
      db.collection('articles').onSnapshot(function(snap){
        if(snap.empty&&snap.metadata.fromCache)return;
        var next={education:[],academic:[],kids:[]};
        snap.docs.slice().sort(function(a,b){return ((a.data()||{}).order||0)-((b.data()||{}).order||0);}).forEach(function(d){
          var v=d.data()||{};
          if(!next[v.topic]||v.published===false||!(v.en&&v.en.title))return;
          next[v.topic].push(toItem(v));
        });
        live=next;
        Object.keys(state).forEach(render);
      },function(){});
    }).catch(function(){});
  }

  var toast=document.createElement('div');
  toast.className='toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);
  var toastTimer=null;
  function showToast(msg){
    toast.textContent=msg;toast.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){toast.classList.remove('show');},2600);
  }

  var state={};
  Object.keys(TOPICS).forEach(function(key){
    var view=document.querySelector('.topic-view[data-view="'+TOPICS[key].view+'"]');
    if(!view)return;
    var s=state[key]={list:view.querySelector('.article-list'),empty:view.querySelector('.list-empty'),count:view.querySelector('.topic-count'),input:view.querySelector('.search input'),note:view.querySelector('.sample-note'),query:''};
    s.input.addEventListener('input',function(){s.query=s.input.value.trim().toLowerCase();render(key);});
  });

  function render(key){
    var t=TOPICS[key],s=state[key];
    if(!s)return;
    var l=lang();
    s.input.placeholder=t.search[l];s.input.setAttribute('aria-label',t.search[l]);
    var items=itemsOf(key);
    s.note.textContent=UI[l].sample;
    s.note.hidden=!(live[key]===null||items.some(function(x){return x.sample;}));
    var n=items.length;
    s.count.textContent=l==='si'?t.noun.si+' '+n:n+' '+(n===1?t.noun.en[0]:t.noun.en[1]);
    s.list.textContent='';
    var shown=0;
    items.forEach(function(item,i){
      var txt=item[l]||item.en;
      if(s.query){
        var hay=(txt[0]+' '+txt[1]+' '+item.en[0]+' '+item.en[1]).toLowerCase();
        if(hay.indexOf(s.query)===-1)return;
      }
      shown++;
      var li=document.createElement('li');
      var a=document.createElement('a');a.className='article';
      if(item.doc){a.href=item.doc;a.target='_blank';a.rel='noopener';}
      else{a.href='#'+t.view;a.addEventListener('click',function(e){e.preventDefault();showToast(UI[lang()].soon);});}
      var th=document.createElement('span');th.className='article-thumb';if(item.image){var im=document.createElement('img');im.src=item.image;im.alt='';im.loading='lazy';th.appendChild(im);}else{th.innerHTML=thumb(key,i);}
      var body=document.createElement('span');body.className='article-body';
      var ty=document.createElement('span');ty.className='article-type';ty.textContent=t.type[l];
      var ti=document.createElement('span');ti.className='article-title';ti.textContent=txt[0];
      var de=document.createElement('span');de.className='article-desc';de.textContent=txt[1];
      body.appendChild(ty);body.appendChild(ti);body.appendChild(de);
      var go=document.createElement('span');go.className='go';go.setAttribute('aria-hidden','true');go.innerHTML=ARROW;
      a.appendChild(th);a.appendChild(body);a.appendChild(go);
      li.appendChild(a);s.list.appendChild(li);
    });
    s.empty.textContent=n===0?UI[l].none:UI[l].empty;
    s.empty.hidden=shown>0;
  }

  /* Simple page switching: #education, #academic-posts and #childrens-books
     show their page; every other address shows the home page. */
  var home=document.getElementById('home-view');
  var views=[].slice.call(document.querySelectorAll('.topic-view'));
  var navLinks=[].slice.call(document.querySelectorAll('.site-header .nav a'));
  var keyByView={};
  Object.keys(TOPICS).forEach(function(k){keyByView[TOPICS[k].view]=k;});
  var wasTopic=false;
  function setTitle(){
    var k=keyByView[location.hash.slice(1)],l=lang();
    document.title=k?TOPICS[k].title[l]+' | '+UI[l].site:UI[l].home;
  }
  function route(){
    var h=location.hash.slice(1);
    var key=keyByView[h];
    var isMedia=h==='media'||h.indexOf('album-')===0;
    var isAdmin=h==='admin';
    var page=key?h:(isMedia?'media':(isAdmin?'admin':''));
    root.classList.toggle('is-admin',isAdmin);
    if(home)home.hidden=!!page;
    views.forEach(function(v){v.hidden=v.getAttribute('data-view')!==page;});
    navLinks.forEach(function(a){
      var target=(a.getAttribute('href')||'').slice(1);
      var current=page?target===page:target==='top';
      if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    setTitle();
    if(page){window.scrollTo(0,0);}
    else if(wasTopic){
      var el=h&&h!=='top'?document.getElementById(h):null;
      if(el)el.scrollIntoView();else window.scrollTo(0,0);
    }
    wasTopic=!!page;
    document.dispatchEvent(new CustomEvent('vp:route'));
  }
  document.addEventListener('vp:lang',function(){Object.keys(state).forEach(render);setTitle();});
  window.addEventListener('hashchange',route);
  Object.keys(state).forEach(render);
  route();
})();
</script>
