import { getLocale } from '@/lib/locale';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isRu = locale === 'ru';
  return {
    title: isRu ? 'Политика конфиденциальности · FeedLens' : 'Privacy Policy · FeedLens',
    description: isRu
      ? 'Что мы собираем и как используем данные'
      : 'What we collect and how we use your data',
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const isRu = locale === 'ru';

  return (
    <main className="container">
      <div className="privacy-page">
        {isRu ? <PrivacyRu /> : <PrivacyEn />}
      </div>
    </main>
  );
}

function PrivacyEn() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="privacy-updated">Last updated: March 2026</p>

      <h2>What FeedLens is</h2>
      <p>
        FeedLens is an open-source tool that lets you voluntarily publish a snapshot
        of your YouTube homepage recommendations and explore what YouTube recommends
        to other people.
      </p>

      <h2>Data we collect</h2>
      <p>When you publish a snapshot, we store:</p>
      <ul>
        <li>Public YouTube <strong>video IDs</strong>, titles, and channel names visible on your homepage</li>
        <li>The <strong>nickname, city, age range, and description</strong> you choose to provide</li>
        <li>Technical context: browser locale, timezone, timestamp of collection</li>
        <li>A <strong>hashed</strong> removal token (so you can delete your snapshot later)</li>
      </ul>

      <h2>Data we do NOT collect</h2>
      <ul>
        <li>Your IP address</li>
        <li>Cookies or tracking identifiers</li>
        <li>Your YouTube account or watch history</li>
        <li>Any private or personally identifiable information beyond what you explicitly provide</li>
      </ul>

      <h2>How your data is used</h2>
      <ul>
        <li>Snapshots are stored in a PostgreSQL database and made <strong>publicly accessible</strong> via a unique URL</li>
        <li>Data is used to power the Discover feed — letting users compare YouTube recommendations</li>
        <li>Data is <strong>never sold</strong> and never shared with third parties</li>
      </ul>

      <h2>Data retention &amp; deletion</h2>
      <p>
        Snapshots are stored indefinitely unless you request deletion.
        You can delete your snapshot at any time using the removal token provided
        when you published it. Once deleted, the snapshot is immediately removed
        from the public feed.
      </p>

      <h2>Open source</h2>
      <p>
        FeedLens is fully open source. You can audit the entire codebase,
        including all data collection and storage logic, on GitHub.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or deletion requests:{' '}
        <a href="mailto:akira.kumo@proton.me">akira.kumo@proton.me</a>
      </p>
    </>
  );
}

function PrivacyRu() {
  return (
    <>
      <h1>Политика конфиденциальности</h1>
      <p className="privacy-updated">Последнее обновление: март 2026</p>

      <h2>Что такое FeedLens</h2>
      <p>
        FeedLens — инструмент с открытым исходным кодом, который позволяет добровольно
        опубликовать снапшот своих YouTube-рекомендаций и посмотреть, что YouTube
        рекомендует другим людям.
      </p>

      <h2>Что мы собираем</h2>
      <p>При публикации снапшота мы сохраняем:</p>
      <ul>
        <li>Публичные <strong>ID видео</strong>, названия и каналы, видимые на главной странице YouTube</li>
        <li><strong>Никнейм, город, возрастной диапазон и описание</strong>, которые вы указываете добровольно</li>
        <li>Технический контекст: локаль браузера, часовой пояс, время сбора</li>
        <li><strong>Хэш</strong> токена удаления (чтобы вы могли удалить снапшот позже)</li>
      </ul>

      <h2>Что мы НЕ собираем</h2>
      <ul>
        <li>Ваш IP-адрес</li>
        <li>Файлы cookie и идентификаторы отслеживания</li>
        <li>Ваш аккаунт YouTube или историю просмотров</li>
        <li>Любую личную информацию, кроме той, что вы указали явно</li>
      </ul>

      <h2>Как используются данные</h2>
      <ul>
        <li>Снапшоты хранятся в базе данных PostgreSQL и <strong>публично доступны</strong> по уникальной ссылке</li>
        <li>Данные используются для работы ленты Discover</li>
        <li>Данные <strong>никогда не продаются</strong> и не передаются третьим лицам</li>
      </ul>

      <h2>Хранение и удаление данных</h2>
      <p>
        Снапшоты хранятся бессрочно, если вы не запросите удаление.
        Вы можете удалить свой снапшот в любое время с помощью токена удаления,
        выданного при публикации. После удаления снапшот немедленно исчезает из
        публичной ленты.
      </p>

      <h2>Открытый исходный код</h2>
      <p>
        FeedLens полностью open-source. Весь код, включая логику сбора и хранения
        данных, доступен для проверки на GitHub.
      </p>

      <h2>Контакты</h2>
      <p>
        Вопросы или запросы на удаление:{' '}
        <a href="mailto:akira.kumo@proton.me">akira.kumo@proton.me</a>
      </p>
    </>
  );
}
