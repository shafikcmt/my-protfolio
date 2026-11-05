# AI Sales Assistant

Website chat ("Get a project estimate") that talks with potential clients, learns
their real budget, drafts priced packages and sends them to you on Telegram.
You approve or change the proposal with one tap; the assistant then continues
with the client. It never confirms a price, deadline or agreement on its own.

## Files

| File | What it does |
|---|---|
| `lib/salesAgent.ts` | System prompt (scope, pricing approach, safety), tools, agent loop |
| `lib/salesConfig.ts` | **Edit this**: minimum price, typical ranges, advance %, booking link |
| `models/Lead.ts` | Conversation + collected details + proposals |
| `app/api/chat/route.ts` | Website chat API, limits (per chat, per IP, per day) |
| `app/api/telegram/webhook/route.ts` | Your Telegram buttons and replies |
| `app/api/admin/telegram-setup/route.ts` | One-time Telegram connection (Admin → Settings → Connect Telegram) |
| `components/SalesChat.tsx` | Chat widget |

## Setup (Vercel → Settings → Environment Variables, then Redeploy)

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | From console.anthropic.com → API Keys (set a monthly spend limit there) |
| `TELEGRAM_BOT_TOKEN` | Already set for alerts |
| `TELEGRAM_CHAT_ID` | Already set for alerts |
| `TELEGRAM_WEBHOOK_SECRET` | Any long random text (letters, numbers, `_` or `-`) |
| `CHAT_DAILY_REPLY_LIMIT` | Optional, default 150 AI replies per day for the whole site |

Then: Admin → Settings → **Connect Telegram**.

The chat button only appears when `ANTHROPIC_API_KEY` is set.

## How you use it

- Card "🤖 AI lead ready for review" arrives in Telegram with the client's budget and 2–3 packages.
- **✅ Approve & send** — the assistant presents the packages to the client.
- **📞 Ask for a call** — the assistant invites the client to book a call.
- **❌ Not a fit** — the assistant politely closes.
- **Reply to the card** with any change ("Recommended $1,800, add 3 months support") — the assistant presents your version.
- If the client has left the site, use **📲 Send on WhatsApp too** on the confirmation message.
