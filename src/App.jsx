// ============================================================
// مكتب الهتار كارز | AL-HITAR CARS
// نظام إدارة مكتب تأجير سيارات وخدمات سفر — المرحلة الأولى
// React (Single-File ERP Prototype) — RTL كامل — عربي
// الألوان مستخرجة من الشعار المرفق:
//   teal-main #0FA58C | teal-dark #0B8371 | teal-deep #065A4C | teal-light #E8F6F2
// ============================================================
import React, { useState, useEffect, useMemo, useRef, createContext, useContext, useCallback } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/* ============================ إعدادات عامة ============================ */
const BRAND = { main: "#0FA58C", dark: "#0B8371", deep: "#065A4C", light: "#E8F6F2", lighter: "#F4FBF9" };

const OFFICE = {
  nameAr: "مكتب الهتار كارز",
  nameEn: "AL-HITAR CARS",
  activity: "تأجير سيارات + سفريات + حج وعمرة + جوازات + طيران",
  address: "صنعاء - الحصبة، أمام بوابة حديقة الثورة الغربية",
  hours: "9:00 ص - 11:00 م يومياً",
  phones: ["777917111", "775555405"],
  whatsapp: "https://wa.me/967777917111",
  tagline: "للسفريات وتأجير السيارات",
};

const SERVICE_TYPES = ["تأجير يومي", "رحلة", "مطار", "زفاف", "تخرج", "حج", "عمرة", "جواز", "طيران"];
const CAR_CATS = ["صوالين", "دفع رباعي", "حافلة", "فخم"];
const CAR_STATUSES = ["متاحة", "محجوزة", "صيانة", "غير نشطة"];
const BOOK_STATUSES = ["مسودة", "مؤكد", "جاري", "مكتمل", "ملغي"];
const PRICING_TYPES = ["يومي", "رحلة", "كيلومتر"];
const PAY_METHODS = ["نقداً", "تحويل بنكي", "شيك", "محفظة إلكترونية"];
const ROLES = { owner: "المالك", accountant: "المحاسب", receptionist: "موظف الاستقبال" };

const PERMS = {
  owner: ["cars.write", "cars.delete", "customers.write", "customers.delete", "bookings.write", "bookings.delete", "invoices.insert", "invoices.update", "invoices.delete", "payments.write", "payments.delete", "users.manage", "settings.view", "reports.view"],
  accountant: ["invoices.insert", "invoices.update", "payments.write", "reports.view"],
  receptionist: ["customers.write", "bookings.write", "invoices.insert"],
};

/* ============================ أيقونات SVG (بنمط Lucide) ============================ */
const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  car: <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  wallet: <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  edit: <><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>,
  printer: <><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
  chat: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" /></>,
  check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  warn: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></>,
  chart: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
  card: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  db: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>,
  key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
  menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
  gauge: <><path d="M12 15l3.5-3.5" /><path d="M20.3 18a10 10 0 1 0-16.6 0" /></>,
};
function Icon({ n, s = 18, c = "" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c} aria-hidden="true">
      {ICONS[n]}
    </svg>
  );
}

/* شعار المكتب — إعادة رسم SVG مطابقة للشعار المرفق (خط تركوازي + سيارة + خطوط سرعة) */
function LogoMark({ size = 56 }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 200 124" fill="none" aria-hidden="true">
      <path d="M62 6 C40 10 34 40 36 62 C37 74 44 78 52 78 C54 96 66 106 78 106 C92 106 102 96 104 82 L150 82 C152 96 164 106 176 104" stroke={BRAND.main} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M104 82 C100 74 92 72 88 76" stroke={BRAND.main} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M150 82 C148 66 160 56 172 58 C186 60 192 72 190 84 C188 96 180 102 176 104" stroke={BRAND.main} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M96 18 C120 12 138 22 148 34 C158 46 176 44 186 52 C196 60 196 76 190 86" stroke={BRAND.main} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M104 8 C126 4 142 14 152 26 C162 38 180 38 188 46" stroke={BRAND.main} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M64 26 L96 26 L94 46 L60 46 Z" fill={BRAND.main} />
      <path d="M104 26 C120 26 132 34 138 46 L104 46 Z" fill={BRAND.main} />
      <circle cx="168" cy="80" r="20" fill={BRAND.main} />
      <circle cx="168" cy="80" r="13" fill="#fff" />
      <circle cx="168" cy="80" r="5" fill="none" stroke={BRAND.main} strokeWidth="2.5" />
      <path d="M168 67 v6 M168 87 v6 M155 80 h6 M175 80 h6 M159 71 l4 4 M173 85 l4 4 M177 71 l-4 4 M163 85 l-4 4" stroke={BRAND.main} strokeWidth="2.5" />
      <path d="M18 108 C26 106 30 96 30 84 L32 62" stroke={BRAND.main} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M14 110 H52 M74 110 H100 M116 110 H142 M158 110 H186" stroke={BRAND.main} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/* ============================ أدوات مساعدة ============================ */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const money = (n) => `${Number(n || 0).toLocaleString("en-US")} ر.ي`;
const fmtD = (iso) => (iso ? String(iso).slice(0, 10) : "—");
const fmtDT = (iso) => (iso ? String(iso).slice(0, 16).replace("T", " ") : "—");
const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
const addDays = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return dayKey(x); };
const daysBetween = (s, e) => Math.max(1, Math.ceil((new Date(e) - new Date(s)) / 86400000));
const overlaps = (s1, e1, s2, e2) => s1 < e2 && s2 < e1;
const nextSeq = (rows, prefix) => { const m = rows.reduce((a, r) => { const n = parseInt(String(r.number || "").replace(/\D/g, ""), 10); return isNaN(n) ? a : Math.max(a, n); }, 0); return `${prefix}-${String(m + 1).padStart(4, "0")}`; };
const waPhone = (p) => { const d = String(p || "").replace(/\D/g, ""); if (d.startsWith("967")) return d; if (d.startsWith("0")) return "967" + d.slice(1); return "967" + d; };
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* تفقيط عربي (تحويل الرقم إلى كلمات بالعربية) */
const T_ONES = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const T_TENS = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const T_HUND = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
function under1000(n) {
  const parts = [];
  const h = Math.floor(n / 100), r = n % 100;
  if (h) parts.push(T_HUND[h]);
  if (r) {
    if (r < 20) parts.push(T_ONES[r]);
    else { const u = r % 10, t = Math.floor(r / 10); parts.push(u ? `${T_ONES[u]} و${T_TENS[t]}` : T_TENS[t]); }
  }
  return parts.join(" و");
}
function groupWords(g, one, two, few, many) {
  if (g === 1) return one; if (g === 2) return two;
  if (g >= 3 && g <= 10) return `${under1000(g)} ${few}`;
  return `${under1000(g)} ${many}`;
}
function tafqit(n) {
  n = Math.floor(Number(n) || 0);
  if (n === 0) return "صفر ريال يمني فقط";
  const parts = [];
  const mil = Math.floor(n / 1000000), thou = Math.floor(n / 1000) % 1000, rest = n % 1000;
  if (mil) parts.push(groupWords(mil, "مليون", "مليونان", "ملايين", "مليوناً"));
  if (thou) parts.push(groupWords(thou, "ألف", "ألفان", "آلاف", "ألفاً"));
  if (rest) parts.push(under1000(rest));
  return `${parts.join(" و")} ريال يمني فقط`;
}

/* ============================ البيانات التجريبية (Seed) ============================ */
function buildSeed() {
  const ow1 = { id: "ow1", name: "عبدالله صالح المطري", phone: "778889999", notes: "صاحب سيارة لاند كروزر (ملكية خارجية)", created_at: addDays(-120) };
  const cars = [
    { id: "car1", plate_number: "1-45210", brand: "تويوتا", model: "كامري", year: 2022, color: "فضي", category: "صوالين", ownership: "ملك المكتب", owner_id: null, daily_price: 25000, trip_price: 40000, km_price: 150, insurance_expiry: addDays(210), license_expiry: addDays(120), status: "متاحة", odometer: 45200, notes: "", created_at: addDays(-200) },
    { id: "car2", plate_number: "2-11873", brand: "هيونداي", model: "H1", year: 2021, color: "أبيض", category: "حافلة", ownership: "ملك المكتب", owner_id: null, daily_price: 35000, trip_price: 60000, km_price: 200, insurance_expiry: addDays(25), license_expiry: addDays(300), status: "متاحة", odometer: 98000, notes: "حافلة 12 راكب للرحلات", created_at: addDays(-200) },
    { id: "car3", plate_number: "1-77021", brand: "تويوتا", model: "لاند كروزر", year: 2023, color: "أسود", category: "دفع رباعي", ownership: "خارجي", owner_id: "ow1", daily_price: 60000, trip_price: 90000, km_price: 300, insurance_expiry: addDays(150), license_expiry: addDays(18), status: "محجوزة", odometer: 21000, notes: "سيارة ملكية خارجية — نسبة المالك 40%", created_at: addDays(-90) },
  ];
  const customers = [
    { id: "cus1", name: "أحمد محمد الشامي", phone: "771234567", phone2: "733445566", id_number: "0101234567", address: "صنعاء - حدة", type: "فرد", company_name: "", notes: "عميل دائم", created_at: addDays(-150) },
    { id: "cus2", name: "قسم المشتريات - شركة اليمن للسفر", phone: "01234567", phone2: "", id_number: "", address: "صنعاء - شارع الزبيري", type: "شركة", company_name: "شركة اليمن للسفر والسياحة", notes: "تعامل شهري بعقود", created_at: addDays(-100) },
  ];
  const users = [
    { id: "u1", username: "owner", password: "Owner@2026!", full_name: "مالك المكتب", role: "owner" },
    { id: "u2", username: "accountant", password: "Accountant@2026!", full_name: "خالد المحاسب", role: "accountant" },
    { id: "u3", username: "receptionist", password: "Receptionist@2026!", full_name: "سامي الاستقبال", role: "receptionist" },
  ];
  const profiles = users.map((u) => ({ id: u.id, username: u.username, full_name: u.full_name, role: u.role, created_at: addDays(-200) }));

  const bookings = [], invoices = [], payments = [];
  const plan = [
    { d: 29, car: "car1", cus: "cus1", amt: 45000, svc: "تأجير يومي" },
    { d: 27, car: "car2", cus: "cus2", amt: 60000, svc: "رحلة" },
    { d: 24, car: "car1", cus: "cus2", amt: 50000, svc: "مطار" },
    { d: 21, car: "car3", cus: "cus1", amt: 90000, svc: "زفاف" },
    { d: 18, car: "car2", cus: "cus1", amt: 35000, svc: "تأجير يومي" },
    { d: 15, car: "car1", cus: "cus2", amt: 75000, svc: "تخرج" },
    { d: 12, car: "car3", cus: "cus2", amt: 120000, svc: "رحلة" },
    { d: 9, car: "car2", cus: "cus1", amt: 60000, svc: "عمرة" },
    { d: 6, car: "car1", cus: "cus1", amt: 48000, svc: "تأجير يومي" },
    { d: 4, car: "car3", cus: "cus2", amt: 85000, svc: "مطار" },
    { d: 2, car: "car2", cus: "cus2", amt: 62000, svc: "حج" },
    { d: 1, car: "car1", cus: "cus1", amt: 35000, svc: "جواز" },
    { d: 0, car: "car2", cus: "cus1", amt: 50000, svc: "طيران" },
  ];
  plan.forEach((p, i) => {
    const bid = `bk${i + 1}`, start = `${addDays(-p.d)}T09:00`, end = `${addDays(-p.d + 1)}T09:00`;
    bookings.push({ id: bid, number: `BK-${String(i + 1).padStart(4, "0")}`, customer_id: p.cus, car_id: p.car, service_type: p.svc, driver_name: i % 3 === 0 ? "سائق المكتب: منير" : "", pickup_location: "صنعاء - الحصبة", dropoff_location: "صنعاء - الحصبة", start_at: start, end_at: end, pricing_type: p.svc === "تأجير يومي" ? "يومي" : "رحلة", est_km: 0, total: p.amt, deposit: 0, status: "مكتمل", notes: "", created_by: "u1", created_at: start });
    invoices.push({ id: `inv${i + 1}`, number: `INV-${String(i + 1).padStart(4, "0")}`, booking_id: bid, customer_id: p.cus, items: [{ desc: `${p.svc} — سيارة ${cars.find((c) => c.id === p.car).brand} ${cars.find((c) => c.id === p.car).model} (${cars.find((c) => c.id === p.car).plate_number})`, qty: 1, price: p.amt }], total: p.amt, discount: 0, notes: "", created_at: start });
    const paidFull = i % 4 !== 2;
    payments.push({ id: `pay${i + 1}`, number: `PAY-${String(i + 1).padStart(4, "0")}`, invoice_id: `inv${i + 1}`, amount: paidFull ? p.amt : Math.floor(p.amt / 2), method: i % 2 === 0 ? "نقداً" : "تحويل بنكي", note: "", received_by: "u2", created_at: start });
  });
  const base = plan.length;
  bookings.push(
    { id: `bk${base + 1}`, number: `BK-${String(base + 1).padStart(4, "0")}`, customer_id: "cus1", car_id: "car3", service_type: "تأجير يومي", driver_name: "", pickup_location: "صنعاء - الحصبة", dropoff_location: "صنعاء - حدة", start_at: `${addDays(0)}T10:00`, end_at: `${addDays(2)}T10:00`, pricing_type: "يومي", est_km: 0, total: 120000, deposit: 30000, status: "جاري", notes: "تسليم بمقر المكتب", created_by: "u3", created_at: `${addDays(-1)}T12:00` },
    { id: `bk${base + 2}`, number: `BK-${String(base + 2).padStart(4, "0")}`, customer_id: "cus2", car_id: "car2", service_type: "رحلة", driver_name: "سائق المكتب: منير", pickup_location: "صنعاء - الحصبة", dropoff_location: "الحديدة", start_at: `${addDays(5)}T06:00`, end_at: `${addDays(6)}T18:00`, pricing_type: "رحلة", est_km: 0, total: 120000, deposit: 0, status: "مؤكد", notes: "", created_by: "u3", created_at: `${addDays(0)}T09:30` },
    { id: `bk${base + 3}`, number: `BK-${String(base + 3).padStart(4, "0")}`, customer_id: "cus1", car_id: "car1", service_type: "مطار", driver_name: "", pickup_location: "صنعاء", dropoff_location: "مطار صنعاء", start_at: `${addDays(3)}T14:00`, end_at: `${addDays(3)}T17:00`, pricing_type: "رحلة", est_km: 0, total: 40000, deposit: 0, status: "مسودة", notes: "بانتظار تأكيد العميل", created_by: "u3", created_at: `${addDays(0)}T08:00` },
    { id: `bk${base + 4}`, number: `BK-${String(base + 4).padStart(4, "0")}`, customer_id: "cus2", car_id: "car1", service_type: "تأجير يومي", driver_name: "", pickup_location: "صنعاء", dropoff_location: "صنعاء", start_at: `${addDays(-3)}T09:00`, end_at: `${addDays(-2)}T09:00`, pricing_type: "يومي", est_km: 0, total: 25000, deposit: 0, status: "ملغي", notes: "اعتذر العميل", created_by: "u3", created_at: `${addDays(-4)}T10:00` }
  );
  invoices.push({ id: `inv${base + 1}`, number: `INV-${String(base + 1).padStart(4, "0")}`, booking_id: `bk${base + 1}`, customer_id: "cus1", items: [{ desc: "تأجير يومي — تويوتا لاند كروزر (1-77021) — 2 يوم", qty: 1, price: 120000 }], total: 120000, discount: 0, notes: "", created_at: `${addDays(-1)}T12:30` });
  payments.push({ id: `pay${base + 1}`, number: `PAY-${String(base + 1).padStart(4, "0")}`, invoice_id: `inv${base + 1}`, amount: 30000, method: "نقداً", note: "عربون مستلم عند الحجز", received_by: "u2", created_at: `${addDays(-1)}T12:35` });
  return { profiles, users, car_owners: [ow1], cars, customers, bookings, invoices, payments };
}

/* ============================ نصوص SQL (تُسلم داخل صفحة الإعدادات) ============================ */
const SCHEMA_SQL = `-- =====================================================
-- مكتب الهتار كارز | مخطط قاعدة البيانات (Supabase PostgreSQL)
-- =====================================================
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  role text not null check (role in ('owner','accountant','receptionist')),
  created_at timestamptz not null default now()
);

create table if not exists public.car_owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  plate_number text unique not null,
  brand text not null,
  model text not null,
  year int,
  color text,
  category text not null check (category in ('صوالين','دفع رباعي','حافلة','فخم')),
  ownership text not null check (ownership in ('ملك المكتب','خارجي')),
  owner_id uuid references public.car_owners(id),
  daily_price numeric not null default 0,
  trip_price numeric not null default 0,
  km_price numeric not null default 0,
  insurance_expiry date,
  license_expiry date,
  status text not null default 'متاحة' check (status in ('متاحة','محجوزة','صيانة','غير نشطة')),
  odometer numeric not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone2 text,
  id_number text,
  address text,
  type text not null default 'فرد' check (type in ('فرد','شركة')),
  company_name text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  customer_id uuid not null references public.customers(id),
  car_id uuid not null references public.cars(id),
  service_type text not null,
  driver_name text,
  pickup_location text,
  dropoff_location text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  pricing_type text not null check (pricing_type in ('يومي','رحلة','كيلومتر')),
  est_km numeric not null default 0,
  total numeric not null default 0,
  deposit numeric not null default 0,
  status text not null default 'مسودة' check (status in ('مسودة','مؤكد','جاري','مكتمل','ملغي')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  booking_id uuid references public.bookings(id),
  customer_id uuid not null references public.customers(id),
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  discount numeric not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric not null check (amount > 0),
  method text not null default 'نقداً' check (method in ('نقداً','تحويل بنكي','شيك','محفظة إلكترونية')),
  note text,
  received_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_car on public.bookings(car_id, start_at, end_at);
create index if not exists idx_bookings_customer on public.bookings(customer_id);
create index if not exists idx_invoices_booking on public.invoices(booking_id);
create index if not exists idx_payments_invoice on public.payments(invoice_id);
`;

const POLICIES_SQL = `-- =====================================================
-- سياسات الوصول (RLS) — الهتار كارز
-- =====================================================
create or replace function public.current_profile()
returns public.profiles language sql stable security definer as
$$ select * from public.profiles where id = auth.uid() limit 1 $$;

create or replace function public.current_role_name()
returns text language sql stable security definer as
$$ select role from public.profiles where id = auth.uid() limit 1 $$;

alter table public.profiles enable row level security;
alter table public.car_owners enable row level security;
alter table public.cars enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;

-- profiles: كل مستخدم مسجل يرى الملفات، والمالك يدير الكل
create policy prof_select on public.profiles for select to authenticated using (public.current_role_name() is not null);
create policy prof_write on public.profiles for all to authenticated using (public.current_role_name() = 'owner') with check (public.current_role_name() = 'owner');

-- car_owners + cars: قراءة لكل الأدوار، كتابة وحذف للمالك فقط
create policy cars_select on public.cars for select to authenticated using (public.current_role_name() in ('owner','accountant','receptionist'));
create policy cars_insert on public.cars for insert to authenticated with check (public.current_role_name() = 'owner');
create policy cars_update on public.cars for update to authenticated using (public.current_role_name() = 'owner');
create policy cars_delete on public.cars for delete to authenticated using (public.current_role_name() = 'owner');
create policy owners_select on public.car_owners for select to authenticated using (public.current_role_name() is not null);
create policy owners_write on public.car_owners for all to authenticated using (public.current_role_name() = 'owner') with check (public.current_role_name() = 'owner');

-- customers: قراءة للكل، كتابة للمالك والاستقبال، حذف للمالك
create policy cus_select on public.customers for select to authenticated using (public.current_role_name() in ('owner','accountant','receptionist'));
create policy cus_insert on public.customers for insert to authenticated with check (public.current_role_name() in ('owner','receptionist'));
create policy cus_update on public.customers for update to authenticated using (public.current_role_name() in ('owner','receptionist'));
create policy cus_delete on public.customers for delete to authenticated using (public.current_role_name() = 'owner');

-- bookings: قراءة للكل، كتابة للمالك والاستقبال، حذف للمالك
create policy bok_select on public.bookings for select to authenticated using (public.current_role_name() in ('owner','accountant','receptionist'));
create policy bok_insert on public.bookings for insert to authenticated with check (public.current_role_name() in ('owner','receptionist'));
create policy bok_update on public.bookings for update to authenticated using (public.current_role_name() in ('owner','receptionist'));
create policy bok_delete on public.bookings for delete to authenticated using (public.current_role_name() = 'owner');

-- invoices: قراءة للكل، إدراج للكل (الاستقبال إدراج فقط)، تحديث للمالك والمحاسب، حذف للمالك
create policy inv_select on public.invoices for select to authenticated using (public.current_role_name() in ('owner','accountant','receptionist'));
create policy inv_insert on public.invoices for insert to authenticated with check (public.current_role_name() in ('owner','accountant','receptionist'));
create policy inv_update on public.invoices for update to authenticated using (public.current_role_name() in ('owner','accountant'));
create policy inv_delete on public.invoices for delete to authenticated using (public.current_role_name() = 'owner');

-- payments: للمالك والمحاسب فقط (قراءة وكتابة)، حذف للمالك فقط
create policy pay_select on public.payments for select to authenticated using (public.current_role_name() in ('owner','accountant'));
create policy pay_insert on public.payments for insert to authenticated with check (public.current_role_name() in ('owner','accountant'));
create policy pay_update on public.payments for update to authenticated using (public.current_role_name() in ('owner','accountant'));
create policy pay_delete on public.payments for delete to authenticated using (public.current_role_name() = 'owner');
`;

const SEED_SQL = `-- =====================================================
-- بيانات تجريبية (Seed) — تُنفذ بعد schema.sql و policies.sql
-- =====================================================
insert into public.car_owners (id, name, phone, notes) values
 ('00000000-0000-0000-0000-000000000001','عبدالله صالح المطري','778889999','صاحب سيارة لاند كروزر (ملكية خارجية)');

insert into public.cars (id, plate_number, brand, model, year, color, category, ownership, owner_id, daily_price, trip_price, km_price, insurance_expiry, license_expiry, status, odometer) values
 ('00000000-0000-0000-0000-000000000101','1-45210','تويوتا','كامري',2022,'فضي','صوالين','ملك المكتب',null,25000,40000,150, current_date + 210, current_date + 120,'متاحة',45200),
 ('00000000-0000-0000-0000-000000000102','2-11873','هيونداي','H1',2021,'أبيض','حافلة','ملك المكتب',null,35000,60000,200, current_date + 25, current_date + 300,'متاحة',98000),
 ('00000000-0000-0000-0000-000000000103','1-77021','تويوتا','لاند كروزر',2023,'أسود','دفع رباعي','خارجي','00000000-0000-0000-0000-000000000001',60000,90000,300, current_date + 150, current_date + 18,'محجوزة',21000);

insert into public.customers (id, name, phone, phone2, id_number, address, type, company_name, notes) values
 ('00000000-0000-0000-0000-000000000201','أحمد محمد الشامي','771234567','733445566','0101234567','صنعاء - حدة','فرد',null,'عميل دائم'),
 ('00000000-0000-0000-0000-000000000202','قسم المشتريات - شركة اليمن للسفر','01234567',null,null,'صنعاء - شارع الزبيري','شركة','شركة اليمن للسفر والسياحة','تعامل شهري بعقود');
`;

const OWNER_SQL = `-- =====================================================
-- إنشاء أول مستخدم Owner في Supabase Auth
-- نفّذ هذا السكريبت مرة واحدة في SQL Editor
-- =====================================================
do $$
declare new_id uuid := gen_random_uuid();
begin
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  values (new_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'owner@alhitar.local', crypt('Owner@2026!', gen_salt('bf')), now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{"username":"owner"}'::jsonb);

  insert into public.profiles (id, username, full_name, role)
  values (new_id, 'owner', 'مالك المكتب', 'owner');
end $$;

-- ملاحظة: عند تسجيل الدخول من التطبيق يُحوَّل اسم المستخدم داخلياً إلى:
--   username@alhitar.local
`;

const README_TXT = `# مكتب الهتار كارز | AL-HITAR CARS — دليل التشغيل والنشر

## 1) شجرة المشروع (Next.js 14 App Router)
alhitar-cars/
├─ app/
│  ├─ layout.tsx            (RTL + خط Tajawal + Providers)
│  ├─ middleware.ts         (حماية الصفحات وتحويل username→بريد وهمي)
│  ├─ (auth)/login/page.tsx
│  └─ (app)/
│     ├─ dashboard/page.tsx
│     ├─ cars/page.tsx | cars/new/page.tsx | cars/[id]/page.tsx
│     ├─ customers/page.tsx | customers/new/page.tsx | customers/[id]/page.tsx
│     ├─ bookings/page.tsx | bookings/new/page.tsx | bookings/[id]/page.tsx
│     ├─ invoices/page.tsx | invoices/[id]/page.tsx | invoices/[id]/print/page.tsx
│     ├─ payments/page.tsx
│     └─ settings/page.tsx
├─ components/  (ui, tables, forms, invoice-print, receipt)
├─ lib/         (supabase/client.ts, supabase/server.ts, zod schemas, utils)
├─ hooks/       (use-auth, use-permissions, use-pager)
├─ supabase/    (schema.sql, policies.sql, seed.sql)
├─ .env.example
└─ README.md

## 2) إعداد Supabase
1. أنشئ مشروعاً جديداً على supabase.com
2. افتح SQL Editor ونفّذ بالترتيب: schema.sql ثم policies.sql ثم seed.sql
3. نفّذ OWNER_SQL لإنشاء مستخدم المالك (owner / Owner@2026!)
4. من Project Settings → API انسخ: Project URL و anon public key

## 3) التشغيل محلياً
npm install
cp .env.example .env.local   # ضع NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:3000

## 4) النشر على Vercel
1. ارفع المستودع على GitHub ثم استورده في Vercel
2. أضف متغيرات البيئة نفسها الموجودة في .env.local
3. سيتم البناء والنشر تلقائياً (Framework: Next.js)

## 5) متغيرات البيئة (.env.example)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

## 6) الأدوار والصلاحيات
- owner: كل الصلاحيات
- accountant: الفواتير والمدفوعات (بدون حذف)، قراءة السيارات والعملاء، التقارير
- receptionist: العملاء والحجوزات، إدراج الفواتير فقط، لا يرى التقارير المالية

## 7) ملاحظات المرحلة الأولى
- المصروفات وتتبع الرحلات والسائقون والصيانة والتقارير المتقدمة: المرحلة الثانية
- هذا الملف معروض داخل التطبيق: الإعدادات ← دليل النشر
`;

/* ============================ السياق العام ============================ */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

/* ============================ مكونات واجهة أساسية ============================ */
const INP = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#0FA58C] focus:ring-2 focus:ring-[#0FA58C]/20 disabled:bg-slate-100";
const LBL = "mb-1 block text-xs font-bold text-slate-600";

function Field({ label, error, required, children, className = "" }) {
  return (
    <div className={className}>
      {label && <label className={LBL}>{label}{required && <span className="text-red-500"> *</span>}</label>}
      {children}
      {error && <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-red-600"><Icon n="warn" s={12} />{error}</p>}
    </div>
  );
}
function Btn({ variant = "primary", icon, children, className = "", ...rest }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none";
  const styles = {
    primary: "bg-[#0B8371] text-white hover:bg-[#065A4C] shadow-sm",
    soft: "bg-[#E8F6F2] text-[#065A4C] hover:bg-[#0FA58C]/20",
    outline: "border border-slate-300 bg-white text-slate-700 hover:border-[#0FA58C] hover:text-[#065A4C]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-slate-600 hover:bg-slate-100",
    whats: "bg-[#128C7E] text-white hover:bg-[#0B6B60]",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {icon && <Icon n={icon} s={16} />}
      {children}
    </button>
  );
}
function Badge({ tone = "slate", children }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    teal: "bg-[#E8F6F2] text-[#065A4C] border-[#0FA58C]/30",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}
const bookTone = (s) => ({ مسودة: "slate", مؤكد: "blue", جاري: "amber", مكتمل: "green", ملغي: "red" }[s] || "slate");
const carTone = (s) => ({ متاحة: "green", محجوزة: "amber", صيانة: "red", "غير نشطة": "slate" }[s] || "slate");

function Card({ title, icon, actions, children, className = "", pad = true }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700">{icon && <span className="text-[#0B8371]"><Icon n={icon} s={17} /></span>}{title}</h3>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
      )}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}
function StatCard({ icon, label, value, sub, tone = "teal" }) {
  const tones = { teal: "bg-[#E8F6F2] text-[#0B8371]", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", blue: "bg-sky-50 text-sky-600", green: "bg-emerald-50 text-emerald-600" };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon n={icon} s={20} /></div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold text-slate-500">{label}</p>
        <p className="truncate text-lg font-extrabold text-slate-800">{value}</p>
        {sub && <p className="truncate text-[10px] font-semibold text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}
function EmptyState({ icon = "search", title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icon n={icon} s={26} /></div>
      <p className="text-sm font-extrabold text-slate-600">{title}</p>
      {sub && <p className="max-w-xs text-xs text-slate-400">{sub}</p>}
      {action}
    </div>
  );
}
function Spinner({ s = 20 }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="animate-spin text-[#0B8371]"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".2" strokeWidth="4" /><path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>;
}
function PageLoading() {
  return <div className="grid place-items-center py-24"><Spinner s={34} /><p className="mt-3 text-xs font-bold text-slate-400">جارٍ التحميل...</p></div>;
}
function Modal({ open, onClose, title, icon, children, wide }) {
  if (!open) return null;
  return (
    <div className="print-overlay fixed inset-0 z-50 overflow-auto bg-slate-900/50 p-4 backdrop-blur-[2px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`mx-auto my-6 w-full ${wide ? "max-w-3xl" : "max-w-lg"} rounded-xl bg-white shadow-2xl`}>
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-700">{icon && <span className="text-[#0B8371]"><Icon n={icon} s={17} /></span>}{title}</h3>
          <button onClick={onClose} className="hide-on-print rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Icon n="x" s={18} /></button>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
function Confirm({ state, onClose }) {
  if (!state) return null;
  return (
    <Modal open onClose={onClose} title="تأكيد العملية" icon="warn">
      <p className="mb-4 text-sm font-semibold text-slate-600">{state.msg}</p>
      <div className="flex justify-end gap-2">
        <Btn variant="outline" onClick={onClose}>إلغاء</Btn>
        <Btn variant="danger" icon="check" onClick={() => { state.onYes(); onClose(); }}>تأكيد</Btn>
      </div>
    </Modal>
  );
}
function useConfirm() {
  const [state, setState] = useState(null);
  const ask = useCallback((msg, onYes) => setState({ msg, onYes }), []);
  const node = <Confirm state={state} onClose={() => setState(null)} />;
  return [ask, node];
}

/* بحث + ترقيم صفحات */
const PAGE_SIZE = 8;
function usePager(rows, keys) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const t = q.trim().toLowerCase();
    return rows.filter((r) => keys.some((k) => String(r[k] ?? "").toLowerCase().includes(t)));
  }, [rows, q, keys]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [q]);
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { q, setQ, view, page, setPage: (p) => setPage(Math.min(pages, Math.max(1, p))), pages, total: filtered.length };
}
function SearchBox({ value, onChange, placeholder = "بحث..." }) {
  return (
    <div className="relative w-full sm:w-64">
      <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-slate-400"><Icon n="search" s={16} /></span>
      <input className={`${INP} pr-9`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
function Pager({ page, pages, setPage, total }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5 text-xs font-bold text-slate-500">
      <span>إجمالي السجلات: {total}</span>
      <div className="flex items-center gap-1">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-slate-200 px-2.5 py-1 hover:border-[#0FA58C] disabled:opacity-40">السابق</button>
        <span className="px-2">{page} / {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-slate-200 px-2.5 py-1 hover:border-[#0FA58C] disabled:opacity-40">التالي</button>
      </div>
    </div>
  );
}
function Tbl({ head, children, empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead><tr className="bg-slate-50 text-right text-[11px] font-extrabold text-slate-500">{head.map((h, i) => <th key={i} className="whitespace-nowrap px-4 py-2.5">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}
const TD = ({ children, className = "" }) => <td className={`whitespace-nowrap px-4 py-2.5 text-slate-700 ${className}`}>{children}</td>;

/* ============================ صفحة تسجيل الدخول ============================ */
function LoginPage() {
  const { db, login, toast } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!username.trim()) errs.username = "اس المستخدم مطلوب";
    if (!password) errs.password = "كلمة المرور مطلوبة";
    setErr(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    await delay(400);
    const u = db.users.find((x) => x.username === username.trim().toLowerCase());
    if (!u || u.password !== password) { setBusy(false); setErr({ form: "بيانات الدخول غير صحيحة" }); return; }
    setBusy(false);
    login(u);
    toast("success", `مرحباً ${u.full_name} — تم تسجيل الدخول`);
  };
  const fill = (un, pw) => { setUsername(un); setPassword(pw); setErr({}); };

  return (
    <div className="grid min-h-screen bg-[#F4FBF9] lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#065A4C] p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10"><LogoMark size={44} /></div>
          <div>
            <p className="text-xl font-extrabold">{OFFICE.nameAr}</p>
            <p className="text-xs font-semibold text-white/70">{OFFICE.nameEn} — For travel and car rental</p>
          </div>
        </div>
        <div>
          <h1 className="mb-3 text-3xl font-extrabold leading-snug">نظام إدارة تأجير السيارات<br />وخدمات السفر</h1>
          <p className="max-w-md text-sm leading-7 text-white/80">نظام متكامل لإدارة السيارات والعملاء والحجوزات والفواتير والمدفوعات — المرحلة الأولى. {OFFICE.activity}.</p>
          <div className="mt-6 space-y-2 text-xs font-bold text-white/80">
            <p className="flex items-center gap-2"><Icon n="pin" s={14} />{OFFICE.address}</p>
            <p className="flex items-center gap-2"><Icon n="clock" s={14} />{OFFICE.hours}</p>
            <p className="flex items-center gap-2"><Icon n="phone" s={14} />{OFFICE.phones.join(" | ")}</p>
          </div>
        </div>
        <p className="text-[11px] font-semibold text-white/50">الإصدار 1.0 — المرحلة الأولى</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2 lg:hidden">
            <LogoMark size={72} />
            <p className="text-lg font-extrabold text-[#065A4C]">{OFFICE.nameAr}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-[#0FA58C]/5">
            <h2 className="mb-1 text-lg font-extrabold text-slate-800">تسجيل الدخول</h2>
            <p className="mb-5 text-xs font-semibold text-slate-400">أدخل اسم المستخدم وكلمة المرور للمتابعة</p>
            {err.form && <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"><Icon n="warn" s={14} />{err.form}</div>}
            <form onSubmit={submit} noValidate>
              <Field label="اسم المستخدم" required error={err.username}>
                <input className={INP} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="owner" autoComplete="username" />
              </Field>
              <Field label="كلمة المرور" required error={err.password}>
                <input type="password" className={INP} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
              </Field>
              <Btn className="w-full" icon={busy ? null : "key"} disabled={busy} type="submit">
                {busy ? <Spinner s={16} /> : null}{busy ? "جارٍ التحقق..." : "دخول"}
              </Btn>
            </form>
            <div className="mt-5 rounded-xl bg-[#F4FBF9] p-3">
              <p className="mb-2 text-[11px] font-extrabold text-[#065A4C]">حسابات تجريبية (بيانات Seed):</p>
              <div className="grid gap-1.5 text-[11px] font-bold">
                <button onClick={() => fill("owner", "Owner@2026!")} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-slate-600 shadow-sm hover:text-[#0B8371]"><span>المالك</span><span className="text-slate-400">owner / Owner@2026!</span></button>
                <button onClick={() => fill("accountant", "Accountant@2026!")} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-slate-600 shadow-sm hover:text-[#0B8371]"><span>المحاسب</span><span className="text-slate-400">accountant / Accountant@2026!</span></button>
                <button onClick={() => fill("receptionist", "Receptionist@2026!")} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-slate-600 shadow-sm hover:text-[#0B8371]"><span>الاستقبال</span><span className="text-slate-400">receptionist / Receptionist@2026!</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ الهيكل (Sidebar + Topbar) ============================ */
const NAV = [
  { path: "/dashboard", label: "لوحة التحكم", icon: "dashboard", roles: ["owner", "accountant", "receptionist"] },
  { path: "/cars", label: "السيارات", icon: "car", roles: ["owner", "accountant", "receptionist"] },
  { path: "/customers", label: "العملاء", icon: "users", roles: ["owner", "accountant", "receptionist"] },
  { path: "/bookings", label: "الحجوزات", icon: "calendar", roles: ["owner", "accountant", "receptionist"] },
  { path: "/invoices", label: "الفواتير", icon: "file", roles: ["owner", "accountant", "receptionist"] },
  { path: "/payments", label: "المدفوعات", icon: "wallet", roles: ["owner", "accountant"] },
  { path: "/settings", label: "الإعدادات", icon: "settings", roles: ["owner"] },
];
function Shell({ children, title }) {
  const { session, logout, nav, path } = useApp();
  const [open, setOpen] = useState(false);
  const items = NAV.filter((n) => n.roles.includes(session.role));
  const active = (p) => path === p || path.startsWith(p + "/");
  return (
    <div className="app-shell min-h-screen bg-[#F4F6F5]">
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col bg-[#065A4C] text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10"><LogoMark size={36} /></div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">{OFFICE.nameAr}</p>
            <p className="truncate text-[10px] font-bold text-white/60">{OFFICE.nameEn}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((n) => (
            <button key={n.path} onClick={() => { nav(n.path); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${active(n.path) ? "bg-[#0FA58C] text-white shadow" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
              <Icon n={n.icon} s={17} />{n.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-[10px] font-bold text-white/60">
          <p className="flex items-center gap-2"><Icon n="clock" s={12} />{OFFICE.hours}</p>
          <p className="mt-1 flex items-center gap-2"><Icon n="phone" s={12} />{OFFICE.phones.join(" | ")}</p>
          <p className="mt-2 text-white/40">الإصدار 1.0 — المرحلة الأولى</p>
        </div>
      </aside>

      <div className="lg:mr-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}><Icon n="menu" s={20} /></button>
            <h1 className="text-base font-extrabold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-[#E8F6F2] px-3 py-1.5 text-[11px] font-extrabold text-[#065A4C] sm:inline-flex"><Icon n="shield" s={13} />{ROLES[session.role]}</span>
            <span className="hidden items-center gap-2 text-xs font-bold text-slate-500 md:flex"><Icon n="user" s={14} />{session.full_name}</span>
            <Btn variant="outline" icon="logout" onClick={logout}>خروج</Btn>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

/* ============================ لوحة التحكم ============================ */
function DashboardPage() {
  const { db, session, can, nav } = useApp();
  const financial = can("reports.view");
  const today = dayKey(new Date());
  const month = today.slice(0, 7);

  const paidOf = (invId) => db.payments.filter((p) => p.invoice_id === invId).reduce((a, p) => a + Number(p.amount), 0);
  const carsAvail = db.cars.filter((c) => c.status === "متاحة").length;
  carsBusy = db.cars.filter((c) => c.status === "محجوزة").length;
  const todayBookings = db.bookings.filter((b) => b.status !== "ملغي" && b.start_at.slice(0, 10) <= today && b.end_at.slice(0, 10) >= today);
  const todayRev = db.payments.filter((p) => p.created_at.slice(0, 10) === today).reduce((a, p) => a + Number(p.amount), 0);
  const monthRev = db.payments.filter((p) => p.created_at.slice(0, 7) === month).reduce((a, p) => a + Number(p.amount), 0);
  const debts = db.invoices.reduce((a, inv) => a + Math.max(0, Number(inv.total) - Number(inv.discount) - paidOf(inv.id)), 0);

  const chart = useMemo(() => {
    const arr = [];
    for (let i = 29; i >= 0; i--) {
      const k = addDays(-i);
      arr.push({ date: k, revenue: db.payments.filter((p) => p.created_at.slice(0, 10) === k).reduce((a, p) => a + Number(p.amount), 0) });
    }
    return arr;
  }, [db.payments]);

  const expiring = db.cars.filter((c) => (c.insurance_expiry && c.insurance_expiry <= addDays(30)) || (c.license_expiry && c.license_expiry <= addDays(30)));
  const recent = [...db.bookings].sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 5);
  const custName = (id) => db.customers.find((c) => c.id === id)?.name || "—";
  const carLabel = (id) => { const c = db.cars.find((x) => x.id === id); return c ? `${c.brand} ${c.model} (${c.plate_number})` : "—"; };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <StatCard icon="car" label="سيارات متاحة" value={carsAvail} tone="green" />
        <StatCard icon="car" label="سيارات محجوزة" value={carsBusy} tone="amber" />
        <StatCard icon="calendar" label="حجوزات اليوم" value={todayBookings.length} tone="blue" />
        {financial && <StatCard icon="wallet" label="إيرادات اليوم" value={money(todayRev)} tone="teal" />}
        {financial && <StatCard icon="chart" label="إيرادات الشهر" value={money(monthRev)} tone="teal" />}
        {financial && <StatCard icon="card" label="مصروفات الشهر" value={money(0)} sub="تُفعَّل في المرحلة الثانية" tone="red" />}
        {financial && <StatCard icon="warn" label="إجمالي ديون العملاء" value={money(debts)} tone="red" />}
      </div>

      {financial && (
        <Card title="إيرادات آخر 30 يوم" icon="chart">
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.main} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={BRAND.main} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tickFormatter={(d) => `${d.slice(8, 10)}/${d.slice(5, 7)}`} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} width={52} />
                <Tooltip formatter={(v) => [money(v), "الإيرادات"]} labelFormatter={(l) => `تاريخ ${l}`} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12, direction: "rtl" }} />
                <Area type="monotone" dataKey="revenue" stroke={BRAND.dark} strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="أحدث الحجوزات" icon="calendar" pad={false} actions={<Btn variant="soft" icon="plus" onClick={() => nav("/bookings/new")}>حجز جديد</Btn>}>
          {recent.length === 0 ? <EmptyState icon="calendar" title="لا توجد حجوزات بعد" /> : (
            <Tbl head={["الرقم", "العميل", "السيارة", "التاريخ", "الحالة"]}>
              {recent.map((b) => (
                <tr key={b.id} className="cursor-pointer hover:bg-[#F4FBF9]" onClick={() => nav(`/bookings/${b.id}`)}>
                  <TD className="font-extrabold text-[#0B8371]">{b.number}</TD>
                  <TD>{custName(b.customer_id)}</TD>
                  <TD>{carLabel(b.car_id)}</TD>
                  <TD>{fmtD(b.start_at)}</TD>
                  <TD><Badge tone={bookTone(b.status)}>{b.status}</Badge></TD>
                </tr>
              ))}
            </Tbl>
          )}
        </Card>
        <Card title="تنبيهات انتهاء التأمين والرخص" icon="warn">
          {expiring.length === 0 ? <EmptyState icon="check" title="لا توجد تنبيهات" sub="جميع التأمينات والرخص سارية لأكثر من 30 يوم" /> : (
            <div className="space-y-2">
              {expiring.map((c) => (
                <button key={c.id} onClick={() => nav(`/cars/${c.id}`)} className="flex w-full items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-right text-xs font-bold text-amber-800 hover:border-amber-300">
                  <span className="flex items-center gap-2"><Icon n="car" s={15} />{c.brand} {c.model} — {c.plate_number}</span>
                  <span className="flex items-center gap-3">
                    {c.insurance_expiry <= addDays(30) && <span>التأمين: {fmtD(c.insurance_expiry)}</span>}
                    {c.license_expiry <= addDays(30) && <span>الرخصة: {fmtD(c.license_expiry)}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
let carsBusy = 0;

/* ============================ السيارات ============================ */
function CarsPage() {
  const { db, nav, can, setDb, toast } = useApp();
  const [ask, confirmNode] = useConfirm();
  const pg = usePager(db.cars, ["plate_number", "brand", "model", "color"]);
  const remove = (car) => ask(`هل تريد حذف السيارة ${car.plate_number} نهائياً؟`, () => {
    setDb((d) => ({ ...d, cars: d.cars.filter((c) => c.id !== car.id) }));
    toast("success", "تم حذف السيارة");
  });
  return (
    <div className="space-y-4">
      <Card pad={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <SearchBox value={pg.q} onChange={pg.setQ} placeholder="بحث باللوحة / الماركة / الموديل..." />
          {can("cars.write") && <Btn icon="plus" onClick={() => nav("/cars/new")}>إضافة سيارة</Btn>}
        </div>
        {pg.view.length === 0 ? <EmptyState icon="car" title="لا توجد سيارات" sub="أضف أول سيارة لبدء التشغيل" action={can("cars.write") && <Btn icon="plus" onClick={() => nav("/cars/new")}>إضافة سيارة</Btn>} /> : (
          <>
            <Tbl head={["اللوحة", "السيارة", "الفئة", "الملكية", "سعر اليوم", "الحالة", "إجراءات"]}>
              {pg.view.map((c) => (
                <tr key={c.id} className="hover:bg-[#F4FBF9]">
                  <TD className="font-extrabold text-[#0B8371]">{c.plate_number}</TD>
                  <TD>{c.brand} {c.model} — {c.year}</TD>
                  <TD>{c.category}</TD>
                  <TD>{c.ownership}</TD>
                  <TD>{money(c.daily_price)}</TD>
                  <TD><Badge tone={carTone(c.status)}>{c.status}</Badge></TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      <button title="عرض" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/cars/${c.id}`)}><Icon n="eye" s={16} /></button>
                      {can("cars.write") && <button title="تعديل" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/cars/${c.id}?edit=1`)}><Icon n="edit" s={16} /></button>}
                      {can("cars.delete") && <button title="حذف" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(c)}><Icon n="trash" s={16} /></button>}
                    </div>
                  </TD>
                </tr>
              ))}
            </Tbl>
            <Pager page={pg.page} pages={pg.pages} setPage={pg.setPage} total={pg.total} />
          </>
        )}
      </Card>
      {confirmNode}
    </div>
  );
}

function CarFormPage({ id }) {
  const { db, setDb, nav, toast } = useApp();
  const editing = db.cars.find((c) => c.id === id);
  const [f, setF] = useState(editing || { plate_number: "", brand: "", model: "", year: new Date().getFullYear(), color: "", category: "صوالين", ownership: "ملك المكتب", owner_id: "", daily_price: 0, trip_price: 0, km_price: 0, insurance_expiry: "", license_expiry: "", status: "متاحة", odometer: 0, notes: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.plate_number.trim()) errs.plate_number = "رقم اللوحة مطلوب";
    else if (db.cars.some((c) => c.plate_number === f.plate_number.trim() && c.id !== id)) errs.plate_number = "رقم اللوحة مستخدم مسبقاً (فريد)";
    if (!f.brand.trim()) errs.brand = "الماركة مطلوبة";
    if (!f.model.trim()) errs.model = "الموديل مطلوب";
    if (Number(f.daily_price) < 0) errs.daily_price = "قيمة غير صحيحة";
    if (f.ownership === "خارجي" && !f.owner_id) errs.owner_id = "اختر صاحب السيارة الخارجي";
    setErr(errs);
    if (Object.keys(errs).length) { toast("error", "تحقق من الحقول المطلوبة"); return; }
    setBusy(true); await delay(350);
    const row = { ...f, plate_number: f.plate_number.trim(), owner_id: f.ownership === "خارجي" ? f.owner_id : null, year: Number(f.year) || null, daily_price: Number(f.daily_price) || 0, trip_price: Number(f.trip_price) || 0, km_price: Number(f.km_price) || 0, odometer: Number(f.odometer) || 0 };
    if (editing) { setDb((d) => ({ ...d, cars: d.cars.map((c) => (c.id === id ? { ...c, ...row } : c)) })); toast("success", "تم تحديث بيانات السيارة"); nav(`/cars/${id}`); }
    else { const nid = uid(); setDb((d) => ({ ...d, cars: [{ ...row, id: nid, created_at: new Date().toISOString() }, ...d.cars] })); toast("success", "تمت إضافة السيارة بنجاح"); nav(`/cars/${nid}`); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Card title={editing ? `تعديل سيارة: ${editing.plate_number}` : "إضافة سيارة جديدة"} icon="car" actions={<Btn variant="outline" icon="back" type="button" onClick={() => nav(editing ? `/cars/${editing.id}` : "/cars")}>رجوع</Btn>}>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="رقم اللوحة" required error={err.plate_number}><input className={INP} value={f.plate_number} onChange={(e) => set("plate_number", e.target.value)} placeholder="1-45210" /></Field>
          <Field label="الماركة" required error={err.brand}><input className={INP} value={f.brand} onChange={(e) => set("brand", e.target.value)} placeholder="تويوتا" /></Field>
          <Field label="الموديل" required error={err.model}><input className={INP} value={f.model} onChange={(e) => set("model", e.target.value)} placeholder="كامري" /></Field>
          <Field label="السنة"><input type="number" className={INP} value={f.year} onChange={(e) => set("year", e.target.value)} /></Field>
          <Field label="اللون"><input className={INP} value={f.color} onChange={(e) => set("color", e.target.value)} placeholder="فضي" /></Field>
          <Field label="النوع"><select className={INP} value={f.category} onChange={(e) => set("category", e.target.value)}>{CAR_CATS.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="نوع الملكية"><select className={INP} value={f.ownership} onChange={(e) => set("ownership", e.target.value)}><option>ملك المكتب</option><option>خارجي</option></select></Field>
          {f.ownership === "خارجي" && (
            <Field label="صاحب السيارة الخارجي" required error={err.owner_id}>
              <select className={INP} value={f.owner_id} onChange={(e) => set("owner_id", e.target.value)}>
                <option value="">— اختر —</option>
                {db.car_owners.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </Field>
          )}
          <Field label="الحالة الحالية"><select className={INP} value={f.status} onChange={(e) => set("status", e.target.value)}>{CAR_STATUSES.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="سعر اليوم (ر.ي)" required error={err.daily_price}><input type="number" min="0" className={INP} value={f.daily_price} onChange={(e) => set("daily_price", e.target.value)} /></Field>
          <Field label="سعر الرحلة (ر.ي)"><input type="number" min="0" className={INP} value={f.trip_price} onChange={(e) => set("trip_price", e.target.value)} /></Field>
          <Field label="سعر الكيلومتر (ر.ي)"><input type="number" min="0" className={INP} value={f.km_price} onChange={(e) => set("km_price", e.target.value)} /></Field>
          <Field label="تاريخ انتهاء التأمين"><input type="date" className={INP} value={f.insurance_expiry} onChange={(e) => set("insurance_expiry", e.target.value)} /></Field>
          <Field label="تاريخ انتهاء الرخصة"><input type="date" className={INP} value={f.license_expiry} onChange={(e) => set("license_expiry", e.target.value)} /></Field>
          <Field label="العداد الحالي (كم)"><input type="number" min="0" className={INP} value={f.odometer} onChange={(e) => set("odometer", e.target.value)} /></Field>
          <Field label="ملاحظات" className="md:col-span-3"><textarea rows={3} className={INP} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        </div>
      </Card>
      <div className="flex justify-end gap-2">
        <Btn variant="outline" type="button" onClick={() => nav(editing ? `/cars/${editing.id}` : "/cars")}>إلغاء</Btn>
        <Btn type="submit" icon="check" disabled={busy}>{busy ? <Spinner s={16} /> : null}{editing ? "حفظ التعديلات" : "حفظ السيارة"}</Btn>
      </div>
    </form>
  );
}

function CarDetailPage({ id, edit }) {
  const { db, nav, can } = useApp();
  const car = db.cars.find((c) => c.id === id);
  if (!car) return <EmptyState icon="car" title="السيارة غير موجودة" action={<Btn icon="back" onClick={() => nav("/cars")}>رجوع للقائمة</Btn>} />;
  if (edit && can("cars.write")) return <CarFormPage id={id} />;
  const owner = db.car_owners.find((o) => o.id === car.owner_id);
  const bookings = db.bookings.filter((b) => b.car_id === id).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const invIds = db.invoices.filter((i) => bookings.some((b) => b.id === i.booking_id)).map((i) => i.id);
  const revenue = db.payments.filter((p) => invIds.includes(p.invoice_id)).reduce((a, p) => a + Number(p.amount), 0);
  const custName = (cid) => db.customers.find((c) => c.id === cid)?.name || "—";
  const nearExp = (d) => d && d <= addDays(30);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E8F6F2] text-[#0B8371]"><Icon n="car" s={24} /></div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">{car.brand} {car.model} — {car.plate_number}</h2>
            <p className="text-xs font-bold text-slate-400">{car.category} • {car.color} • {car.year}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {can("cars.write") && <Btn variant="soft" icon="edit" onClick={() => nav(`/cars/${id}?edit=1`)}>تعديل</Btn>}
          <Btn variant="outline" icon="back" onClick={() => nav("/cars")}>رجوع</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon="wallet" label="إجمالي الإيرادات" value={money(revenue)} tone="teal" />
        <StatCard icon="calendar" label="عدد الحجوزات" value={bookings.length} tone="blue" />
        <StatCard icon="gauge" label="الحالة الحالية" value={car.status} tone={car.status === "متاحة" ? "green" : "amber"} />
        <StatCard icon="gauge" label="العداد الحالي" value={`${Number(car.odometer).toLocaleString()} كم`} tone="teal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="بيانات السيارة" icon="car">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              ["نوع الملكية", car.ownership], ["صاحب السيارة الخارجي", owner ? owner.name : "—"],
              ["سعر اليوم", money(car.daily_price)], ["سعر الرحلة", money(car.trip_price)],
              ["سعر الكيلومتر", money(car.km_price)], ["سنة الصنع", car.year || "—"],
              ["تاريخ انتهاء التأمين", fmtD(car.insurance_expiry)], ["تاريخ انتهاء الرخصة", fmtD(car.license_expiry)],
              ["ملاحظات", car.notes || "—"],
            ].map(([k, v], i) => (
              <div key={i} className={i === 8 ? "col-span-2" : ""}>
                <dt className="text-[11px] font-bold text-slate-400">{k}</dt>
                <dd className="font-bold text-slate-700">{v}</dd>
              </div>
            ))}
          </dl>
          {(nearExp(car.insurance_expiry) || nearExp(car.license_expiry)) && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800"><Icon n="warn" s={14} />تنبيه: يوجد مستند ينتهي خلال 30 يوم</div>
          )}
        </Card>
        <Card title="حجوزات السيارة" icon="calendar" pad={false}>
          {bookings.length === 0 ? <EmptyState icon="calendar" title="لا توجد حجوزات على هذه السيارة" /> : (
            <Tbl head={["الرقم", "العميل", "من", "إلى", "الحالة"]}>
              {bookings.slice(0, 8).map((b) => (
                <tr key={b.id} className="cursor-pointer hover:bg-[#F4FBF9]" onClick={() => nav(`/bookings/${b.id}`)}>
                  <TD className="font-extrabold text-[#0B8371]">{b.number}</TD>
                  <TD>{custName(b.customer_id)}</TD>
                  <TD>{fmtD(b.start_at)}</TD>
                  <TD>{fmtD(b.end_at)}</TD>
                  <TD><Badge tone={bookTone(b.status)}>{b.status}</Badge></TD>
                </tr>
              ))}
            </Tbl>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================ العملاء ============================ */
function CustomersPage() {
  const { db, nav, can, setDb, toast } = useApp();
  const [ask, confirmNode] = useConfirm();
  const pg = usePager(db.customers, ["name", "phone", "company_name"]);
  const balanceOf = (cid) => {
    const invs = db.invoices.filter((i) => i.customer_id === cid);
    const paid = db.payments.filter((p) => invs.some((i) => i.id === p.invoice_id)).reduce((a, p) => a + Number(p.amount), 0);
    return invs.reduce((a, i) => a + Number(i.total) - Number(i.discount), 0) - paid;
  };
  const remove = (c) => ask(`هل تريد حذف العميل ${c.name}؟`, () => { setDb((d) => ({ ...d, customers: d.customers.filter((x) => x.id !== c.id) })); toast("success", "تم حذف العميل"); });
  return (
    <div className="space-y-4">
      <Card pad={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <SearchBox value={pg.q} onChange={pg.setQ} placeholder="بحث بالاسم / الهاتف / الشركة..." />
          {can("customers.write") && <Btn icon="plus" onClick={() => nav("/customers/new")}>إضافة عميل</Btn>}
        </div>
        {pg.view.length === 0 ? <EmptyState icon="users" title="لا يوجد عملاء" sub="أضف أول عميل لبدء الحجوزات" action={can("customers.write") && <Btn icon="plus" onClick={() => nav("/customers/new")}>إضافة عميل</Btn>} /> : (
          <>
            <Tbl head={["الاسم", "الهاتف", "النوع", "الشركة", "الرصيد المستحق", "إجراءات"]}>
              {pg.view.map((c) => {
                const bal = balanceOf(c.id);
                return (
                  <tr key={c.id} className="hover:bg-[#F4FBF9]">
                    <TD className="font-extrabold text-slate-800">{c.name}</TD>
                    <TD>{c.phone}</TD>
                    <TD><Badge tone={c.type === "شركة" ? "blue" : "teal"}>{c.type}</Badge></TD>
                    <TD>{c.company_name || "—"}</TD>
                    <TD className={bal > 0 ? "font-extrabold text-red-600" : "font-extrabold text-emerald-600"}>{money(bal)}</TD>
                    <TD>
                      <div className="flex items-center gap-1">
                        <button title="عرض" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/customers/${c.id}`)}><Icon n="eye" s={16} /></button>
                        {can("customers.write") && <button title="تعديل" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/customers/${c.id}?edit=1`)}><Icon n="edit" s={16} /></button>}
                        {can("customers.delete") && <button title="حذف" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(c)}><Icon n="trash" s={16} /></button>}
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </Tbl>
            <Pager page={pg.page} pages={pg.pages} setPage={pg.setPage} total={pg.total} />
          </>
        )}
      </Card>
      {confirmNode}
    </div>
  );
}

function CustomerFormPage({ id }) {
  const { db, setDb, nav, toast } = useApp();
  const editing = db.customers.find((c) => c.id === id);
  const [f, setF] = useState(editing || { name: "", phone: "", phone2: "", id_number: "", address: "", type: "فرد", company_name: "", notes: "" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.name.trim()) errs.name = "الاسم مطلوب";
    if (!f.phone.trim()) errs.phone = "الهاتف مطلوب";
    else if (!/^\d{6,12}$/.test(f.phone.replace(/\D/g, ""))) errs.phone = "رقم هاتف غير صالح";
    if (f.type === "شركة" && !f.company_name.trim()) errs.company_name = "اسم الشركة مطلوب للعميل الشركة";
    setErr(errs);
    if (Object.keys(errs).length) { toast("error", "تحقق من الحقول المطلوبة"); return; }
    setBusy(true); await delay(300);
    if (editing) { setDb((d) => ({ ...d, customers: d.customers.map((c) => (c.id === id ? { ...c, ...f } : c)) })); toast("success", "تم تحديث بيانات العميل"); nav(`/customers/${id}`); }
    else { const nid = uid(); setDb((d) => ({ ...d, customers: [{ ...f, id: nid, created_at: new Date().toISOString() }, ...d.customers] })); toast("success", "تمت إضافة العميل بنجاح"); nav(`/customers/${nid}`); }
    setBusy(false);
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Card title={editing ? `تعديل عميل: ${editing.name}` : "إضافة عميل جديد"} icon="users" actions={<Btn variant="outline" icon="back" type="button" onClick={() => nav(editing ? `/customers/${editing.id}` : "/customers")}>رجوع</Btn>}>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="الاسم" required error={err.name}><input className={INP} value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="الهاتف" required error={err.phone}><input className={INP} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="77xxxxxxx" /></Field>
          <Field label="الهاتف الثاني"><input className={INP} value={f.phone2} onChange={(e) => set("phone2", e.target.value)} /></Field>
          <Field label="رقم الهوية"><input className={INP} value={f.id_number} onChange={(e) => set("id_number", e.target.value)} /></Field>
          <Field label="العنوان"><input className={INP} value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="نوع العميل"><select className={INP} value={f.type} onChange={(e) => set("type", e.target.value)}><option>فرد</option><option>شركة</option></select></Field>
          {f.type === "شركة" && <Field label="اسم الشركة" required error={err.company_name}><input className={INP} value={f.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>}
          <Field label="ملاحظات" className="md:col-span-2"><textarea rows={3} className={INP} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        </div>
      </Card>
      <div className="flex justify-end gap-2">
        <Btn variant="outline" type="button" onClick={() => nav(editing ? `/customers/${editing.id}` : "/customers")}>إلغاء</Btn>
        <Btn type="submit" icon="check" disabled={busy}>{busy ? <Spinner s={16} /> : null}{editing ? "حفظ التعديلات" : "حفظ العميل"}</Btn>
      </div>
    </form>
  );
}

function CustomerDetailPage({ id, edit }) {
  const { db, nav, can } = useApp();
  const cus = db.customers.find((c) => c.id === id);
  if (!cus) return <EmptyState icon="users" title="العميل غير موجود" action={<Btn icon="back" onClick={() => nav("/customers")}>رجوع</Btn>} />;
  if (edit && can("customers.write")) return <CustomerFormPage id={id} />;
  const bookings = db.bookings.filter((b) => b.customer_id === id).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const invoices = db.invoices.filter((i) => i.customer_id === id).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const paidOf = (invId) => db.payments.filter((p) => p.invoice_id === invId).reduce((a, p) => a + Number(p.amount), 0);
  const debt = invoices.reduce((a, i) => a + Number(i.total) - Number(i.discount) - paidOf(i.id), 0);
  const carLabel = (cid) => { const c = db.cars.find((x) => x.id === cid); return c ? `${c.brand} ${c.model}` : "—"; };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E8F6F2] text-[#0B8371]"><Icon n={cus.type === "شركة" ? "building" : "user"} s={24} /></div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">{cus.name}</h2>
            <p className="text-xs font-bold text-slate-400">{cus.phone}{cus.phone2 ? ` | ${cus.phone2}` : ""} • {cus.type}{cus.company_name ? ` — ${cus.company_name}` : ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {can("bookings.write") && <Btn icon="plus" onClick={() => nav(`/bookings/new?customer=${id}`)}>حجز جديد</Btn>}
          {can("customers.write") && <Btn variant="soft" icon="edit" onClick={() => nav(`/customers/${id}?edit=1`)}>تعديل</Btn>}
          <Btn variant="outline" icon="back" onClick={() => nav("/customers")}>رجوع</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard icon="calendar" label="عدد الحجوزات" value={bookings.length} tone="blue" />
        <StatCard icon="file" label="عدد الفواتير" value={invoices.length} tone="teal" />
        <StatCard icon="wallet" label="الرصيد المستحق" value={money(debt)} tone={debt > 0 ? "red" : "green"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="كل الحجوزات" icon="calendar" pad={false}>
          {bookings.length === 0 ? <EmptyState icon="calendar" title="لا توجد حجوزات" /> : (
            <Tbl head={["الرقم", "السيارة", "الخدمة", "التاريخ", "الحالة"]}>
              {bookings.map((b) => (
                <tr key={b.id} className="cursor-pointer hover:bg-[#F4FBF9]" onClick={() => nav(`/bookings/${b.id}`)}>
                  <TD className="font-extrabold text-[#0B8371]">{b.number}</TD>
                  <TD>{carLabel(b.car_id)}</TD>
                  <TD>{b.service_type}</TD>
                  <TD>{fmtD(b.start_at)}</TD>
                  <TD><Badge tone={bookTone(b.status)}>{b.status}</Badge></TD>
                </tr>
              ))}
            </Tbl>
          )}
        </Card>
        <Card title="كل الفواتير" icon="file" pad={false}>
          {invoices.length === 0 ? <EmptyState icon="file" title="لا توجد فواتير" /> : (
            <Tbl head={["الرقم", "التاريخ", "الإجمالي", "المتبقي", "حالة"]}>
              {invoices.map((i) => {
                const rem = Number(i.total) - Number(i.discount) - paidOf(i.id);
                return (
                  <tr key={i.id} className="cursor-pointer hover:bg-[#F4FBF9]" onClick={() => nav(`/invoices/${i.id}`)}>
                    <TD className="font-extrabold text-[#0B8371]">{i.number}</TD>
                    <TD>{fmtD(i.created_at)}</TD>
                    <TD>{money(i.total)}</TD>
                    <TD className={rem > 0 ? "font-extrabold text-red-600" : "font-extrabold text-emerald-600"}>{money(rem)}</TD>
                    <TD><Badge tone={rem <= 0 ? "green" : rem < Number(i.total) ? "amber" : "red"}>{rem <= 0 ? "مدفوعة" : rem < Number(i.total) ? "جزئية" : "غير مدفوعة"}</Badge></TD>
                  </tr>
                );
              })}
            </Tbl>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================ الحجوزات ============================ */
function BookingsPage() {
  const { db, nav, can, setDb, toast } = useApp();
  const [ask, confirmNode] = useConfirm();
  const [status, setStatus] = useState("الكل");
  const pg = usePager(db.bookings, ["number", "service_type", "driver_name"]);
  const rows = status === "الكل" ? pg.view : pg.view.filter((b) => b.status === status);
  const custName = (id) => db.customers.find((c) => c.id === id)?.name || "—";
  const carLabel = (id) => { const c = db.cars.find((x) => x.id === id); return c ? `${c.brand} ${c.model} (${c.plate_number})` : "—"; };
  const remove = (b) => ask(`هل تريد حذف الحجز ${b.number}؟`, () => { setDb((d) => ({ ...d, bookings: d.bookings.filter((x) => x.id !== b.id) })); toast("success", "تم حذف الحجز"); });
  return (
    <div className="space-y-4">
      <Card pad={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={pg.q} onChange={pg.setQ} placeholder="بحث برقم الحجز / الخدمة..." />
            <select className={`${INP} w-auto`} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>الكل</option>{BOOK_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          {can("bookings.write") && <Btn icon="plus" onClick={() => nav("/bookings/new")}>حجز جديد</Btn>}
        </div>
        {rows.length === 0 ? <EmptyState icon="calendar" title="لا توجد حجوزات مطابقة" action={can("bookings.write") && <Btn icon="plus" onClick={() => nav("/bookings/new")}>إنشاء حجز</Btn>} /> : (
          <>
            <Tbl head={["الرقم", "العميل", "السيارة", "الخدمة", "الانطلاق", "الإجمالي", "الحالة", "إجراءات"]}>
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-[#F4FBF9]">
                  <TD className="font-extrabold text-[#0B8371]">{b.number}</TD>
                  <TD>{custName(b.customer_id)}</TD>
                  <TD>{carLabel(b.car_id)}</TD>
                  <TD>{b.service_type}</TD>
                  <TD>{fmtD(b.start_at)}</TD>
                  <TD>{money(b.total)}</TD>
                  <TD><Badge tone={bookTone(b.status)}>{b.status}</Badge></TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      <button title="عرض" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/bookings/${b.id}`)}><Icon n="eye" s={16} /></button>
                      {can("bookings.delete") && <button title="حذف" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(b)}><Icon n="trash" s={16} /></button>}
                    </div>
                  </TD>
                </tr>
              ))}
            </Tbl>
            <Pager page={pg.page} pages={pg.pages} setPage={pg.setPage} total={pg.total} />
          </>
        )}
      </Card>
      {confirmNode}
    </div>
  );
}

function calcTotal(bk, car) {
  if (!car) return 0;
  if (bk.pricing_type === "يومي") return daysBetween(`${bk.start_date}T${bk.start_time}`, `${bk.end_date}T${bk.end_time}`) * Number(car.daily_price || 0);
  if (bk.pricing_type === "رحلة") return Number(car.trip_price || 0);
  return Number(bk.est_km || 0) * Number(car.km_price || 0);
}

function BookingWizard({ presetCustomer }) {
  const { db, setDb, nav, toast, session } = useApp();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState({});
  const [f, setF] = useState({
    customer_mode: presetCustomer ? "existing" : "existing",
    customer_id: presetCustomer || "",
    new_name: "", new_phone: "",
    start_date: addDays(0), start_time: "09:00", end_date: addDays(1), end_time: "09:00",
    service_type: "تأجير يومي", driver_name: "", pickup_location: "", dropoff_location: "",
    car_id: "", pricing_type: "يومي", est_km: 0, deposit: 0, status: "مؤكد", notes: "",
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const startISO = `${f.start_date}T${f.start_time}`, endISO = `${f.end_date}T${f.end_time}`;
  const car = db.cars.find((c) => c.id === f.car_id);
  const total = calcTotal({ ...f, start_date: f.start_date, end_date: f.end_date }, car);

  const conflict = (carId, s, e, ignoreId) => db.bookings.some((b) => b.car_id === carId && b.id !== ignoreId && !["ملغي", "مسودة"].includes(b.status) && overlaps(s, e, b.start_at, b.end_at));
  const availableCars = db.cars.filter((c) => c.status === "متاحة" && !conflict(c.id, startISO, endISO));

  const next = () => {
    const errs = {};
    if (step === 1) {
      if (f.customer_mode === "existing" && !f.customer_id) errs.customer_id = "اختر عميلاً";
      if (f.customer_mode === "new") {
        if (!f.new_name.trim()) errs.new_name = "الاسم مطلوب";
        if (!f.new_phone.trim()) errs.new_phone = "الهاتف مطلوب";
      }
    }
    if (step === 2) {
      if (endISO <= startISO) errs.end_date = "تاريخ العودة يجب أن يكون بعد الانطلاق";
    }
    if (step === 3 && !f.car_id) errs.car_id = "اختر سيارة";
    setErr(errs);
    if (Object.keys(errs).length) { toast("error", "تحقق من الحقول المطلوبة"); return; }
    setStep(step + 1);
  };

  const submit = async () => {
    if (Number(f.deposit) > total) { setErr({ deposit: "العربون أكبر من الإجمالي" }); return; }
    if (conflict(f.car_id, startISO, endISO)) { toast("error", "تعذر الحفظ: تعارض مع حجز آخر على نفس السيارة"); setStep(3); setF((s) => ({ ...s, car_id: "" })); return; }
    setBusy(true); await delay(400);
    let customerId = f.customer_id;
    setDb((d) => {
      let customers = d.customers;
      if (f.customer_mode === "new") { customerId = uid(); customers = [{ id: customerId, name: f.new_name.trim(), phone: f.new_phone.trim(), phone2: "", id_number: "", address: "", type: "فرد", company_name: "", notes: "أُنشئ من داخل معالج الحجز", created_at: new Date().toISOString() }, ...d.customers]; }
      const booking = { id: uid(), number: nextSeq(d.bookings, "BK-"), customer_id: customerId, car_id: f.car_id, service_type: f.service_type, driver_name: f.driver_name, pickup_location: f.pickup_location, dropoff_location: f.dropoff_location, start_at: startISO, end_at: endISO, pricing_type: f.pricing_type, est_km: Number(f.est_km) || 0, total, deposit: Number(f.deposit) || 0, status: f.status, notes: f.notes, created_by: session.id, created_at: new Date().toISOString() };
      return { ...d, customers, bookings: [booking, ...d.bookings] };
    });
    setBusy(false);
    toast("success", "تم إنشاء الحجز بنجاح");
    nav("/bookings");
  };

  const steps = ["العميل", "التفاصيل والمواعيد", "السيارة", "التسعير والمراجعة"];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <button key={s} onClick={() => i + 1 < step && setStep(i + 1)} className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${step === i + 1 ? "bg-[#0B8371] text-white shadow" : step > i + 1 ? "bg-[#E8F6F2] text-[#065A4C]" : "bg-slate-100 text-slate-400"}`}>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[10px]">{i + 1}</span>{s}
          </button>
        ))}
      </div>

      {step === 1 && (
        <Card title="اختيار العميل" icon="users">
          <div className="mb-4 flex gap-2">
            <Btn variant={f.customer_mode === "existing" ? "primary" : "outline"} type="button" onClick={() => set("customer_mode", "existing")}>عميل موجود</Btn>
            <Btn variant={f.customer_mode === "new" ? "primary" : "outline"} type="button" onClick={() => set("customer_mode", "new")}>عميل جديد</Btn>
          </div>
          {f.customer_mode === "existing" ? (
            <Field label="العميل" required error={err.customer_id}>
              <select className={INP} value={f.customer_id} onChange={(e) => set("customer_id", e.target.value)}>
                <option value="">— اختر العميل —</option>
                {db.customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </Field>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="اسم العميل" required error={err.new_name}><input className={INP} value={f.new_name} onChange={(e) => set("new_name", e.target.value)} /></Field>
              <Field label="هاتف العميل" required error={err.new_phone}><input className={INP} value={f.new_phone} onChange={(e) => set("new_phone", e.target.value)} /></Field>
            </div>
          )}
        </Card>
      )}

      {step === 2 && (
        <Card title="نوع الخدمة والمواعيد والمواقع" icon="calendar">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Field label="نوع الخدمة" required><select className={INP} value={f.service_type} onChange={(e) => set("service_type", e.target.value)}>{SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="السائق (اختياري)"><input className={INP} value={f.driver_name} onChange={(e) => set("driver_name", e.target.value)} placeholder="اسم السائق" /></Field>
            <Field label="موقع الانطلاق"><input className={INP} value={f.pickup_location} onChange={(e) => set("pickup_location", e.target.value)} placeholder="صنعاء - الحصبة" /></Field>
            <Field label="موقع الوصول"><input className={INP} value={f.dropoff_location} onChange={(e) => set("dropoff_location", e.target.value)} placeholder="الوجهة" /></Field>
            <Field label="تاريخ الانطلاق" required><input type="date" className={INP} value={f.start_date} onChange={(e) => set("start_date", e.target.value)} /></Field>
            <Field label="وقت الانطلاق" required><input type="time" className={INP} value={f.start_time} onChange={(e) => set("start_time", e.target.value)} /></Field>
            <Field label="تاريخ العودة" required error={err.end_date}><input type="date" className={INP} value={f.end_date} onChange={(e) => set("end_date", e.target.value)} /></Field>
            <Field label="وقت العودة" required><input type="time" className={INP} value={f.end_time} onChange={(e) => set("end_time", e.target.value)} /></Field>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card title={`السيارات المتاحة (${fmtDT(startISO)} → ${fmtDT(endISO)})`} icon="car">
          {err.car_id && <p className="mb-3 flex items-center gap-1 text-xs font-bold text-red-600"><Icon n="warn" s={13} />{err.car_id}</p>}
          {availableCars.length === 0 ? <EmptyState icon="car" title="لا توجد سيارات متاحة في هذه الفترة" sub="غيّر المواعيد أو تحقق من حالة السيارات" /> : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {availableCars.map((c) => (
                <button key={c.id} type="button" onClick={() => { set("car_id", c.id); if (!f.pricing_type) set("pricing_type", "يومي"); }} className={`rounded-xl border-2 p-3 text-right transition ${f.car_id === c.id ? "border-[#0FA58C] bg-[#F4FBF9] shadow" : "border-slate-200 bg-white hover:border-[#0FA58C]/50"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-slate-800">{c.brand} {c.model}</p>
                    <Badge tone="teal">{c.plate_number}</Badge>
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-slate-400">{c.category} • {c.year} • {c.ownership}</p>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] font-extrabold">
                    <span className="rounded-lg bg-slate-50 px-1 py-1 text-slate-600">يوم: {Number(c.daily_price).toLocaleString()}</span>
                    <span className="rounded-lg bg-slate-50 px-1 py-1 text-slate-600">رحلة: {Number(c.trip_price).toLocaleString()}</span>
                    <span className="rounded-lg bg-slate-50 px-1 py-1 text-slate-600">كم: {Number(c.km_price).toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {step === 4 && car && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="نموذج التسعير" icon="card">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="نوع التسعير" required><select className={INP} value={f.pricing_type} onChange={(e) => set("pricing_type", e.target.value)}>{PRICING_TYPES.map((p) => <option key={p}>{p}</option>)}</select></Field>
              {f.pricing_type === "كيلومتر" && <Field label="عدد الكيلومترات المتوقعة"><input type="number" min="0" className={INP} value={f.est_km} onChange={(e) => set("est_km", e.target.value)} /></Field>}
              {f.pricing_type === "يومي" && <Field label="عدد الأيام المحسوبة"><input className={INP} disabled value={daysBetween(startISO, endISO)} /></Field>}
              <Field label="العربون (إن وجد)" error={err.deposit}><input type="number" min="0" className={INP} value={f.deposit} onChange={(e) => set("deposit", e.target.value)} /></Field>
              <Field label="حالة الحجز"><select className={INP} value={f.status} onChange={(e) => set("status", e.target.value)}>{BOOK_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="ملاحظات" className="md:col-span-2"><textarea rows={2} className={INP} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
            </div>
            <div className="mt-3 rounded-xl bg-[#065A4C] p-4 text-white">
              <p className="text-[11px] font-bold text-white/70">المبلغ الإجمالي (محسوب تلقائياً)</p>
              <p className="text-2xl font-extrabold">{money(total)}</p>
              <p className="mt-1 text-[11px] font-bold text-white/70">{tafqit(total)}</p>
            </div>
          </Card>
          <Card title="مراجعة نهائية" icon="check">
            <dl className="space-y-2 text-sm">
              {[
                ["العميل", f.customer_mode === "new" ? f.new_name : (db.customers.find((c) => c.id === f.customer_id)?.name || "—")],
                ["السيارة", `${car.brand} ${car.model} (${car.plate_number})`],
                ["الخدمة", f.service_type],
                ["السائق", f.driver_name || "بدون سائق"],
                ["من", `${f.pickup_location || "—"} — ${fmtDT(startISO)}`],
                ["إلى", `${f.dropoff_location || "—"} — ${fmtDT(endISO)}`],
                ["التسعير", f.pricing_type === "كيلومتر" ? `كيلومتر × ${f.est_km} كم` : f.pricing_type],
                ["العربون", money(f.deposit)],
                ["الحالة", f.status],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between gap-3 border-b border-dashed border-slate-100 pb-2"><dt className="font-bold text-slate-400">{k}</dt><dd className="font-extrabold text-slate-700">{v}</dd></div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Btn variant="outline" icon="back" type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>السابق</Btn>
        {step < 4 ? <Btn icon="check" type="button" onClick={next}>التالي</Btn> : <Btn icon="check" type="button" disabled={busy} onClick={submit}>{busy ? <Spinner s={16} /> : null}حفظ الحجز</Btn>}
      </div>
    </div>
  );
}

function BookingDetailPage({ id }) {
  const { db, setDb, nav, can, toast } = useApp();
  const b = db.bookings.find((x) => x.id === id);
  if (!b) return <EmptyState icon="calendar" title="الحجز غير موجود" action={<Btn icon="back" onClick={() => nav("/bookings")}>رجوع</Btn>} />;
  const car = db.cars.find((c) => c.id === b.car_id);
  const cus = db.customers.find((c) => c.id === b.customer_id);
  const invoice = db.invoices.find((i) => i.booking_id === b.id);
  const changeStatus = (st) => { setDb((d) => ({ ...d, bookings: d.bookings.map((x) => (x.id === id ? { ...x, status: st } : x)) })); toast("success", `تم تغيير حالة الحجز إلى: ${st}`); };
  const createInvoice = () => {
    setDb((d) => {
      const inv = { id: uid(), number: nextSeq(d.invoices, "INV-"), booking_id: b.id, customer_id: b.customer_id, items: [{ desc: `${b.service_type} — ${car ? `${car.brand} ${car.model} (${car.plate_number})` : ""} — ${fmtDT(b.start_at)} إلى ${fmtDT(b.end_at)}`, qty: 1, price: Number(b.total) }], total: Number(b.total), discount: 0, notes: "أُنشئت من الحجز " + b.number, created_at: new Date().toISOString() };
      return { ...d, invoices: [inv, ...d.invoices] };
    });
    toast("success", "تم إنشاء الفاتورة من الحجز");
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E8F6F2] text-[#0B8371]"><Icon n="calendar" s={24} /></div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">حجز رقم {b.number}</h2>
            <p className="text-xs font-bold text-slate-400">{b.service_type} • أُنشئ {fmtDT(b.created_at)}</p>
          </div>
          <Badge tone={bookTone(b.status)}>{b.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {can("bookings.write") && (
            <select className={`${INP} w-auto`} value={b.status} onChange={(e) => changeStatus(e.target.value)}>
              {BOOK_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          )}
          {can("invoices.insert") && !invoice && <Btn icon="file" onClick={createInvoice}>إنشاء فاتورة</Btn>}
          {invoice && <Btn variant="soft" icon="file" onClick={() => nav(`/invoices/${invoice.id}`)}>عرض الفاتورة {invoice.number}</Btn>}
          <Btn variant="outline" icon="back" onClick={() => nav("/bookings")}>رجوع</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon="wallet" label="الإجمالي" value={money(b.total)} tone="teal" />
        <StatCard icon="card" label="العربون" value={money(b.deposit)} tone="blue" />
        <StatCard icon="clock" label="المدة" value={`${daysBetween(b.start_at, b.end_at)} يوم`} tone="amber" />
        <StatCard icon="gauge" label="نوع التسعير" value={b.pricing_type === "كيلومتر" ? `كيلومتر (${b.est_km} كم)` : b.pricing_type} tone="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="بيانات الحجز" icon="calendar">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              ["العميل", cus ? cus.name : "—"], ["هاتف العميل", cus ? cus.phone : "—"],
              ["السيارة", car ? `${car.brand} ${car.model} (${car.plate_number})` : "—"], ["السائق", b.driver_name || "بدون سائق"],
              ["موقع الانطلاق", b.pickup_location || "—"], ["موقع الوصول", b.dropoff_location || "—"],
              ["وقت الانطلاق", fmtDT(b.start_at)], ["وقت العودة", fmtDT(b.end_at)],
              ["ملاحظات", b.notes || "—"],
            ].map(([k, v], i) => (
              <div key={i} className={i === 8 ? "col-span-2" : ""}>
                <dt className="text-[11px] font-bold text-slate-400">{k}</dt>
                <dd className="font-bold text-slate-700">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card title="ملخص مالي" icon="wallet">
          {invoice ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-dashed border-slate-100 pb-2"><span className="font-bold text-slate-400">رقم الفاتورة</span><span className="font-extrabold text-[#0B8371]">{invoice.number}</span></div>
              <div className="flex justify-between border-b border-dashed border-slate-100 pb-2"><span className="font-bold text-slate-400">إجمالي الفاتورة</span><span className="font-extrabold">{money(invoice.total)}</span></div>
              <div className="flex justify-between border-b border-dashed border-slate-100 pb-2"><span className="font-bold text-slate-400">المسدّد</span><span className="font-extrabold text-emerald-600">{money(db.payments.filter((p) => p.invoice_id === invoice.id).reduce((a, p) => a + Number(p.amount), 0))}</span></div>
              <div className="flex justify-between"><span className="font-bold text-slate-400">المتبقي</span><span className="font-extrabold text-red-600">{money(Number(invoice.total) - Number(invoice.discount) - db.payments.filter((p) => p.invoice_id === invoice.id).reduce((a, p) => a + Number(p.amount), 0))}</span></div>
              <Btn variant="soft" icon="eye" className="w-full" onClick={() => nav(`/invoices/${invoice.id}`)}>فتح صفحة الفاتورة</Btn>
            </div>
          ) : <EmptyState icon="file" title="لا توجد فاتورة لهذا الحجز" sub={can("invoices.insert") ? "أنشئ فاتورة لتحصيل المبلغ" : ""} action={can("invoices.insert") && <Btn icon="file" onClick={createInvoice}>إنشاء فاتورة</Btn>} />}
        </Card>
      </div>
    </div>
  );
}

/* ============================ الفواتير ============================ */
function InvoicesPage() {
  const { db, nav, can, setDb, toast } = useApp();
  const [ask, confirmNode] = useConfirm();
  const [newOpen, setNewOpen] = useState(false);
  const [selBooking, setSelBooking] = useState("");
  const pg = usePager(db.invoices, ["number", "notes"]);
  const paidOf = (invId) => db.payments.filter((p) => p.invoice_id === invId).reduce((a, p) => a + Number(p.amount), 0);
  const custName = (id) => db.customers.find((c) => c.id === id)?.name || "—";
  const bookingsWithoutInvoice = db.bookings.filter((b) => !db.invoices.some((i) => i.booking_id === b.id));
  const createFromBooking = () => {
    const b = db.bookings.find((x) => x.id === selBooking);
    if (!b) { toast("error", "اختر حجزاً أولاً"); return; }
    const car = db.cars.find((c) => c.id === b.car_id);
    setDb((d) => ({ ...d, invoices: [{ id: uid(), number: nextSeq(d.invoices, "INV-"), booking_id: b.id, customer_id: b.customer_id, items: [{ desc: `${b.service_type} — ${car ? `${car.brand} ${car.model} (${car.plate_number})` : ""} — ${fmtDT(b.start_at)} إلى ${fmtDT(b.end_at)}`, qty: 1, price: Number(b.total) }], total: Number(b.total), discount: 0, notes: "أُنشئت من الحجز " + b.number, created_at: new Date().toISOString() }, ...d.invoices] }));
    setNewOpen(false); setSelBooking("");
    toast("success", "تم إنشاء الفاتورة");
  };
  const remove = (inv) => ask(`هل تريد حذف الفاتورة ${inv.number}؟ سيتم حذف مدفوعاتها أيضاً.`, () => {
    setDb((d) => ({ ...d, invoices: d.invoices.filter((x) => x.id !== inv.id), payments: d.payments.filter((p) => p.invoice_id !== inv.id) }));
    toast("success", "تم حذف الفاتورة");
  });
  return (
    <div className="space-y-4">
      <Card pad={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <SearchBox value={pg.q} onChange={pg.setQ} placeholder="بحث برقم الفاتورة..." />
          {can("invoices.insert") && <Btn icon="plus" onClick={() => setNewOpen(true)}>فاتورة من حجز</Btn>}
        </div>
        {pg.view.length === 0 ? <EmptyState icon="file" title="لا توجد فواتير" sub="أنشئ فاتورة من حجز موجود" /> : (
          <>
            <Tbl head={["الرقم", "التاريخ", "العميل", "الحجز", "الإجمالي", "المسدّد", "المتبقي", "الحالة", "إجراءات"]}>
              {pg.view.map((i) => {
                const paid = paidOf(i.id);
                const rem = Number(i.total) - Number(i.discount) - paid;
                const bk = db.bookings.find((b) => b.id === i.booking_id);
                return (
                  <tr key={i.id} className="hover:bg-[#F4FBF9]">
                    <TD className="font-extrabold text-[#0B8371]">{i.number}</TD>
                    <TD>{fmtD(i.created_at)}</TD>
                    <TD>{custName(i.customer_id)}</TD>
                    <TD>{bk ? bk.number : "—"}</TD>
                    <TD>{money(i.total)}</TD>
                    <TD className="text-emerald-600">{money(paid)}</TD>
                    <TD className={rem > 0 ? "font-extrabold text-red-600" : "font-extrabold text-emerald-600"}>{money(rem)}</TD>
                    <TD><Badge tone={rem <= 0 ? "green" : rem < Number(i.total) ? "amber" : "red"}>{rem <= 0 ? "مدفوعة" : rem < Number(i.total) ? "جزئية" : "غير مدفوعة"}</Badge></TD>
                    <TD>
                      <div className="flex items-center gap-1">
                        <button title="عرض" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/invoices/${i.id}`)}><Icon n="eye" s={16} /></button>
                        <button title="طباعة A5" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => nav(`/invoices/${i.id}/print`)}><Icon n="printer" s={16} /></button>
                        {can("invoices.delete") && <button title="حذف" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(i)}><Icon n="trash" s={16} /></button>}
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </Tbl>
            <Pager page={pg.page} pages={pg.pages} setPage={pg.setPage} total={pg.total} />
          </>
        )}
      </Card>
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="إنشاء فاتورة من حجز" icon="file">
        {bookingsWithoutInvoice.length === 0 ? <EmptyState icon="check" title="كل الحجوزات لديها فواتير" /> : (
          <div className="space-y-3">
            <Field label="اختر الحجز" required>
              <select className={INP} value={selBooking} onChange={(e) => setSelBooking(e.target.value)}>
                <option value="">— اختر حجزاً —</option>
                {bookingsWithoutInvoice.map((b) => <option key={b.id} value={b.id}>{b.number} — {custName(b.customer_id)} — {money(b.total)}</option>)}
              </select>
            </Field>
            <div className="flex justify-end gap-2">
              <Btn variant="outline" onClick={() => setNewOpen(false)}>إلغاء</Btn>
              <Btn icon="check" onClick={createFromBooking}>إنشاء الفاتورة</Btn>
            </div>
          </div>
        )}
      </Modal>
      {confirmNode}
    </div>
  );
}

function InvoiceDoc({ inv, compact }) {
  const { db } = useApp();
  const cus = db.customers.find((c) => c.id === inv.customer_id);
  const bk = db.bookings.find((b) => b.id === inv.booking_id);
  const paid = db.payments.filter((p) => p.invoice_id === inv.id).reduce((a, p) => a + Number(p.amount), 0);
  const rem = Number(inv.total) - Number(inv.discount) - paid;
  return (
    <div className="print-sheet mx-auto w-full max-w-[160mm] rounded-xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm" style={{ fontFamily: "Tajawal, sans-serif" }}>
      <header className="flex items-start justify-between gap-3 border-b-2 border-[#0FA58C] pb-4">
        <div className="flex items-center gap-3">
          <LogoMark size={64} />
          <div>
            <p className="text-lg font-extrabold text-[#065A4C]">{OFFICE.nameAr}</p>
            <p className="text-[11px] font-bold text-slate-500">{OFFICE.nameEn} — For travel and car rental</p>
            <p className="text-[10px] font-semibold text-slate-500">{OFFICE.address}</p>
            <p className="text-[10px] font-semibold text-slate-500">هاتف: {OFFICE.phones.join(" | ")}</p>
          </div>
        </div>
        <div className="text-left">
          <p className="rounded-lg bg-[#065A4C] px-3 py-1 text-sm font-extrabold text-white">فاتورة {compact ? "" : "ضريبية مبسطة"}</p>
          <p className="mt-2 text-sm font-extrabold text-[#0B8371]">رقم: {inv.number}</p>
          <p className="text-[11px] font-bold text-slate-500">التاريخ: {fmtD(inv.created_at)}</p>
          {bk && <p className="text-[11px] font-bold text-slate-500">حجز رقم: {bk.number}</p>}
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 border-b border-dashed border-slate-200 py-4 text-xs">
        <div>
          <p className="font-bold text-slate-400">فاتورة إلى:</p>
          <p className="text-sm font-extrabold">{cus?.name}</p>
          <p className="font-semibold text-slate-500">هاتف: {cus?.phone}</p>
          {cus?.company_name && <p className="font-semibold text-slate-500">{cus.company_name}</p>}
          {cus?.id_number && <p className="font-semibold text-slate-500">هوية: {cus.id_number}</p>}
        </div>
        {bk && (
          <div>
            <p className="font-bold text-slate-400">تفاصيل الخدمة:</p>
            <p className="font-extrabold">{bk.service_type}</p>
            <p className="font-semibold text-slate-500">من: {fmtDT(bk.start_at)} — {bk.pickup_location || "—"}</p>
            <p className="font-semibold text-slate-500">إلى: {fmtDT(bk.end_at)} — {bk.dropoff_location || "—"}</p>
            {bk.driver_name && <p className="font-semibold text-slate-500">السائق: {bk.driver_name}</p>}
          </div>
        )}
      </section>

      <table className="mt-4 w-full text-xs">
        <thead>
          <tr className="bg-[#E8F6F2] text-[#065A4C]">
            <th className="rounded-r-lg px-2 py-2 text-right font-extrabold">#</th>
            <th className="px-2 py-2 text-right font-extrabold">البيان</th>
            <th className="px-2 py-2 text-center font-extrabold">الكمية</th>
            <th className="rounded-l-lg px-2 py-2 text-left font-extrabold">المبلغ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(inv.items || []).map((it, i) => (
            <tr key={i}>
              <td className="px-2 py-2 font-bold">{i + 1}</td>
              <td className="px-2 py-2 font-semibold">{it.desc}</td>
              <td className="px-2 py-2 text-center font-semibold">{it.qty}</td>
              <td className="px-2 py-2 text-left font-extrabold">{Number(it.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-4 flex justify-between gap-4">
        <div className="flex-1 rounded-lg bg-[#F4FBF9] p-3 text-[11px] font-bold text-[#065A4C]">
          <p className="mb-1 text-slate-400">المبلغ كتابةً:</p>
          <p>{tafqit(Number(inv.total) - Number(inv.discount))}</p>
        </div>
        <div className="w-44 space-y-1 text-xs font-extrabold">
          <div className="flex justify-between"><span className="text-slate-400">الإجمالي</span><span>{money(inv.total)}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">الخصم</span><span>{money(inv.discount)}</span></div>
          <div className="flex justify-between text-emerald-600"><span>المسدّد</span><span>{money(paid)}</span></div>
          <div className="flex justify-between rounded-lg bg-[#065A4C] px-2 py-1.5 text-white"><span>المتبقي</span><span>{money(rem)}</span></div>
        </div>
      </section>

      <footer className="mt-6 border-t border-dashed border-slate-200 pt-3 text-center text-[10px] font-bold text-slate-400">
        <p>{OFFICE.tagline} — {OFFICE.activity}</p>
        <p>أوقات العمل: {OFFICE.hours} | واتساب: {OFFICE.phones[0]}</p>
        <p className="mt-1">شكراً لتعاملكم معنا</p>
      </footer>
    </div>
  );
}

function InvoicePrintPage({ id }) {
  const { db, nav } = useApp();
  const inv = db.invoices.find((i) => i.id === id);
  if (!inv) return <div className="app-shell p-10"><EmptyState icon="file" title="الفاتورة غير موجودة" action={<Btn icon="back" onClick={() => nav("/invoices")}>رجوع</Btn>} /></div>;
  const cus = db.customers.find((c) => c.id === inv.customer_id);
  const rem = Number(inv.total) - Number(inv.discount) - db.payments.filter((p) => p.invoice_id === inv.id).reduce((a, p) => a + Number(p.amount), 0);
  const waText = encodeURIComponent(`*${OFFICE.nameAr}*%0Aفاتورة رقم: ${inv.number}%0Aالعميل: ${cus?.name}%0Aالإجمالي: ${money(inv.total)}%0Aالمتبقي: ${money(rem)}%0Aشكراً لتعاملكم معنا`);
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="hide-on-print mx-auto mb-4 flex max-w-[160mm] flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Btn icon="printer" onClick={() => window.print()}>طباعة A5</Btn>
          <Btn variant="soft" icon="download" onClick={() => window.print()}>تصدير PDF</Btn>
          <Btn variant="whats" icon="chat" onClick={() => window.open(`${OFFICE.whatsapp}?text=${waText}`, "_blank")}>مشاركة واتساب</Btn>
        </div>
        <Btn variant="outline" icon="back" onClick={() => nav(`/invoices/${id}`)}>رجوع للفاتورة</Btn>
      </div>
      <InvoiceDoc inv={inv} />
    </div>
  );
}

function InvoiceDetailPage({ id }) {
  const { db, nav, can } = useApp();
  const inv = db.invoices.find((i) => i.id === id);
  const [payOpen, setPayOpen] = useState(false);
  if (!inv) return <EmptyState icon="file" title="الفاتورة غير موجودة" action={<Btn icon="back" onClick={() => nav("/invoices")}>رجوع</Btn>} />;
  const cus = db.customers.find((c) => c.id === inv.customer_id);
  const bk = db.bookings.find((b) => b.id === inv.booking_id);
  const pays = db.payments.filter((p) => p.invoice_id === id);
  const paid = pays.reduce((a, p) => a + Number(p.amount), 0);
  const rem = Number(inv.total) - Number(inv.discount) - paid;
  const waText = encodeURIComponent(`*${OFFICE.nameAr}*%0Aفاتورة رقم: ${inv.number}%0Aالعميل: ${cus?.name}%0Aالإجمالي: ${money(inv.total)}%0Aالمتبقي: ${money(rem)}%0Aشكراً لتعاملكم معنا`);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E8F6F2] text-[#0B8371]"><Icon n="file" s={24} /></div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">فاتورة رقم {inv.number}</h2>
            <p className="text-xs font-bold text-slate-400">{cus?.name} • {fmtD(inv.created_at)}</p>
          </div>
          <Badge tone={rem <= 0 ? "green" : rem < Number(inv.total) ? "amber" : "red"}>{rem <= 0 ? "مدفوعة" : rem < Number(inv.total) ? "مدفوعة جزئياً" : "غير مدفوعة"}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {can("payments.write") && rem > 0 && <Btn icon="wallet" onClick={() => setPayOpen(true)}>تسجيل دفعة</Btn>}
          <Btn variant="soft" icon="printer" onClick={() => nav(`/invoices/${id}/print`)}>طباعة / PDF</Btn>
          <Btn variant="whats" icon="chat" onClick={() => window.open(`${OFFICE.whatsapp}?text=${waText}`, "_blank")}>واتساب</Btn>
          <Btn variant="outline" icon="back" onClick={() => nav("/invoices")}>رجوع</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon="card" label="الإجمالي" value={money(inv.total)} tone="teal" />
        <StatCard icon="check" label="المسدّد" value={money(paid)} tone="green" />
        <StatCard icon="wallet" label="المتبقي" value={money(rem)} tone={rem > 0 ? "red" : "green"} />
        <StatCard icon="calendar" label="عدد الدفعات" value={pays.length} tone="blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="بنود الفاتورة" icon="file" pad={false}>
          <Tbl head={["#", "البيان", "الكمية", "المبلغ"]}>
            {(inv.items || []).map((it, i) => (
              <tr key={i}><TD>{i + 1}</TD><TD className="whitespace-normal">{it.desc}</TD><TD>{it.qty}</TD><TD className="font-extrabold">{money(it.price)}</TD></tr>
            ))}
          </Tbl>
          <div className="space-y-1 border-t border-slate-100 p-4 text-sm font-extrabold">
            <div className="flex justify-between"><span className="text-slate-400">الإجمالي</span><span>{money(inv.total)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">الخصم</span><span>{money(inv.discount)}</span></div>
            <div className="flex justify-between rounded-lg bg-[#065A4C] px-3 py-2 text-white"><span>المتبقي</span><span>{money(rem)}</span></div>
            <p className="pt-2 text-[11px] font-bold text-[#065A4C]">{tafqit(Number(inv.total) - Number(inv.discount))}</p>
          </div>
        </Card>
        <Card title="الدفعات المسجلة" icon="wallet" pad={false}>
          {pays.length === 0 ? <EmptyState icon="wallet" title="لا توجد دفعات" sub={rem > 0 ? "سجّل أول دفعة على هذه الفاتورة" : ""} /> : (
            <Tbl head={["الرقم", "التاريخ", "المبلغ", "الطريقة"]}>
              {pays.map((p) => (
                <tr key={p.id} className="hover:bg-[#F4FBF9]">
                  <TD className="font-extrabold text-[#0B8371]">{p.number}</TD>
                  <TD>{fmtDT(p.created_at)}</TD>
                  <TD className="font-extrabold text-emerald-600">{money(p.amount)}</TD>
                  <TD><Badge tone="teal">{p.method}</Badge></TD>
                </tr>
              ))}
            </Tbl>
          )}
        </Card>
      </div>
      {bk && <Card title="الحجز المرتبط" icon="calendar"><Btn variant="soft" icon="eye" onClick={() => nav(`/bookings/${bk.id}`)}>فتح الحجز {bk.number}</Btn></Card>}
      {payOpen && <PaymentModal invoiceId={id} onClose={() => setPayOpen(false)} />}
    </div>
  );
}

/* ============================ المدفوعات ============================ */
function PaymentModal({ invoiceId, onClose }) {
  const { db, setDb, toast, session } = useApp();
  const inv = db.invoices.find((i) => i.id === invoiceId);
  const paid = db.payments.filter((p) => p.invoice_id === invoiceId).reduce((a, p) => a + Number(p.amount), 0);
  const rem = inv ? Number(inv.total) - Number(inv.discount) - paid : 0;
  const [amount, setAmount] = useState(rem);
  const [method, setMethod] = useState("نقداً");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [receiptId, setReceiptId] = useState(null);

  const save = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { setErr("أدخل مبلغاً صحيحاً أكبر من صفر"); return; }
    if (amt > rem) { setErr(`لا يمكن الدفع بأكثر من المتبقي (${money(rem)})`); return; }
    setErr(""); setBusy(true); await delay(300);
    const pid = uid();
    setDb((d) => ({ ...d, payments: [{ id: pid, number: nextSeq(d.payments, "PAY-"), invoice_id: invoiceId, amount: amt, method, note, received_by: session.id, created_at: new Date().toISOString() }, ...d.payments] }));
    setBusy(false);
    toast("success", "تم تسجيل الدفعة وتحديث الرصيد");
    setReceiptId(pid);
  };
  const pay = db.payments.find((p) => p.id === receiptId);
  if (pay) return <ReceiptDoc payment={pay} onClose={onClose} />;
  return (
    <Modal open onClose={onClose} title={`تسجيل دفعة — فاتورة ${inv?.number}`} icon="wallet">
      <div className="mb-3 grid grid-cols-3 gap-2 text-center text-xs font-extrabold">
        <div className="rounded-lg bg-slate-50 p-2"><p className="text-slate-400">الإجمالي</p><p>{money(inv?.total)}</p></div>
        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><p>المسدّد</p><p>{money(paid)}</p></div>
        <div className="rounded-lg bg-red-50 p-2 text-red-700"><p>المتبقي</p><p>{money(rem)}</p></div>
      </div>
      <Field label="المبلغ (ر.ي)" required error={err}><input type="number" min="1" max={rem} className={INP} value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
      <Field label="طريقة الدفع"><select className={INP} value={method} onChange={(e) => setMethod(e.target.value)}>{PAY_METHODS.map((m) => <option key={m}>{m}</option>)}</select></Field>
      <Field label="ملاحظة"><input className={INP} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      <p className="mb-3 rounded-lg bg-[#F4FBF9] px-3 py-2 text-[11px] font-bold text-[#065A4C]">{tafqit(amount)}</p>
      <div className="flex justify-end gap-2">
        <Btn variant="outline" onClick={onClose}>إلغاء</Btn>
        <Btn icon="check" disabled={busy} onClick={save}>{busy ? <Spinner s={16} /> : null}حفظ الدفعة</Btn>
      </div>
    </Modal>
  );
}

function ReceiptDoc({ payment, onClose }) {
  const { db } = useApp();
  const inv = db.invoices.find((i) => i.id === payment.invoice_id);
  const cus = db.customers.find((c) => c.id === inv?.customer_id);
  const receiver = db.profiles.find((p) => p.id === payment.received_by);
  return (
    <Modal open onClose={onClose} title="سند قبض" icon="printer" wide>
      <div className="print-sheet mx-auto max-w-[140mm] rounded-xl border-2 border-[#0FA58C] bg-white p-5">
        <header className="flex items-center justify-between border-b-2 border-[#0FA58C] pb-3">
          <div className="flex items-center gap-2">
            <LogoMark size={48} />
            <div>
              <p className="text-sm font-extrabold text-[#065A4C]">{OFFICE.nameAr}</p>
              <p className="text-[10px] font-bold text-slate-500">{OFFICE.phones.join(" | ")}</p>
            </div>
          </div>
          <div className="text-left">
            <p className="rounded bg-[#065A4C] px-2 py-0.5 text-xs font-extrabold text-white">سند قبض</p>
            <p className="mt-1 text-xs font-extrabold text-[#0B8371]">رقم: {payment.number}</p>
            <p className="text-[10px] font-bold text-slate-500">التاريخ: {fmtDT(payment.created_at)}</p>
          </div>
        </header>
        <div className="space-y-2 py-4 text-sm font-bold">
          <p>استلمنا من السيد/ <span className="font-extrabold text-[#065A4C]">{cus?.name}</span></p>
          <p>مبلغاً وقدره <span className="font-extrabold text-[#065A4C]">{money(payment.amount)}</span></p>
          <p className="rounded bg-[#F4FBF9] px-2 py-1 text-[11px] text-[#065A4C]">فقط: {tafqit(payment.amount)}</p>
          <p>وذلك عن: فاتورة رقم <span className="font-extrabold">{inv?.number}</span>{inv?.booking_id ? ` (حجز ${db.bookings.find((b) => b.id === inv.booking_id)?.number || ""})` : ""}</p>
          <p>طريقة الدفع: <span className="font-extrabold">{payment.method}</span></p>
          {payment.note && <p>ملاحظة: {payment.note}</p>}
        </div>
        <footer className="flex justify-between border-t border-dashed border-slate-300 pt-3 text-xs font-extrabold text-slate-600">
          <span>المستلم: {receiver?.full_name || "—"}</span>
          <span>التوقيع والختم: ....................</span>
        </footer>
      </div>
      <div className="hide-on-print mt-3 flex justify-end gap-2">
        <Btn variant="outline" onClick={onClose}>إغلاق</Btn>
        <Btn icon="printer" onClick={() => window.print()}>طباعة السند</Btn>
      </div>
    </Modal>
  );
}

function PaymentsPage() {
  const { db, nav, can, setDb, toast } = useApp();
  const [ask, confirmNode] = useConfirm();
  const [invSel, setInvSel] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const pg = usePager(db.payments, ["number", "method", "note"]);
  const invOf = (id) => db.invoices.find((i) => i.id === id);
  const cusOf = (inv) => db.customers.find((c) => c.id === inv?.customer_id);
  const receiver = (id) => db.profiles.find((p) => p.id === id)?.full_name || "—";
  const remove = (p) => ask(`هل تريد حذف الدفعة ${p.number}؟`, () => { setDb((d) => ({ ...d, payments: d.payments.filter((x) => x.id !== p.id) })); toast("success", "تم حذف الدفعة"); });
  return (
    <div className="space-y-4">
      <Card pad={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <SearchBox value={pg.q} onChange={pg.setQ} placeholder="بحث برقم الدفعة / الطريقة..." />
          {can("payments.write") && (
            <div className="flex items-center gap-2">
              <select className={`${INP} w-56`} value={invSel} onChange={(e) => setInvSel(e.target.value)}>
                <option value="">— اختر فاتورة للتحصيل —</option>
                {db.invoices.map((i) => {
                  const paid = db.payments.filter((p) => p.invoice_id === i.id).reduce((a, p) => a + Number(p.amount), 0);
                  const rem = Number(i.total) - Number(i.discount) - paid;
                  return rem > 0 ? <option key={i.id} value={i.id}>{i.number} — متبقي {money(rem)}</option> : null;
                })}
              </select>
              <Btn icon="plus" disabled={!invSel} onClick={() => setPayOpen(true)}>تسجيل دفعة</Btn>
            </div>
          )}
        </div>
        {pg.view.length === 0 ? <EmptyState icon="wallet" title="لا توجد مدفوعات" sub="سجّل أول دفعة من صفحة الفواتير أو من الأعلى" /> : (
          <>
            <Tbl head={["الرقم", "التاريخ", "الفاتورة", "العميل", "المبلغ", "الطريقة", "المستلم", "إجراءات"]}>
              {pg.view.map((p) => (
                <tr key={p.id} className="hover:bg-[#F4FBF9]">
                  <TD className="font-extrabold text-[#0B8371]">{p.number}</TD>
                  <TD>{fmtDT(p.created_at)}</TD>
                  <TD><button className="font-bold text-[#0B8371] hover:underline" onClick={() => nav(`/invoices/${p.invoice_id}`)}>{invOf(p.invoice_id)?.number}</button></TD>
                  <TD>{cusOf(invOf(p.invoice_id))?.name}</TD>
                  <TD className="font-extrabold text-emerald-600">{money(p.amount)}</TD>
                  <TD><Badge tone="teal">{p.method}</Badge></TD>
                  <TD>{receiver(p.received_by)}</TD>
                  <TD>
                    <div className="flex items-center gap-1">
                      <button title="سند قبض" className="rounded-lg p-1.5 text-slate-500 hover:bg-[#E8F6F2] hover:text-[#0B8371]" onClick={() => setReceipt(p.id)}><Icon n="printer" s={16} /></button>
                      {can("payments.delete") && <button title="حذف" className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => remove(p)}><Icon n="trash" s={16} /></button>}
                    </div>
                  </TD>
                </tr>
              ))}
            </Tbl>
            <Pager page={pg.page} pages={pg.pages} setPage={pg.setPage} total={pg.total} />
          </>
        )}
      </Card>
      {payOpen && <PaymentModal invoiceId={invSel} onClose={() => { setPayOpen(false); setInvSel(""); }} />}
      {receipt && <ReceiptDoc payment={db.payments.find((p) => p.id === receipt)} onClose={() => setReceipt(null)} />}
      {confirmNode}
    </div>
  );
}

/* ============================ الإعدادات ============================ */
function SettingsPage() {
  const { db, setDb, toast, session } = useApp();
  const [tab, setTab] = useState("office");
  const [userOpen, setUserOpen] = useState(false);
  const [uf, setUf] = useState({ username: "", full_name: "", role: "receptionist", password: "" });
  const [uerr, setUerr] = useState({});
  const copy = async (txt) => {
    try { await navigator.clipboard.writeText(txt); toast("success", "تم نسخ النص إلى الحافظة"); }
    catch { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("success", "تم نسخ النص"); }
  };
  const addUser = () => {
    const errs = {};
    if (!/^[a-z0-9_]{3,20}$/.test(uf.username)) errs.username = "اسم مستخدم إنجليزي صغير 3-20 حرفاً/أرقام";
    else if (db.users.some((u) => u.username === uf.username)) errs.username = "اسم المستخدم موجود مسبقاً";
    if (!uf.full_name.trim()) errs.full_name = "الاسم مطلوب";
    if (uf.password.length < 8) errs.password = "كلمة المرور 8 أحرف على الأقل";
    setUerr(errs);
    if (Object.keys(errs).length) return;
    const nid = uid();
    setDb((d) => ({ ...d, users: [...d.users, { id: nid, username: uf.username, password: uf.password, full_name: uf.full_name, role: uf.role }], profiles: [...d.profiles, { id: nid, username: uf.username, full_name: uf.full_name, role: uf.role, created_at: new Date().toISOString() }] }));
    setUserOpen(false); setUf({ username: "", full_name: "", role: "receptionist", password: "" });
    toast("success", "تم إنشاء المستخدم (في الربط الفعلي يُنشأ في Supabase Auth)");
  };
  const tabs = [
    ["office", "معلومات المكتب", "building"],
    ["users", "المستخدمون", "users"],
    ["schema", "schema.sql", "db"],
    ["policies", "policies.sql", "shield"],
    ["seed", "seed.sql", "db"],
    ["owner", "إنشاء المالك", "key"],
    ["readme", "دليل النشر", "file"],
  ];
  const sqlOf = { schema: SCHEMA_SQL, policies: POLICIES_SQL, seed: SEED_SQL, owner: OWNER_SQL, readme: README_TXT };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
        {tabs.map(([k, l, ic]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition ${tab === k ? "bg-[#0B8371] text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}>
            <Icon n={ic} s={14} />{l}
          </button>
        ))}
      </div>

      {tab === "office" && (
        <Card title="معلومات المكتب (تظهر في الفواتير والطباعة)" icon="building">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm font-bold text-slate-600">
              <p className="flex items-center gap-2"><Icon n="building" s={15} />{OFFICE.nameAr} — {OFFICE.nameEn}</p>
              <p className="flex items-center gap-2"><Icon n="car" s={15} />{OFFICE.activity}</p>
              <p className="flex items-center gap-2"><Icon n="pin" s={15} />{OFFICE.address}</p>
              <p className="flex items-center gap-2"><Icon n="clock" s={15} />{OFFICE.hours}</p>
              <p className="flex items-center gap-2"><Icon n="phone" s={15} />{OFFICE.phones.join(" | ")}</p>
              <p className="flex items-center gap-2"><Icon n="chat" s={15} />{OFFICE.whatsapp}</p>
            </div>
            <div className="rounded-xl bg-[#F4FBF9] p-4 text-center">
              <LogoMark size={110} />
              <p className="mt-2 text-sm font-extrabold text-[#065A4C]">{OFFICE.nameAr}</p>
              <p className="text-[11px] font-bold text-slate-500">{OFFICE.tagline}</p>
              <div className="mt-3 flex justify-center gap-2">
                {[BRAND.main, BRAND.dark, BRAND.deep, BRAND.light].map((c) => (
                  <span key={c} className="flex flex-col items-center gap-1">
                    <span className="h-8 w-8 rounded-lg border border-slate-200" style={{ background: c }} />
                    <span className="text-[9px] font-bold text-slate-400">{c}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {tab === "users" && (
        <Card title="المستخدمون والأدوار" icon="users" pad={false} actions={<Btn icon="plus" onClick={() => setUserOpen(true)}>مستخدم جديد</Btn>}>
          <Tbl head={["اسم المستخدم", "الاسم الكامل", "الدور", "البريد الوهمي للدخول"]}>
            {db.profiles.map((p) => (
              <tr key={p.id}>
                <TD className="font-extrabold text-[#0B8371]">{p.username}</TD>
                <TD>{p.full_name}</TD>
                <TD><Badge tone={p.role === "owner" ? "teal" : p.role === "accountant" ? "blue" : "amber"}>{ROLES[p.role]}</Badge></TD>
                <TD className="text-slate-400">{p.username}@alhitar.local</TD>
              </tr>
            ))}
          </Tbl>
          <p className="border-t border-slate-100 p-3 text-[11px] font-bold text-slate-400">ملاحظة: عند تسجيل الدخول يُحوَّل اسم المستخدم داخلياً إلى بريد وهمي بصيغة username@alhitar.local للمطابقة مع Supabase Auth.</p>
        </Card>
      )}

      {["schema", "policies", "seed", "owner", "readme"].includes(tab) && (
        <Card title={tabs.find((t) => t[0] === tab)[1]} icon="db" actions={<Btn variant="soft" icon="copy" onClick={() => copy(sqlOf[tab])}>نسخ الكل</Btn>}>
          <pre dir="ltr" className="max-h-[520px] overflow-auto rounded-xl bg-[#065A4C] p-4 text-left text-[11px] leading-5 text-emerald-50">{sqlOf[tab]}</pre>
        </Card>
      )}

      <Modal open={userOpen} onClose={() => setUserOpen(false)} title="إنشاء مستخدم جديد" icon="users">
        <Field label="اسم المستخدم (إنجليزي)" required error={uerr.username}><input className={INP} value={uf.username} onChange={(e) => setUf({ ...uf, username: e.target.value.toLowerCase() })} placeholder="receptionist2" /></Field>
        <Field label="الاسم الكامل" required error={uerr.full_name}><input className={INP} value={uf.full_name} onChange={(e) => setUf({ ...uf, full_name: e.target.value })} /></Field>
        <Field label="الدور"><select className={INP} value={uf.role} onChange={(e) => setUf({ ...uf, role: e.target.value })}>{Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="كلمة المرور" required error={uerr.password}><input type="password" className={INP} value={uf.password} onChange={(e) => setUf({ ...uf, password: e.target.value })} /></Field>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setUserOpen(false)}>إلغاء</Btn><Btn icon="check" onClick={addUser}>حفظ المستخدم</Btn></div>
      </Modal>
    </div>
  );
}

/* ============================ التطبيق الرئيسي ============================ */
export default function App() {
  const [db, setDb] = useState(() => buildSeed());
  const [session, setSession] = useState(() => {
    try { const s = sessionStorage.getItem("alhitar_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [path, setPath] = useState("/dashboard");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    document.title = `${OFFICE.nameAr} | نظام الإدارة`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/fontsource/css/tajawal@latest/400.css";
    document.head.appendChild(link);
    [500, 700, 800].forEach((w) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = `https://cdn.jsdelivr.net/fontsource/css/tajawal@latest/${w}.css`;
      document.head.appendChild(l);
    });
    const st = document.createElement("style");
    st.textContent = `
      *{font-family:'Tajawal',system-ui,sans-serif}
      @page{size:A5;margin:8mm}
      @media print{
        .app-shell{display:none !important}
        .hide-on-print{display:none !important}
        .print-overlay{position:static !important;background:none !important;padding:0 !important;overflow:visible !important;backdrop-filter:none !important}
        .print-sheet{box-shadow:none !important;border-color:#ddd !important;max-width:none !important}
        body{background:#fff !important}
      }
      ::-webkit-scrollbar{width:8px;height:8px}
      ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:8px}
      ::-webkit-scrollbar-thumb:hover{background:#0FA58C}
    `;
    document.head.appendChild(st);
  }, []);

  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 220); return () => clearTimeout(t); }, [path]);

  const toast = useCallback((type, msg) => {
    const id = uid();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const login = (u) => {
    const s = { id: u.id, username: u.username, full_name: u.full_name, role: u.role, email: `${u.username}@alhitar.local` };
    setSession(s);
    try { sessionStorage.setItem("alhitar_session", JSON.stringify(s)); } catch {}
    setPath("/dashboard");
  };
  const logout = () => {
    setSession(null);
    try { sessionStorage.removeItem("alhitar_session"); } catch {}
    setPath("/dashboard");
  };
  const nav = useCallback((p) => setPath(p), []);
  const can = useCallback((action) => !!session && PERMS[session.role].includes(action), [session]);

  const ctx = { db, setDb, session, login, logout, nav, path, toast, can };

  /* توجيه الصفحات */
  let page = null, title = "";
  const parts = path.split("/").filter(Boolean);
  const qIdx = path.indexOf("?");
  const query = qIdx >= 0 ? new URLSearchParams(path.slice(qIdx + 1)) : new URLSearchParams();
  const clean = qIdx >= 0 ? path.slice(0, qIdx) : path;
  const seg = clean.split("/").filter(Boolean);

  if (!session) page = <LoginPage />;
  else if (seg[0] === "invoices" && seg[1] && seg[2] === "print") { page = <InvoicePrintPage id={seg[1]} />; }
  else {
    if (seg[0] === "dashboard" || seg.length === 0) { page = <DashboardPage />; title = "لوحة التحكم"; }
    else if (seg[0] === "cars" && !seg[1]) { page = <CarsPage />; title = "إدارة السيارات"; }
    else if (seg[0] === "cars" && seg[1] === "new") { page = <CarFormPage />; title = "إضافة سيارة"; }
    else if (seg[0] === "cars" && seg[1]) { page = <CarDetailPage id={seg[1]} edit={query.get("edit") === "1"} />; title = "تفاصيل السيارة"; }
    else if (seg[0] === "customers" && !seg[1]) { page = <CustomersPage />; title = "إدارة العملاء"; }
    else if (seg[0] === "customers" && seg[1] === "new") { page = <CustomerFormPage />; title = "إضافة عميل"; }
    else if (seg[0] === "customers" && seg[1]) { page = <CustomerDetailPage id={seg[1]} edit={query.get("edit") === "1"} />; title = "تفاصيل العميل"; }
    else if (seg[0] === "bookings" && !seg[1]) { page = <BookingsPage />; title = "إدارة الحجوزات"; }
    else if (seg[0] === "bookings" && seg[1] === "new") { page = <BookingWizard presetCustomer={query.get("customer") || ""} />; title = "حجز جديد"; }
    else if (seg[0] === "bookings" && seg[1]) { page = <BookingDetailPage id={seg[1]} />; title = "تفاصيل الحجز"; }
    else if (seg[0] === "invoices" && !seg[1]) { page = <InvoicesPage />; title = "إدارة الفواتير"; }
    else if (seg[0] === "invoices" && seg[1]) { page = <InvoiceDetailPage id={seg[1]} />; title = "تفاصيل الفاتورة"; }
    else if (seg[0] === "payments") { page = <PaymentsPage />; title = "المدفوعات وسندات القبض"; }
    else if (seg[0] === "settings") { page = <SettingsPage />; title = "الإعدادات"; }
    else { page = <EmptyState icon="warn" title="الصفحة غير موجودة" action={<Btn icon="back" onClick={() => nav("/dashboard")}>العودة للوحة التحكم</Btn>} />; title = "غير موجود"; }

    const guard = { cars: true, customers: true, bookings: true, invoices: true, payments: ["owner", "accountant"].includes(session.role), settings: session.role === "owner" }[seg[0]];
    if (seg[0] && guard === false) { page = <EmptyState icon="shield" title="ليس لديك صلاحية الوصول لهذه الصفحة" sub="تواصل مع مالك المكتب لمنحك الصلاحية" action={<Btn icon="back" onClick={() => nav("/dashboard")}>العودة للوحة التحكم</Btn>} />; title = "غير مصرح"; }

    page = <Shell title={title}>{loading ? <PageLoading /> : page}</Shell>;
  }

  return (
    <Ctx.Provider value={ctx}>
      <div dir="rtl" className="min-h-screen bg-[#F4F6F5] text-slate-800">
        {page}
        <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex w-80 flex-col gap-2">
          {toasts.map((t) => (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-extrabold shadow-lg ${t.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
              <Icon n={t.type === "success" ? "check" : "warn"} s={15} />
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </Ctx.Provider>
  );
}