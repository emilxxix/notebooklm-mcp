// ---------- data ----------
const NICKNAMES = ["พี่อาย", "บิบี๋น้อย", "น้องจี๊ด", "ตาแป๋ว", "ที่รัก", "อายจัง"];

const ANNIVERSARY = new Date(2026, 2, 1); // 1 มี.ค. 2569

const TIMELINE = [
  { date: "2025-11-02", emoji: "💋", title: "💋" },
  { date: "2025-12-20", emoji: "⭐", title: "Star Day" },
  { date: "2026-03-01", emoji: "💗", title: "วันครบรอบของเรา" },
  { date: "2026-04-18", emoji: "🏠", title: "บิบี๋น้อยมาบ้านมิลครั้งแรก" },
];

const BIRTHDAYS = [
  { emoji: "🎂", title: "วันเกิดบิบี๋น้อย", desc: "12 Jun (every year)" },
  { emoji: "🎂", title: "วันเกิดอีมิล", desc: "29 Feb (every year)" },
];

const SURPRISE_MESSAGE = "ให้เลือกอีกกี่ครั้ง ก็ยังเลือกบิบี๋น้อยเหมือนเดิมนะ รักมาก 🤍";

// กิจกรรมของเรา — เพิ่มรูปใหม่: วางไฟล์ใน assets/activities/ แล้วเพิ่มบรรทัดที่นี่
const ACTIVITIES = [
  { date: "2025-10-17", emoji: "🎬", title: "ดูหนังเรื่องแรก ธี่หยด 3 @ Terminal21 Korat", photos: ["assets/activities/2025-10-17-1.jpeg"] },
  { date: "2025-12-04", emoji: "🎬", title: "ดูหนังเรื่องที่ 2 Zootopia 2 @ Terminal21 Korat", photos: ["assets/activities/2025-12-04-1.jpeg"] },
  { date: "2025-12-23", emoji: "🎬", title: "ดูหนังเรื่องที่ 3 Avatar 3 @ Terminal21 Korat", photos: ["assets/activities/2025-12-23-1.jpeg"] },
  { date: "2026-03-29", emoji: "🎬", title: "ดูหนังเรื่องที่ 4 Hoppers @ Central Ayutthaya", photos: ["assets/activities/2026-03-29-1.jpeg"] },
  { date: "2026-07-19", emoji: "🎨", title: "ระบายสีกัน @ร้านเติมศิลป์", photos: ["assets/activities/2026-07-19-1.jpeg"] },
];

// ---------- saved state (custom days + notes) ----------
const STORAGE_KEY = "love-webapp-data-v1";

let state = { customDays: [], notes: [] };

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.customDays = Array.isArray(parsed.customDays) ? parsed.customDays : [];
      state.notes = Array.isArray(parsed.notes) ? parsed.notes : [];
    }
  } catch (e) { /* corrupted storage — start fresh */ }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

loadState();

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
  // นับแบบรวมวันแรก (1 Mar = day 1) ให้ตรงกับแอพ Special Day
  const days = Math.floor((now - ANNIVERSARY) / (1000 * 60 * 60 * 24)) + 1;
  dayCountEl.textContent = days.toLocaleString("th-TH");
  const years = Math.floor(days / 365);
  const remDays = days - years * 365;
  counterSubEl.textContent = years > 0
    ? `about ${years} year${years > 1 ? "s" : ""} ${remDays} days`
    : `Almost 1 year together 🤍`;
}
updateCounter();
setInterval(updateCounter, 60 * 1000);

// ---------- timeline render ----------
const timelineEl = document.getElementById("timeline");

function renderTimeline() {
  timelineEl.innerHTML = "";

  const dated = [
    ...TIMELINE.map((t) => ({ ...t, custom: false })),
    ...state.customDays.map((t) => ({ ...t, emoji: t.emoji || "📌", custom: true })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  dated.forEach((item) => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.setAttribute("data-emoji", item.emoji);
    div.innerHTML = `
      <div class="t-date">${fmtDate(item.date)}</div>
      <div class="t-title"></div>
    `;
    div.querySelector(".t-title").textContent = item.title;
    timelineEl.appendChild(div);
  });

  BIRTHDAYS.forEach((item) => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.setAttribute("data-emoji", item.emoji);
    div.innerHTML = `
      <div class="t-date">${item.desc}</div>
      <div class="t-title"></div>
    `;
    div.querySelector(".t-title").textContent = item.title;
    timelineEl.appendChild(div);
  });
}

renderTimeline();

// ---------- journal ----------
const journalForm = document.getElementById("journal-form");
const jDate = document.getElementById("j-date");
const jText = document.getElementById("j-text");
const jType = document.getElementById("j-type");
const notesListEl = document.getElementById("notes-list");

jDate.valueAsDate = new Date();

function renderNotes() {
  notesListEl.innerHTML = "";

  const items = [
    ...state.notes.map((n) => ({ ...n, kind: "note" })),
    ...state.customDays.map((n) => ({ ...n, kind: "day" })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (items.length === 0) {
    notesListEl.innerHTML = `<p class="notes-empty">ยังไม่มีบันทึกเลย ลองเขียนความทรงจำแรกดูสิ 🩷</p>`;
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = `
      <span>${item.kind === "day" ? "📌" : "📝"}</span>
      <div class="n-body">
        <div class="n-date">${fmtDate(item.date)}${item.kind === "day" ? " · วันสำคัญ" : ""}</div>
        <div class="n-text"></div>
      </div>
      <button class="n-del" title="ลบ">✕</button>
    `;
    div.querySelector(".n-text").textContent = item.kind === "day" ? item.title : item.text;
    div.querySelector(".n-del").addEventListener("click", () => {
      if (item.kind === "day") {
        state.customDays = state.customDays.filter((d) => d.id !== item.id);
      } else {
        state.notes = state.notes.filter((d) => d.id !== item.id);
      }
      saveState();
      renderNotes();
      renderTimeline();
    });
    notesListEl.appendChild(div);
  });
}

renderNotes();

journalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = jDate.value;
  const text = jText.value.trim();
  if (!date || !text) return;

  if (jType.value === "day") {
    state.customDays.push({ id: Date.now(), date, title: text, emoji: "📌" });
  } else {
    state.notes.push({ id: Date.now(), date, text });
  }
  saveState();
  renderNotes();
  renderTimeline();
  jText.value = "";
  const rect = journalForm.getBoundingClientRect();
  burstHearts(rect.left + rect.width / 2, rect.top + 20, 10);
});

// ---------- backup: export .md ----------
const backupStatusEl = document.getElementById("backup-status");

function buildBackupMarkdown() {
  const now = new Date();
  const lines = [];
  lines.push("# 💗 ไฟล์สำรองข้อมูล — เว็บของพี่อาย");
  lines.push("");
  lines.push(`สำรองเมื่อ: ${now.toLocaleString("th-TH")}`);
  lines.push("");
  lines.push("## วันสำคัญ (ในเว็บ)");
  TIMELINE.forEach((t) => lines.push(`- ${t.emoji} ${t.title} — ${fmtDate(t.date)}`));
  BIRTHDAYS.forEach((t) => lines.push(`- ${t.emoji} ${t.title} — ${t.desc}`));
  lines.push("");
  lines.push("## วันสำคัญที่เพิ่มเอง");
  if (state.customDays.length === 0) lines.push("- (ยังไม่มี)");
  state.customDays.forEach((t) => lines.push(`- ${t.emoji || "📌"} ${t.title} — ${fmtDate(t.date)}`));
  lines.push("");
  lines.push("## บันทึกความทรงจำ");
  if (state.notes.length === 0) lines.push("- (ยังไม่มี)");
  state.notes.forEach((n) => lines.push(`- [${fmtDate(n.date)}] ${n.text}`));
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("<!-- LOVE-WEBAPP-BACKUP");
  lines.push(JSON.stringify({ version: 1, customDays: state.customDays, notes: state.notes }));
  lines.push("-->");
  lines.push("");
  return lines.join("\n");
}

document.getElementById("export-btn").addEventListener("click", () => {
  const md = buildBackupMarkdown();
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  a.href = url;
  a.download = `love-backup-${stamp}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  backupStatusEl.textContent = "ดาวน์โหลดไฟล์สำรองแล้ว 💾🩷";
});

// ---------- backup: import .md ----------
document.getElementById("import-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result);
      const match = text.match(/<!-- LOVE-WEBAPP-BACKUP\s*\n([\s\S]*?)\n-->/);
      if (!match) throw new Error("ไม่พบข้อมูลสำรองในไฟล์นี้");
      const data = JSON.parse(match[1]);
      if (!Array.isArray(data.customDays) || !Array.isArray(data.notes)) {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
      }
      state.customDays = data.customDays;
      state.notes = data.notes;
      saveState();
      renderNotes();
      renderTimeline();
      backupStatusEl.textContent = `กู้คืนข้อมูลสำเร็จ! (วันสำคัญ ${state.customDays.length} · บันทึก ${state.notes.length}) 🥰`;
    } catch (err) {
      backupStatusEl.textContent = `อัพโหลดไม่สำเร็จ: ${err.message} 😢`;
    }
    e.target.value = "";
  };
  reader.readAsText(file, "utf-8");
});

// ---------- activity calendar ----------
const activityMap = {};
ACTIVITIES.forEach((a) => { activityMap[a.date] = a; });

const calTitleEl = document.getElementById("cal-title");
const calGridEl = document.getElementById("cal-grid");
const dayView = document.getElementById("day-view");
const dayViewTitle = document.getElementById("day-view-title");
const dayViewPhotos = document.getElementById("day-view-photos");

let calYear, calMonth;
{
  const latest = ACTIVITIES.map((a) => a.date).sort().pop();
  const base = latest ? new Date(latest) : new Date();
  calYear = base.getFullYear();
  calMonth = base.getMonth();
}

const pad2 = (n) => String(n).padStart(2, "0");

function renderCalendar() {
  calTitleEl.textContent = new Date(calYear, calMonth, 1)
    .toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  calGridEl.innerHTML = "";

  ["S", "M", "T", "W", "T", "F", "S"].forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-dow";
    el.textContent = d;
    calGridEl.appendChild(el);
  });

  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

  for (let i = 0; i < firstDow; i++) {
    calGridEl.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${calYear}-${pad2(calMonth + 1)}-${pad2(d)}`;
    const act = activityMap[iso];
    const el = document.createElement("div");
    el.className = "cal-day";
    if (iso === todayIso) el.classList.add("cal-today");
    el.innerHTML = `<span>${d}</span>`;
    if (act) {
      el.classList.add("cal-active");
      el.innerHTML += `<span class="cal-mark">🤍</span>`;
      el.addEventListener("click", () => openDayView(act));
    }
    calGridEl.appendChild(el);
  }
}

function openDayView(act) {
  dayViewTitle.textContent = `${act.emoji} ${act.title} · ${fmtDate(act.date)}`;
  dayViewPhotos.innerHTML = "";
  act.photos.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = act.title;
    img.loading = "lazy";
    dayViewPhotos.appendChild(img);
  });
  dayView.classList.add("open");
}

document.getElementById("cal-prev").addEventListener("click", () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

document.getElementById("cal-next").addEventListener("click", () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

document.getElementById("day-view-close").addEventListener("click", () => {
  dayView.classList.remove("open");
});

dayView.addEventListener("click", (e) => {
  if (e.target === dayView) dayView.classList.remove("open");
});

renderCalendar();

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

const surprisePhotoEl = document.getElementById("surprise-photo");

surpriseBtn.addEventListener("click", () => {
  surprisePhotoEl.classList.add("show");
  surpriseMsgEl.textContent = SURPRISE_MESSAGE;
  surpriseMsgEl.classList.add("show");
  setTimeout(fireworkAroundPhoto, 350);
});

// white hearts bursting outward around the photo, firework style
function fireworkAroundPhoto() {
  const rect = surprisePhotoEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const radius = Math.max(rect.width, rect.height) / 2 + 10;
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2 + wave * 0.25;
        const sx = cx + Math.cos(angle) * radius * 0.85;
        const sy = cy + Math.sin(angle) * radius * 0.85;
        const el = document.createElement("span");
        el.className = "burst-heart";
        el.textContent = "🤍";
        const dist = 55 + Math.random() * 75;
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        el.style.setProperty("--bx", `${Math.cos(angle) * dist}px`);
        el.style.setProperty("--by", `${Math.sin(angle) * dist}px`);
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 950);
      }
    }, wave * 280);
  }
}

// ---------- ambient floating hearts ----------
const HEART_EMOJI = ["💗", "💕", "💖", "🩷", "💘", "❤️", "🤍"];
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

const NO_BURST = "#surprise-btn, .gallery, .lightbox, .journal-form, .note-item, .backup-buttons, .calendar-card, .day-view, input, select, button, label";

document.addEventListener("click", (e) => {
  if (e.target.closest(NO_BURST)) return;
  burstHearts(e.clientX, e.clientY, 8);
});

document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (!t || e.target.closest(NO_BURST)) return;
  burstHearts(t.clientX, t.clientY, 8);
}, { passive: true });
