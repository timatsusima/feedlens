import type { Locale } from './locale';

// ─── Dictionary shape ─────────────────────────────────────────────────────

const en = {
  locale: 'en' as Locale,

  nav: {
    discover:  '🔍 Discover',
    admin:     'Admin',
    langSwitch: 'RU',
  },

  home: {
    title:   '📸 FeedLens',
    tagline: 'See what YouTube recommends to others.\nShare your feed to explore theirs.',

    // Reciprocity block
    reciprocityTitle:    '🔀 Discover — built on reciprocity',
    reciprocityText:
      'FeedLens works on a simple principle: to see what YouTube recommends to others, you share what it recommends to you first. This keeps the dataset real, voluntary, and fair.',
    reciprocityStep1Label: 'Share',
    reciprocityStep1Text:  'Publish your YouTube homepage feed (50 videos, anonymous)',
    reciprocityStep2Label: 'Unlock',
    reciprocityStep2Text:  'Enter your Snapshot ID on the Discover page',
    reciprocityStep3Label: 'Explore',
    reciprocityStep3Text:  'Browse snapshots from people around the world',
    reciprocityBtn:       '🔍 Go to Discover →',

    // Features
    feature1Title: '🔒 Privacy First',
    feature1Text:  'No cookies, no account, no tracking. Only public video IDs.',
    feature2Title: '🌐 Open Source',
    feature2Text:  'Fully transparent. Audit the code on GitHub.',
    feature3Title: '⚡ Fast & Simple',
    feature3Text:  'Install extension, visit YouTube, click Publish. Done.',

    // CTA
    ctaTitle:   'Get started in 3 steps',
    ctaStep1:   'Install the Chrome Extension',
    ctaStep2:   'Open YouTube and click "Publish My Snapshot"',
    ctaStep3:   'Come back here and unlock Discover with your Snapshot ID',
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
  },

  home: {
    title:   '\ud83d\udcf8 FeedLens',
    tagline: 'Смотри, что YouTube рекомендует другим.\nПоделись своей лентой — изучи чужие.',

    reciprocityTitle: '\ud83d\udd00 Discover — на принципе взаимности',
    reciprocityText:
      'FeedLens работает по простому принципу: чтобы видеть, что YouTube рекомендует другим, сначала поделись тем, что рекомендует тебе. Это делает данные честными и добровольными.',
    reciprocityStep1Label: 'Поделись',
    reciprocityStep1Text:  'Опубликуй свою ленту YouTube (50 видео, анонимно)',
    reciprocityStep2Label: 'Разблокируй',
    reciprocityStep2Text:  'Введи свой Snapshot ID на странице Discover',
    reciprocityStep3Label: 'Исследуй',
    reciprocityStep3Text:  'Просматривай снапшоты людей со всего мира',
    reciprocityBtn:       '\ud83d\udd0d Перейти в Discover \u2192',

    feature1Title: '\ud83d\udd12 Приватность',
    feature1Text:  'Никаких cookies, аккаунтов и трекинга. Только публичные ID видео.',
    feature2Title: '\ud83c\udf10 Открытый код',
    feature2Text:  'Полная прозрачность. Проверь код на GitHub.',
    feature3Title: '\u26a1 Быстро и просто',
    feature3Text:  'Установи расширение, зайди на YouTube, нажми «Опубликовать».',

    ctaTitle:    'Начни за 3 шага',
    ctaStep1:    'Установи расширение для Chrome',
    ctaStep2:    'Открой YouTube и нажми «Опубликовать мой снапшот»',
    ctaStep3:    'Вернись сюда и разблокируй Discover с помощью своего Snapshot ID',
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
