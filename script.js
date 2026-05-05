const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 🔥 canvas correto (DPR fix)
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// detectar mobile
const isMobile = window.matchMedia("(pointer: coarse)").matches;

// 💓 sistema
const particles = [];
const flowers = [];
const petals = [];
const ambient = [];

const PARTICLE_COUNT = isMobile ? 800 : 2000;
const FLOWER_COUNT = isMobile ? 15 : 25;
const PETAL_COUNT = isMobile ? 20 : 40;
const AMBIENT_COUNT = isMobile ? 40 : 80;

let time = 0;

// 🎵 áudio
const audio = document.getElementById("music");
let audioCtx;

// 📸 polaroids
const polaroidContainer = document.getElementById("polaroids");
let polaroidsShown = false;

const images = [
  "Imagens/1.jpeg","Imagens/2.jpeg","Imagens/3.jpeg","Imagens/4.jpeg",
  "Imagens/5.jpeg","Imagens/6.jpeg","Imagens/7.jpeg","Imagens/8.jpeg"
];

// ================= MOBILE =================
let currentIndex = 0;
let currentPolaroid = null;

function createMobilePolaroid(src) {
  const div = document.createElement("div");
  div.className = "polaroid";

  const img = document.createElement("img");
  img.src = src;

  div.appendChild(img);
  polaroidContainer.appendChild(div);

  setTimeout(() => div.classList.add("active"), 50);

  return div;
}

function showNextPhoto() {
  if (currentPolaroid) {
    currentPolaroid.classList.remove("active");
    currentPolaroid.classList.add("exit");
  }

  if (currentIndex >= images.length) return;

  currentPolaroid = createMobilePolaroid(images[currentIndex]);
  currentIndex++;
}

function startMobileExperience() {
  showNextPhoto();

  setTimeout(() => {
    window.addEventListener("touchstart", showNextPhoto);
  }, 300);
}

// ================= DESKTOP =================
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getSafePosition() {
  const margin = 100;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  let x, y;

  do {
    x = Math.random() * (window.innerWidth - 200 - margin) + margin;
    y = Math.random() * (window.innerHeight - 200 - margin) + margin;
  } while (Math.abs(x - cx) < 200 && Math.abs(y - cy) < 150);

  return { x, y };
}

function createDesktopPolaroid(src, index) {
  const div = document.createElement("div");
  div.className = "polaroid";

  const img = document.createElement("img");
  img.src = src;

  div.appendChild(img);

  const { x, y } = getSafePosition();
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  div.style.setProperty("--rotate", (Math.random()*30-15)+"deg");

  polaroidContainer.appendChild(div);

  setTimeout(() => div.classList.add("show"), 100);
}

function startDesktopExperience() {
  shuffle([...images]).forEach((src, i) => {
    setTimeout(() => createDesktopPolaroid(src, i), i * 1200);
  });
}

function showPolaroids() {
  if (polaroidsShown) return;
  polaroidsShown = true;

  isMobile ? startMobileExperience() : startDesktopExperience();
}

// 🎵 áudio
function setupAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// start
const startExperience = () => {
  if (!audioCtx) setupAudio();

  audioCtx.resume();
  audio.play().catch(() => {});

  setTimeout(() => {
    document.querySelector(".message").classList.add("show");
  }, 3000);

  setTimeout(showPolaroids, 5000);
};

window.addEventListener("click", startExperience, { once: true });
window.addEventListener("touchstart", startExperience, { once: true });

// ❤️ coração
function heart(t){
  return {
    x:16*Math.sin(t)**3,
    y:13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)
  };
}

// partículas
for(let i=0;i<PARTICLE_COUNT;i++){
  const t=Math.random()*Math.PI*2;
  const h=heart(t);
  particles.push({x:0,y:0,tx:h.x,ty:h.y});
}

// 🌸 flores
function createFlower() {
  const t = Math.random() * Math.PI * 2;
  const h = heart(t);

  return {
    x: window.innerWidth/2 + h.x*18,
    y: window.innerHeight/2 - h.y*18,
    size: 0,
    maxSize: 8 + Math.random()*10,
    growth: 0.03 + Math.random()*0.04,
    life: 0,
    maxLife: 150 + Math.random()*150,
    rot: Math.random()*Math.PI
  };
}
for(let i=0;i<FLOWER_COUNT;i++) flowers.push(createFlower());

function drawFlower(f){
  ctx.save();
  ctx.translate(f.x,f.y);
  ctx.rotate(f.rot);

  for(let i=0;i<6;i++){
    ctx.rotate(Math.PI/3);
    ctx.beginPath();
    ctx.ellipse(0,f.size,f.size/2,f.size,0,0,Math.PI*2);
    ctx.fillStyle="rgba(255,182,193,0.7)";
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(0,0,f.size/3,0,Math.PI*2);
  ctx.fillStyle="#ffd166";
  ctx.fill();

  ctx.restore();
}

// 🍃 pétalas
function createPetal(){
  return {
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight,
    size:3+Math.random()*4,
    speedY:0.5+Math.random(),
    speedX:Math.random()-0.5,
    rot:Math.random()*Math.PI
  };
}
for(let i=0;i<PETAL_COUNT;i++) petals.push(createPetal());

// ✨ ambiente
for(let i=0;i<AMBIENT_COUNT;i++){
  ambient.push({
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight,
    size:Math.random()*2,
    speed:0.2+Math.random()*0.3
  });
}

// 🎬 animação
function animate(){
  time+=0.05;

  ctx.fillStyle="rgba(0,0,0,0.2)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // ambiente
  ctx.fillStyle="rgba(255,255,255,0.3)";
  ambient.forEach(p=>{
    p.y-=p.speed;
    if(p.y<0) p.y=window.innerHeight;

    ctx.fillRect(p.x,p.y,p.size,p.size);
  });

  // flores
  flowers.forEach((f,i)=>{
    f.life++;
    if(f.size<f.maxSize) f.size+=f.growth;

    if(f.life>f.maxLife) flowers[i]=createFlower();

    drawFlower(f);
  });

  // pétalas
  ctx.fillStyle="rgba(255,182,193,0.8)";
  petals.forEach(p=>{
    p.y+=p.speedY;
    p.x+=p.speedX;
    p.rot+=0.01;

    if(p.y>window.innerHeight) Object.assign(p,createPetal());

    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.fillRect(0,0,p.size,p.size*1.5);
    ctx.restore();
  });

  // coração
  const scale=15+Math.sin(time*2)*2;

  ctx.fillStyle="#ff4d6d";
  ctx.shadowBlur=15;
  ctx.shadowColor="#ff4d6d";

  particles.forEach(p=>{
    const tx=window.innerWidth/2+p.tx*scale;
    const ty=window.innerHeight/2-p.ty*scale;

    p.x+=(tx-p.x)*0.08;
    p.y+=(ty-p.y)*0.08;

    ctx.fillRect(p.x,p.y,2,2);
  });

  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

animate();