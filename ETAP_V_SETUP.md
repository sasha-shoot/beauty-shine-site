# Етап В — налаштування (треба зробити перед використанням)

## 1️⃣ Створи таблицю «Користувачі» в Airtable

У базі `appSUzIDbLksvmdkq` (тій самій, де «Товари» і «Замовлення») створи нову таблицю **«Користувачі»** з полями:

| Поле           | Тип                  | Примітка                                         |
|----------------|----------------------|--------------------------------------------------|
| `tg_user_id`   | Single line text     | Telegram ID, основний ключ пошуку                |
| `first_name`   | Single line text     | Імʼя з Telegram                                  |
| `last_name`    | Single line text     | Прізвище з Telegram                              |
| `username`     | Single line text     | @username без @                                  |
| `phone`        | Phone number         | Заповнюється вручну або через бот                |
| `city`         | Single line text     | Місто доставки                                   |
| `bonus`        | Number (integer)     | Баланс ✦ бонусів, стартовий: 100                 |
| `created_at`   | Created time         | Авто                                             |

## 2️⃣ Налаштуй @BotFather

1. Відкрий `@BotFather` у Telegram
2. Команда `/setdomain`
3. Обери свого бота (`@beauty_shine_izmayil_bot`)
4. Введи домен: `beauty-shine-site.vercel.app`
5. Bot Father підтвердить — тепер Telegram Login Widget працюватиме на цьому домені

> ⚠️ Якщо домен буде інший (напр. кастомний `beautyandshine.ua`) — додай і його так само.

## 3️⃣ Знайди свій ADMIN_TG_CHAT_ID

Це твій особистий Telegram ID. Без нього бот не зможе слати тобі сповіщення про замовлення.

**Спосіб 1:** напиши `/start` боту `@userinfobot` — він поверне твій ID.
**Спосіб 2:** напиши боту `@RawDataBot` — те саме.

Збережи це число (виглядає типу `123456789`).

## 4️⃣ Додай нові Environment Variables у Vercel

`Project → Settings → Environment Variables` → додай **на Project-level** (не Shared):

| Назва                              | Значення                                                 |
|-----------------------------------|----------------------------------------------------------|
| `TELEGRAM_BOT_TOKEN`              | токен з BotFather (формат `12345:AABBcc...`)             |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | `beauty_shine_izmayil_bot` (без @)                             |
| `SESSION_SECRET`                  | будь-який довгий випадковий рядок (32+ символи)          |
| `ADMIN_TG_CHAT_ID`                | твій Telegram ID з пункту 3                              |

Для генерації `SESSION_SECRET` можна використати `openssl rand -hex 32` або просто настукати щось довге.

> Старі env vars `AIRTABLE_TOKEN` і `AIRTABLE_BASE_ID` мають бути теж — вже мають бути від попередніх етапів.

## 5️⃣ Перерозгорни

Після додавання env vars Vercel автоматично запропонує redeploy. Натискай **Redeploy** на останньому деплою.

## ✅ Що тепер працює

- **Реальна авторизація через Telegram** — клієнт клацає кнопку віджета, Telegram запитує підтвердження, після того створюється запис у таблиці «Користувачі» з welcome-бонусом 100 ✦
- **Сесія через cookie** — підписаний httpOnly cookie на 30 днів, безпечно
- **Замовлення пишуться в Airtable** «Замовлення» — поля `order_no`, `user_id` (Telegram ID або "guest"), `customer_name`, `customer_phone`, `items`, `total`, `address`, `comment`, `date`
- **Сповіщення тобі в бот** після кожного замовлення — повний текст з товарами, сумою, контактом клієнта

## ⚠️ Що залишилось зробити на стороні бота (Етап Г)

Цей сайт пише в Airtable і шле тобі сповіщення. Але **сам бот** все ще не показує користувачам:
- їх дані при `/start` (ПІБ, телефон, @, бонуси)
- кнопку «Мої замовлення» (останні за 7 днів)
- кнопку «Мої записи» (майбутні)

Це наступний крок — оновлення коду бота (`beauty_shine_bot` на Railway).
