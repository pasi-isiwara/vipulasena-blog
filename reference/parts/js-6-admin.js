<script>
/* ===== Admin: manage articles, albums, photos and questions =====
   Open the site address ending in #admin. Only the site owner and editors
   can use it; everything saves straight to the site's database, so the
   public pages update immediately. */
(function(){
  var view=document.querySelector('.topic-view[data-view="admin"]');
  if(!view)return;
  var gate=view.querySelector('.admin-gate'),gateMsg=view.querySelector('.admin-gate-msg');
  var body=view.querySelector('.admin-body'),main=view.querySelector('.admin-content');
  var navBtns=[].slice.call(view.querySelectorAll('.admin-nav button'));
  var badge=view.querySelector('.adm-badge');
  var adminLink=document.querySelector('.admin-link');
  var TOPICS={education:'Education',academic:'Academic posts',kids:'Children\u2019s books'};
  var PAGE={education:'education',academic:'academic-posts',kids:'childrens-books'};
  var db=null,assets=null,isOwner=false,started=false,ready=false;
  var data={articles:[],albums:[],photos:[],questions:[],people:0,visits:0};
  var tab='overview',openAlbum=null;

  var IC={
    up:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    down:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    left:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    doc:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5"/></svg>',
    photo:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>',
    close:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function now(){return new Date().toISOString();}
  function isId(x){return typeof x==='string'&&/^[0-9a-f]{32}$/.test(x);}
  function blob(id){return isId(id)?'/_blob/'+id:'';}
  function safeLink(u){u=typeof u==='string'?u.trim():'';return /^https?:\/\//i.test(u)?u:'';}
  function portraitSrc(){var img=document.querySelector('.portrait-photo img');return img?img.src:'';}
  function photoSrc(p){return p.src==='PORTRAIT'?portraitSrc():blob(p.asset);}
  function byOrder(a,b){return (a.order||0)-(b.order||0);}
  function rows(snap){return snap.docs.map(function(d){var v=Object.assign({},d.data()||{});v.id=d.id;return v;});}
  function find(list,id){for(var i=0;i<list.length;i++){if(list[i].id===id)return list[i];}return null;}
  function nextOrder(list){var m=0;list.forEach(function(x){if(typeof x.order==='number'&&x.order>m)m=x.order;});return m+1;}
  function plural(n,one,many){return n+' '+(n===1?one:many);}
  function fmtDate(at){try{return new Date(at).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'});}catch(e){return '';}}
  function articlesOf(k){return data.articles.filter(function(a){return a.topic===k;}).sort(byOrder);}
  function photosIn(id){return data.photos.filter(function(p){return p.album===id;}).sort(byOrder);}
  function openQuestions(){return data.questions.filter(function(q){return !q.answered;}).length;}

  /* Status messages */
  var status=document.createElement('div');
  status.className='adm-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  document.body.appendChild(status);
  var statusTimer=null;
  function say(msg,kind,stay){
    status.textContent=msg;status.className='adm-status show'+(kind?' '+kind:'');
    clearTimeout(statusTimer);
    if(!stay)statusTimer=setTimeout(function(){status.className='adm-status';},3200);
  }
  function errMsg(e){
    var c=e&&e.code;
    if(c==='invalid_argument'||c==='not_granted')return 'You don\u2019t have permission to change this.';
    if(c==='quota_exceeded')return 'The website\u2019s storage is full. Remove some old photos or files first.';
    if(c==='too_large')return 'That file is too large. Files can be up to 20 MB.';
    if(c==='unsupported_type')return 'That type of file can\u2019t be uploaded.';
    if(e&&e.message&&!c)return e.message;
    return 'Something went wrong. Please try again.';
  }
  function fail(e){say(errMsg(e),'err');}
  function busy(p,msg){say('Saving\u2026','',true);return p.then(function(){say(msg,'ok');},fail);}

  /* Uploads */
  function upload(b,type){
    if(!assets)return Promise.reject(new Error('Uploading files needs editor access to this page.'));
    return assets.upload(b,type?{type:type}:undefined).then(function(r){return r.id;});
  }
  function prepareImage(file,max){
    if(!/^image\//.test(file.type))return Promise.reject(new Error('Please choose an image file.'));
    if(file.type==='image/svg+xml'||typeof createImageBitmap!=='function')return Promise.resolve({blob:file,ratio:4/3});
    return createImageBitmap(file).then(function(bmp){
      var w=bmp.width,h=bmp.height,ratio=w/h;
      if(Math.max(w,h)<=max&&file.size<1500000){if(bmp.close)bmp.close();return {blob:file,ratio:ratio};}
      var k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');
      c.width=Math.round(w*k);c.height=Math.round(h*k);
      c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
      if(bmp.close)bmp.close();
      return new Promise(function(res){c.toBlob(function(b){res({blob:b||file,ratio:ratio});},'image/jpeg',0.86);});
    }).catch(function(){return {blob:file,ratio:4/3};});
  }

  /* Getting in */
  function showGate(msg){gate.hidden=false;body.hidden=true;gateMsg.textContent=msg;}
  function start(){
    if(started)return;
    started=true;
    if(!window.claude||typeof window.claude.use!=='function'){showGate('The admin area works when this page is opened on claude.ai.');return;}
    showGate('Connecting\u2026');
    Promise.all([window.claude.use('db'),window.claude.use('user'),window.claude.use('assets')]).then(function(r){
      db=r[0];var user=r[1];assets=r[2];
      if(!db||!user){showGate('Please sign in to claude.ai to use the admin area.');return;}
      return Promise.all([user.canEdit(),user.isOwner()]).then(function(v){
        if(!v[0]){showGate('This area is only for the site owner. You can still browse the website.');return;}
        isOwner=!!v[1];ready=true;gate.hidden=true;body.hidden=false;
        subscribe();render();
      });
    }).catch(function(){showGate('The admin area couldn\u2019t connect. Please reload the page.');});
  }
  function subscribe(){
    db.collection('articles').onSnapshot(function(s){data.articles=rows(s).sort(byOrder);render();},function(){});
    db.collection('albums').onSnapshot(function(s){data.albums=rows(s).sort(byOrder);render();},function(){});
    db.collection('photos').onSnapshot(function(s){data.photos=rows(s).sort(byOrder);render();},function(){});
    db.collection('visitors').onSnapshot(function(s){
      var p=0,t=0;
      s.docs.forEach(function(d){var v=d.data()||{};p++;t+=(typeof v.visits==='number'&&v.visits>0)?Math.min(Math.floor(v.visits),100000):1;});
      data.people=p;data.visits=t;render();
    },function(){});
    if(isOwner){
      db.collection('questions').onSnapshot(function(s){
        var all=[];
        s.docs.forEach(function(d){
          var b=d.data()||{};
          (Array.isArray(b.entries)?b.entries:[]).forEach(function(en){
            if(en&&typeof en.text==='string'&&en.text){
              all.push({owner:d.id,at:String(en.at||''),name:typeof en.name==='string'?en.name:'',contact:typeof en.contact==='string'?en.contact:'',text:en.text,answered:!!en.answered});
            }
          });
        });
        all.sort(function(a,b){return (a.answered-b.answered)||b.at.localeCompare(a.at);});
        data.questions=all;render();
      },function(){});
    }
  }

  /* Panels */
  function head(title,text,actions,back){
    return '<header class="adm-head"><div>'+(back||'')+'<h1>'+esc(title)+'</h1>'+(text?'<p>'+esc(text)+'</p>':'')+'</div>'+(actions?'<div class="adm-head-actions">'+actions+'</div>':'')+'</header>';
  }
  function moveBtns(kind,id,i,n){
    return '<button type="button" class="adm-icon" data-act="move" data-kind="'+kind+'" data-dir="-1" data-id="'+esc(id)+'" aria-label="Move up"'+(i===0?' disabled':'')+'>'+IC.up+'</button>'+
           '<button type="button" class="adm-icon" data-act="move" data-kind="'+kind+'" data-dir="1" data-id="'+esc(id)+'" aria-label="Move down"'+(i===n-1?' disabled':'')+'>'+IC.down+'</button>';
  }
  function stat(n,label){return '<div class="adm-stat"><b>'+esc(n)+'</b><span>'+esc(label)+'</span></div>';}

  function overview(){
    var live=data.articles.filter(function(a){return a.published!==false;}).length;
    var h=head('Overview','Everything you change here appears on the website straight away.');
    h+='<div class="adm-stats">'+stat(data.people,'Visitors')+stat(data.visits,'Page visits')+stat(live,'Articles on the website')+stat(data.albums.length,'Albums')+stat(data.photos.length,'Photos')+(isOwner?stat(openQuestions(),'New questions'):'')+'</div>';
    h+='<h2 class="adm-h2">Manage the website</h2><div class="adm-cards">';
    Object.keys(TOPICS).forEach(function(k){
      var n=articlesOf(k).length;
      h+='<div class="adm-card"><h3>'+esc(TOPICS[k])+'</h3><p>'+esc(plural(n,'article','articles'))+'</p><div class="adm-card-actions"><button type="button" class="btn" data-act="new-article" data-topic="'+k+'">Add article</button><button type="button" class="btn-ghost" data-act="tab" data-tab="'+k+'">Manage</button></div></div>';
    });
    h+='<div class="adm-card"><h3>Media</h3><p>'+esc(plural(data.albums.length,'album','albums')+', '+plural(data.photos.length,'photo','photos'))+'</p><div class="adm-card-actions"><button type="button" class="btn" data-act="new-album">Add album</button><button type="button" class="btn-ghost" data-act="tab" data-tab="media">Manage</button></div></div>';
    if(isOwner)h+='<div class="adm-card"><h3>Questions</h3><p>'+esc(plural(openQuestions(),'new question','new questions'))+'</p><div class="adm-card-actions"><button type="button" class="btn-ghost" data-act="tab" data-tab="questions">Read questions</button></div></div>';
    return h+'</div>';
  }

  function articlesPanel(k){
    var list=articlesOf(k);
    var h=head(TOPICS[k],plural(list.length,'article','articles')+'. Use the arrows to set the order on the website.','<a class="btn-ghost" href="#'+PAGE[k]+'">See this page</a><button type="button" class="btn" data-act="new-article" data-topic="'+k+'">Add article</button>');
    if(!list.length)return h+'<p class="adm-empty">No articles yet. Use \u201cAdd article\u201d to add the first one.</p>';
    h+='<ol class="adm-list">';
    list.forEach(function(a,i){
      var img=blob(a.image),tags='';
      if(a.published===false)tags+='<span class="adm-tag warn">Hidden from the website</span>';
      if(a.sample)tags+='<span class="adm-tag warn">Sample</span>';
      tags+=(isId(a.docAsset)||safeLink(a.docLink))?'<span class="adm-tag">Document attached</span>':'<span class="adm-tag">No document yet</span>';
      if(!(a.si&&a.si.title))tags+='<span class="adm-tag">No Sinhala title</span>';
      h+='<li class="adm-row"><span class="adm-thumb">'+(img?'<img src="'+esc(img)+'" alt="">':IC.doc)+'</span>'+
        '<span class="adm-row-main"><strong>'+esc(a.en&&a.en.title)+'</strong>'+(a.si&&a.si.title?'<small lang="si">'+esc(a.si.title)+'</small>':'')+'<span class="adm-tags">'+tags+'</span></span>'+
        '<span class="adm-row-actions">'+moveBtns('article',a.id,i,list.length)+
        '<button type="button" class="btn-ghost" data-act="edit-article" data-id="'+esc(a.id)+'">Edit</button>'+
        '<button type="button" class="btn-ghost danger" data-act="del-article" data-confirm data-id="'+esc(a.id)+'">Delete</button></span></li>';
    });
    return h+'</ol>';
  }

  function mediaPanel(){
    var h=head('Media',plural(data.albums.length,'album','albums')+'. Open an album to add or arrange its photos.','<a class="btn-ghost" href="#media">See this page</a><button type="button" class="btn" data-act="new-album">Add album</button>');
    if(!data.albums.length)return h+'<p class="adm-empty">No albums yet. Use \u201cAdd album\u201d to create the first one.</p>';
    h+='<div class="adm-albums">';
    data.albums.forEach(function(a,i){
      var ps=photosIn(a.id),cover=ps[0]?photoSrc(ps[0]):'';
      var info=ps.length?plural(ps.length,'photo','photos'):(a.sampleCount?a.sampleCount+' sample pictures shown on the website':'No photos yet');
      h+='<article class="adm-album"><div class="adm-album-cover">'+(cover?'<img src="'+esc(cover)+'" alt="">':IC.photo)+'</div>'+
        '<div class="adm-album-body"><strong>'+esc(a.en&&a.en.title)+'</strong>'+(a.si&&a.si.title?'<small lang="si">'+esc(a.si.title)+'</small>':'')+'<small>'+esc(info)+'</small></div>'+
        '<div class="adm-album-actions"><button type="button" class="btn" data-act="open-album" data-id="'+esc(a.id)+'">Open</button>'+
        '<button type="button" class="btn-ghost" data-act="edit-album" data-id="'+esc(a.id)+'">Edit</button>'+moveBtns('album',a.id,i,data.albums.length)+
        '<button type="button" class="btn-ghost danger" data-act="del-album" data-confirm data-id="'+esc(a.id)+'">Delete</button></div></article>';
    });
    return h+'</div>';
  }

  function albumPanel(id){
    var a=find(data.albums,id),ps=photosIn(id);
    var back='<button type="button" class="adm-back" data-act="back-albums">'+IC.left+'All albums</button>';
    var h=head(a.en&&a.en.title,plural(ps.length,'photo','photos')+'. The first photo is the album cover.',
      '<a class="btn-ghost" href="#album-'+esc(id)+'">See this album</a><button type="button" class="btn-ghost" data-act="edit-album" data-id="'+esc(id)+'">Edit album</button><button type="button" class="btn" data-act="upload" data-id="'+esc(id)+'">Upload photos</button>',back);
    if(!ps.length&&a.sampleCount){
      h+='<div class="adm-note"><p>The website shows '+esc(a.sampleCount)+' sample pictures in this album until you upload real photos. They disappear as soon as you add the first photo.</p><button type="button" class="btn-ghost" data-act="clear-samples" data-id="'+esc(id)+'">Remove sample pictures now</button></div>';
    }
    if(!ps.length)return h+'<p class="adm-empty">No photos yet. Use \u201cUpload photos\u201d to add some. You can choose several at once.</p>';
    h+='<ol class="adm-photos">';
    ps.forEach(function(p,i){
      h+='<li class="adm-photo"><div class="adm-photo-img"><img src="'+esc(photoSrc(p))+'" alt=""></div>'+
        '<div class="adm-photo-body">'+(p.en?esc(p.en):'<span class="adm-muted">No caption</span>')+'</div>'+
        '<div class="adm-photo-actions">'+moveBtns('photo',p.id,i,ps.length)+
        '<button type="button" class="btn-ghost" data-act="edit-photo" data-id="'+esc(p.id)+'">Caption</button>'+
        '<button type="button" class="btn-ghost danger" data-act="del-photo" data-confirm data-id="'+esc(p.id)+'">Delete</button></div></li>';
    });
    return h+'</ol>';
  }

  function contactHtml(v){
    v=(v||'').trim();
    if(!v)return '<span class="adm-muted">No contact details given</span>';
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))return '<a href="mailto:'+esc(v)+'">'+esc(v)+'</a>';
    if(/^\+?[\d\s().-]{7,}$/.test(v))return '<a href="tel:'+esc(v.replace(/[^\d+]/g,''))+'">'+esc(v)+'</a>';
    return esc(v);
  }
  function questionsPanel(){
    if(!isOwner)return head('Questions','')+'<p class="adm-empty">Only the site owner can read questions.</p>';
    var open=openQuestions(),list=data.questions;
    var h=head('Questions',open+' new, '+(list.length-open)+' answered. Only you can see these.');
    if(!list.length)return h+'<p class="adm-empty">No questions yet. Questions sent from the \u201cAsk a question\u201d section appear here.</p>';
    h+='<ol class="adm-list">';
    list.forEach(function(q){
      h+='<li class="adm-q'+(q.answered?' is-answered':'')+'"><div class="adm-q-head"><strong>'+esc(q.name||'A reader')+'</strong><span class="adm-muted">'+esc(fmtDate(q.at))+'</span><span class="adm-tag'+(q.answered?'':' warn')+'">'+(q.answered?'Answered':'New')+'</span></div>'+
        '<p class="adm-q-contact">'+contactHtml(q.contact)+'</p><p class="adm-q-text">'+esc(q.text)+'</p>'+
        '<div class="adm-row-actions"><button type="button" class="btn-ghost" data-act="q-toggle" data-id="'+esc(q.owner)+'" data-at="'+esc(q.at)+'">'+(q.answered?'Mark as new':'Mark as answered')+'</button>'+
        '<button type="button" class="btn-ghost danger" data-act="q-del" data-confirm data-id="'+esc(q.owner)+'" data-at="'+esc(q.at)+'">Delete</button></div></li>';
    });
    return h+'</ol>';
  }

  function render(){
    if(!ready)return;
    navBtns.forEach(function(b){if(b.getAttribute('data-tab')===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    var open=openQuestions();badge.textContent=open?String(open):'';
    var html;
    if(tab==='overview')html=overview();
    else if(TOPICS[tab])html=articlesPanel(tab);
    else if(tab==='media')html=(openAlbum&&find(data.albums,openAlbum))?albumPanel(openAlbum):mediaPanel();
    else html=questionsPanel();
    main.innerHTML=html;
  }
  function go(t){tab=t;openAlbum=null;render();window.scrollTo(0,0);}
  navBtns.forEach(function(b){b.addEventListener('click',function(){go(b.getAttribute('data-tab'));});});

  /* Side panel with a form */
  var drawer=document.createElement('div');
  drawer.className='adm-drawer';drawer.hidden=true;
  drawer.innerHTML='<form class="adm-form" novalidate role="dialog" aria-modal="true" aria-labelledby="adm-form-title"><div class="adm-form-head"><h2 id="adm-form-title"></h2><button type="button" class="adm-icon" data-close aria-label="Close">'+IC.close+'</button></div><div class="adm-form-body"></div><div class="adm-form-foot"><p class="adm-form-status" role="status"></p><button type="button" class="btn-ghost" data-close>Cancel</button><button type="submit" class="btn">Save</button></div></form>';
  view.appendChild(drawer);
  var form=drawer.querySelector('form'),formTitle=drawer.querySelector('#adm-form-title'),formBody=drawer.querySelector('.adm-form-body');
  var formStatus=drawer.querySelector('.adm-form-status'),saveBtn=drawer.querySelector('button[type="submit"]');
  var currentForm=null,lastFocus=null;
  function onFormKey(e){if(e.key==='Escape'){e.preventDefault();closeForm();}}
  function openForm(title,html,handlers){
    currentForm=handlers;lastFocus=document.activeElement;
    formTitle.textContent=title;formBody.innerHTML=html;
    formStatus.textContent='';formStatus.className='adm-form-status';saveBtn.disabled=false;
    drawer.hidden=false;document.body.style.overflow='hidden';
    document.addEventListener('keydown',onFormKey);
    var first=formBody.querySelector('input:not([type="file"]):not([type="checkbox"]),select,textarea');
    if(first)first.focus();
  }
  function closeForm(){
    if(drawer.hidden)return;
    drawer.hidden=true;document.body.style.overflow='';
    document.removeEventListener('keydown',onFormKey);
    currentForm=null;
    if(lastFocus&&document.contains(lastFocus))lastFocus.focus();
  }
  drawer.addEventListener('click',function(e){
    if(e.target===drawer||e.target.closest('[data-close]')){closeForm();return;}
    if(currentForm&&currentForm.click)currentForm.click(e);
  });
  form.addEventListener('change',function(e){if(currentForm&&currentForm.change)currentForm.change(e);});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!currentForm)return;
    var cur=currentForm,p;
    saveBtn.disabled=true;formStatus.textContent='Saving\u2026';formStatus.className='adm-form-status';
    try{p=Promise.resolve(cur.submit(form.elements));}catch(err){p=Promise.reject(err);}
    p.then(function(){if(currentForm===cur)closeForm();},function(err){
      var m=errMsg(err);formStatus.textContent=m;formStatus.className='adm-form-status err';saveBtn.disabled=false;say(m,'err');
    });
  });
  function langFields(prefix,v,descLabel,descRows){
    var en=v.en||{},si=v.si||{};
    var desc=function(lang,val){return descLabel?'<label class="field"><span>'+descLabel+'</span><textarea name="'+lang+'_desc" rows="'+(descRows||3)+'" maxlength="500"'+(lang==='si'?' lang="si"':'')+'>'+esc(val)+'</textarea></label>':'';};
    return '<fieldset class="adm-lang"><legend>English</legend><label class="field"><span>'+prefix+'</span><input name="en_title" maxlength="160" required value="'+esc(en.title)+'"></label>'+desc('en',en.desc)+'</fieldset>'+
           '<fieldset class="adm-lang"><legend>Sinhala</legend><label class="field"><span>'+prefix+'</span><input name="si_title" maxlength="160" lang="si" value="'+esc(si.title)+'"></label>'+desc('si',si.desc)+'<span class="adm-hint">If you leave these empty, the English text is shown in Sinhala mode.</span></fieldset>';
  }

  /* Article form */
  function articleForm(a,topic){
    var v=a||{topic:topic||'education',published:true};
    var st={image:isId(v.image)?v.image:'',docAsset:isId(v.docAsset)?v.docAsset:''};
    function docHtml(){return st.docAsset?'Uploaded PDF: <a href="'+blob(st.docAsset)+'" target="_blank" rel="noopener">Open</a><button type="button" class="btn-ghost" data-clear="doc">Remove</button>':'';}
    var opts=Object.keys(TOPICS).map(function(k){return '<option value="'+k+'"'+(k===v.topic?' selected':'')+'>'+esc(TOPICS[k])+'</option>';}).join('');
    var html='<label class="field"><span>Section</span><select name="topic">'+opts+'</select></label>'+
      langFields('Title',v,'Short description',3)+
      '<div class="field"><span>Preview image</span><div class="adm-file"><span class="adm-file-preview" data-preview>'+(st.image?'<img src="'+blob(st.image)+'" alt="">':'No image')+'</span><span class="adm-file-ctrl"><input type="file" name="image" accept="image/*"><button type="button" class="btn-ghost" data-clear="image">Remove image</button><span class="adm-hint">Without an image, a small drawing is shown instead.</span></span></div></div>'+
      '<div class="field"><span>Document</span><span class="adm-doc-current" data-doc>'+docHtml()+'</span><input type="file" name="docfile" accept="application/pdf"><span class="adm-hint">Upload a PDF, or paste a link to the document below.</span><input type="url" name="doc_link" placeholder="https://" value="'+esc(safeLink(v.docLink))+'"></div>'+
      '<label class="adm-check"><input type="checkbox" name="published"'+(v.published===false?'':' checked')+'>Show this article on the website</label>';
    openForm(a?'Edit article':'Add article',html,{
      click:function(e){
        var c=e.target.closest('[data-clear]');if(!c)return;
        if(c.getAttribute('data-clear')==='image'){st.image='';form.elements.image.value='';formBody.querySelector('[data-preview]').textContent='No image';}
        else{st.docAsset='';formBody.querySelector('[data-doc]').innerHTML='';}
      },
      change:function(e){
        if(e.target.name==='image'&&e.target.files[0]){
          var pv=formBody.querySelector('[data-preview]');pv.textContent='';
          var im=document.createElement('img');im.alt='';im.src=URL.createObjectURL(e.target.files[0]);pv.appendChild(im);
        }
      },
      submit:function(f){
        var enTitle=f.en_title.value.trim();
        if(!enTitle)throw new Error('Please enter an English title.');
        var link=f.doc_link.value.trim();
        if(link&&!safeLink(link))throw new Error('The document link must start with https://');
        var imgFile=f.image.files[0],docFile=f.docfile.files[0];
        if(docFile&&docFile.type!=='application/pdf')throw new Error('Please choose a PDF file for the document.');
        var topicVal=TOPICS[f.topic.value]?f.topic.value:'education';
        var p=Promise.resolve();
        if(imgFile)p=p.then(function(){say('Uploading image\u2026','',true);return prepareImage(imgFile,1400);}).then(function(r){return upload(r.blob);}).then(function(id){st.image=id;});
        if(docFile)p=p.then(function(){say('Uploading document\u2026','',true);return upload(docFile,'application/pdf');}).then(function(id){st.docAsset=id;});
        return p.then(function(){
          var b={topic:topicVal,en:{title:enTitle,desc:f.en_desc.value.trim()},si:{title:f.si_title.value.trim(),desc:f.si_desc.value.trim()},
            image:st.image||'',docAsset:docFile?st.docAsset:(link?'':(st.docAsset||'')),docLink:docFile?'':link,
            published:f.published.checked,sample:false,updated:now()};
          if(a){
            if(a.topic!==topicVal)b.order=nextOrder(articlesOf(topicVal));
            return db.doc('articles/'+a.id).update(b);
          }
          b.order=nextOrder(articlesOf(topicVal));b.created=now();
          return db.collection('articles').add(b);
        }).then(function(){say(a?'Article saved.':'Article added.','ok');});
      }
    });
  }

  /* Album form */
  function slug(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);}
  function albumForm(a){
    openForm(a?'Edit album':'Add album',langFields('Album name',a||{},'Short description',2),{
      submit:function(f){
        var enTitle=f.en_title.value.trim();
        if(!enTitle)throw new Error('Please enter an English album name.');
        var b={en:{title:enTitle,desc:f.en_desc.value.trim()},si:{title:f.si_title.value.trim(),desc:f.si_desc.value.trim()},updated:now()};
        if(a)return db.doc('albums/'+a.id).update(b).then(function(){say('Album saved.','ok');});
        var id=slug(enTitle)||'album';
        if(find(data.albums,id))id=id+'-'+Date.now().toString(36);
        b.order=nextOrder(data.albums);b.sampleCount=0;b.pal=Math.floor(Math.random()*5);b.created=now();
        return db.doc('albums/'+id).set(b).then(function(){say('Album added. Now upload its photos.','ok');tab='media';openAlbum=id;render();});
      }
    });
  }

  /* Photo caption form */
  function photoForm(p){
    var html='<div class="adm-thumb" style="max-width:240px"><img src="'+esc(photoSrc(p))+'" alt=""></div>'+
      '<label class="field"><span>Caption in English</span><input name="en" maxlength="200" value="'+esc(p.en)+'"></label>'+
      '<label class="field"><span>Caption in Sinhala</span><input name="si" maxlength="200" lang="si" value="'+esc(p.si)+'"></label>'+
      '<span class="adm-hint">Leave a caption empty to show \u201cPhoto 1\u201d, \u201cPhoto 2\u201d and so on.</span>';
    openForm('Photo caption',html,{
      submit:function(f){return db.doc('photos/'+p.id).update({en:f.en.value.trim(),si:f.si.value.trim(),updated:now()}).then(function(){say('Caption saved.','ok');});}
    });
  }

  /* Photo uploads (several at once) */
  var fileInput=document.createElement('input');
  fileInput.type='file';fileInput.accept='image/*';fileInput.multiple=true;fileInput.hidden=true;
  view.appendChild(fileInput);
  var uploadTarget=null;
  fileInput.addEventListener('change',function(){
    var files=[].slice.call(fileInput.files||[]).filter(function(f){return /^image\//.test(f.type);});
    fileInput.value='';
    if(!files.length||!uploadTarget)return;
    var album=uploadTarget,order=nextOrder(photosIn(album)),i=0;
    function next(){
      if(i>=files.length){say(files.length===1?'1 photo added.':files.length+' photos added.','ok');return;}
      var file=files[i++];
      say('Uploading photo '+i+' of '+files.length+'\u2026','',true);
      return prepareImage(file,2000).then(function(r){
        return upload(r.blob).then(function(id){
          return db.collection('photos').add({album:album,asset:id,en:'',si:'',ratio:Math.round(r.ratio*1000)/1000,order:order++,created:now()});
        });
      }).then(next);
    }
    Promise.resolve().then(next).catch(fail);
  });

  /* Other actions */
  function move(kind,id,dir){
    var list,coll;
    if(kind==='article'){var a=find(data.articles,id);list=a?articlesOf(a.topic):[];coll='articles';}
    else if(kind==='album'){list=data.albums;coll='albums';}
    else{var p=find(data.photos,id);list=p?photosIn(p.album):[];coll='photos';}
    var i=-1;list.forEach(function(x,k){if(x.id===id)i=k;});
    var j=i+dir;
    if(i<0||j<0||j>=list.length)return;
    var x=list[i],y=list[j];
    var ox=typeof x.order==='number'?x.order:i,oy=typeof y.order==='number'?y.order:j;
    if(ox===oy)oy=ox+dir;
    busy(db.doc(coll+'/'+x.id).update({order:oy}).then(function(){return db.doc(coll+'/'+y.id).update({order:ox});}),'Order updated.');
  }
  function deleteAlbum(id){
    var ps=photosIn(id),p=Promise.resolve();
    say('Deleting album\u2026','',true);
    ps.forEach(function(ph){p=p.then(function(){return db.doc('photos/'+ph.id).delete();});});
    p.then(function(){return db.doc('albums/'+id).delete();}).then(function(){
      if(openAlbum===id)openAlbum=null;
      say('Album deleted.','ok');render();
    },fail);
  }
  function questionUpdate(owner,at,change,msg){
    var ref=db.doc('questions/'+owner);
    busy(ref.get().then(function(s){
      var b=s.exists?(s.data()||{}):{};
      var list=(Array.isArray(b.entries)?b.entries:[]).map(function(x){return Object.assign({},x);});
      var i=-1;list.forEach(function(x,k){if(i<0&&x&&String(x.at)===at)i=k;});
      if(i<0)return;
      change(list,i);
      return ref.set({entries:list,updated:now()});
    }),msg);
  }
  main.addEventListener('click',function(e){
    var b=e.target.closest('[data-act]');
    if(!b||!main.contains(b)||b.disabled)return;
    if(b.hasAttribute('data-confirm')&&b.getAttribute('data-armed')!=='1'){b.setAttribute('data-armed','1');b.textContent='Confirm delete';return;}
    var act=b.getAttribute('data-act'),id=b.getAttribute('data-id');
    if(act==='tab')go(b.getAttribute('data-tab'));
    else if(act==='new-article')articleForm(null,b.getAttribute('data-topic'));
    else if(act==='edit-article'){var ar=find(data.articles,id);if(ar)articleForm(ar);}
    else if(act==='del-article')busy(db.doc('articles/'+id).delete(),'Article deleted.');
    else if(act==='move')move(b.getAttribute('data-kind'),id,Number(b.getAttribute('data-dir')));
    else if(act==='new-album')albumForm(null);
    else if(act==='edit-album'){var al=find(data.albums,id);if(al)albumForm(al);}
    else if(act==='open-album'){tab='media';openAlbum=id;render();window.scrollTo(0,0);}
    else if(act==='back-albums'){openAlbum=null;render();}
    else if(act==='del-album')deleteAlbum(id);
    else if(act==='upload'){uploadTarget=id;fileInput.click();}
    else if(act==='edit-photo'){var ph=find(data.photos,id);if(ph)photoForm(ph);}
    else if(act==='del-photo')busy(db.doc('photos/'+id).delete(),'Photo deleted.');
    else if(act==='clear-samples')busy(db.doc('albums/'+id).update({sampleCount:0}),'Sample pictures removed.');
    else if(act==='q-toggle')questionUpdate(id,b.getAttribute('data-at'),function(list,i){list[i].answered=!list[i].answered;},'Question updated.');
    else if(act==='q-del')questionUpdate(id,b.getAttribute('data-at'),function(list,i){list.splice(i,1);},'Question deleted.');
  });

  /* Show the admin when the address ends in #admin */
  function onRoute(){
    if(location.hash==='#admin'){
      document.title='Admin | Vipulasena Pathirajage';
      start();render();
    }else{closeForm();}
  }
  document.addEventListener('vp:route',onRoute);
  document.addEventListener('vp:lang',function(){if(location.hash==='#admin')document.title='Admin | Vipulasena Pathirajage';});
  onRoute();

  /* A small "Admin" link in the footer, shown only to the owner and editors */
  if(adminLink&&window.claude&&typeof window.claude.use==='function'){
    window.claude.use('user').then(function(u){
      if(!u)return;
      return u.canEdit().then(function(ok){if(ok)adminLink.hidden=false;});
    }).catch(function(){});
  }
})();
</script>
