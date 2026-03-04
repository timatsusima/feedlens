import type { Locale } from './locale';

// ─── Dictionary shape ─────────────────────────────────────────────────────

const en = {
  locale: 'en' as Locale,

  nav: {
    discover:  '🔍 Discover',
    admin:     'Admin',
    langSwitch: 'RU',
    privacy:   'Privacy Policy',
    themeLight: 'Light',
    themeDark:  'Dark',
    themeSystem: 'System',
  },

  home: {
    title:   'Stuck in the same YouTube loop?',
    tagline: 'Your feed shows you what you\'ve always watched.\nFeedLens shows you what YouTube recommends to everyone else.',

    // Bubble insight section
    bubbleTitle: 'The algorithm keeps you comfortable. We make the bubble visible.',
    bubbleText:
      'YouTube\'s recommendations are deeply personal — and deeply isolating. Two people in the same city can have completely different feeds: one sees finance and tech, another sees cooking and travel. Neither knows what they\'re missing.',
    bubbleLeftLabel:  'Inside your bubble',
    bubbleLeftItems:  ['Same 10 creators', 'Same topics, different angles', 'What you already agree with'],
    bubbleRightLabel: 'Outside your bubble',
    bubbleRightItems: ['Channels you\'ve never heard of', 'Topics you didn\'t know you\'d love', 'What others are actually watching'],
    bubbleCta: 'See what\'s outside your bubble →',

    // How it works
    howTitle: 'How it works',
    reciprocityTitle:    '🔀 Built on reciprocity',
    reciprocityText:
      'To see what YouTube recommends to others, share what it recommends to you first. Every snapshot in the feed was contributed by a real person — no bots, no scraping.',
    reciprocityStep1Label: 'Share',
    reciprocityStep1Text:  'Publish your YouTube feed in one click (50 videos, anonymous)',
    reciprocityStep2Label: 'Unlock',
    reciprocityStep2Text:  'Your snapshot unlocks the Discover feed instantly',
    reciprocityStep3Label: 'Explore',
    reciprocityStep3Text:  'Browse real feeds from people around the world',
    reciprocityBtn:       '🔍 Open Discover →',

    // Features
    feature1Title: '🔒 Fully anonymous',
    feature1Text:  'No account, no cookies, no IP tracking. Only the public video IDs visible on your screen.',
    feature2Title: '🌐 Open source',
    feature2Text:  'Every line of code is public. Audit exactly what we collect and how.',
    feature3Title: '🗑 You\'re in control',
    feature3Text:  'Delete your snapshot anytime with the removal token you get when publishing.',

    // CTA
    ctaTitle:   'Break out in 30 seconds',
    ctaStep1:   'Install the Chrome Extension',
    ctaStep2:   'Open YouTube — click the FeedLens icon',
    ctaStep3:   'Your snapshot is published. Discover unlocks automatically.',
    ctaGithub:  'View on GitHub',
    ctaDiscover: '🔍 Open Discover',
  },

  discover: {
    title:       '🔍 Discover',
    subtitle:    'See what YouTube recommends to people around the world',
    publishBtn:  '+ Publish yours',
    empty:       'No snapshots yet. Be the first to publish!',
    videosLabel: 'videos',
    partial:     'partial',

    // Filters
    filterQ:           'Name',
    filterQPh:         'Search by name…',
    filterCity:        'City',
    filterCityPh:      'e.g. Moscow',
    filterCountry:     'Country',
    filterCountryPh:   'US, JP, DE, RU…',
    filterAge:         'Age',
    filterClear:       'Clear filters',
    filterResults:     'results',

    // Welcome banner (shown after publishing via extension)
    welcomeTitle:       '🎉 Your snapshot is live!',
    welcomeText:        'Discover is unlocked. Here\'s what people like you are watching:',
    welcomeSimilarTitle: 'Similar to you',
    welcomeAllTitle:    'All snapshots',
    welcomeNoSimilar:   'You might be the first from your area — here are the latest snapshots:',
  },

  gate: {
    icon:      '🔐',
    title:     'See what YouTube recommends to others',
    subtitle:  'To explore others\u2019 recommendations, share yours first.\nIt\u2019s anonymous and takes 30 seconds.',

    whyTitle:     'Why share first?',
    whyText:
      'FeedLens is built on reciprocity \u2014 every person who browses others\u2019 feeds has contributed their own. This keeps the platform genuine and the data valuable.',

    step1Title: 'Install the Chrome Extension',
    step1Text:  'Go to YouTube and click the FeedLens icon',
    step2Title: 'Click \u201cPublish My Snapshot\u201d',
    step2Text:  'We collect public video IDs from your feed \u2014 no login, no tracking',
    step3Title: 'Paste your Snapshot ID below',
    step3Text:  'You\u2019ll get the ID right after publishing',

    inputLabel:       'Your Snapshot ID or URL',
    inputPlaceholder: '550e8400-e29b-41d4-a716-\u2026 or feedlens.com/snapshot/\u2026',
    btnVerify:        'Verifying\u2026',
    btnUnlock:        'Unlock Discover \u2192',
    errNotFound:      'Snapshot not found. Double-check the ID and try again.',
    errNetwork:       'Network error. Please try again.',
  },

  snapshot: {
    title:          '\ud83d\udcf8 YouTube Snapshot',
    surfaceHome:    '\ud83c\udfe0 Homepage feed',
    surfaceWatch:   '\ud83d\udcfa Watch Next sidebar',
    capturedAt:     'Captured at',
    surface:        'Surface',
    locale:         'Locale',
    collector:      'Collector',
    qualityOk:      '\u2705 Complete snapshot',
    qualityWarn:    '\u26a0 Quality notice',
    collected:      'collected',
    unique:         'unique',
    duplicate:      'duplicate',
    duplicates:     'duplicates',
    partial:        'partial',
    footerNote:     'Is this your snapshot?',
    removalTrigger: 'Request removal',
  },

  removal: {
    triggerBtn:     'Request removal',
    title:          '\ud83d\uddd1 Request Snapshot Removal',
    closeLabel:     'Close',
    desc:
      'Enter the removal token you received when you published this snapshot.\nIf you lost it, contact the admin.',
    tokenLabel:     'Removal Token *',
    tokenPh:        '64-character hex token',
    reasonLabel:    'Reason',
    reasonOptional: '(optional)',
    reasonPh:       'Why do you want to remove this snapshot?',
    btnCancel:      'Cancel',
    btnVerifying:   'Verifying\u2026',
    btnRemove:      'Remove Snapshot',
    errFallback:    'Removal failed. Please check your token and try again.',
    errNetwork:     'Network error. Please try again.',
    doneTitle:      'Done.',
    doneText:       'Your snapshot has been marked for removal and is no longer publicly visible.',
    doneNote:       'It will not appear in searches or the Discover feed.',
  },
};

const ru: typeof en = {
  locale: 'ru' as Locale,

  nav: {
    discover:  '\ud83d\udd0d Discover',
    admin:     'Админ',
    langSwitch: 'EN',
    privacy:   'Конфиденциальность',
    themeLight: 'Светлая',
    themeDark:  'Тёмная',
    themeSystem: 'По умолчанию',
  },

  home: {
    title:   'Застрял в одной и той же ленте YouTube?',
    tagline: 'Алгоритм показывает тебе то, что ты уже смотрел.\nFeedLens показывает что он рекомендует всем остальным.',

    bubbleTitle: 'Алгоритм держит тебя в комфорте. Мы делаем пузырь видимым.',
    bubbleText:
      'Рекомендации YouTube глубоко личные — и глубоко изолирующие. Два человека в одном городе видят совершенно разные ленты: один — финансы и технологии, другой — кулинарию и путешествия. Никто не знает, что упускает.',
    bubbleLeftLabel:  'Внутри твоего пузыря',
    bubbleLeftItems:  ['Одни и те же 10 каналов', 'Одни темы под разными углами', 'То, с чем ты уже согласен'],
    bubbleRightLabel: 'За пределами пузыря',
    bubbleRightItems: ['Каналы, о которых ты не слышал', 'Темы, которые тебе понравятся', 'Что реально смотрят другие'],
    bubbleCta: 'Выйди за пределы своего пузыря →',

    howTitle: 'Как это работает',
    reciprocityTitle: '\ud83d\udd00 Построено на взаимности',
    reciprocityText:
      'Чтобы видеть ленты других — поделись своей. Каждый снапшот в Discover добавлен реальным человеком добровольно.',
    reciprocityStep1Label: 'Поделись',
    reciprocityStep1Text:  'Опубликуй свою ленту одним кликом (50 видео, анонимно)',
    reciprocityStep2Label: 'Разблокируй',
    reciprocityStep2Text:  'Твой снапшот сразу открывает доступ к Discover',
    reciprocityStep3Label: 'Исследуй',
    reciprocityStep3Text:  'Смотри реальные ленты людей со всего мира',
    reciprocityBtn:       '\ud83d\udd0d Открыть Discover \u2192',

    feature1Title: '\ud83d\udd12 Полная анонимность',
    feature1Text:  'Никаких аккаунтов, cookie и IP-трекинга. Только публичные ID видео с твоего экрана.',
    feature2Title: '\ud83c\udf10 Открытый код',
    feature2Text:  'Каждая строка кода публична. Проверь сам что мы собираем.',
    feature3Title: '\ud83d\uddd1 Ты управляешь данными',
    feature3Text:  'Удали свой снапшот в любой момент с помощью токена удаления.',

    ctaTitle:    'Выйди из пузыря за 30 секунд',
    ctaStep1:    'Установи расширение для Chrome',
    ctaStep2:    'Открой YouTube — нажми иконку FeedLens',
    ctaStep3:    'Снапшот опубликован. Discover открывается автоматически.',
    ctaGithub:   'Смотреть на GitHub',
    ctaDiscover: '\ud83d\udd0d Открыть Discover',
  },

  discover: {
    title:       '\ud83d\udd0d Discover',
    subtitle:    'Смотри, что YouTube рекомендует людям по всему миру',
    publishBtn:  '+ Опубликовать свой',
    empty:       'Снапшотов пока нет. Будь первым!',
    videosLabel: 'видео',
    partial:     'частичный',

    // Filters
    filterQ:           'Имя',
    filterQPh:         'Поиск по имени…',
    filterCity:        'Город',
    filterCityPh:      'напр. Алматы',
    filterCountry:     'Страна',
    filterCountryPh:   'US, JP, DE, KZ…',
    filterAge:         'Возраст',
    filterClear:       'Сбросить',
    filterResults:     'результатов',

    welcomeTitle:        '🎉 Твой снапшот опубликован!',
    welcomeText:         'Discover разблокирован. Смотри, что смотрят похожие на тебя:',
    welcomeSimilarTitle: 'Похожие на тебя',
    welcomeAllTitle:     'Все снапшоты',
    welcomeNoSimilar:    'Возможно, ты первый из своего города — вот последние снапшоты:',
  },

  gate: {
    icon:      '\ud83d\udd10',
    title:     'Смотри, что YouTube рекомендует другим',
    subtitle:  'Чтобы изучать чужие рекомендации, сначала поделись своими.\nЭто анонимно и займёт 30 секунд.',

    whyTitle: 'Почему нужно делиться первым?',
    whyText:
      'FeedLens построен на взаимности \u2014 каждый, кто просматривает чужие ленты, сам поделился своей. Это делает платформу честной и данные — ценными.',

    step1Title: 'Установи расширение для Chrome',
    step1Text:  'Зайди на YouTube и нажми на иконку FeedLens',
    step2Title: 'Нажми «Опубликовать мой снапшот»',
    step2Text:  'Мы собираем публичные ID видео из твоей ленты — без входа в аккаунт',
    step3Title: 'Вставь свой Snapshot ID ниже',
    step3Text:  'Ты получишь ссылку сразу после публикации',

    inputLabel:       'Твой Snapshot ID или ссылка',
    inputPlaceholder: '550e8400-e29b-41d4-a716-\u2026 или feedlens.com/snapshot/\u2026',
    btnVerify:        'Проверяем\u2026',
    btnUnlock:        'Разблокировать Discover \u2192',
    errNotFound:      'Снапшот не найден. Проверь ID и попробуй ещё раз.',
    errNetwork:       'Ошибка сети. Попробуй ещё раз.',
  },

  snapshot: {
    title:          '\ud83d\udcf8 Снапшот YouTube',
    surfaceHome:    '\ud83c\udfe0 Главная страница',
    surfaceWatch:   '\ud83d\udcfa Боковая панель',
    capturedAt:     'Собрано',
    surface:        'Поверхность',
    locale:         'Локаль',
    collector:      'Коллектор',
    qualityOk:      '\u2705 Полный снапшот',
    qualityWarn:    '\u26a0 Предупреждение о качестве',
    collected:      'собрано',
    unique:         'уникальных',
    duplicate:      'дубликат',
    duplicates:     'дубликатов',
    partial:        'частичный',
    footerNote:     'Это твой снапшот?',
    removalTrigger: 'Запросить удаление',
  },

  removal: {
    triggerBtn:     'Запросить удаление',
    title:          '\ud83d\uddd1 Удаление снапшота',
    closeLabel:     'Закрыть',
    desc:
      'Введи токен удаления, который ты получил при публикации снапшота.\nЕсли потерял — обратись к администратору.',
    tokenLabel:     'Токен удаления *',
    tokenPh:        '64-символьный hex-токен',
    reasonLabel:    'Причина',
    reasonOptional: '(необязательно)',
    reasonPh:       'Почему ты хочешь удалить этот снапшот?',
    btnCancel:      'Отмена',
    btnVerifying:   'Проверяем\u2026',
    btnRemove:      'Удалить снапшот',
    errFallback:    'Удаление не удалось. Проверь токен и попробуй снова.',
    errNetwork:     'Ошибка сети. Попробуй ещё раз.',
    doneTitle:      'Готово.',
    doneText:       'Твой снапшот помечен для удаления и больше не отображается публично.',
    doneNote:       'Он не будет отображаться в поиске и в ленте Discover.',
  },
};

export type Dict = typeof en;

export function getDictionary(locale: Locale): Dict {
  return locale === 'ru' ? ru : en;
}
