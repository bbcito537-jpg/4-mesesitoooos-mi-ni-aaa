window.Interactions=(()=>{
  const TARGETS=[
    {name:'photo', selector:'.globe'},
    {name:'note', selector:'.guitar'},
    {name:'flower', selector:'.flowers'},
    {name:'chest', selector:'.chest'},
    {name:'desk', selector:'.desk'},
    {name:'cat', selector:'.cat'}
  ];

  function footPoint(){
    const player=document.getElementById('player');
    const r=player.getBoundingClientRect();
    return {
      x:r.left+r.width*.5,
      y:r.top+r.height*.92
    };
  }

  function distanceToRect(point,rect){
    const dx=Math.max(rect.left-point.x,0,point.x-rect.right);
    const dy=Math.max(rect.top-point.y,0,point.y-rect.bottom);
    return Math.hypot(dx,dy);
  }

  function scan(){
    const stage=document.getElementById('gameStage');
    if(!stage){G.near=null;return null}

    const stageRect=stage.getBoundingClientRect();
    const p=footPoint();

    // Scales with the actual displayed game, so iPhone scaling cannot break it.
    const radius=Math.max(52,Math.min(stageRect.width,stageRect.height)*.105);

    let nearest=null;
    let nearestDistance=Infinity;

    for(const target of TARGETS){
      const el=document.querySelector(target.selector);
      if(!el)continue;
      const rect=el.getBoundingClientRect();
      const d=distanceToRect(p,rect);
      if(d<nearestDistance){
        nearestDistance=d;
        nearest=target.name;
      }
    }

    G.near=nearestDistance<=radius ? nearest : null;

    const use=document.getElementById('useBtn');
    if(use)use.classList.toggle('ready',!!G.near);

    return G.near;
  }

  function message(text){
    const m=document.getElementById('message');
    if(!m)return;
    m.textContent=text;
    m.style.display='block';
    clearTimeout(m._timer);
    m._timer=setTimeout(()=>m.style.display='none',2500);
  }

  function reveal(item){
    if(G.items.has(item)){
      message('Ese recuerdo ya está en tu inventario.');
      return false;
    }

    G.items.add(item);
    G.lastInteraction=item;

    const ids={photo:'slotPhoto',note:'slotNote',flower:'slotFlower'};
    const masks={photo:'mask3',note:'mask2',flower:'mask4'};

    if(ids[item]){
      const icon=document.getElementById(ids[item]);
      if(icon)icon.style.display='block';
    }
    if(masks[item]){
      const mask=document.getElementById(masks[item]);
      if(mask)mask.style.display='none';
    }

    if(['photo','note','flower'].every(x=>G.items.has(x))){
      const check=document.getElementById('checkA');
      if(check){
        check.textContent='☑';
        check.parentElement.classList.add('done');
      }
    }
    return true;
  }

  function use(){
    const target=scan();
    if(!target){
      message('No hay nada suficientemente cerca para usar.');
      return;
    }

    G.lastInteraction=target;

    if(target==='photo'){
      if(reveal('photo'))message('Encontraste una foto escondida junto al marco del escritorio.');
      return;
    }

    if(target==='note'){
      if(reveal('note'))message('Detrás de la guitarra: “No todo empezó en persona.”');
      return;
    }

    if(target==='flower'){
      if(!G.flowerSolved){
        document.getElementById('flowerPuzzle')?.classList.add('show');
      }else{
        message('La caja de flores ya está resuelta.');
      }
      return;
    }

    if(target==='cat'){
      message(G.key
        ? 'Tzuyu te mira como si supiera que ya casi terminaste.'
        : 'Tzuyu no va a darte la respuesta tan fácil.');
      return;
    }

    if(target==='chest'){
      if(!['photo','note','flower'].every(x=>G.items.has(x))){
        message('El cofre necesita los tres recuerdos.');
        return;
      }

      if(!G.key){
        G.key=true;
        const mask=document.getElementById('mask1');
        const icon=document.getElementById('slotKey');
        if(mask)mask.style.display='none';
        if(icon)icon.style.display='block';

        const check=document.getElementById('checkB');
        if(check){
          check.textContent='☑';
          check.parentElement.classList.add('done');
        }

        message('El cofre se abre. Dentro estaba la llave dorada.');
      }else{
        message('El cofre ya está vacío.');
      }
      return;
    }

    if(target==='desk'){
      if(!G.key){
        message('El escritorio está cerrado. Primero necesitas la llave.');
      }else if(!G.symbolSolved){
        document.getElementById('symbolPuzzle')?.classList.add('show');
      }else{
        message('El escritorio ya reveló su secreto.');
      }
    }
  }

  return{scan,message,reveal,use};
})();
