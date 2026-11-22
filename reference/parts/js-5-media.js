<script>
/* ===== Media: albums and photos =====
   ALBUMS below lists each album. An album shows sample pictures (count) until
   real photos are added as images: [{src:'photo.jpg', en:'Caption', si:'...'}].
   src 'PORTRAIT' reuses the portrait photo from the home page. */
(function(){
  var root=document.documentElement;
  var view=document.querySelector('.topic-view[data-view="media"]');
  if(!view)return;
  var titleEl=view.querySelector('.media-title'),leadEl=view.querySelector('.media-lead'),countEl=view.querySelector('.media-count');
  var noteEl=view.querySelector('.media-note'),grid=view.querySelector('.album-grid'),panel=view.querySelector('.album-panel');
  var photoGrid=view.querySelector('.photo-grid'),emptyEl=view.querySelector('.album-empty'),backLabel=view.querySelector('.back-albums-label');
  var crumbSep=view.querySelector('.crumb-album-sep'),crumbAlbum=view.querySelector('.crumb-album');

  var PAL=[['#dfe9ec','#f2d99a','#a9c4ae','#6f9a82'],['#efe3d3','#e9b98f','#c9b28d','#8c7a5c'],['#e3e6f0','#f4e3a6','#9fb3c8','#5f7891'],['#e8efe4','#f6d6a1','#b7cf9e','#7d9b6a'],['#f1e7e1','#f0c2a4','#d3a89a','#9b6f66']];
  var RATIOS=[4/3,3/4,1,4/3,16/10,3/4];
  var ALBUMS=[
    {id:'recent',count:8,pal:0,en:['Recent moments','Photos from everyday life these days.'],si:['මෑත සටහන්','මේ දිනවල එදිනෙදා ජීවිතයේ ඡායාරූප.']},
    {id:'new-things',count:6,pal:2,en:['New things I’m doing','Fresh projects, ideas and new experiences.'],si:['මා අලුතින් කරන දේ','නව ව්‍යාපෘති, අදහස් සහ නව අත්දැකීම්.']},
    {id:'outings',count:9,pal:3,en:['Trips and outings','Travels, visits and days out.'],si:['සංචාර සහ විනෝද ගමන්','ගමන්, සංචාර සහ එළිමහන් දින.']},
    {id:'leisure',count:7,pal:1,en:['Leisure and hobbies','The activities I enjoy in my free time.'],si:['විවේකය සහ විනෝදාංශ','විවේක කාලයේ මා රස විඳින ක්‍රියාකාරකම්.']},
    {id:'portraits',en:['Portraits','Recent personal photographs, including the portrait on the home page.'],si:['පෞද්ගලික ඡායාරූප','මුල් පිටුවේ ඇති ඡායාරූපය ද ඇතුළුව මෑත පෞද්ගලික ඡායාරූප.'],images:[{src:'PORTRAIT',ratio:1,en:'Portrait in the garden',si:'උද්‍යානයේ දී ගත් ඡායාරූපය'}]}
  ];
  var T={
    en:{title:'Media',lead:'Photos from my life today: new things I’m doing and the activities I enjoy in my free time.',albums:function(n){return n+(n===1?' album':' albums');},photos:function(n){return n+(n===1?' photo':' photos');},photo:'Photo',all:'All albums',sample:'These albums and photos are samples showing the layout. Your own photos will replace them.',site:'Vipulasena Pathirajage',close:'Close',prev:'Previous photo',next:'Next photo',viewer:'Photo viewer',of:'of',empty:'This album has no photos yet.'},
    si:{title:'මාධ්‍ය',lead:'අද මගේ ජීවිතයේ ඡායාරූප: මා කරන නව දේවල් සහ විවේක කාලයේ මා රස විඳින ක්‍රියාකාරකම්.',albums:function(n){return 'ඇල්බම '+n;},photos:function(n){return 'ඡායාරූප '+n;},photo:'ඡායාරූපය',all:'සියලු ඇල්බම',sample:'මෙම ඇල්බම සහ ඡායාරූප පිරිසැලසුම පෙන්වීමට යොදා ඇති නියැදි වේ. ඔබගේ සැබෑ ඡායාරූප මේවා වෙනුවට යොදනු ඇත.',site:'විපුලසේන පතිරාජගේ',close:'වසන්න',prev:'පෙර ඡායාරූපය',next:'ඊළඟ ඡායාරූපය',viewer:'ඡායාරූප දර්ශකය',of:'/',empty:'මෙම ඇල්බමයේ තවම ඡායාරූප නැත.'}
  };
  function lang(){return root.lang==='si'?'si':'en';}
  function portraitSrc(){var img=document.querySelector('.portrait-photo img');return img?img.src:'';}
  function scene(p){
    var c=PAL[p%PAL.length];
    return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="400" height="300" fill="'+c[0]+'"/><circle cx="290" cy="90" r="34" fill="'+c[1]+'"/><path d="M0 214Q100 150 200 204T400 180V300H0Z" fill="'+c[2]+'"/><path d="M0 256Q140 210 280 258T400 240V300H0Z" fill="'+c[3]+'"/></svg>';
  }
  function photosOf(a){
    if(a.images){
      return a.images.map(function(im,i){return {kind:'img',src:im.src==='PORTRAIT'?portraitSrc():im.src,ratio:im.ratio||4/3,cap:{en:im.en||'',si:im.si||im.en||''},n:i+1};});
    }
    var out=[];
    for(var i=0;i<(a.count||0);i++){out.push({kind:'ph',p:(a.pal+i)%PAL.length,ratio:RATIOS[(i+a.pal)%RATIOS.length],n:i+1});}
    return out;
  }
  function caption(item){var l=lang();return (item.cap&&item.cap[l])?item.cap[l]:T[l].photo+' '+item.n;}
  function mediaNode(item){
    if(item.kind==='img'){var img=document.createElement('img');img.src=item.src;img.alt=caption(item);img.loading='lazy';return img;}
    var s=document.createElement('span');s.className='ph';s.innerHTML=scene(item.p);s.style.aspectRatio=String(item.ratio);return s;
  }
  function findAlbum(h){
    if(h.indexOf('album-')!==0)return null;
    var id=h.slice(6);
    var list=albumsList();
    for(var i=0;i<list.length;i++){if(list[i].id===id)return list[i];}
    return null;
  }

  function renderAlbums(){
    var l=lang();
    grid.textContent='';
    albumsList().forEach(function(a){
      var ps=photosOf(a);
      var li=document.createElement('li');
      var link=document.createElement('a');link.className='album';link.href='#album-'+a.id;
      var stack=document.createElement('span');stack.className='album-stack';
      var cover=document.createElement('span');cover.className='album-cover';
      if(ps[0]){var m=mediaNode(ps[0]);if(m.tagName==='IMG')m.alt='';m.style.aspectRatio='';cover.appendChild(m);}
      stack.appendChild(cover);
      var info=document.createElement('span');info.className='album-info';
      var ti=document.createElement('span');ti.className='album-title';ti.textContent=a[l][0];
      var me=document.createElement('span');me.className='album-meta';me.textContent=T[l].photos(ps.length);
      var de=document.createElement('span');de.className='album-desc';de.textContent=a[l][1];
      info.appendChild(ti);info.appendChild(me);info.appendChild(de);
      link.appendChild(stack);link.appendChild(info);
      li.appendChild(link);grid.appendChild(li);
    });
  }

  var current=[];
  function renderAlbum(a){
    current=photosOf(a);
    photoGrid.textContent='';
    current.forEach(function(item,i){
      var li=document.createElement('li');
      var btn=document.createElement('button');btn.type='button';btn.className='photo';btn.setAttribute('aria-label',caption(item));
      var m=mediaNode(item);
      var cap=document.createElement('span');cap.className='photo-cap';cap.setAttribute('aria-hidden','true');cap.textContent=caption(item);
      btn.appendChild(m);btn.appendChild(cap);
      btn.addEventListener('click',function(){openViewer(i,btn);});
      li.appendChild(btn);photoGrid.appendChild(li);
    });
    emptyEl.textContent=T[lang()].empty;
    emptyEl.hidden=current.length>0;
  }

  function update(){
    var h=location.hash.slice(1);
    if(!(h==='media'||h.indexOf('album-')===0)){closeViewer();return;}
    var l=lang(),a=findAlbum(h);
    noteEl.textContent=T[l].sample;
    noteEl.hidden=!(liveAlbums===null||albumsList().some(function(x){return x.sample;}));
    backLabel.textContent=T[l].all;
    if(a){
      var n=photosOf(a).length;
      titleEl.textContent=a[l][0];leadEl.textContent=a[l][1];countEl.textContent=T[l].photos(n);
      crumbSep.hidden=false;crumbAlbum.hidden=false;crumbAlbum.textContent=a[l][0];
      grid.hidden=true;panel.hidden=false;renderAlbum(a);
      document.title=a[l][0]+' | '+T[l].title+' | '+T[l].site;
    }else{
      titleEl.textContent=T[l].title;leadEl.textContent=T[l].lead;countEl.textContent=T[l].albums(albumsList().length);
      crumbSep.hidden=true;crumbAlbum.hidden=true;
      grid.hidden=false;panel.hidden=true;renderAlbums();
      document.title=T[l].title+' | '+T[l].site;
      closeViewer();
    }
  }

  /* Live albums and photos from the site's database (managed from the admin page) */
  var liveAlbums=null,rawAlbums=null,rawPhotos=null;
  function albumsList(){return liveAlbums||ALBUMS;}
  function byOrder(a,b){return (a.order||0)-(b.order||0);}
  function rebuildAlbums(){
    if(!rawAlbums||!rawPhotos)return;
    var groups={};
    rawPhotos.forEach(function(p){
      var src=p.src==='PORTRAIT'?'PORTRAIT':(/^[0-9a-f]{32}$/.test(p.asset||'')?'/_blob/'+p.asset:'');
      if(!p.album||!src)return;
      (groups[p.album]=groups[p.album]||[]).push({src:src,ratio:(typeof p.ratio==='number'&&p.ratio>0)?p.ratio:4/3,en:typeof p.en==='string'?p.en:'',si:typeof p.si==='string'?p.si:'',order:p.order||0});
    });
    liveAlbums=rawAlbums.slice().sort(byOrder).map(function(a){
      var en=[(a.en&&a.en.title)||'',(a.en&&a.en.desc)||''];
      var si=[(a.si&&a.si.title)||en[0],(a.si&&a.si.desc)||en[1]];
      var ims=(groups[a.id]||[]).sort(byOrder);
      var count=Math.max(0,Math.min(40,Math.floor(a.sampleCount||0)));
      return {id:a.id,en:en,si:si,pal:Math.floor(a.pal||0),count:count,images:ims.length?ims:null,sample:!ims.length&&count>0};
    }).filter(function(a){return a.en[0];});
    update();
  }
  if(window.claude&&typeof window.claude.use==='function'){
    window.claude.use('db').then(function(db){
      if(!db)return;
      db.collection('albums').onSnapshot(function(snap){
        if(snap.empty&&snap.metadata.fromCache)return;
        rawAlbums=snap.docs.map(function(d){var v=Object.assign({},d.data()||{});v.id=d.id;return v;});
        rebuildAlbums();
      },function(){});
      db.collection('photos').onSnapshot(function(snap){
        if(snap.empty&&snap.metadata.fromCache)return;
        rawPhotos=snap.docs.map(function(d){return d.data()||{};});
        rebuildAlbums();
      },function(){});
    }).catch(function(){});
  }

  /* Photo viewer */
  var ICON={
    close:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    prev:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    next:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>'
  };
  var lb=document.createElement('div');
  lb.className='lightbox';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
  lb.innerHTML='<button type="button" class="lb-btn lb-close">'+ICON.close+'</button><button type="button" class="lb-btn lb-prev">'+ICON.prev+'</button><figure class="lb-figure"><div class="lb-media"></div><figcaption class="lb-cap"><span class="lb-text"></span><span class="lb-count"></span></figcaption></figure><button type="button" class="lb-btn lb-next">'+ICON.next+'</button>';
  document.body.appendChild(lb);
  var lbMedia=lb.querySelector('.lb-media'),lbText=lb.querySelector('.lb-text'),lbCount=lb.querySelector('.lb-count');
  var lbClose=lb.querySelector('.lb-close'),lbPrev=lb.querySelector('.lb-prev'),lbNext=lb.querySelector('.lb-next');
  var index=0,opener=null;
  function viewerLabels(){
    var l=lang();
    lb.setAttribute('aria-label',T[l].viewer);
    lbClose.setAttribute('aria-label',T[l].close);
    lbPrev.setAttribute('aria-label',T[l].prev);
    lbNext.setAttribute('aria-label',T[l].next);
  }
  function showAt(i){
    if(!current.length)return;
    index=(i+current.length)%current.length;
    var item=current[index];
    lbMedia.textContent='';
    var m=mediaNode(item);
    if(item.kind==='img'){lbMedia.style.width='';lbMedia.style.aspectRatio='';}
    else{m.style.aspectRatio='';lbMedia.style.width='min(84vw, calc(72vh * '+item.ratio+'))';lbMedia.style.aspectRatio=String(item.ratio);}
    lbMedia.appendChild(m);
    var l=lang();
    lbText.textContent=caption(item);
    lbCount.textContent=(index+1)+' '+T[l].of+' '+current.length;
    var multi=current.length>1;
    lbPrev.hidden=!multi;lbNext.hidden=!multi;
    viewerLabels();
  }
  function onKey(e){
    if(e.key==='Escape'){e.preventDefault();closeViewer();}
    else if(e.key==='ArrowLeft'){showAt(index-1);}
    else if(e.key==='ArrowRight'){showAt(index+1);}
    else if(e.key==='Tab'){
      var f=[lbClose,lbPrev,lbNext].filter(function(b){return !b.hidden;});
      var at=f.indexOf(document.activeElement);
      e.preventDefault();
      f[(at+(e.shiftKey?-1:1)+f.length)%f.length].focus();
    }
  }
  function openViewer(i,from){
    opener=from;lb.hidden=false;document.body.style.overflow='hidden';
    showAt(i);
    document.addEventListener('keydown',onKey);
    lbClose.focus();
  }
  function closeViewer(){
    if(lb.hidden)return;
    lb.hidden=true;document.body.style.overflow='';
    document.removeEventListener('keydown',onKey);
    if(opener&&document.contains(opener))opener.focus();
    opener=null;
  }
  lbClose.addEventListener('click',closeViewer);
  lbPrev.addEventListener('click',function(){showAt(index-1);});
  lbNext.addEventListener('click',function(){showAt(index+1);});
  lb.addEventListener('click',function(e){if(e.target===lb)closeViewer();});

  document.addEventListener('vp:route',update);
  document.addEventListener('vp:lang',function(){update();if(!lb.hidden)showAt(index);});
  update();
})();
</script>
