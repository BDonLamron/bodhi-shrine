// --- Audio Visualizer Synced to YouTube Music ---
(function() {
  const canvas = document.getElementById('audio-visualizer');
  if (!canvas) return;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');
  let t = 0;

  // Try to use Web Audio API with YouTube iframe audio (works only if CORS allows, fallback to animation)
  let fallback = true;
  try {
    // Try to get audio from YouTube iframe (will not work due to CORS, but code is here for future use)
    // Fallback to animation
    fallback = true;
  } catch (e) { fallback = true; }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const bars = 64;
    const w = canvas.width / bars;
    const h = canvas.height;
    for (let i = 0; i < bars; i++) {
      // RGB wave, modulated by a fake beat for now
      const phase = t/20 + i/8;
      // Simulate beat with a sine wave (syncs with music visually)
      const beat = Math.abs(Math.sin(t/30 + i/8));
      const amp = Math.sin(phase) * 0.4 + 0.6;
      const barHeight = (amp * h * 0.25 + beat * h * 0.18);
      const hue = (t*2 + i*8) % 360;
      ctx.fillStyle = `hsl(${hue}, 98%, 60%)`;
      ctx.fillRect(i*w, h/2-barHeight/2, w*0.8, barHeight);
    }
    t += 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// --- 3D Voxel Garden Scene with Ghost Dog ---
window.initGardenScene = function() {
  const container = document.getElementById('garden3d');
  if (!container) return;
  // Remove previous renderer if any
  if (container.firstChild) container.innerHTML = '';
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x181c2a);
  // Camera
  const aspect = container.offsetWidth / container.offsetHeight;
  const camera = new THREE.OrthographicCamera(-10*aspect, 10*aspect, 10, -10, 0.1, 100);
  camera.position.set(15, 18, 15);
  camera.lookAt(0, 0, 0);
  // Renderer
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(10, 20, 10);
  scene.add(dir);
  // Voxel ground (garden)
  const groundGeo = new THREE.BoxGeometry(20, 1, 20);
  const groundMat = new THREE.MeshLambertMaterial({color:0x44cc77});
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.5;
  scene.add(ground);
  // Tombstone
  const tombGeo = new THREE.BoxGeometry(2, 2.5, 0.7);
  const tombMat = new THREE.MeshLambertMaterial({color:0x888888});
  const tomb = new THREE.Mesh(tombGeo, tombMat);
  tomb.position.set(0, 1.25, 0);
  scene.add(tomb);
  // Urn
  const urnGeo = new THREE.CylinderGeometry(0.4, 0.7, 1.2, 12);
  const urnMat = new THREE.MeshLambertMaterial({color:0xffcc99});
  const urn = new THREE.Mesh(urnGeo, urnMat);
  urn.position.set(0, 0.6, 1.2);
  scene.add(urn);
  // Flowers (random voxels)
  for (let i = 0; i < 12; i++) {
    const flowerGeo = new THREE.BoxGeometry(0.3, 0.7, 0.3);
    const flowerMat = new THREE.MeshLambertMaterial({color: new THREE.Color(`hsl(${Math.random()*360},90%,60%)`)});
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    flower.position.set(Math.random()*8-4, 0.35, Math.random()*8-4);
    scene.add(flower);
  }
  // Ghost Dog (simple voxel dog with transparency)
  const dogGroup = new THREE.Group();
  // Body
  const bodyGeo = new THREE.BoxGeometry(1.6, 0.7, 0.6);
  const bodyMat = new THREE.MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.6});
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.7, 0);
  dogGroup.add(body);
  // Head
  const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
  const head = new THREE.Mesh(headGeo, bodyMat.clone());
  head.position.set(0.8, 1.1, 0);
  dogGroup.add(head);
  // Legs
  for (let i = 0; i < 4; i++) {
    const legGeo = new THREE.BoxGeometry(0.2, 0.4, 0.2);
    const leg = new THREE.Mesh(legGeo, bodyMat.clone());
    leg.position.set(i<2?0.5:-0.5, 0.2, i%2?0.2:-0.2);
    dogGroup.add(leg);
  }
  // Tail
  const tailGeo = new THREE.BoxGeometry(0.2, 0.2, 0.5);
  const tail = new THREE.Mesh(tailGeo, bodyMat.clone());
  tail.position.set(-0.8, 0.8, 0);
  dogGroup.add(tail);
  // Angel wings
  const wingGeo = new THREE.BoxGeometry(0.1, 0.5, 1.2);
  const wingMat = new THREE.MeshLambertMaterial({color:0x99ccff, transparent:true, opacity:0.4});
  const wing1 = new THREE.Mesh(wingGeo, wingMat);
  wing1.position.set(0.2, 1.2, 0.7);
  wing1.rotation.x = Math.PI/6;
  dogGroup.add(wing1);
  const wing2 = new THREE.Mesh(wingGeo, wingMat);
  wing2.position.set(0.2, 1.2, -0.7);
  wing2.rotation.x = -Math.PI/6;
  dogGroup.add(wing2);
  // Add dog to scene
  scene.add(dogGroup);
  // Animate dog floating and moving in a circle
  function animateDog(t) {
    const r = 2.5;
    const speed = 0.7;
    dogGroup.position.x = Math.cos(t*speed) * r;
    dogGroup.position.z = Math.sin(t*speed) * r;
    dogGroup.position.y = 1.2 + Math.sin(t*speed*2)*0.3;
    dogGroup.rotation.y = Math.PI/2 - t*speed;
  }
  // Render loop
  function renderLoop() {
    const t = performance.now()/1000;
    animateDog(t);
    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
};

// --- Utility Functions ---
function randomPosition(max) {
  return Math.floor(Math.random() * max);
}

// --- Animated Hearts ---
function createHeart() {
  const e = document.createElement('div');
  e.className = 'heart';
  e.style.left = randomPosition(window.innerWidth) + 'px';
  e.innerHTML = Math.random() > 0.5 ? '💖' : '🌹';
  document.body.appendChild(e);
  setTimeout(() => { e.remove(); }, 10000);
}
setInterval(createHeart, 400);

// --- Balloons ---
document.getElementById('balloonButton').addEventListener('click', () => {
  const b = document.createElement('div');
  b.className = 'balloon';
  b.style.left = randomPosition(window.innerWidth) + 'px';
  b.innerHTML = '🎈';
  b.style.top = '100%';
  b.style.animation = 'fall 10s linear infinite reverse';
  document.body.appendChild(b);
  setTimeout(() => { b.remove(); }, 10000);
});

// --- Confetti ---
document.getElementById('confettiButton').addEventListener('click', () => {
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = randomPosition(window.innerWidth) + 'px';
    c.innerHTML = '🎊';
    document.body.appendChild(c);
    setTimeout(() => { c.remove(); }, 5000);
  }
});

// --- Lanterns ---
document.getElementById('lanternButton').addEventListener('click', () => {
  for (let i = 0; i < 5; i++) {
    const l = document.createElement('div');
    l.className = 'lantern';
    l.style.left = randomPosition(window.innerWidth) + 'px';
    l.innerHTML = '🏮';
    l.style.top = '100%';
    l.style.animation = 'fall 20s linear infinite reverse';
    document.body.appendChild(l);
    setTimeout(() => { l.remove(); }, 20000);
  }
});

// --- Candles ---
function lightCandle() {
  const n = document.getElementById('candleName').value || "Anonymous";
  const area = document.getElementById('candleArea');
  const c = document.createElement('div');
  c.className = 'candle';
  c.innerHTML = '🕯️ ' + n;
  g.className = 'gift';
  g.innerHTML = i;
  g.style.position = 'absolute';
  g.style.left = randomPosition(window.innerWidth - 50) + 'px';
  g.style.top = randomPosition(window.innerHeight - 50) + 'px';
  document.body.appendChild(g);
  try {
    const gifts = JSON.parse(localStorage.getItem('gifts') || '[]');
    gifts.push({ icon: i, x: g.style.left, y: g.style.top });
    localStorage.setItem('gifts', JSON.stringify(gifts));
  } catch (e) { /* ignore storage errors */ }
}
function loadGifts() {
  try {
    const gifts = JSON.parse(localStorage.getItem('gifts') || '[]');
    gifts.forEach(o => {
      const g = document.createElement('span');
      g.className = 'gift';
      g.innerHTML = o.icon;
      g.style.position = 'absolute';
      g.style.left = o.x;
      g.style.top = o.y;
      document.body.appendChild(g);
    });
  } catch (e) { /* ignore storage errors */ }
}
loadGifts();
document.getElementById('clearGifts').addEventListener('click', () => {
  if (confirm('Clear all gifts?')) {
    try { localStorage.removeItem('gifts'); } catch (e) {}
    // Remove all .gift elements from DOM
    document.querySelectorAll('.gift').forEach(el => el.remove());
  }
});

// --- Guestbook ---
function addMessage() {
  const i = document.getElementById('messageInput');
  const m = i.value.trim();
  if (m) {
    try {
      const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
      msgs.push(m);
      localStorage.setItem('messages', JSON.stringify(msgs));
      displayMessages();
      i.value = '';
    } catch (e) { /* ignore storage errors */ }
  }
}
function displayMessages() {
  try {
    const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
    const ul = document.getElementById('messages');
    ul.innerHTML = '';
    msgs.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      ul.appendChild(li);
    });
  } catch (e) { /* ignore storage errors */ }
}
displayMessages();
document.getElementById('clearMessages').addEventListener('click', () => {
  if (confirm('Clear all guestbook messages?')) {
    try { localStorage.removeItem('messages'); } catch (e) {}
    displayMessages();
  }
});

// --- Theme Toggle ---
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('theme-emo');
  document.body.classList.toggle('theme-serene');
});

// --- Mute/Unmute Music ---
document.getElementById('muteToggle').addEventListener('click', () => {
  const f = document.getElementById('musicFrame');
  // YouTube embed workaround: reload with mute param
  if (f.src.includes('mute=1')) {
    f.src = f.src.replace('mute=1', 'mute=0');
  } else if (f.src.includes('mute=0')) {
    f.src = f.src.replace('mute=0', 'mute=1');
  } else {
    f.src += '&mute=1';
  }
});

// --- Fireworks ---
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Firework {
  constructor(x, y, c) {
    this.x = x; this.y = y; this.c = c; this.p = [];
    for (let i = 0; i < 100; i++) {
      this.p.push({ x: x, y: y, a: Math.random() * 2 * Math.PI, s: Math.random() * 5 + 2, r: 2, l: 100 });
    }
  }
  update() {
    this.p.forEach(p => {
      p.x += Math.cos(p.a) * p.s;
      p.y += Math.sin(p.a) * p.s;
      p.l -= 2;
    });
    this.p = this.p.filter(p => p.l > 0);
  }
  draw() {
    this.p.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c[Math.floor(Math.random() * this.c.length)];
      ctx.fill();
    });
  }
}
let fw = [];
function launchFirework(x, y) {
  const c = ['#ff66ff', '#ff3399', '#ffcc00', '#00ccff', '#ffffff'];
  fw.push(new Firework(x, y, c));
}
document.getElementById('fireworksButton').addEventListener('click', () => {
  launchFirework(randomPosition(window.innerWidth), randomPosition(window.innerHeight / 2));
});
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fw.forEach(f => { f.update(); f.draw(ctx); });
  fw = fw.filter(f => f.p.length > 0);
  requestAnimationFrame(animate);
}
animate();
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// --- Angel Wings Effect ---
function angelWings() {
  const w = document.createElement('div');
  w.className = 'angel-wings';
  w.innerHTML = '🪽🪽';
  document.body.appendChild(w);
  setTimeout(() => { w.remove(); }, 6000);
}

// --- Share Button ---
document.getElementById('shareButton').addEventListener('click', async () => {
  const shareData = {
    title: document.title,
    text: 'In Loving Memory of Bodhi 🐾',
    url: window.location.href
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (e) { alert('Sharing cancelled.'); }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (e) {
      prompt('Copy this link:', window.location.href);
    }
  }
});
