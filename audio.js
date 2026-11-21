
window.AudioManager=(()=>{let current=null,key=null,muted=false;
function fade(a,target,ms,done){if(!a){done&&done();return}const start=a.volume,steps=18,delta=(target-start)/steps;let i=0;const id=setInterval(()=>{i++;a.volume=Math.max(0,Math.min(1,start+delta*i));if(i>=steps){clearInterval(id);done&&done()}},ms/steps)}
function play(k){const src=MUSIC[k];if(!src)return;if(current&&key===k&&!current.paused)return;key=k;const next=new Audio(src);next.loop=true;next.preload='auto';next.volume=0;next.muted=muted;next.play().catch(()=>{});const old=current;current=next;fade(next,.56,600);if(old)fade(old,0,450,()=>old.pause())}
function toggle(){muted=!muted;if(current)current.muted=muted;return!muted}function stop(){if(current){current.pause();current=null;key=null}}return{play,toggle,stop}})();
