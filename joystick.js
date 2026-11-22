window.Joystick=(()=>{
  let active=false;
  let pointerId=null;
  let v={x:0,y:0};
  let center={x:0,y:0};

  function reset(){
    active=false;
    pointerId=null;
    v={x:0,y:0};
    const k=document.getElementById('knob');
    if(k)k.style.transform='translate(-50%,-50%)';
  }

  function init(){
    const zone=document.getElementById('joystick');
    const knob=document.getElementById('knob');
    if(!zone||!knob)return;

    function update(e){
      if(!active||e.pointerId!==pointerId)return;

      const dx=e.clientX-center.x;
      const dy=e.clientY-center.y;
      const mag=Math.hypot(dx,dy)||1;
      const radius=Math.min(46,mag);

      v={
        x:dx/mag*(radius/46),
        y:dy/mag*(radius/46)
      };

      knob.style.transform=`translate(calc(-50% + ${v.x*42}px),calc(-50% + ${v.y*42}px))`;
    }

    zone.addEventListener('pointerdown',e=>{
      e.preventDefault();
      active=true;
      pointerId=e.pointerId;

      const b=zone.getBoundingClientRect();
      center={x:b.left+b.width/2,y:b.top+b.height/2};

      try{zone.setPointerCapture(e.pointerId)}catch(_){}
      update(e);
    },{passive:false});

    zone.addEventListener('pointermove',e=>{
      e.preventDefault();
      update(e);
    },{passive:false});

    zone.addEventListener('pointerup',e=>{
      if(e.pointerId===pointerId)reset();
    });

    zone.addEventListener('pointercancel',reset);
    zone.addEventListener('lostpointercapture',reset);

    window.addEventListener('blur',reset);
  }

  return{init,get:()=>v};
})();
