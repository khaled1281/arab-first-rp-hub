import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

const dict = {
  nav: { home: ["الرئيسية", "Home"], about: ["عن السيرفر", "About"], features: ["المميزات", "Features"], rules: ["القوانين", "Rules"], departments: ["الأقسام", "Departments"], join: ["انضم إلينا", "Join"], team: ["الفريق", "Team"], store: ["المتجر", "Store"], staff: ["الطاقم الإداري", "Staff"], supervision: ["الطاقم الرقابي", "Supervision"], devteam: ["الطاقم البرمجي", "Dev Team"], safezones: ["المناطق الآمنة", "Safe Zones"] },
  devTeam: {
    k: ["الطاقم البرمجي", "Development team"],
    t: ["البرمجة في Arab First RP", "Engineering at Arab First RP"],
    p: [
      "الطاقم البرمجي في Arab First RP يتكوّن من شخص واحد فقط، مسؤول عن كل الأنظمة والبوتات والموقع الرسمي.",
      "The Arab First RP development team is a single person, responsible for every system, bot and the official website.",
    ],
    role: ["مسؤول البرمجة في السيرفر", "Head of development"],
    certs: ["شهادة برمجية دولية", "International certifications"],
    years: ["سنوات خبرة برمجية", "Years of experience"],
    langs: ["لغة برمجية متقنة", "Programming languages mastered"],
    langsTitle: ["اللغات البرمجية", "Programming languages"],
  },
  staffPages: {
    loading: ["جارٍ التحميل...", "Loading..."],
    empty: ["لا يوجد أعضاء في هذه الرتبة حالياً.", "No members in this role right now."],
    count: ["عضو", "members"],
    adminK: ["الطاقم الإداري", "Administrative staff"],
    adminT: ["إدارة Arab First RP", "Arab First RP administration"],
    adminP: [
      "جميع أعضاء الطاقم الإداري في Arab First RP بأفاتاراتهم ويوزراتهم الرسمية في الديسكورد.",
      "Every administrative staff member of Arab First RP with their official Discord avatars and handles.",
    ],
    adminRole: ["إداري", "Staff"],
    supK: ["الطاقم الرقابي", "Supervision team"],
    supT: ["الرقابة في Arab First RP", "Arab First RP supervision"],
    supP: [
      "أعضاء الطاقم الرقابي المسؤولون عن متابعة الإدارة وجودة اللعب داخل السيرفر.",
      "The supervision team responsible for monitoring staff and gameplay quality.",
    ],
    supRole: ["رقابي", "Supervisor"],
  },
  hero: {
    badge: ["سيرفر رول بلاي عربي · ERLC Roblox", "Arabic Roleplay Server · ERLC Roblox"],
    title: ["ARAB FIRST RP", "ARAB FIRST RP"],
    sub: [
      "أول تجربة رول بلاي عربية احترافية داخل Emergency Response: Liberty County. واقعية، انضباط، ومجتمع عربي متكامل.",
      "The premier Arabic roleplay experience inside Emergency Response: Liberty County. Realism, discipline, and a full Arabic community.",
    ],
    cta: ["انضم إلى الديسكورد", "Join Discord"],
    cta2: ["اكتشف المزيد", "Explore more"],
  },
  stats: [
    { v: "2025", l: ["سنة التأسيس", "Established"] },
    { v: "ERLC", l: ["منصة اللعب", "Platform"] },
    { v: "24/7", l: ["السيرفر يعمل", "Server uptime"] },
    { v: "AR", l: ["مجتمع عربي", "Arabic community"] },
  ],
  about: {
    k: ["عن السيرفر", "About us"],
    t: ["رول بلاي عربي بمعايير عالمية", "Arabic roleplay, global standards"],
    p: [
      "Arab First RP هو سيرفر رول بلاي عربي داخل لعبة ERLC على روبلوكس، تأسس عام 2025. نقدّم تجربة واقعية منظمة بإدارة عربية محترفة، مع أقسام شرطة وإسعاف وإطفاء ومدنيين، وقوانين واضحة تضمن جودة اللعب للجميع.",
      "Arab First RP is an Arabic roleplay server on ERLC (Roblox), founded in 2025. We deliver a realistic, well-structured experience run by a professional Arabic staff team, with police, EMS, fire and civilian divisions, plus clear rules that keep the quality high for everyone.",
    ],
  },
  features: {
    k: ["المميزات", "Features"],
    t: ["لماذا Arab First RP؟", "Why Arab First RP?"],
    items: [
      { t: ["واقعية عالية", "High realism"], d: ["سيناريوهات ودوريات مبنية على قواعد واقعية ومنطقية.", "Scenarios and patrols built on realistic, logical standards."] },
      { t: ["إدارة نشطة", "Active staff"], d: ["فريق إداري متواجد على مدار الساعة لحل البلاغات بسرعة.", "A staff team available around the clock to handle reports fast."] },
      { t: ["تدريب رسمي", "Official training"], d: ["دورات تدريب لكل قسم قبل الانضمام للخدمة الفعلية.", "Training courses for every department before active duty."] },
      { t: ["مجتمع محترم", "Respectful community"], d: ["بيئة عربية خالية من السُمية والإساءة بكل أشكالها.", "An Arabic environment free of toxicity and harassment."] },
      { t: ["فعاليات أسبوعية", "Weekly events"], d: ["مطاردات، عمليات، ومسابقات بجوائز داخل السيرفر.", "Chases, operations and contests with in-server prizes."] },
      { t: ["ترقيات عادلة", "Fair promotions"], d: ["نظام رتب واضح يعتمد على الأداء والالتزام فقط.", "A clear rank system based purely on performance and commitment."] },
    ],
  },
  departments: {
    k: ["الأقسام", "Departments"],
    t: ["اختر مسارك", "Choose your path"],
    items: [
      { t: ["الشرطة", "Police"], d: ["دوريات، مرور، وتحقيقات جنائية.", "Patrols, traffic and criminal investigations."] },
      { t: ["الإسعاف", "EMS"], d: ["استجابة طبية طارئة ونقل المصابين.", "Emergency medical response and transport."] },
      { t: ["الإطفاء", "Fire"], d: ["مكافحة الحرائق وعمليات الإنقاذ.", "Firefighting and rescue operations."] },
      { t: ["المدنيون", "Civilians"], d: ["حياة يومية، أعمال، وسيناريوهات حرة.", "Daily life, jobs and free scenarios."] },
      { t: ["وزارة العدل", "Ministry of Justice"], d: ["القضاء، المحاكم، والمحاماة داخل السيرفر.", "Judges, courts and legal defense inside the server."] },
    ],
    apply: ["تقديم", "Apply"],
    status: ["التقديمات مغلقة", "Applications closed"],
    closedTitle: ["التقديم مغلق حالياً", "Applications are currently closed"],
    closedMsg: [
      "تم إغلاق التقديم على هذا القسم مؤقتاً. تابع سيرفر الديسكورد ليصلك إعلان فتح التقديمات.",
      "Applications for this department are temporarily closed. Follow our Discord for the reopening announcement.",
    ],
    noApply: ["لا يحتاج تقديم", "No application needed"],
  },

  rules: {
    k: ["القوانين", "Rules"],
    t: ["قوانين السيرفر الكاملة", "Full server rules"],
  },
  join: {
    k: ["انضم إلينا", "Join us"],
    t: ["مكانك بانتظارك", "Your spot is waiting"],
    p: ["ادخل سيرفر الديسكورد، اقرأ القوانين، وابدأ رحلتك في Arab First RP اليوم.", "Join our Discord, read the rules, and start your journey at Arab First RP today."],
    cta: ["دخول الديسكورد", "Open Discord"],
  },
  team: {
    k: ["فريق العمل", "Our team"],
    t: ["قيادة Arab First RP", "Arab First RP leadership"],
    devRole: ["مبرمج السيرفر الرسمي", "Official server developer"],
    devDesc: [
      "المسؤول عن الموقع الرسمي والأنظمة والبوتات والتصميم داخل Arab First RP.",
      "Behind the official website, systems, bots and design of Arab First RP.",
    ],
    note: ["الأسماء المعروضة هي معرفات الديسكورد الرسمية للإدارة.", "Names shown are the official Discord handles of the staff."],
  },
  store: {
    k: ["المتجر", "Store"],
    t: ["متجر Arab First RP", "Arab First RP Store"],
    p: [
      "ادعم السيرفر واحصل على مزايا إضافية داخل اللعب. الدفع بالروبوكس عبر تذكرة في الديسكورد.",
      "Support the server and unlock extra in-game perks. Payment in Robux through a Discord ticket.",
    ],
    buy: ["اشترِ عبر الديسكورد", "Buy via Discord"],
    currency: ["روبوكس", "Robux"],
    popular: ["الأكثر طلباً", "Most popular"],
    note: ["يتم تسليم المشتريات بعد تأكيد الدفع من الإدارة.", "Purchases are delivered after staff confirms the payment."],
    items: [
      { t: ["شراء سيارة", "Buy a car"], d: ["أضف سيارة خاصة إلى حسابك داخل السيرفر.", "Add a personal car to your in-server account."], price: 30, tag: "" },
      { t: ["سيارة ون ادشن", "One Edition car"], d: ["سيارة حصرية ومميزة لا يمتلكها الجميع.", "An exclusive, rare edition vehicle."], price: 200, tag: "popular" },
      { t: ["شخصية ٢", "2nd character"], d: ["افتح خانة شخصية ثانية بهوية مستقلة.", "Unlock a second character slot with its own identity."], price: 100, tag: "" },
      { t: ["شخصية ٣", "3rd character"], d: ["خانة شخصية ثالثة — تتطلب امتلاك الشخصية الثانية.", "A third character slot — requires owning the 2nd character."], price: 150, tag: "req" },
      { t: ["شراء مقر", "Buy a base"], d: ["مقر خاص لك أو لعصابتك داخل الخريطة.", "A private base for you or your crew on the map."], price: 100, tag: "" },
    ],
    req: ["يتطلب شراء شخصية ٢ أولاً", "Requires the 2nd character first"],
  },
  safezones: {
    k: ["المناطق الآمنة", "Safe Zones"],
    t: ["خريطة السيرفر", "Server map"],
    p: [
      "خريطة Season 4 الرسمية لـ Arab First RP. المناطق المظللة بالأخضر هي المناطق الآمنة، بينما المظللة بالبرتقالي مناطق تجارية وصناعية.",
      "The official Season 4 map of Arab First RP. Green-shaded areas are safe zones, while orange-shaded areas are commercial and industrial districts.",
    ],
    legend: ["مفتاح الخريطة", "Map legend"],
    safe: ["منطقة آمنة", "Safe zone"],
    commercial: ["منطقة تجارية/صناعية", "Commercial / industrial"],
    road: ["طرق رئيسية", "Main roads"],
    note: [
      "احترم المناطق الأمنة، لا يحق لك الطلق فيها او خطف مواطن في المناطق الامنة - afrps4 ",
      "Respect each zone's boundaries during play. Safe zones are for daily interaction — not chases or operations.",
    ],
  },
  footer: { rights: ["جميع الحقوق محفوظة", "All rights reserved"], dev: ["تطوير", "Developed by"] },
} as const;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "ar", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  const i = lang === "ar" ? 0 : 1;
  const t = (pair: readonly [string, string] | string[]) => pair[i];
  return { lang, setLang, i, t, dict };
}

export const DISCORD_URL = "https://discord.gg/af-1";
