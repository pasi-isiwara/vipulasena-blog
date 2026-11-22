<script>
/* ===== Visitor counter =====
   Counts each signed-in visitor once per browser session and shows the
   total number of visitors and page visits. It works while the page is
   opened on claude.ai; on any other host it stays hidden. */
(function(){
  var box=document.querySelector('.visits');
  if(!box||!window.claude||typeof window.claude.use!=='function')return;
  var peopleEl=box.querySelector('.visits-people');
  var totalEl=box.querySelector('.visits-total');
  var peopleLbl=box.querySelector('.visits-people-label');
  var totalLbl=box.querySelector('.visits-total-label');
  var people=0,total=0,shownPeople=0,shownTotal=0;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function labels(){
    var si=document.documentElement.lang==='si';
    peopleLbl.textContent=si?'නරඹන්නන්':(people===1?'visitor':'visitors');
    totalLbl.textContent=si?'පිටු නැරඹුම්':(total===1?'page visit':'page visits');
  }
  function countTo(el,from,to){
    if(reduce||from===to){el.textContent=to.toLocaleString('en-US');return;}
    var start=null;
    function step(ts){
      if(start===null)start=ts;
      var k=Math.min(1,(ts-start)/900),e=1-Math.pow(1-k,3);
      el.textContent=Math.round(from+(to-from)*e).toLocaleString('en-US');
      if(k<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function render(){
    countTo(peopleEl,shownPeople,people);
    countTo(totalEl,shownTotal,total);
    shownPeople=people;shownTotal=total;
    labels();
    box.hidden=false;
  }
  document.addEventListener('vp:lang',labels);

  Promise.all([window.claude.use('db'),window.claude.use('user')]).then(function(found){
    var db=found[0],user=found[1];
    if(!db)return;
    var visitors=db.collection('visitors');

    visitors.onSnapshot(function(snap){
      var p=0,t=0;
      snap.docs.forEach(function(d){
        var v=d.data()||{};
        var n=(typeof v.visits==='number'&&v.visits>0)?Math.min(Math.floor(v.visits),100000):1;
        p+=1;t+=n;
      });
      if(p===0&&snap.metadata.fromCache)return;
      people=p;total=t;render();
    },function(){});

    if(!user)return;
    return user.id().then(function(id){
      if(!id)return;
      var counted=false;
      try{counted=sessionStorage.getItem('vp-counted')==='1';}catch(e){}
      if(counted)return;
      var ref;
      try{ref=visitors.doc(id);}catch(e){return;}
      return ref.get().then(function(s){
        var now=new Date().toISOString();
        var d=s.exists?(s.data()||{}):{};
        var prev=(typeof d.visits==='number'&&d.visits>0)?Math.floor(d.visits):0;
        return ref.set({visits:prev+1,first:typeof d.first==='string'?d.first:now,last:now});
      }).then(function(){
        try{sessionStorage.setItem('vp-counted','1');}catch(e){}
      });
    });
  }).catch(function(){});
})();
</script>
