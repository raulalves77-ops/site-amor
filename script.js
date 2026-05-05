const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const polaroidContainer = document.getElementById("polaroids");
const audio = document.getElementById("music");
const message = document.querySelector(".message");

let particles = [];
let flowers = [];
let petals = [];
let ambient = [];
let time = 0;
let audioCtx;
let polaroidsShown = false;

// Imagens (Verifique se os caminhos estão corretos no seu GitHub)
const images = [
    "files/1.jpeg","files/2.jpeg","files/3.jpeg","files/4.jpeg",
    "files/5.jpeg","files/6.jpeg","files/7.jpeg","files/8.jpeg"
];

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

const isMobile = window.matchMedia("(pointer: coarse)").matches;

// ❤️ Definição do Coração
function heart(t) {
    return {
        x: 16 * Math.sin(t) ** 3,
        y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    };
}

// Inicializar Partículas
const PARTICLE_COUNT = isMobile ? 600 : 1500;
for(let i=0; i<PARTICLE_COUNT; i++){
    const t = Math.random() * Math.PI * 2;
    const h = heart(t);
    particles.push({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, tx: h.x, ty: h.y });
}

// --- LOGICA POLAROIDS ---
let currentIndex = 0;
let currentPolaroid = null;

function createMobilePolaroid(src) {
    const div = document.createElement("div");
    div.className = "polaroid";
    const img = document.createElement("img");
    img.src = src;
    div.appendChild(img);
    polaroidContainer.appendChild(div);
    setTimeout(() => div.classList.add("active"), 100);
    return div;
}

function showNextPhoto() {
    if (currentPolaroid) {
        currentPolaroid.classList.remove("active");
        currentPolaroid.classList.add("exit");
        const prev = currentPolaroid;
        setTimeout(() => prev.remove(), 1000);
    }
    if (currentIndex >= images.length) {
        currentIndex = 0; // Reinicia o ciclo de fotos
    }
    currentPolaroid = createMobilePolaroid(images[currentIndex]);
    currentIndex++;
}

function startExperience() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audio.play().catch(() => {});
    
    message.classList.add("show");

    setTimeout(() => {
        if (polaroidsShown) return;
        polaroidsShown = true;
        
        if (isMobile) {
            showNextPhoto();
            window.addEventListener("touchstart", (e) => {
                if(e.target.tagName !== "CANVAS") showNextPhoto();
            });
        } else {
            images.forEach((src, i) => {
                setTimeout(() => {
                    const div = document.createElement("div");
                    div.className = "polaroid";
                    div.style.setProperty("--rotate", (Math.random()*20-10)+"deg");
                    const img = document.createElement("img");
                    img.src = src;
                    div.appendChild(img);
                    
                    const margin = 150;
                    div.style.left = (Math.random() * (window.innerWidth - 200 - margin) + margin/2) + "px";
                    div.style.top = (Math.random() * (window.innerHeight - 200 - margin) + margin/2) + "px";
                    
                    polaroidContainer.appendChild(div);
                    setTimeout(() => div.classList.add("show"), 100);
                }, i * 1500);
            });
        }
    }, 3000);
}

window.addEventListener("click", startExperience, { once: true });
window.addEventListener("touchstart", startExperience, { once: true });

// --- ANIMAÇÃO ---
function animate() {
    time += 0.05;
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = isMobile ? 10 + Math.sin(time)*1 : 15 + Math.sin(time)*2;

    ctx.fillStyle = "#ff4d6d";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff4d6d";

    particles.forEach(p => {
        const tx = centerX + p.tx * scale;
        const ty = centerY - p.ty * scale;
        p.x += (tx - p.x) * 0.07;
        p.y += (ty - p.y) * 0.07;
        ctx.fillRect(p.x, p.y, 2, 2);
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
}
animate();
