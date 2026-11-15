// Fake data for کافه مدرسه V1 demo
// Coordinates chosen so 500–800 m radius mechanism is visible

const SCHOOLS = [
  {
    id: "school-1",
    name: "دبیرستان سلام تجریش",
    lat: 35.80621,
    lng: 51.44092,
    area: "تجریش"
  },
  {
    id: "school-2",
    name: "دبیرستان نمونه ونک",
    lat: 35.76104,
    lng: 51.39422,
    area: "ونک"
  }
];

const CAFES = [
  // Around Salam Tajrish (~500-700m)
  {
    id: "cafe-1",
    name: "کافه دزاشیب",
    lat: 35.8085,
    lng: 51.4370,
    address: "خیابان دزاشیب، نزدیک میدان قدس",
    schools: ["school-1"], // within range of school-1
    icon: "☕"
  },
  {
    id: "cafe-2",
    name: "قهوه‌خانه تجریش",
    lat: 35.8040,
    lng: 51.4435,
    address: "خیابان شریعتی، روبروی مترو تجریش",
    schools: ["school-1"],
    icon: "🫘"
  },
  {
    id: "cafe-3",
    name: "کافه باغ‌فردوس",
    lat: 35.8098,
    lng: 51.4450,
    address: "خیابان ولیعصر، بالاتر از تجریش",
    schools: ["school-1"],
    icon: "🌿"
  },
  // Around Vanak (~500-800m)
  {
    id: "cafe-4",
    name: "کافه ونک",
    lat: 35.7585,
    lng: 51.3970,
    address: "خیابان ونک، نزدیک میدان",
    schools: ["school-2"],
    icon: "☕"
  },
  {
    id: "cafe-5",
    name: "روستر آناهیتا",
    lat: 35.7635,
    lng: 51.3900,
    address: "خیابان گاندی، جنب پارک",
    schools: ["school-2"],
    icon: "🔥"
  },
  // Shared / slightly farther for demo
  {
    id: "cafe-6",
    name: "کافه چهارراه",
    lat: 35.7800,
    lng: 51.4200,
    address: "خیابان ولیعصر، محدوده میانی",
    schools: [], // not in range of either by default
    icon: "🥐"
  }
];

// Default menus – admin can edit via localStorage
const DEFAULT_MENUS = {
  "cafe-1": {
    coffee: {
      hot: [
        { id: "c1h1", name: "اسپرسو", price: 85000, desc: "تک شات" },
        { id: "c1h2", name: "آمریکانو", price: 95000, desc: "" },
        { id: "c1h3", name: "کاپوچینو", price: 120000, desc: "شیر بخار" },
        { id: "c1h4", name: "لاته", price: 130000, desc: "" }
      ],
      cold: [
        { id: "c1c1", name: "آیس آمریکانو", price: 110000, desc: "" },
        { id: "c1c2", name: "آیس لاته", price: 140000, desc: "" },
        { id: "c1c3", name: "فراپه", price: 150000, desc: "یخ و شکر" }
      ]
    },
    nonCaffeine: {
      hot: [
        { id: "c1n1", name: "چای سیاه", price: 45000, desc: "" },
        { id: "c1n2", name: "چای سبز", price: 55000, desc: "" },
        { id: "c1n3", name: "شکلات داغ", price: 110000, desc: "بدون کافئین" }
      ],
      cold: [
        { id: "c1n4", name: "لیموناد", price: 90000, desc: "" },
        { id: "c1n5", name: "شیک موز", price: 130000, desc: "" }
      ]
    },
    sweets: [
      { id: "c1s1", name: "کیک شکلاتی", price: 95000, desc: "برش" },
      { id: "c1s2", name: "کوکی شکلات", price: 45000, desc: "" },
      { id: "c1s3", name: "کرواسان", price: 75000, desc: "" }
    ]
  },
  "cafe-2": {
    coffee: {
      hot: [
        { id: "c2h1", name: "اسپرسو دوبل", price: 100000, desc: "" },
        { id: "c2h2", name: "ماکیاتو", price: 115000, desc: "" },
        { id: "c2h3", name: "موکا", price: 140000, desc: "شکلات + اسپرسو" }
      ],
      cold: [
        { id: "c2c1", name: "آیس موکا", price: 155000, desc: "" },
        { id: "c2c2", name: "کولد برو", price: 130000, desc: "۱۸ ساعته" }
      ]
    },
    nonCaffeine: {
      hot: [
        { id: "c2n1", name: "چای دارچین", price: 60000, desc: "" },
        { id: "c2n2", name: "شیر گرم عسل", price: 85000, desc: "" }
      ],
      cold: [
        { id: "c2n3", name: "آب پرتقال تازه", price: 100000, desc: "" }
      ]
    },
    sweets: [
      { id: "c2s1", name: "براونی", price: 85000, desc: "" },
      { id: "c2s2", name: "مافین بلوبری", price: 90000, desc: "" }
    ]
  },
  "cafe-3": {
    coffee: {
      hot: [
        { id: "c3h1", name: "اسپرسو", price: 90000, desc: "" },
        { id: "c3h2", name: "فلات وایت", price: 135000, desc: "" }
      ],
      cold: [
        { id: "c3c1", name: "آیس لاته وانیل", price: 150000, desc: "" }
      ]
    },
    nonCaffeine: {
      hot: [
        { id: "c3n1", name: "چای ماسالا", price: 75000, desc: "" },
        { id: "c3n2", name: "هات چاکلت", price: 120000, desc: "" }
      ],
      cold: [
        { id: "c3n3", name: "اسموتی توت", price: 140000, desc: "" }
      ]
    },
    sweets: [
      { id: "c3s1", name: "تارت لیمو", price: 110000, desc: "" },
      { id: "c3s2", name: "چیزکیک", price: 130000, desc: "" }
    ]
  },
  "cafe-4": {
    coffee: {
      hot: [
        { id: "c4h1", name: "اسپرسو", price: 80000, desc: "" },
        { id: "c4h2", name: "کاپوچینو", price: 115000, desc: "" },
        { id: "c4h3", name: "لاته کارامل", price: 145000, desc: "" }
      ],
      cold: [
        { id: "c4c1", name: "آیس آمریکانو", price: 105000, desc: "" },
        { id: "c4c2", name: "فراپاچینو", price: 160000, desc: "" }
      ]
    },
    nonCaffeine: {
      hot: [
        { id: "c4n1", name: "چای سبز ژاپنی", price: 70000, desc: "" },
        { id: "c4n2", name: "شکلات داغ", price: 105000, desc: "" }
      ],
      cold: [
        { id: "c4n3", name: "لیموناد نعناع", price: 95000, desc: "" }
      ]
    },
    sweets: [
      { id: "c4s1", name: "کیک هویج", price: 100000, desc: "" },
      { id: "c4s2", name: "دونات", price: 55000, desc: "" }
    ]
  },
  "cafe-5": {
    coffee: {
      hot: [
        { id: "c5h1", name: "اسپرسو سینگل", price: 75000, desc: "" },
        { id: "c5h2", name: "آمریکانو", price: 90000, desc: "" },
        { id: "c5h3", name: "کورتادو", price: 110000, desc: "" }
      ],
      cold: [
        { id: "c5c1", name: "آیس لاته", price: 135000, desc: "" }
      ]
    },
    nonCaffeine: {
      hot: [
        { id: "c5n1", name: "چای سیاه", price: 40000, desc: "" },
        { id: "c5n2", name: "شیر کاکائو", price: 95000, desc: "" }
      ],
      cold: [
        { id: "c5n3", name: "شیک شکلات", price: 125000, desc: "بدون قهوه" }
      ]
    },
    sweets: [
      { id: "c5s1", name: "کوکی جو", price: 50000, desc: "" },
      { id: "c5s2", name: "کیک ساده", price: 80000, desc: "" }
    ]
  },
  "cafe-6": {
    coffee: {
      hot: [
        { id: "c6h1", name: "اسپرسو", price: 85000, desc: "" }
      ],
      cold: [
        { id: "c6c1", name: "آیس کافی", price: 120000, desc: "" }
      ]
    },
    nonCaffeine: {
      hot: [
        { id: "c6n1", name: "چای", price: 45000, desc: "" }
      ],
      cold: [
        { id: "c6n2", name: "آبمیوه", price: 80000, desc: "" }
      ]
    },
    sweets: [
      { id: "c6s1", name: "شیرینی خشک", price: 60000, desc: "" }
    ]
  }
};

// Haversine distance in meters
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Get cafes within 500-800m of a school (or show all nearby-ish for demo)
function getNearbyCafes(schoolId) {
  const school = SCHOOLS.find(s => s.id === schoolId);
  if (!school) return [];
  return CAFES.map(c => {
    const dist = distanceMeters(school.lat, school.lng, c.lat, c.lng);
    return { ...c, distance: Math.round(dist) };
  }).filter(c => c.distance <= 900) // slight buffer for demo visibility
    .sort((a, b) => a.distance - b.distance);
}

function formatPrice(n) {
  return n.toLocaleString('fa-IR') + ' تومان';
}
