# AI Sales Assistant (Sadika)

Website chat ("Get a project estimate") where Sadika, the project assistant, talks with potential clients, learns
their real budget, drafts priced packages and sends them to you on Telegram.
You approve or change the proposal with one tap; the assistant then continues
with the client. It never confirms a price, deadline or agreement on its own.

## Files

| File | What it does |
|---|---|
| `lib/salesAgent.ts` | System prompt (scope, pricing approach, safety), tools, agent loop |
| `lib/salesConfig.ts` | **Edit this**: assistant name, minimum price, typical ranges, payment schedule, **payment methods (bKash/bank details)**, proposal terms, support days, validity |
| `models/Lead.ts` | Conversation + collected details + proposals |
| `app/api/chat/route.ts` | Website chat API, limits (per chat, per IP, per day) |
| `app/api/telegram/webhook/route.ts` | Your Telegram buttons and replies |
| `app/api/admin/telegram-setup/route.ts` | One-time Telegram connection (Admin → Settings → Connect Telegram) |
| `components/SalesChat.tsx` | Chat widget |
| `lib/proposals.ts`, `models/Proposal.ts` | Proposal pages: create, open/expired, advance amount |
| `app/proposal/[token]/page.tsx`, `components/ProposalView.tsx` | Client proposal page: packages, payment schedule, terms, Accept, payment report, Download PDF |
| `app/api/proposals/[token]/accept`, `.../payment` | Accept a package; report the advance payment |

## Setup (Vercel → Settings → Environment Variables, then Redeploy)

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Claude (best quality, paid credits) — console.anthropic.com → API Keys (set a monthly spend limit there) |
| `GEMINI_API_KEY` | **Free alternative** — aistudio.google.com → Get API key. Used when there is no Claude key (or set `AI_PROVIDER=gemini`). Optional `GEMINI_MODEL` (default `gemini-flash-latest`). |
| `TELEGRAM_BOT_TOKEN` | Already set for alerts |
| `TELEGRAM_CHAT_ID` | Already set for alerts |
| `TELEGRAM_WEBHOOK_SECRET` | Any long random text (letters, numbers, `_` or `-`) |
| `CHAT_DAILY_REPLY_LIMIT` | Optional, default 150 AI replies per day for the whole site |

Then: Admin → Settings → **Connect Telegram**.

The chat button only appears when one AI key is set. With both keys, Claude is used.

Gemini free tier: low daily limits, and Google may use free-tier prompts to improve its products — fine to start, switch to Claude once clients use the chat regularly.

## How you use it

- Card "🤖 AI lead ready for review" arrives in Telegram with the client's budget and 2–3 packages.
- **✅ Approve & send** — the assistant presents the packages to the client.
- **📞 Ask for a call** — the assistant invites the client to book a call.
- **❌ Not a fit** — the assistant politely closes.
- **Reply to the card** with any change ("Recommended $1,800, add 3 months support") — the assistant presents your version.
- If the client has left the site, use **📲 Send on WhatsApp too** on the confirmation message.

## Proposal → payment flow

1. You approve in Telegram → a proposal page is created (`/proposal/<private link>`) with exactly the
   packages you approved, and Sadika sends the link. If you reply with changes instead, Sadika publishes
   a proposal with your packages and you get a **📄 Proposal published** message with a
   **↩️ Withdraw** button in case anything is off.
2. Telegram tells you when the client **opens** it (👀) and **accepts** a package (🎉, with the advance amount).
3. The client pays the advance using the methods in `salesConfig.paymentMethods` and submits the
   transaction ID → **💰 Payment reported** with **✅ Payment received / ❌ Not received** buttons.
4. ✅ marks the project as won and tells the client in the chat and on the proposal page.

Proposal pages are private (not in Google), valid for `proposalValidDays`, and can be saved as PDF
with the Download PDF button.

**Before going live:** fill in your real payment details in `paymentMethods` (empty ones are hidden),
and review `paymentSchedule` and `proposalTerms`.

## Honesty rule

Sadika introduces herself by name and does not announce she is an AI, but if a client sincerely asks
whether they are talking to a human or a bot, she answers honestly and never claims to be human.
