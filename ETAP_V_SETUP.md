# Етап В — налаштування (OIDC версія)

⚠️ **Важливо:** Telegram **відключив legacy widget**. Зараз працює тільки новий OIDC-потік.

---

## 1. У @BotFather → Login Widget

**Redirect URIs** — мають бути обидва:
- `https://beauty-shine-site.vercel.app/`
- `https://beauty-shine-site.vercel.app/api/auth/telegram/callback`

**Trusted Origins**:
- `https://beauty-shine-site.vercel.app` (без слешу)

**Client ID** — скопіюй (наприклад `8862382686`)
**Client Secret** — скопіюй (натисни → копіюй цілком)

---

## 2. У Airtable — таблиця «Користувачі»

База `appSUzIDbLksvmdkq`, нова таблиця «Користувачі»:

| Поле           | Тип                  |
|----------------|----------------------|
| `tg_user_id`   | Single line text     |
| `first_name`   | Single line text     |
| `last_name`    | Single line text     |
| `username`     | Single line text     |
| `phone`        | Phone number         |
| `city`         | Single line text     |
| `bonus`        | Number (integer)     |

---

## 3. У Vercel → Environment Variables

| Назва                       | Значення                                                                  |
|----------------------------|---------------------------------------------------------------------------|
| `TELEGRAM_CLIENT_ID`       | Client ID з BotFather (`8862382686`)                                      |
| `TELEGRAM_CLIENT_SECRET`   | Client Secret з BotFather                                                 |
| `TELEGRAM_REDIRECT_URI`    | `https://beauty-shine-site.vercel.app/api/auth/telegram/callback`         |
| `TELEGRAM_BOT_TOKEN`       | Bot Token з BotFather (НЕ Client Secret — це різні речі!)                |
| `SESSION_SECRET`           | Довгий випадковий рядок 32+ символів                                      |
| `ADMIN_TG_CHAT_ID`         | Твій Telegram ID (з @userinfobot)                                         |

**Видали з Vercel** якщо було:
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` — більше не потрібно

**Має лишитись:**
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`

---

## 4. Передеплой Vercel

Deployments → останній → ⋯ → Redeploy (without cache).

---

## ✅ Як перевірити

1. Сайт → кнопка профілю у хедері → drawer відкриється
2. Натисни **«Продовжити через Telegram»**
3. Тебе редіректне на oauth.telegram.org з діалогом
4. Введи номер, в Telegram отримаєш повідомлення «Login request from Beauty & Shine» — Confirm
5. Тебе редіректне назад на сайт, профіль автоматично відкриється з твоїми даними + 100 ✦ бонусами
