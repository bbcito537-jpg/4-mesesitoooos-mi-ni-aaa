
window.Joystick=(()=>{let active=false,v={x:0,y:0},center={x:0,y:0};
function init(){const z=document.getElementById('joystick'),k=document.getElementById('knob');function set(e){const dx=e.clientX-center.x,dy=e.clientY-center.y,m=Math.hypot(dx,dy)||1,r=Math.min(46,m);v={x:dx/m*(r/46),y:dy/m*(r/46)};k.style.transform=`translate(calc(-50% + ${v.x*42}px),calc(-50% + ${v.y*42}px))`}z.addEventListener('pointerdown',e=>{active=true;const b=z.getBoundingClientRect();center={x:b.left+b.width/2,y:b.top+b.height/2};z.setPointerCapture(e.pointerId);set(e)});z.addEventListener('pointermove',e=>active&&set(e));['pointerup','pointercancel'].forEach(ev=>z.addEventListener(ev,()=>{active=false;v={x:0,y:0};k.style.transform='translate(-50%,-50%)'}))}
return{init,get:()=>v}})();
