<script>
/* ===== Ask a question =====
   Visitors send questions privately. Only the site owner sees the
   "Questions received" list. Works while the page is opened on claude.ai. */
(function(){
  var form=document.querySelector('.question-form');
  if(!form)return;
  var statusEl=form.querySelector('.form-status');
  var sendBtn=form.querySelector('button[type="submit"]');
  var area=document.querySelector('.comments-area');
  var list=area.querySelector('.comment-list');
  var db=null,uid=null,ready=false,isOwner=false,questions=[];
  var T={
    en:{sending:'Sending…',sent:'Thank you. Your question has been sent, and I’ll reply as soon as I can.',empty:'Please write your question before sending.',unavailable:'Sending questions isn’t available here yet. Please use the phone number or email on this page.',noAccess:'Your access doesn’t allow sending questions here. Please use the phone number or email on this page.',failed:'Your question couldn’t be sent. Please try again.',loading:'Connecting, please try again in a moment.',listTitle:'Questions received',listNote:'Only you can see these questions.',none:'No questions yet.',anon:'A reader',noContact:'No contact details given',remove:'Remove',confirm:'Confirm remove'},
    si:{sending:'යවමින්…',sent:'ස්තූතියි. ඔබගේ ප්‍රශ්නය යවන ලදී. හැකි ඉක්මනින් මම පිළිතුරු දෙන්නෙමි.',empty:'යැවීමට පෙර කරුණාකර ඔබගේ ප්‍රශ්නය ලියන්න.',unavailable:'මෙහින් ප්‍රශ්න යැවීම තවම ලබා ගත නොහැක. කරුණාකර මෙම පිටුවේ ඇති දුරකථන අංකය හෝ විද්‍යුත් තැපෑල භාවිත කරන්න.',noAccess:'ඔබගේ ප්‍රවේශයෙන් මෙහි ප්‍රශ්න යැවිය නොහැක. කරුණාකර මෙම පිටුවේ ඇති දුරකථන අංකය හෝ විද්‍යුත් තැපෑල භාවිත කරන්න.',failed:'ඔබගේ ප්‍රශ්නය යැවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',loading:'සම්බන්ධ වෙමින්, කරුණාකර මද වේලාවකින් නැවත උත්සාහ කරන්න.',listTitle:'ලැබුණු ප්‍රශ්න',listNote:'මෙම ප්‍රශ්න ඔබට පමණක් පෙනේ.',none:'තවම ප්‍රශ්න නැත.',anon:'පාඨකයෙක්',noContact:'සම්බන්ධතා විස්තර ලබා දී නැත',remove:'ඉවත් කරන්න',confirm:'තහවුරු කරන්න'}
  };
  function t(k){return T[document.documentElement.lang==='si'?'si':'en'][k];}
  var statusKey='',statusCls='';
  function say(k,cls){
    statusKey=k||'';statusCls=cls||'';
    statusEl.textContent=k?t(k):'';
    statusEl.className='form-status'+(cls?' '+cls:'');
  }
  function initial(name){var ch=Array.from(name.trim())[0];return ch?ch.toUpperCase():'?';}
  function contactNode(value){
    var v=(value||'').trim();
    if(!v){var none=document.createElement('span');none.textContent=t('noContact');return none;}
    var a=document.createElement('a');a.textContent=v;
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){a.href='mailto:'+v;return a;}
    if(/^\+?[\d\s().-]{7,}$/.test(v)){a.href='tel:'+v.replace(/[^\d+]/g,'');return a;}
    var s=document.createElement('span');s.textContent=v;return s;
  }

  function renderList(){
    if(area.hidden)return;
    area.querySelector('.questions-title').textContent=t('listTitle');
    area.querySelector('.comment-count').textContent='('+questions.length+')';
    area.querySelector('.questions-note').textContent=t('listNote');
    list.textContent='';
    if(!questions.length){
      var empty=document.createElement('li');empty.className='comments-empty';empty.textContent=t('none');list.appendChild(empty);return;
    }
    var locale=document.documentElement.lang==='si'?'si-LK':'en-GB';
    questions.forEach(function(q){
      var li=document.createElement('li');li.className='comment';
      var who=q.name||t('anon');
      var avatar=document.createElement('span');avatar.className='comment-avatar';avatar.setAttribute('aria-hidden','true');avatar.textContent=initial(who);
      var body=document.createElement('div');
      var head=document.createElement('div');head.className='comment-head';
      var nameEl=document.createElement('span');nameEl.className='comment-name';nameEl.textContent=who;
      var dateEl=document.createElement('span');dateEl.className='comment-date';
      try{dateEl.textContent=new Date(q.at).toLocaleString(locale,{dateStyle:'medium',timeStyle:'short'});}catch(e){}
      head.appendChild(nameEl);head.appendChild(dateEl);
      var rm=document.createElement('button');rm.type='button';rm.className='comment-remove';rm.textContent=t('remove');
      rm.addEventListener('click',function(){
        if(rm.getAttribute('data-armed')!=='1'){rm.setAttribute('data-armed','1');rm.textContent=t('confirm');return;}
        rm.disabled=true;removeQuestion(q);
      });
      head.appendChild(rm);
      var contact=document.createElement('p');contact.className='comment-contact';contact.appendChild(contactNode(q.contact));
      var text=document.createElement('p');text.className='comment-text';text.textContent=q.text;
      body.appendChild(head);body.appendChild(contact);body.appendChild(text);
      li.appendChild(avatar);li.appendChild(body);list.appendChild(li);
    });
  }
  function removeQuestion(q){
    var ref=db.collection('questions').doc(q.owner);
    ref.get().then(function(s){
      var b=s.exists?(s.data()||{}):{};
      var kept=(Array.isArray(b.entries)?b.entries:[]).filter(function(en){return !(en&&en.at===q.at&&en.text===q.text);});
      return ref.set({entries:kept,updated:new Date().toISOString()});
    }).catch(function(){renderList();});
  }
  document.addEventListener('vp:lang',function(){if(statusKey)say(statusKey,statusCls);renderList();});

  function off(){say('unavailable');sendBtn.disabled=true;}
  if(!window.claude||typeof window.claude.use!=='function'){off();}
  else{
    Promise.all([window.claude.use('db'),window.claude.use('user')]).then(function(found){
      db=found[0];var user=found[1];
      if(!db||!user){off();return;}
      return Promise.all([user.id(),user.isOwner(),user.can('data.write')]).then(function(v){
        uid=v[0];isOwner=!!v[1];ready=true;
        if(!uid){off();return;}
        if(v[2]===false){say('noAccess');sendBtn.disabled=true;}
        if(isOwner){
          area.hidden=false;renderList();
          db.collection('questions').onSnapshot(function(snap){
            var all=[];
            snap.docs.forEach(function(d){
              var b=d.data()||{};
              (Array.isArray(b.entries)?b.entries:[]).forEach(function(en){
                if(en&&typeof en.text==='string'&&en.text){
                  all.push({owner:d.id,name:typeof en.name==='string'?en.name.slice(0,80):'',contact:typeof en.contact==='string'?en.contact.slice(0,120):'',text:en.text.slice(0,3000),at:String(en.at||'')});
                }
              });
            });
            all.sort(function(a,b){return b.at.localeCompare(a.at);});
            questions=all;renderList();
          },function(){});
        }
      });
    }).catch(off);
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var f=form.elements;
    var name=f.namedItem('qname').value.trim().slice(0,80);
    var contact=f.namedItem('qcontact').value.trim().slice(0,120);
    var text=f.namedItem('qtext').value.trim().slice(0,3000);
    if(text.length<2){say('empty','err');f.namedItem('qtext').focus();return;}
    if(!ready){say('loading');return;}
    if(!db||!uid){off();return;}
    sendBtn.disabled=true;say('sending');
    var ref=db.collection('questions').doc(uid);
    ref.get().then(function(s){
      var b=s.exists?(s.data()||{}):{};
      var kept=Array.isArray(b.entries)?b.entries.slice(-49):[];
      var now=new Date().toISOString();
      kept.push({name:name,contact:contact,text:text,at:now,lang:document.documentElement.lang});
      return ref.set({entries:kept,updated:now});
    }).then(function(){
      form.reset();say('sent','ok');sendBtn.disabled=false;
    }).catch(function(err){
      if(err&&err.code==='invalid_argument'){say('noAccess','err');}
      else{say('failed','err');sendBtn.disabled=false;}
    });
  });
})();
</script>
