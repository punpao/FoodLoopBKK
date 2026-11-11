// Mock catalogues for the prototype. All store, partner and product names are
// fictional, and every price, weight and quantity is illustrative demo data.

import type { Deal, DealCategory, Food, GuideStep, IconName, ItemSeed, Level, LogEntry, LoopKey, Perk, Recipe, Store, TabId } from './types';

// Ingredient catalogue. `alias` lets manually typed names (Thai or English) match recipes.
export const FOODS: Record<string, Food> = {
  bread:    { name: 'ขนมปังแผ่น', icon: '🍞', alias: ['ขนมปัง', 'bread', 'toast'] },
  basil:    { name: 'ใบกะเพรา',   icon: '🌿', alias: ['กะเพรา', 'basil'] },
  pork:     { name: 'หมูสับ',      icon: '🥩', alias: ['หมู', 'pork'] },
  egg:      { name: 'ไข่ไก่',      icon: '🥚', alias: ['ไข่', 'egg'] },
  rice:     { name: 'ข้าวสวย',     icon: '🍚', alias: ['ข้าว', 'rice'] },
  milk:     { name: 'นมสด',       icon: '🥛', alias: ['นมสด', 'นมจืด', 'milk'] },
  tomato:   { name: 'มะเขือเทศ',   icon: '🍅', alias: ['มะเขือเทศ', 'tomato'] },
  yogurt:   { name: 'โยเกิร์ต',     icon: '🥣', alias: ['โยเกิร์ต', 'yogurt', 'yoghurt'] },
  garlic:   { name: 'กระเทียม',    icon: '🧄', alias: ['กระเทียม', 'garlic'] },
  banana:   { name: 'กล้วย',       icon: '🍌', alias: ['กล้วย', 'banana'] },
  chicken:  { name: 'อกไก่',       icon: '🍗', alias: ['ไก่', 'chicken'] },
  glory:    { name: 'ผักบุ้ง',      icon: '🥬', alias: ['ผักบุ้ง', 'morning glory'] },
  tofu:     { name: 'เต้าหู้อ่อน',   icon: '🍢', alias: ['เต้าหู้', 'tofu'] },
  coconut:  { name: 'กะทิ',        icon: '🥥', alias: ['กะทิ', 'coconut'] },
  mushroom: { name: 'เห็ด',        icon: '🍄', alias: ['เห็ด', 'mushroom'] },
  lime:     { name: 'มะนาว',      icon: '🍋', alias: ['มะนาว', 'lime'] },
  galangal: { name: 'ข่า',         icon: '🌿', alias: ['ข่า', 'galangal'] },
  chili:    { name: 'พริก',        icon: '🌶️', alias: ['พริก', 'chili', 'chilli'] },
};

// Icon guesses for manual entries that are not in the catalogue.
export const ICON_GUESS: [string, string][] = [
  ['กิมจิ', '🥬'], ['kimchi', '🥬'], ['แอปเปิ', '🍎'], ['apple', '🍎'], ['มะม่วง', '🥭'], ['mango', '🥭'],
  ['ปลา', '🐟'], ['fish', '🐟'], ['กุ้ง', '🦐'], ['shrimp', '🦐'], ['ชีส', '🧀'], ['cheese', '🧀'],
  ['แครอ', '🥕'], ['carrot', '🥕'], ['เส้น', '🍜'], ['ก๋วยเตี๋ยว', '🍜'], ['noodle', '🍜'], ['แกง', '🍛'], ['curry', '🍛'],
  ['ส้ม', '🍊'], ['orange', '🍊'], ['เนย', '🧈'], ['butter', '🧈'], ['สลัด', '🥗'], ['salad', '🥗'], ['เค้ก', '🍰'], ['cake', '🍰'],
];

// What is in the fridge on first load.
export const SEED_FRIDGE: ItemSeed[] = [
  ['yogurt', '1 ถ้วย', -1, 25, 0.15],
  ['basil', '1 กำ', 0, 15, 0.05],
  ['bread', '6 แผ่น', 1, 45, 0.4],
  ['rice', '2 ถ้วย', 1, 15, 0.3],
  ['milk', '500 มล.', 2, 52, 0.5],
  ['banana', '3 ลูก', 2, 25, 0.35],
  ['pork', '300 กรัม', 3, 60, 0.3],
  ['tomato', '4 ลูก', 4, 30, 0.4],
  ['egg', '6 ฟอง', 9, 48, 0.36],
  ['garlic', '1 หัว', 14, 20, 0.1],
];

// The mock receipt that "สแกนใบเสร็จ" reads.
export const RECEIPT: { store: string; items: ItemSeed[] } = {
  store: 'ตลาดใจดี มาร์ท',
  items: [
    ['glory', '1 กำ', 2, 20, 0.25],
    ['chicken', '400 กรัม', 3, 89, 0.4],
    ['mushroom', '200 กรัม', 3, 45, 0.2],
    ['tofu', '1 ก้อน', 4, 18, 0.3],
    ['lime', '5 ลูก', 10, 25, 0.25],
    ['coconut', '250 มล.', 30, 32, 0.25],
  ],
};

// Recipes. `keep: true` marks long-life staples that stay in the fridge after cooking.
export const RECIPES: Recipe[] = [
  { id: 'frenchtoast', name: 'ขนมปังชุบไข่', icon: '🍳', mins: 10,
    ings: [{ key: 'bread' }, { key: 'milk' }, { key: 'banana' }, { key: 'egg', keep: true }], pantry: 'เนย, น้ำตาล',
    steps: ['ตีไข่กับนมสดและน้ำตาลเล็กน้อย', 'ชุบขนมปังให้ชุ่ม แล้วทอดกับเนยจนเหลืองทอง', 'โรยหน้าด้วยกล้วยหั่นแว่น'] },
  { id: 'krapow', name: 'ผัดกะเพราหมูสับ', icon: '🍛', mins: 15,
    ings: [{ key: 'basil' }, { key: 'pork' }, { key: 'rice' }, { key: 'garlic', keep: true }, { key: 'egg', keep: true }], pantry: 'น้ำมัน, น้ำปลา, ซีอิ๊ว',
    steps: ['เจียวกระเทียม ใส่หมูสับ ผัดด้วยไฟแรง', 'ปรุงรส ใส่ใบกะเพรา แล้วปิดไฟ', 'ราดบนข้าว โปะไข่ดาว'] },
  { id: 'khaopad', name: 'ข้าวผัดไข่', icon: '🍚', mins: 12,
    ings: [{ key: 'rice' }, { key: 'tomato' }, { key: 'egg', keep: true }, { key: 'garlic', keep: true }, { key: 'lime', keep: true }], pantry: 'น้ำมัน, ซีอิ๊ว',
    steps: ['ผัดไข่กับกระเทียมให้หอม', 'ใส่ข้าวเย็นและมะเขือเทศ ผัดจนร่วนและร้อน', 'ปรุงรส เสิร์ฟพร้อมมะนาวฝาน'] },
  { id: 'tomatoegg', name: 'ไข่ผัดมะเขือเทศ', icon: '🍅', mins: 10,
    ings: [{ key: 'tomato' }, { key: 'rice' }, { key: 'egg', keep: true }, { key: 'garlic', keep: true }], pantry: 'น้ำมัน, น้ำตาล, น้ำปลา',
    steps: ['ผัดไข่พอสุกนุ่ม ตักพักไว้', 'ผัดมะเขือเทศกับกระเทียมจนเป็นซอส', 'ใส่ไข่กลับลงไปคลุก แล้วราดข้าว'] },
  { id: 'khaijiao', name: 'ไข่เจียวราดข้าว', icon: '🥚', mins: 8,
    ings: [{ key: 'rice' }, { key: 'egg', keep: true }], pantry: 'น้ำมัน, น้ำปลา',
    steps: ['ตีไข่กับน้ำปลาให้ขึ้นฟู', 'ทอดในน้ำมันร้อนจนฟูกรอบ', 'วางบนข้าวสวยร้อนๆ'] },
  { id: 'pakboong', name: 'ผัดผักบุ้งไฟแดง', icon: '🥬', mins: 7,
    ings: [{ key: 'glory' }, { key: 'garlic', keep: true }, { key: 'chili' }], pantry: 'น้ำมัน, ซอสหอยนางรม',
    steps: ['ทุบกระเทียมและพริก', 'ผัดผักบุ้งด้วยไฟแรงจัดประมาณ 1 นาที', 'ปรุงรส แล้วเสิร์ฟทันที'] },
  { id: 'tomkha', name: 'ต้มข่าไก่', icon: '🍲', mins: 25,
    ings: [{ key: 'chicken' }, { key: 'mushroom' }, { key: 'coconut' }, { key: 'lime', keep: true }, { key: 'galangal' }], pantry: 'น้ำปลา',
    steps: ['ต้มกะทิกับข่าให้หอม', 'ใส่ไก่และเห็ด ต้มจนสุก', 'ปรุงด้วยน้ำมะนาวและน้ำปลา'] },
  { id: 'gaengjued', name: 'แกงจืดเต้าหู้หมูสับ', icon: '🥣', mins: 15,
    ings: [{ key: 'tofu' }, { key: 'pork' }, { key: 'mushroom' }, { key: 'garlic', keep: true }], pantry: 'น้ำซุป, ซีอิ๊ว',
    steps: ['ต้มน้ำซุปกับกระเทียม', 'ปั้นหมูสับเป็นก้อนเล็ก ใส่ลงไปพร้อมเห็ด', 'ใส่เต้าหู้ ต้มพออุ่น แล้วปรุงรส'] },
];

// Fictional stores. x / y place them on the illustrative map (viewBox 100 x 72).
export const STORES: Record<string, Store> = {
  yimyim:  { name: 'ยิ้มยิ้ม เบคเฮาส์', type: 'ร้านเบเกอรี่',     dist: 350,  x: 40, y: 48 },
  jaidee:  { name: 'ตลาดใจดี มาร์ท',   type: 'ซูเปอร์มาร์เก็ต',  dist: 600,  x: 14, y: 40 },
  baanpak: { name: 'บ้านผัก กรีนส์',    type: 'ร้านผักผลไม้',     dist: 900,  x: 66, y: 40 },
  imdee:   { name: 'อิ่มดี คิทเช่น',     type: 'ร้านอาหารปรุงสุก', dist: 1200, x: 88, y: 52 },
  nomsod:  { name: 'นมสด แดรี่บาร์',    type: 'ร้านนม',          dist: 1800, x: 66, y: 18 },
  soi:     { name: 'ตลาดสดซอยลูป',    type: 'ตลาดสด',          dist: 2400, x: 88, y: 18 },
};
export const YOU = { x: 27, y: 60 };

export const CATEGORIES: ['all' | DealCategory, string][] = [
  ['all', 'ทั้งหมด'], ['bakery', 'เบเกอรี่'], ['ready', 'อาหารพร้อมทาน'], ['produce', 'ผักผลไม้'], ['dairy', 'นมและไข่'],
];
export const DISTANCES: [number, string][] = [[0, 'ทุกระยะ'], [500, 'ภายใน 500 ม.'], [1000, 'ภายใน 1 กม.'], [2000, 'ภายใน 2 กม.']];
export const ENDING_SOON_MIN = 60;

// Surplus deals, all 40–60% off. `endsIn` is minutes until the pickup window closes (mock).
export const DEALS: Omit<Deal, 'navigated'>[] = [
  { id: 'd1',  store: 'yimyim',  cat: 'bakery',  icon: '🥐', name: 'ครัวซองต์เนยสด กล่อง 4 ชิ้น',        was: 160, now: 72, left: 3, pickup: '18:00–20:00', endsIn: 35,  kg: 0.3 },
  { id: 'd2',  store: 'yimyim',  cat: 'bakery',  icon: '🍞', name: 'ขนมปังซาวโดว์',                    was: 120, now: 60, left: 5, pickup: '18:00–20:00', endsIn: 35,  kg: 0.5 },
  { id: 'd3',  store: 'jaidee',  cat: 'ready',   icon: '🥗', name: 'สลัดโบว์ลเต้าหู้ย่าง',                was: 129, now: 58, left: 4, pickup: '19:00–21:00', endsIn: 95,  kg: 0.35 },
  { id: 'd4',  store: 'jaidee',  cat: 'dairy',   icon: '🥛', name: 'นมสด 1 ลิตร ควรบริโภคก่อนพรุ่งนี้',   was: 58,  now: 29, left: 6, pickup: '19:00–21:00', endsIn: 95,  kg: 1 },
  { id: 'd5',  store: 'baanpak', cat: 'produce', icon: '🥬', name: 'กล่องผักรวม',                      was: 140, now: 77, left: 2, pickup: '17:30–19:00', endsIn: 20,  kg: 1.5 },
  { id: 'd6',  store: 'baanpak', cat: 'produce', icon: '🥭', name: 'มะม่วงสุก 1 กก.',                   was: 85,  now: 51, left: 7, pickup: '17:30–19:00', endsIn: 20,  kg: 1 },
  { id: 'd7',  store: 'imdee',   cat: 'ready',   icon: '🍛', name: 'ชุดแกงเขียวหวานพร้อมข้าว',          was: 120, now: 48, left: 2, pickup: '20:00–21:30', endsIn: 150, kg: 0.45 },
  { id: 'd8',  store: 'imdee',   cat: 'ready',   icon: '🍱', name: 'ข้าวกล่องไก่ย่าง',                   was: 90,  now: 45, left: 4, pickup: '20:00–21:30', endsIn: 150, kg: 0.4 },
  { id: 'd9',  store: 'nomsod',  cat: 'dairy',   icon: '🥣', name: 'โยเกิร์ต 4 ถ้วย',                    was: 75,  now: 33, left: 5, pickup: '18:30–20:30', endsIn: 55,  kg: 0.5 },
  { id: 'd10', store: 'soi',     cat: 'dairy',   icon: '🥚', name: 'ไข่ไก่ 10 ฟอง ใกล้วันหมดอายุ',       was: 65,  now: 39, left: 8, pickup: '17:00–19:30', endsIn: 45,  kg: 0.6 },
];

// Reward perks from fictional partners.
export const PERKS: Perk[] = [
  { id: 'p1', icon: '🛍️', name: 'ถุงผ้าใส่ผักใช้ซ้ำ',          partner: 'ลูป กู๊ดส์',           cost: 150 },
  { id: 'p2', icon: '🧋', name: 'ชาไทยเย็นฟรี 1 แก้ว',        partner: 'รถเข็นชาเย็น',        cost: 200 },
  { id: 'p3', icon: '🥐', name: 'ส่วนลด ฿30 สำหรับดีลใดก็ได้', partner: 'ยิ้มยิ้ม เบคเฮาส์',     cost: 300 },
  { id: 'p4', icon: '🪱', name: 'ชุดเริ่มต้นทำปุ๋ยหมัก',         partner: 'ดินดี ฟาร์มในเมือง',   cost: 500 },
  { id: 'p5', icon: '🚲', name: 'บัตรจักรยานสาธารณะ 1 วัน',   partner: 'วงเวียน ไบค์',        cost: 800 },
  { id: 'p6', icon: '👩‍🍳', name: 'คลาสทำอาหารไร้ของเหลือ',   partner: 'ครัวลูป สตูดิโอ',      cost: 1200 },
];

export const LEVELS: Level[] = [
  { name: 'ต้นกล้า',    min: 0,    icon: '🌱' },
  { name: 'ต้นอ่อน',    min: 200,  icon: '🌿' },
  { name: 'ไม้หนุ่ม',    min: 500,  icon: '🪴' },
  { name: 'ต้นไม้ใหญ่',  min: 1000, icon: '🌳' },
  { name: 'ผืนป่า',     min: 2000, icon: '🌲' },
];

export const POINTS = { scan: 20, log: 5, use: 10, cook: 40, perRescue: 10, mission: 25, deal: 30, dispose: 60, loopBonus: 50 };
export const STREAK_MILESTONES = [3, 5, 7, 14, 30];
export const CO2E_PER_KG = 2.5;   // illustrative demo factor, kg CO2e per kg of food kept out of the bin
export const FEE_THB = 20;        // discounted collection fee named in the pitch brief
export const NEAR_DAYS = 2;       // "expiring soon" = today, tomorrow or the day after
export const USER_NAME = 'พลอย';

// The three arcs of the daily loop, in journey order.
export const LOOP: { key: LoopKey; tab: TabId; label: string; phase: string; icon: IconName; blurb: string }[] = [
  { key: 'eat',  tab: 'fridge',  label: 'ใช้ของในตู้เย็น', phase: 'ก่อนกิน',      icon: 'fridge', blurb: 'ตู้เย็นอัจฉริยะและสูตรอาหาร' },
  { key: 'save', tab: 'deals',   label: 'รับดีลอาหาร',    phase: 'ก่อนเหลือทิ้ง', icon: 'tag',    blurb: 'อาหารส่วนเกินลด 40–60%' },
  { key: 'sort', tab: 'dispose', label: 'แยกเศษอาหาร',   phase: 'เมื่อต้องทิ้ง',  icon: 'bin',    blurb: 'คัดแยกแบบไม่เทรวม ค่าเก็บขยะ ฿20' },
];

export const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'home',    label: 'หน้าหลัก', icon: 'home' },
  { id: 'fridge',  label: 'ตู้เย็น',   icon: 'fridge' },
  { id: 'deals',   label: 'ดีล',      icon: 'tag' },
  { id: 'dispose', label: 'ไม่เทรวม', icon: 'bin' },
  { id: 'rewards', label: 'รางวัล',   icon: 'trophy' },
];

export const SEED_LOG: LogEntry[] = [
  { icon: '🍚', text: 'ทำข้าวผัดไข่จากข้าวเหลือ', pts: 50, when: 'เมื่อวาน' },
  { icon: '🍞', text: 'รับขนมปังซาวโดว์ลด 50%', pts: 30, when: 'เมื่อวาน' },
  { icon: '🗑️', text: 'แยกขยะอินทรีย์ ยืนยันรูปแล้ว', pts: 60, when: '2 วันก่อน' },
];

// The presenter's demo guide. Each step opens a tab and highlights one control;
// where `on` is set, the step ticks itself when that action happens.
export const GUIDE: GuideStep[] = [
  { tab: 'home', target: 'loop', title: 'หนึ่งลูป สามอย่างเล็กๆ',
    text: 'ใช้ของในตู้เย็น รับดีลอาหาร แยกเศษอาหาร ทำอย่างเดียวก็นับวันต่อเนื่อง ทำครบสามอย่างคือปิดลูป' },
  { tab: 'fridge', view: 'items', target: 'scan', on: 'scan', title: 'ก่อนกิน: สแกนใบเสร็จ',
    text: 'แตะ “สแกนใบเสร็จ” แล้วเพิ่มรายการ ตู้เย็นจะเรียงตามของที่หมดอายุก่อนให้เอง' },
  { tab: 'fridge', view: 'recipes', target: 'recipe', on: 'cook', title: 'ทำเมนูจากของใกล้หมดอายุ',
    text: 'สูตรที่ใช้ของใกล้หมดอายุจะขึ้นก่อน เปิดสูตรแรกแล้วแตะ “ทำเมนูนี้แล้ว”' },
  { tab: 'deals', target: 'navigate', on: 'deal', title: 'ก่อนเหลือทิ้ง: รับดีลอาหาร',
    text: 'อาหารส่วนเกินลด 40–60% รับที่ร้านเท่านั้น แตะ “นำทางไปร้าน” เพื่อดูเงินที่ประหยัดได้' },
  { tab: 'dispose', target: 'dispose', on: 'dispose', title: 'เมื่อต้องทิ้ง: ไม่เทรวม',
    text: 'ใช้รูปตัวอย่างแล้วส่งตรวจ เพื่อปลดล็อกค่าเก็บขยะ ฿20 ถ้าจะโชว์กรณีรูปไม่ผ่าน ให้ติ๊กช่องผู้นำเสนอก่อน' },
  { tab: 'rewards', target: 'metrics', title: 'ทุกการกระทำถูกนับ',
    text: 'ยอดเงิน อาหาร CO₂e วันต่อเนื่อง ระดับ และสิทธิพิเศษ ขยับตามสิ่งที่เพิ่งทำไปทั้งหมด' },
];
