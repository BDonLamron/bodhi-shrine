function randomPosition(max){return Math.floor(Math.random()*max);}
function createHeart(){const e=document.createElement('div');e.className='heart';
e.style.left=randomPosition(window.innerWidth)+'px';e.innerHTML=Math.random()>0.5?'💖':'🌹';
document.body.appendChild(e);setTimeout(()=>{e.remove();},10000);}setInterval(createHeart,400);
document.getElementById('balloonButton').addEventListener('click',()=>{
  const b=document.createElement('div');b.className='balloon';b.style.left=randomPosition(window.innerWidth)+'px';
  b.innerHTML='🎈';b.style.top='100%';b.style.animation='fall 10s linear infinite reverse';document.body.appendChild(b);
  setTimeout(()=>{b.remove();},10000);});
document.getElementById('confettiButton').addEventListener('click',()=>{
  for(let i=0;i<30;i++){const c=document.createElement('div');c.className='confetti';c.style.left=randomPosition(window.innerWidth)+'px';
  c.innerHTML='🎊';document.body.appendChild(c);setTimeout(()=>{c.remove();},5000);} });
document.getElementById('lanternButton').addEventListener('click',()=>{
  for(let i=0;i<5;i++){const l=document.createElement('div');l.className='lantern';l.style.left=randomPosition(window.innerWidth)+'px';
  l.innerHTML='🏮';l.style.top='100%';l.style.animation='fall 20s linear infinite reverse';document.body.appendChild(l);
  setTimeout(()=>{l.remove();},20000);} });
function lightCandle(){const n=document.getElementById('candleName').value||"Anonymous";
const area=document.getElementById('candleArea');const c=document.createElement('div');c.className='candle';
c.innerHTML='🕯️ '+n;area.appendChild(c);const candles=JSON.parse(localStorage.getItem('candles')||'[]');
candles.push(n);localStorage.setItem('candles',JSON.stringify(candles));}
function loadCandles(){const candles=JSON.parse(localStorage.getItem('candles')||'[]');
const area=document.getElementById('candleArea');candles.forEach(n=>{const c=document.createElement('div');
c.className='candle';c.innerHTML='🕯️ '+n;area.appendChild(c);});}loadCandles();
function leaveGift(i){const g=document.createElement('span');g.className='gift';g.innerHTML=i;
g.style.position='absolute';g.style.left=randomPosition(window.innerWidth-50)+'px';
g.style.top=randomPosition(window.innerHeight-50)+'px';document.body.appendChild(g);
const gifts=JSON.parse(localStorage.getItem('gifts')||'[]');gifts.push({icon:i,x:g.style.left,y:g.style.top});
localStorage.setItem('gifts',JSON.stringify(gifts));}
function loadGifts(){const gifts=JSON.parse(localStorage.getItem('gifts')||'[]');
gifts.forEach(o=>{const g=document.createElement('span');g.className='gift';g.innerHTML=o.icon;g.style.position='absolute';
g.style.left=o.x;g.style.top=o.y;document.body.appendChild(g);});}loadGifts();
function addMessage(){const i=document.getElementById('messageInput');const m=i.value.trim();
if(m){const msgs=JSON.parse(localStorage.getItem('messages')||'[]');msgs.push(m);
localStorage.setItem('messages',JSON.stringify(msgs));displayMessages();i.value='';}}
function displayMessages(){const msgs=JSON.parse(localStorage.getItem('messages')||'[]');const ul=document.getElementById('messages');
ul.innerHTML='';msgs.forEach(m=>{const li=document.createElement('li');li.textContent=m;ul.appendChild(li);});}displayMessages();
document.getElementById('themeToggle').addEventListener('click',()=>{
document.body.classList.toggle('theme-emo');document.body.classList.toggle('theme-serene');});
document.getElementById('muteToggle').addEventListener('click',()=>{const f=document.getElementById('musicFrame');
f.src=f.src.includes('mute=1')?f.src.replace('mute=1','mute=0'):f.src+'&mute=1';});
const canvas=document.getElementById('fireworksCanvas');const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;canvas.height=window.innerHeight;
class Firework{constructor(x,y,c){this.x=x;this.y=y;this.c=c;this.p=[];for(let i=0;i<100;i++){this.p.push({x:x,y:y,
a:Math.random()*2*Math.PI,s:Math.random()*5+2,r:2,l:100});}}update(){this.p.forEach(p=>{p.x+=Math.cos(p.a)*p.s;
p.y+=Math.sin(p.a)*p.s;p.l-=2;});this.p=this.p.filter(p=>p.l>0);}draw(){this.p.forEach(p=>{ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=this.c[Math.floor(Math.random()*this.c.length)];ctx.fill();});}}
let fw=[];function launchFirework(x,y){const c=['#ff66ff','#ff3399','#ffcc00','#00ccff','#ffffff'];fw.push(new Firework(x,y,c));}
document.getElementById('fireworksButton').addEventListener('click',()=>{launchFirework(randomPosition(window.innerWidth),randomPosition(window.innerHeight/2));});
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);fw.forEach(f=>{f.update();f.draw(ctx);});fw=fw.filter(f=>f.p.length>0);requestAnimationFrame(animate);}animate();
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
function angelWings(){const w=document.createElement('div');w.className='angel-wings';w.innerHTML='🪽🪽';
document.body.appendChild(w);setTimeout(()=>{w.remove();},6000);}

function updateVisitorCount(){let c=Number(localStorage.getItem('visitCount')||0)+1;localStorage.setItem('visitCount',c);document.getElementById('visitorCount').textContent='You are visitor #'+c;}
updateVisitorCount();

document.getElementById('shareButton').addEventListener('click',async()=>{
  const data={title:'Bodhi Memorial Shrine',text:'Remembering Bodhi 🐾',url:window.location.href};
  if(navigator.share){try{await navigator.share(data);}catch(e){console.error(e);}}
  else{navigator.clipboard.writeText(data.url).then(()=>alert('Link copied to clipboard!'));}
});
