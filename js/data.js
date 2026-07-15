// Ethio-Majlis — static content data (works fully offline).

// Verses of the day pool
export const VERSES = [
  { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'Indeed, with hardship comes ease.', am: 'ከችግር ጋር በእርግጥ ምቾት አለ።', ref: 'Ash-Sharh 94:6' },
  { ar: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', en: 'And say: My Lord, increase me in knowledge.', am: 'ጌታዬ ሆይ በእውቀት ጨምረኝ በል።', ref: 'Ta-Ha 20:114' },
  { ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ', en: 'So remember Me; I will remember you.', am: 'አስታውሱኝ አስታውሳችኋለሁ።', ref: 'Al-Baqarah 2:152' },
  { ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en: 'Indeed, Allah is with the patient.', am: 'አላህ ከታጋሾች ጋር ነው።', ref: 'Al-Baqarah 2:153' },
  { ar: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', en: 'Whoever fears Allah, He makes a way out for him.', am: 'አላህን የሚፈራ ሰው መውጫ ያደርግለታል።', ref: 'At-Talaq 65:2' },
  { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', en: 'Our Lord, give us good in this world.', am: 'ጌታችን ሆይ በዱንያ መልካምን ስጠን።', ref: 'Al-Baqarah 2:201' },
  { ar: 'وَاللَّهُ خَيْرٌ حَافِظًا', en: 'And Allah is the best guardian.', am: 'አላህ ከጠባቂዎች ሁሉ በላጭ ነው።', ref: 'Yusuf 12:64' },
];

// Hadith of the day pool
export const HADITHS = [
  { en: 'The best among you are those who learn the Quran and teach it.', am: 'ከናንተ በላጩ ቁርኣንን ተምሮ የሚያስተምረው ነው።', ref: 'Sahih al-Bukhari' },
  { en: 'Actions are judged by intentions.', am: 'ስራዎች በንየት ይመዘናሉ።', ref: 'Bukhari & Muslim' },
  { en: 'None of you truly believes until he loves for his brother what he loves for himself.', am: 'ለራሱ የሚወደውን ለወንድሙ እስኪወድ ድረስ አንዳችሁ አያምንም።', ref: 'Bukhari & Muslim' },
  { en: 'The strong believer is better and more beloved to Allah than the weak believer.', am: 'ጠንካራ አማኝ ከደካማ አማኝ ይልቅ በአላህ ዘንድ የተወደደ ነው።', ref: 'Sahih Muslim' },
  { en: 'Make things easy and do not make them difficult.', am: 'ቀላል አድርጉ አታክብዱ።', ref: 'Sahih al-Bukhari' },
  { en: 'A kind word is charity.', am: 'መልካም ቃል ምጽዋት ነው።', ref: 'Bukhari & Muslim' },
  { en: 'He who does not thank people does not thank Allah.', am: 'ሰዎችን የማያመሰግን አላህን አያመሰግንም።', ref: 'Abu Dawud' },
];

// Islamic quotes
export const QUOTES = [
  { text: 'Patience is the key to relief.', by: 'Islamic Proverb' },
  { text: 'Knowledge without action is arrogance.', by: 'Imam al-Ghazali' },
  { text: 'The heart that beats for Allah finds peace in every trial.', by: 'Ethio-Majlis' },
  { text: 'Seek knowledge from the cradle to the grave.', by: 'Islamic Wisdom' },
  { text: 'Unity is strength; in togetherness we rise.', by: 'Ethio-Majlis' },
];

// Quick menu (home grid)
export const QUICK_MENU = [
  { id: 'quran', icon: 'book', labelKey: 'quran' },
  { id: 'dua', icon: 'hands', labelKey: 'dua' },
  { id: 'hajj', icon: 'kaaba', labelKey: 'hajj' },
  { id: 'prayer', icon: 'clock', labelKey: 'prayer' },
  { id: 'qibla', icon: 'compass', labelKey: 'qibla' },
  { id: 'tasbih', icon: 'beads', labelKey: 'tasbih' },
  { id: 'quiz', icon: 'quiz', labelKey: 'quiz' },
  { id: 'live', icon: 'live', labelKey: 'live' },
  { id: 'library', icon: 'library', labelKey: 'library' },
  { id: 'news', icon: 'news', labelKey: 'news' },
  { id: 'settings', icon: 'settings', labelKey: 'settings' },
  { id: 'about', icon: 'info', labelKey: 'about' },
];

// Dua categories with content (Arabic + transliteration + translations)
export const DUAS = [
  { cat: 'morning', title: 'Morning', am: 'የጠዋት', items: [
    { ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', tr: 'Asbahna wa asbahal-mulku lillah', en: 'We have entered morning and the dominion belongs to Allah.', am: 'ነጋን መንግስቱም ለአላህ ሆነ።' },
    { ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا', tr: 'Allahumma bika asbahna wa bika amsayna', en: 'O Allah, by You we enter the morning and the evening.', am: 'አላህ ሆይ ባንተ ነጋን ባንተም አመሸን።' },
  ]},
  { cat: 'evening', title: 'Evening', am: 'የማታ', items: [
    { ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', tr: 'Amsayna wa amsal-mulku lillah', en: 'We have entered evening and the dominion belongs to Allah.', am: 'አመሸን መንግስቱም ለአላህ ሆነ።' },
    { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ هَذِهِ اللَّيْلَةِ', tr: 'Allahumma inni a\'udhu bika min sharri hadhihil-laylah', en: 'O Allah, I seek refuge in You from the evil of this night.', am: 'አላህ ሆይ ከዚህ ሌሊት ክፉ በአንተ እጠበቃለሁ።' },
  ]},
  { cat: 'travel', title: 'Travel', am: 'የጉዞ', items: [
    { ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا', tr: 'Subhanalladhi sakhkhara lana hadha', en: 'Glory to Him who subjected this to us.', am: 'ይህን ላስገዛልን ጌታ ክብር ይገባው።' },
  ]},
  { cat: 'food', title: 'Food', am: 'የምግብ', items: [
    { ar: 'بِسْمِ اللَّهِ', tr: 'Bismillah', en: 'In the name of Allah.', am: 'በአላህ ስም።' },
    { ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا', tr: 'Alhamdulillahilladhi at\'amana', en: 'Praise to Allah who fed us.', am: 'ላበላን አላህ ምስጋና ይሁን።' },
  ]},
  { cat: 'sleeping', title: 'Sleeping', am: 'የመኝታ', items: [
    { ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', tr: 'Bismika Allahumma amutu wa ahya', en: 'In Your name O Allah, I die and I live.', am: 'አላህ ሆይ በስምህ እሞታለሁ እኖራለሁ።' },
  ]},
  { cat: 'wakeup', title: 'Wake Up', am: 'ከእንቅልፍ ሲነሱ', items: [
    { ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا', tr: 'Alhamdulillahilladhi ahyana ba\'da ma amatana', en: 'Praise to Allah who gave us life after death.', am: 'ካሞተን በኋላ ያኖረን አላህ ምስጋና ይሁን።' },
  ]},
  { cat: 'hajj', title: 'Hajj', am: 'ሐጅ', items: [
    { ar: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ', tr: 'Labbayka Allahumma labbayk', en: 'Here I am, O Allah, here I am.', am: 'አላህ ሆይ ተገኘሁልህ።' },
  ]},
  { cat: 'umrah', title: 'Umrah', am: 'ዑምራ', items: [
    { ar: 'لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ', tr: 'Labbayka la sharika laka labbayk', en: 'Here I am, You have no partner, here I am.', am: 'ተገኘሁልህ አጋር የለህም።' },
  ]},
  { cat: 'ramadan', title: 'Ramadan', am: 'ረመዳን', items: [
    { ar: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ', tr: 'Allahumma inni laka sumtu', en: 'O Allah, for You I have fasted.', am: 'አላህ ሆይ ላንተ ጾምኩ።' },
    { ar: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ', tr: 'Dhahaba adh-dhama\'u wabtallatil-\'uruq', en: 'The thirst is gone and the veins are moistened.', am: 'ጥም ጠፋ ስሮችም ረጠቡ።' },
  ]},
  { cat: 'daily', title: 'Daily', am: 'የዕለት', items: [
    { ar: 'رَبِّ زِدْنِي عِلْمًا', tr: 'Rabbi zidni \'ilma', en: 'My Lord, increase me in knowledge.', am: 'ጌታዬ በእውቀት ጨምረኝ።' },
    { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', tr: 'Hasbunallahu wa ni\'mal-wakil', en: 'Allah is sufficient for us, the best disposer of affairs.', am: 'አላህ በቂያችን ነው መልካም መጠጊያም ነው።' },
  ]},
];

// Hajj / Umrah step-by-step guide
export const HAJJ_STEPS = [
  { n: 1, title: 'Ihram', en: 'Enter the state of Ihram at the Miqat, wear the two white garments, and make the intention.', am: 'በሚቃት ኢሕራምን ይልበሱ፣ ሁለቱን ነጭ ልብሶች ይልበሱ፣ ንየትም ያድርጉ።' },
  { n: 2, title: 'Tawaf', en: 'Circle the Kaaba seven times counter-clockwise, beginning at the Black Stone.', am: 'ካዕባን ከጥቁሩ ድንጋይ ጀምሮ ሰባት ጊዜ ይዙሩ።' },
  { n: 3, title: "Sa'i", en: 'Walk seven times between the hills of Safa and Marwah.', am: 'በሰፋና መርዋ መካከል ሰባት ጊዜ ይራመዱ።' },
  { n: 4, title: 'Arafah', en: 'Stand at Arafah on the 9th of Dhul-Hijjah, making dua and seeking forgiveness.', am: 'በዙልሒጃ 9 በዐረፋ ይቁሙ፣ ዱዓ ያድርጉ ምሕረትም ይለምኑ።' },
  { n: 5, title: 'Muzdalifah', en: 'Spend the night at Muzdalifah and collect pebbles for the stoning.', am: 'ሌሊቱን በሙዝደሊፋ ያሳልፉ ጠጠሮችን ይሰብስቡ።' },
  { n: 6, title: 'Rami (Stoning)', en: 'Stone the Jamarat pillars, symbolising the rejection of evil.', am: 'የጀመራት ምሰሶዎችን ይወግሩ።' },
  { n: 7, title: 'Qurbani & Halq', en: 'Offer the sacrifice and shave or trim the hair.', am: 'መስዋዕት ያቅርቡ ጸጉርንም ይላጩ ወይም ያሳጥሩ።' },
  { n: 8, title: 'Tawaf al-Ifadah', en: 'Return to the Kaaba for the final essential Tawaf.', am: 'ወደ ካዕባ ተመልሰው የመጨረሻውን ጣዋፍ ያድርጉ።' },
];

export const HAJJ_CHECKLIST = [
  'Ihram garments (2 white cloths)', 'Passport & visa documents', 'Prayer mat', 'Unscented toiletries',
  'Comfortable sandals', 'Medications & first aid', 'Small backpack', 'Reusable water bottle',
  'Dua book / app', 'Money belt',
];

export const HAJJ_FAQ = [
  { q: 'What is the difference between Hajj and Umrah?', a: 'Hajj is the obligatory annual pilgrimage performed in Dhul-Hijjah, while Umrah is a recommended pilgrimage that can be performed any time of the year.' },
  { q: 'What is the Miqat?', a: 'The Miqat is the designated boundary where pilgrims enter the state of Ihram before proceeding to Mecca.' },
  { q: 'How many times is Tawaf performed?', a: 'Tawaf consists of circling the Kaaba seven times in a counter-clockwise direction.' },
  { q: 'Is Hajj obligatory for everyone?', a: 'Hajj is obligatory once in a lifetime for every adult Muslim who is physically and financially able.' },
];

// Quiz questions by category
export const QUIZ = [
  { cat: 'Quran', q: 'How many surahs are in the Quran?', options: ['110', '114', '120', '99'], answer: 1 },
  { cat: 'Quran', q: 'Which is the longest surah?', options: ['Al-Fatihah', 'Al-Baqarah', 'Yasin', 'Al-Kahf'], answer: 1 },
  { cat: 'Quran', q: 'The first revealed word was?', options: ['Pray', 'Read (Iqra)', 'Fast', 'Give'], answer: 1 },
  { cat: 'Pillars', q: 'How many pillars of Islam are there?', options: ['3', '4', '5', '6'], answer: 2 },
  { cat: 'Pillars', q: 'Which pillar is the pilgrimage to Mecca?', options: ['Salah', 'Zakat', 'Hajj', 'Sawm'], answer: 2 },
  { cat: 'Pillars', q: 'Fasting is observed in which month?', options: ['Shawwal', 'Ramadan', 'Rajab', 'Muharram'], answer: 1 },
  { cat: 'Prophets', q: 'Who built the Kaaba with his son Ismail?', options: ['Nuh', 'Ibrahim', 'Musa', 'Isa'], answer: 1 },
  { cat: 'Prophets', q: 'Which prophet could speak to animals?', options: ['Sulaiman', 'Dawud', 'Yusuf', 'Adam'], answer: 0 },
  { cat: 'History', q: 'In which city was Prophet Muhammad ﷺ born?', options: ['Madinah', 'Mecca', 'Taif', 'Jerusalem'], answer: 1 },
  { cat: 'History', q: 'The migration to Madinah is called?', options: ['Hijrah', 'Isra', 'Miraj', 'Fath'], answer: 0 },
];

// Library items
export const LIBRARY = [
  { type: 'pdf', title: 'The Noble Quran (Translation)', author: 'Various', size: '4.2 MB', cat: 'Books' },
  { type: 'pdf', title: 'Riyad as-Salihin', author: 'Imam an-Nawawi', size: '3.1 MB', cat: 'Books' },
  { type: 'pdf', title: 'Fortress of the Muslim (Hisnul Muslim)', author: 'Sa\'id al-Qahtani', size: '1.8 MB', cat: 'Books' },
  { type: 'audio', title: 'Surah Ar-Rahman Recitation', author: 'Mishary Alafasy', size: '12 MB', cat: 'Audio' },
  { type: 'audio', title: 'Friday Khutbah — Patience', author: 'Ethio-Majlis', size: '18 MB', cat: 'Audio' },
  { type: 'video', title: 'Understanding Salah', author: 'Ethio-Majlis', size: '45 MB', cat: 'Video' },
  { type: 'video', title: 'The Life of the Prophet ﷺ', author: 'Ethio-Majlis', size: '120 MB', cat: 'Video' },
];

// News / announcements
export const NEWS = [
  { title: 'Community Iftar Program Announced', date: '2026-03-01', body: 'Ethio-Majlis invites all members to the annual community iftar. Registration opens next week.', tag: 'Event' },
  { title: 'New Quran Memorization Class', date: '2026-02-20', body: 'A new weekend Hifz program for youth begins this month. Limited seats available.', tag: 'Education' },
  { title: 'Eid Prayer Timing & Location', date: '2026-02-10', body: 'Eid prayer will be held at the main grounds at 7:00 AM. Please arrive early.', tag: 'Announcement' },
  { title: 'Charity Drive for Families in Need', date: '2026-01-28', body: 'Join our monthly sadaqah drive supporting local families. Donations welcome.', tag: 'Charity' },
];

// Live streams
export const LIVE = [
  { title: 'Friday Jumu\'ah Khutbah', platform: 'YouTube', status: 'Upcoming', url: 'https://youtube.com', embed: 'https://www.youtube.com/embed/live_stream?channel=UCanything' },
  { title: 'Weekly Tafsir Session', platform: 'YouTube', status: 'Live', url: 'https://youtube.com', embed: 'https://www.youtube.com/embed/live_stream?channel=UCanything' },
  { title: 'Majlis Community Broadcast', platform: 'Facebook', status: 'Offline', url: 'https://facebook.com', embed: '' },
];

// Default dhikr presets for Tasbih
export const DHIKR = [
  { ar: 'سُبْحَانَ اللَّهِ', tr: 'SubhanAllah', target: 33 },
  { ar: 'الْحَمْدُ لِلَّهِ', tr: 'Alhamdulillah', target: 33 },
  { ar: 'اللَّهُ أَكْبَرُ', tr: 'Allahu Akbar', target: 34 },
  { ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', tr: 'La ilaha illallah', target: 100 },
  { ar: 'أَسْتَغْفِرُ اللَّهَ', tr: 'Astaghfirullah', target: 100 },
];
