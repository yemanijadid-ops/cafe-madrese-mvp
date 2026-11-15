// کافه مدرسه – V1 Private Demo
const GATE_PASSWORD = "cafe1405";
const ADMIN_PASSWORD = "admin-cafe-v1";

let state = {
  studentName: "",
  caffeineAllowed: false,
  selectedSchool: null,
  map: null,
  markers: {},
  schoolMarkers: {},
  currentCafe: null,
  pendingItem: null
};

// ---------- Persistence ----------
function loadMenus() {
  const saved = localStorage.getItem("cm_menus");
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_MENUS));
}

function saveMenus(menus) {
  localStorage.setItem("cm_menus", JSON.stringify(menus));
}

function loadOrders() {
  const saved = localStorage.getItem("cm_orders");
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return [];
}

function saveOrders(orders) {
  localStorage.setItem("cm_orders", JSON.stringify(orders));
}

function getMinPerBreak() {
  return parseInt(localStorage.getItem("cm_min_per_break") || "3", 10);
}

function setMinPerBreak(n) {
  localStorage.setItem("cm_min_per_break", String(n));
}

// ---------- Gate ----------
document.getElementById("gate-btn").addEventListener("click", () => {
  const pw = document.getElementById("gate-password").value.trim();
  if (pw === GATE_PASSWORD) {
    document.getElementById("gate").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
    sessionStorage.setItem("cm_gate", "1");
  } else {
    toast("رمز اشتباه است");
  }
});

document.getElementById("gate-password").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("gate-btn").click();
});

if (sessionStorage.getItem("cm_gate") === "1") {
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

// ---------- Login ----------
document.getElementById("login-btn").addEventListener("click", () => {
  const name = document.getElementById("student-name").value.trim();
  if (!name) {
    toast("لطفاً نام خود را وارد کنید");
    return;
  }
  state.studentName = name;
  state.caffeineAllowed = document.getElementById("caffeine-ok").checked;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("user-display").textContent = name;
  initApp();
});

document.getElementById("student-name").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("login-btn").click();
});

function logout() {
  state.studentName = "";
  state.caffeineAllowed = false;
  state.selectedSchool = null;
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
  document.getElementById("student-name").value = "";
  document.getElementById("caffeine-ok").checked = false;
}

// ---------- Views ----------
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById("view-" + name).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(n => {
    n.classList.toggle("active", n.dataset.view === name);
  });
  if (name === "orders") renderOrders();
  if (name === "timeline") updateTimelineStatus();
}

// ---------- Map ----------
function initApp() {
  // Populate school select
  const sel = document.getElementById("school-select");
  sel.innerHTML = '<option value="">انتخاب مدرسه</option>';
  SCHOOLS.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name + " (" + s.area + ")";
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    const id = sel.value;
    if (!id) {
      state.selectedSchool = null;
      renderCafes([]);
      clearHighlights();
      return;
    }
    state.selectedSchool = id;
    const school = SCHOOLS.find(s => s.id === id);
    state.map.setView([school.lat, school.lng], 15);
    const nearby = getNearbyCafes(id);
    renderCafes(nearby);
    highlightNearby(nearby.map(c => c.id));
  });

  // Init map
  if (!state.map) {
    state.map = L.map("map", { zoomControl: false }).setView([35.78, 51.42], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(state.map);
    L.control.zoom({ position: "bottomleft" }).addTo(state.map);

    // School markers
    SCHOOLS.forEach(s => {
      const m = L.marker([s.lat, s.lng], {
        icon: L.divIcon({
          className: "school-marker",
          html: `<div style="background:#2c1810;color:#fff;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">🏫 ${s.name.split(' ').pop()}</div>`,
          iconSize: [120, 30],
          iconAnchor: [60, 15]
        })
      }).addTo(state.map);
      m.bindPopup(`<b>${s.name}</b><br>${s.area}`);
      state.schoolMarkers[s.id] = m;
    });

    // Cafe markers
    CAFES.forEach(c => {
      const m = L.circleMarker([c.lat, c.lng], {
        radius: 9,
        fillColor: "#c45c26",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(state.map);
      m.bindPopup(`<b>${c.name}</b><br>${c.address}<br><button onclick="openCafeMenu('${c.id}')" style="margin-top:6px;padding:4px 10px;border:none;background:#2c1810;color:#fff;border-radius:6px;cursor:pointer;font-family:inherit">مشاهده منو</button>`);
      m.on("click", () => openCafeMenu(c.id));
      state.markers[c.id] = m;
    });
  }

  updateTimelineStatus();
  document.getElementById("min-display").textContent = getMinPerBreak();
}

function clearHighlights() {
  Object.values(state.markers).forEach(m => {
    m.setStyle({ radius: 9, fillColor: "#c45c26", fillOpacity: 0.85 });
  });
}

function highlightNearby(ids) {
  Object.entries(state.markers).forEach(([id, m]) => {
    if (ids.includes(id)) {
      m.setStyle({ radius: 13, fillColor: "#e85d04", fillOpacity: 1 });
      m.bringToFront();
    } else {
      m.setStyle({ radius: 7, fillColor: "#aaa", fillOpacity: 0.5 });
    }
  });
}

function renderCafes(list) {
  const container = document.getElementById("cafes-list");
  const title = document.getElementById("cafes-title");
  const hint = document.getElementById("cafes-hint");

  if (!list.length) {
    container.innerHTML = "";
    title.textContent = "کافه‌های اطراف";
    hint.style.display = "block";
    hint.textContent = "ابتدا یک مدرسه انتخاب کنید تا کافه‌های نزدیک نمایش داده شوند.";
    return;
  }

  hint.style.display = "none";
  title.textContent = `کافه‌های نزدیک (${list.length})`;
  container.innerHTML = list.map(c => `
    <div class="cafe-card nearby" onclick="openCafeMenu('${c.id}')">
      <div class="cafe-icon">${c.icon || "☕"}</div>
      <div class="cafe-info">
        <h3>${c.name}</h3>
        <p>${c.address}</p>
        <p style="margin-top:4px;color:var(--accent);font-weight:500">${c.distance} متر</p>
      </div>
      <span class="cafe-badge">نزدیک</span>
    </div>
  `).join("");
}

// ---------- Menu ----------
function openCafeMenu(cafeId) {
  const cafe = CAFES.find(c => c.id === cafeId);
  if (!cafe) return;
  state.currentCafe = cafe;

  const menus = loadMenus();
  const menu = menus[cafeId] || DEFAULT_MENUS[cafeId];

  document.getElementById("menu-header").innerHTML = `
    <h2>${cafe.icon || "☕"} ${cafe.name}</h2>
    <p>${cafe.address}</p>
  `;

  let html = "";

  // Coffee section (conditional)
  if (state.caffeineAllowed && menu.coffee) {
    html += `
      <div class="menu-section" id="sec-coffee">
        <h3>نوشیدنی‌های بر پایه قهوه</h3>
        <div class="tabs">
          <button class="tab active" data-tab="hot" onclick="switchTab(this,'coffee')">گرم</button>
          <button class="tab" data-tab="cold" onclick="switchTab(this,'coffee')">سرد</button>
        </div>
        <div class="menu-items" id="items-coffee-hot">
          ${renderItems(menu.coffee.hot, cafeId)}
        </div>
        <div class="menu-items hidden" id="items-coffee-cold">
          ${renderItems(menu.coffee.cold, cafeId)}
        </div>
      </div>
    `;
  }

  // Non-caffeine
  if (menu.nonCaffeine) {
    html += `
      <div class="menu-section">
        <h3>نوشیدنی‌های بدون کافئین</h3>
        <div class="tabs">
          <button class="tab active" data-tab="hot" onclick="switchTab(this,'non')">گرم</button>
          <button class="tab" data-tab="cold" onclick="switchTab(this,'non')">سرد</button>
        </div>
        <div class="menu-items" id="items-non-hot">
          ${renderItems(menu.nonCaffeine.hot, cafeId)}
        </div>
        <div class="menu-items hidden" id="items-non-cold">
          ${renderItems(menu.nonCaffeine.cold, cafeId)}
        </div>
      </div>
    `;
  }

  // Sweets
  if (menu.sweets && menu.sweets.length) {
    html += `
      <div class="menu-section">
        <h3>کیک و شیرینی</h3>
        <div class="menu-items">
          ${renderItems(menu.sweets, cafeId)}
        </div>
      </div>
    `;
  }

  if (!state.caffeineAllowed) {
    html = `<div style="background:var(--accent-soft);padding:12px 14px;border-radius:12px;margin-bottom:16px;font-size:13px;color:var(--muted)">
      بخش نوشیدنی‌های بر پایه قهوه مخفی است چون تیک تأیید والدین در ورود فعال نشده.
    </div>` + html;
  }

  document.getElementById("menu-body").innerHTML = html;
  document.getElementById("menu-modal").classList.remove("hidden");
}

function renderItems(items, cafeId) {
  if (!items || !items.length) return '<p style="font-size:13px;color:var(--muted)">موردی نیست</p>';
  return items.map(it => `
    <div class="menu-item" onclick="startOrder('${cafeId}','${it.id}','${escapeHtml(it.name)}',${it.price})">
      <div>
        <div class="name">${it.name}</div>
        ${it.desc ? `<div class="desc">${it.desc}</div>` : ""}
      </div>
      <div class="price">${formatPrice(it.price)}</div>
    </div>
  `).join("");
}

function switchTab(btn, group) {
  const parent = btn.closest(".menu-section");
  parent.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  const tab = btn.dataset.tab;
  if (group === "coffee") {
    document.getElementById("items-coffee-hot").classList.toggle("hidden", tab !== "hot");
    document.getElementById("items-coffee-cold").classList.toggle("hidden", tab !== "cold");
  } else {
    document.getElementById("items-non-hot").classList.toggle("hidden", tab !== "hot");
    document.getElementById("items-non-cold").classList.toggle("hidden", tab !== "cold");
  }
}

function closeMenu() {
  document.getElementById("menu-modal").classList.add("hidden");
}

function escapeHtml(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// ---------- Order ----------
function startOrder(cafeId, itemId, name, price) {
  state.pendingItem = { cafeId, itemId, name, price };
  const cafe = CAFES.find(c => c.id === cafeId);
  document.getElementById("order-item-preview").innerHTML = `
    <div style="background:var(--bg);padding:14px;border-radius:12px;margin-bottom:16px">
      <strong>${name}</strong><br>
      <span style="color:var(--muted);font-size:13px">${cafe.name}</span><br>
      <span style="color:var(--accent);font-weight:600;margin-top:4px;display:inline-block">${formatPrice(price)}</span>
    </div>
  `;
  updateMinCounter();
  document.getElementById("order-modal").classList.remove("hidden");
}

function updateMinCounter() {
  const min = getMinPerBreak();
  const breakVal = document.getElementById("break-select").value;
  const orders = loadOrders();
  const count = orders.filter(o => o.break === breakVal && o.status !== "cancelled").length;
  document.getElementById("min-counter").innerHTML = `
    تا الان <strong>${count}</strong> نفر از حداقل <strong>${min}</strong> نفر برای این زنگ سفارش داده‌اند.
    ${count < min ? `<br><small>اگر به حداقل نرسد، سفارش در نسخه واقعی لغو می‌شود (در این نسخه تستی ثبت می‌شود).</small>` : ""}
  `;
}

document.getElementById("break-select").addEventListener("change", updateMinCounter);

document.getElementById("confirm-order").addEventListener("click", () => {
  if (!state.pendingItem) return;
  const breakVal = document.getElementById("break-select").value;
  const note = document.getElementById("order-note").value.trim();
  const cafe = CAFES.find(c => c.id === state.pendingItem.cafeId);

  const order = {
    id: "ord-" + Date.now(),
    student: state.studentName,
    cafeId: state.pendingItem.cafeId,
    cafeName: cafe.name,
    itemId: state.pendingItem.itemId,
    itemName: state.pendingItem.name,
    price: state.pendingItem.price,
    break: breakVal,
    note: note,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);

  closeOrderModal();
  closeMenu();
  toast("سفارش ثبت شد (نمایشی)");
  showView("orders");
});

function closeOrderModal() {
  document.getElementById("order-modal").classList.add("hidden");
  state.pendingItem = null;
  document.getElementById("order-note").value = "";
}

function renderOrders() {
  const orders = loadOrders().filter(o => o.student === state.studentName);
  const list = document.getElementById("orders-list");
  const empty = document.getElementById("no-orders");

  if (!orders.length) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const breakNames = { "1": "زنگ اول", "2": "زنگ دوم", "3": "زنگ سوم" };

  list.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="top">
        <span class="status ${o.status === 'pending' ? 'pending' : ''}">
          ${o.status === 'pending' ? 'در انتظار' : o.status}
        </span>
        <span style="font-size:12px;color:var(--muted)">${new Date(o.createdAt).toLocaleDateString('fa-IR')}</span>
      </div>
      <h4>${o.itemName}</h4>
      <p>${o.cafeName} · ${breakNames[o.break] || o.break}</p>
      <p style="margin-top:4px;font-weight:600;color:var(--accent)">${formatPrice(o.price)}</p>
      ${o.note ? `<p style="margin-top:6px;font-size:12px">یادداشت: ${o.note}</p>` : ""}
    </div>
  `).join("");
}

// ---------- Timeline ----------
function updateTimelineStatus() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  let msg = `ساعت فعلی: ${now.toLocaleTimeString('fa-IR')}`;

  if (h >= 0 && h < 6) {
    msg += " — لیست اولیه ارسال شده. فرصت تغییر زنگ تا ساعت ۷.";
  } else if (h >= 6 && h < 7) {
    msg += " — آخرین فرصت تغییر زنگ. بعد از ۷ حداقل‌ها بررسی می‌شوند.";
  } else if (h >= 7 && h < 10) {
    msg += " — لیست نهایی ارسال شده. کافه‌ها در حال آماده‌سازی.";
  } else if (h >= 10 && h < 14) {
    msg += " — بازه زنگ‌های تفریح. تحویل از بوفه.";
  } else if (h >= 14 && h < 24) {
    msg += " — فرصت ثبت سفارش برای فردا تا نیمه‌شب.";
  }

  document.getElementById("current-status").textContent = msg;
  document.getElementById("min-display").textContent = getMinPerBreak();
}

// ---------- Toast ----------
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2800);
}

// ---------- Global helpers for inline onclick ----------
window.openCafeMenu = openCafeMenu;
window.closeMenu = closeMenu;
window.closeOrderModal = closeOrderModal;
window.startOrder = startOrder;
window.switchTab = switchTab;
window.showView = showView;
window.logout = logout;
