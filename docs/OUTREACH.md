# Client Outreach (Phase 4)

Admin → **Client Outreach** (`/dashboard/admin/outreach`).

1. **Find clients** — describe a target ("Garment buying houses in Dhaka", "UK dental clinics without
   online booking"). The AI searches the web, opens company websites and adds real businesses with a
   *published* business email to the Queue. It never guesses email addresses.
2. **Research & draft** — for each company the AI reads its website and writes a short personal email
   (with your tracking link). The daily run drafts 3 automatically; you can also click
   "Research & draft email". Each draft is also sent to Telegram.
3. **Approve** — Admin page (edit freely) or Telegram: **✅ Send / ❌ Skip**, or reply to the Telegram
   draft to have it rewritten ("shorter, mention ProTrac").
4. **Sending** — from your domain, max 15 emails/day, with signature, WhatsApp, and an unsubscribe link.
   Replies go to `OUTREACH_REPLY_TO` (your Gmail by default).
5. **Follow-ups** — automatic after 4 and 9 days unless you mark **💬 They replied** / **🛑 Stop**
   (Telegram or admin). Unsubscribes stop everything for that address.
6. **Tracking** — when a company opens your portfolio from the email you get a Telegram 👀 alert.

Settings: `lib/outreachConfig.ts` (daily limit, follow-up days, drafts per day, signature).

## Setup

### 1. Resend (sending emails) — free tier: 3,000 emails/month
1. Sign up at **resend.com** → **Domains → Add Domain** → `shafiqul.dev`.
2. Resend shows DNS records (SPF/DKIM, usually 3 TXT/MX records). Add them where your domain's DNS is
   managed (if the domain is on Vercel: Vercel → Domains → shafiqul.dev → DNS Records). Wait for
   **Verified**.
3. Recommended: also add a **DMARC** TXT record: name `_dmarc`, value `v=DMARC1; p=none;`.
4. Resend → **API Keys → Create** (Sending access).

### 2. Vercel environment variables (then Redeploy)

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | from Resend |
| `OUTREACH_FROM_EMAIL` | e.g. `hello@shafiqul.dev` (must be on the verified domain) |
| `OUTREACH_REPLY_TO` | optional — where replies go (default: your Gmail) |
| `ANTHROPIC_API_KEY` or `GEMINI_API_KEY` | AI for Find clients / drafts (Gemini = free, uses Google Search) |

No AI key? Add companies yourself and use **✍️ Write email myself** — sending, tracking and follow-up limits still work.

With Claude, web search must be allowed for your API organisation: console.anthropic.com → Settings → Privacy /
Web search (enable if it is off).

### Vercel function time
Finding clients can take 1–3 minutes. This uses `maxDuration = 300`, which needs **Fluid compute**
(on by default for new Vercel projects: Settings → Functions). If a deploy ever fails with a
`maxDuration` error, turn Fluid compute on.

## Good practice
- Start with 5–10 emails a day for the first two weeks (new domains need to build reputation).
- Pick a narrow target per search, and read every draft before sending.
- Only business addresses published on company websites; respect every "no" and unsubscribe.
- Costs: finding 5 companies ≈ $0.30–1 in API usage; one draft ≈ $0.05–0.15.
