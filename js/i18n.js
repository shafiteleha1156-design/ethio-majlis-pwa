// Dynamic multi-language strings: English, Amharic, Afaan Oromo, Arabic.
import { store } from './store.js';

const dict = {
  en: {
    home: 'Home', quran: 'Quran', dua: 'Dua', more: 'More', menu: 'Menu',
    prayerTimes: 'Prayer Times', qibla: 'Qibla', tasbih: 'Tasbih', quiz: 'Quiz',
    live: 'Live', library: 'Library', news: 'News', settings: 'Settings',
    hajj: 'Hajj & Umrah', profile: 'Profile', login: 'Login', about: 'About',
    admin: 'Admin', greetingMorning: 'Good Morning', greetingAfternoon: 'Good Afternoon',
    greetingEvening: 'Good Evening', nextPrayer: 'Next Prayer', verseOfDay: 'Verse of the Day',
    hadithOfDay: 'Hadith of the Day', quote: 'Islamic Quote', quickMenu: 'Quick Menu',
    continueReading: 'Continue Reading', recentlyRead: 'Recently Read', search: 'Search',
    bookmarks: 'Bookmarks', favorites: 'Favorites', darkMode: 'Dark Mode', language: 'Language',
    theme: 'Theme', notifications: 'Notifications', logout: 'Logout', share: 'Share App',
    rate: 'Rate App', privacy: 'Privacy Policy', terms: 'Terms', contact: 'Contact',
    signIn: 'Sign In', signUp: 'Create Account', email: 'Email', password: 'Password',
    name: 'Full Name', forgotPw: 'Forgot Password?', continueGoogle: 'Continue with Google',
    welcome: 'Welcome', guest: 'Guest', install: 'Install App', leaderboard: 'Leaderboard',
    startQuiz: 'Start Quiz', score: 'Score', level: 'Level', achievements: 'Achievements',
    seeAll: 'See all', location: 'Location', findQibla: 'Find Qibla', reset: 'Reset',
    count: 'Count', history: 'History', download: 'Download', play: 'Play',
  },
  am: {
    home: 'መነሻ', quran: 'ቁርኣን', dua: 'ዱዓ', more: 'ተጨማሪ', menu: 'ዝርዝር',
    prayerTimes: 'የሶላት ጊዜያት', qibla: 'ቂብላ', tasbih: 'ተስቢህ', quiz: 'ጥያቄ',
    live: 'ቀጥታ', library: 'ቤተ-መጻሕፍት', news: 'ዜና', settings: 'ቅንብሮች',
    hajj: 'ሐጅ እና ዑምራ', profile: 'መገለጫ', login: 'ግባ', about: 'ስለ መተግበሪያው',
    admin: 'አስተዳዳሪ', greetingMorning: 'እንደምን አደራችሁ', greetingAfternoon: 'እንደምን ዋላችሁ',
    greetingEvening: 'እንደምን አመሻችሁ', nextPrayer: 'የሚቀጥለው ሶላት', verseOfDay: 'የቀኑ አንቀጽ',
    hadithOfDay: 'የቀኑ ሐዲስ', quote: 'እስላማዊ ጥቅስ', quickMenu: 'ፈጣን ማውጫ',
    continueReading: 'ማንበብ ቀጥል', recentlyRead: 'በቅርቡ የተነበበ', search: 'ፈልግ',
    bookmarks: 'ዕልባቶች', favorites: 'ተወዳጆች', darkMode: 'ጨለማ ገጽታ', language: 'ቋንቋ',
    theme: 'ገጽታ', notifications: 'ማሳወቂያዎች', logout: 'ውጣ', share: 'መተግበሪያ አጋራ',
    rate: 'መተግበሪያ ደረጃ ስጥ', privacy: 'የግላዊነት መመሪያ', terms: 'ውሎች', contact: 'አግኙን',
    signIn: 'ግባ', signUp: 'መለያ ፍጠር', email: 'ኢሜይል', password: 'የይለፍ ቃል',
    name: 'ሙሉ ስም', forgotPw: 'የይለፍ ቃል ረሱ?', continueGoogle: 'በGoogle ቀጥል',
    welcome: 'እንኳን ደህና መጡ', guest: 'እንግዳ', install: 'መተግበሪያ ጫን', leaderboard: 'ሰንጠረዥ',
    startQuiz: 'ጥያቄ ጀምር', score: 'ውጤት', level: 'ደረጃ', achievements: 'ስኬቶች',
    seeAll: 'ሁሉንም ተመልከት', location: 'አካባቢ', findQibla: 'ቂብላ ፈልግ', reset: 'ዳግም አስጀምር',
    count: 'ቁጥር', history: 'ታሪክ', download: 'አውርድ', play: 'አጫውት',
  },
  om: {
    home: 'Mana', quran: "Qur'aana", dua: "Du'aa", more: 'Dabalata', menu: 'Baala',
    prayerTimes: 'Yeroo Salaataa', qibla: 'Qiblaa', tasbih: 'Tasbiih', quiz: 'Gaaffii',
    live: 'Kallattii', library: 'Mana Kitaabaa', news: 'Oduu', settings: 'Qindaaʼina',
    hajj: 'Hajjii fi Umraa', profile: 'Ibsa', login: 'Seeni', about: 'Waaʼee',
    admin: 'Bulchaa', greetingMorning: 'Akkam Bultan', greetingAfternoon: 'Akkam Ooltan',
    greetingEvening: 'Akkam Galgaltan', nextPrayer: 'Salaata Itti Aanu', verseOfDay: 'Aayaa Guyyaa',
    hadithOfDay: 'Hadiisa Guyyaa', quote: 'Jecha Islaamaa', quickMenu: 'Baala Ariifataa',
    continueReading: 'Dubbisuu Itti Fufi', recentlyRead: 'Dhiheenya Dubbifame', search: 'Barbaadi',
    bookmarks: 'Mallattoo', favorites: 'Jaallatamoo', darkMode: 'Halluu Dukkanaa', language: 'Afaan',
    theme: 'Bifa', notifications: 'Beeksisa', logout: 'Baʼi', share: 'Appii Qoodi',
    rate: 'Appii Madaali', privacy: 'Imaammata Dhuunfaa', terms: 'Haalawwan', contact: 'Nu Qunnami',
    signIn: 'Seeni', signUp: 'Herrega Uumi', email: 'Imeelii', password: 'Jecha Icciitii',
    name: 'Maqaa Guutuu', forgotPw: 'Jecha icciitii dagatte?', continueGoogle: 'Google waliin itti fufi',
    welcome: 'Baga Nagaan Dhuftan', guest: 'Keessummaa', install: 'Appii Fe’i', leaderboard: 'Gabatee',
    startQuiz: 'Gaaffii Jalqabi', score: 'Qabxii', level: 'Sadarkaa', achievements: 'Milkaaʼina',
    seeAll: 'Hunda ilaali', location: 'Bakka', findQibla: 'Qiblaa barbaadi', reset: 'Haaromsi',
    count: 'Baayina', history: 'Seenaa', download: 'Buufadhu', play: 'Taphachiisi',
  },
  ar: {
    home: 'الرئيسية', quran: 'القرآن', dua: 'دعاء', more: 'المزيد', menu: 'القائمة',
    prayerTimes: 'أوقات الصلاة', qibla: 'القبلة', tasbih: 'تسبيح', quiz: 'اختبار',
    live: 'بث مباشر', library: 'المكتبة', news: 'الأخبار', settings: 'الإعدادات',
    hajj: 'الحج والعمرة', profile: 'الملف', login: 'دخول', about: 'حول',
    admin: 'المشرف', greetingMorning: 'صباح الخير', greetingAfternoon: 'مساء الخير',
    greetingEvening: 'مساء الخير', nextPrayer: 'الصلاة القادمة', verseOfDay: 'آية اليوم',
    hadithOfDay: 'حديث اليوم', quote: 'اقتباس إسلامي', quickMenu: 'قائمة سريعة',
    continueReading: 'متابعة القراءة', recentlyRead: 'قُرئ مؤخراً', search: 'بحث',
    bookmarks: 'الإشارات المرجعية', favorites: 'المفضلة', darkMode: 'الوضع الليلي', language: 'اللغة',
    theme: 'السمة', notifications: 'الإشعارات', logout: 'خروج', share: 'مشاركة التطبيق',
    rate: 'قيّم التطبيق', privacy: 'سياسة الخصوصية', terms: 'الشروط', contact: 'اتصل بنا',
    signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', email: 'البريد الإلكتروني', password: 'كلمة المرور',
    name: 'الاسم الكامل', forgotPw: 'نسيت كلمة المرور؟', continueGoogle: 'المتابعة عبر Google',
    welcome: 'أهلاً بك', guest: 'ضيف', install: 'تثبيت التطبيق', leaderboard: 'المتصدرون',
    startQuiz: 'ابدأ الاختبار', score: 'النتيجة', level: 'المستوى', achievements: 'الإنجازات',
    seeAll: 'عرض الكل', location: 'الموقع', findQibla: 'ابحث عن القبلة', reset: 'إعادة',
    count: 'العدد', history: 'السجل', download: 'تحميل', play: 'تشغيل',
  },
};

export const LANGS = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'am', label: 'Amharic', native: 'አማርኛ' },
  { id: 'om', label: 'Afaan Oromo', native: 'Afaan Oromoo' },
  { id: 'ar', label: 'Arabic', native: 'العربية' },
];

export function t(key) {
  const lang = store.get('lang') || 'en';
  return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
}

export function applyDir() {
  const lang = store.get('lang') || 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
