window.Gameplay=(()=>{
  let last=performance.now();
  let phase=0;
  const P=()=>document.getElementById('player');

  function sprite(dir,walking){
    return (walking?'bella_walk_':'bella_idle_')+dir+'.png';
  }

  function clampPlayer(){
    // These bounds cover every real interactable object in the room,
    // including the chest at the far right.
    G.x=Math.max(17,Math.min(87,G.x));
    G.y=Math.max(30,Math.min(71,G.y));
  }

  function renderPlayer(moving){
    const p=P();
    if(!p)return;
    p.style.left=G.x+'%';
    p.style.top=G.y+'%';
    p.style.backgroundImage=`url("${sprite(G.dir,moving&&phase>=1)}")`;
  }

  function loop(now){
    if(!document.getElementById('game')?.classList.contains('active')){
      last=now;
      requestAnimationFrame(loop);
      return;
    }

    const dt=Math.min(.035,(now-last)/1000);
    last=now;

    const v=Joystick.get();
    const moving=Math.abs(v.x)+Math.abs(v.y)>.075;

    if(moving){
      // Slightly slower = much easier to stop exactly beside an object.
      G.x+=v.x*16.5*dt;
      G.y+=v.y*15*dt;
      clampPlayer();

      if(Math.abs(v.x)>Math.abs(v.y)){
        G.dir=v.x<0?'left':'right';
      }else{
        G.dir=v.y<0?'back':'front';
      }

      phase=(phase+dt*7)%2;
      P()?.classList.add('walking');
    }else{
      phase=0;
      P()?.classList.remove('walking');
    }

    renderPlayer(moving);
    Interactions.scan();
    requestAnimationFrame(loop);
  }

  function init(){
    document.getElementById('useBtn')?.addEventListener('click',Interactions.use);

    document.addEventListener('keydown',e=>{
      if(!document.getElementById('game')?.classList.contains('active'))return;

      const step=1.25;
      if(e.key==='ArrowLeft'){G.x-=step;G.dir='left'}
      if(e.key==='ArrowRight'){G.x+=step;G.dir='right'}
      if(e.key==='ArrowUp'){G.y-=step;G.dir='back'}
      if(e.key==='ArrowDown'){G.y+=step;G.dir='front'}
      if(e.key===' '||e.key==='Enter')Interactions.use();

      clampPlayer();
      renderPlayer(false);
      Interactions.scan();
    });

    requestAnimationFrame(loop);
  }

  return{init};
})();
