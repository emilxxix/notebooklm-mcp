// ---------- data ----------
const NICKNAMES = ["พี่อาย", "บิบี๋น้อย", "น้องจี๊ด", "ตาแป๋ว", "ที่รัก", "อายจัง"];

const ANNIVERSARY = new Date(2026, 2, 1); // 1 มี.ค. 2569

const TIMELINE = [
  { date: new Date(2025, 10, 2), emoji: "💋", title: "จูบแรกของเรา", desc: "2 พฤศจิกายน 2568" },
  { date: new Date(2025, 11, 20), emoji: "⭐", title: "Star Day", desc: "20 ธันวาคม 2568" },
  { date: new Date(2026, 2, 1), emoji: "💗", title: "วันครบรอบของเรา", desc: "1 มีนาคม 2569" },
  { date: new Date(2026, 3, 18), emoji: "🐰", title: "ย้ายมาอยู่ด้วยกัน", desc: "18 เมษายน 2569" },
];

const BIRTHDAYS = [
  { emoji: "🎂", title: "วันเกิดพี่อาย (บิบี๋)", desc: "12 มิถุนายน" },
  { emoji: "🎂", title: "วันเกิดเอมิล", desc: "29 กุมภาพันธ์" },
];

const SURPRISES = [
  "รู้ไหมว่าทุกครั้งที่คิดถึงพี่อาย ปากมันจะยิ้มเองโดยไม่รู้ตัว 🩷",
  "ถ้าให้เลือกใหม่อีกกี่รอบ ก็ยังจะเลือกพี่อายเหมือนเดิมทุกครั้งนะ",
  "อายจัง เป็นคำที่จริงที่สุดในโลกเลย 😳💗",
  "ขอบคุณที่เป็นบิบี๋น้อยของผม ในทุกวันที่ผ่านมา",
  "เก็บทุกวันที่มีพี่อายไว้เป็นวันโปรดตลอดไป",
  "พี่อายคือเหตุผลที่ทำให้วันธรรมดากลายเป็นวันพิเศษ",
  "น้องจี๊ด ตาแป๋ว ที่รัก... เรียกยังไงก็รักหมดเลย 🥹",
  "ไม่ว่าจะอีกกี่ 132 วัน กี่ปี ผมก็ยังอยากอยู่ตรงนี้กับพี่อาย",
];

// ---------- nickname rotator ----------
const nickEl = document.getElementById("nickname-rotator");
let nickIndex = 0;
setInterval(() => {
  nickIndex = (nickIndex + 1) % NICKNAMES.length;
  nickEl.style.opacity = 0;
  setTimeout(() => {
    nickEl.textContent = NICKNAMES[nickIndex];
    nickEl.style.opacity = 1;
  }, 350);
}, 2200);

// ---------- day counter ----------
const dayCountEl = document.getElementById("day-count");
const counterSubEl = document.getElementById("counter-sub");

function updateCounter() {
  const now = new Date();
  const diffMs = now - ANNIVERSARY;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  dayCountEl.textContent = days.toLocaleString("th-TH");
  const years = Math.floor(days / 365);
  const remDays = days - years * 365;
  counterSubEl.textContent = years > 0
    ? `หรือประมาณ ${years} ปี ${remDays} วัน`
    : `อีกไม่นานจะครบ 1 ปีแล้วนะ`;
}
updateCounter();
setInterval(updateCounter, 60 * 1000);

// ---------- timeline render ----------
const timelineEl = document.getElementById("timeline");
const fmt = (d) => d; // dates already pre-formatted in desc

TIMELINE.forEach((item) => {
  const div = document.createElement("div");
  div.className = "timeline-item";
  div.setAttribute("data-emoji", item.emoji);
  div.innerHTML = `
    <div class="t-date">${item.desc}</div>
    <div class="t-title">${item.title}</div>
  `;
  timelineEl.appendChild(div);
});

BIRTHDAYS.forEach((item) => {
  const div = document.createElement("div");
  div.className = "timeline-item";
  div.setAttribute("data-emoji", item.emoji);
  div.innerHTML = `
    <div class="t-date">${item.desc} (ทุกปี)</div>
    <div class="t-title">${item.title}</div>
  `;
  timelineEl.appendChild(div);
});

// ---------- gallery lightbox ----------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.getElementById("gallery").addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    lightboxImg.src = e.target.src;
    lightbox.classList.add("open");
  }
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("open");
  lightboxImg.src = "";
});

// ---------- surprise button ----------
const surpriseBtn = document.getElementById("surprise-btn");
const surpriseMsgEl = document.getElementById("surprise-message");

surpriseBtn.addEventListener("click", (e) => {
  const msg = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
  surpriseMsgEl.textContent = msg;
  surpriseMsgEl.classList.add("show");
  burstHearts(e.clientX, e.clientY, 14);
});

// ---------- ambient floating hearts ----------
const HEART_EMOJI = ["💗", "💕", "💖", "🩷", "💘", "❤️"];
const heartField = document.getElementById("heart-field");

function spawnAmbientHeart() {
  const el = document.createElement("span");
  el.className = "ambient-heart";
  el.textContent = HEART_EMOJI[Math.floor(Math.random() * HEART_EMOJI.length)];
  const startX = Math.random() * 100;
  const drift = (Math.random() - 0.5) * 160;
  const duration = 7 + Math.random() * 6;
  const size = 14 + Math.random() * 18;
  el.style.left = `${startX}vw`;
  el.style.fontSize = `${size}px`;
  el.style.setProperty("--drift", `${drift}px`);
  el.style.animationDuration = `${duration}s`;
  heartField.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 200);
}

setInterval(spawnAmbientHeart, 900);
for (let i = 0; i < 5; i++) setTimeout(spawnAmbientHeart, i * 300);

// ---------- click / tap burst hearts ----------
function burstHearts(x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "burst-heart";
    el.textContent = HEART_EMOJI[Math.floor(Math.random() * HEART_EMOJI.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 90;
    const bx = Math.cos(angle) * dist;
    const by = Math.sin(angle) * dist - 30;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--bx", `${bx}px`);
    el.style.setProperty("--by", `${by}px`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 950);
  }
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#surprise-btn") || e.target.closest(".gallery") || e.target.closest(".lightbox")) return;
  burstHearts(e.clientX, e.clientY, 8);
});

document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (!t) return;
  burstHearts(t.clientX, t.clientY, 8);
}, { passive: true });
