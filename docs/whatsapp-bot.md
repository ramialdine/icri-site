# WhatsApp update bot

Admins forward a prayer flyer, event flyer or announcement to the ICRI bot's WhatsApp number. The site reads it with Claude, saves it as an unpublished Sanity draft, and WhatsApps the approver a summary, a preview link and **Approve** / **Reject** buttons. Nothing reaches the website until the approver taps Approve.

```
admin forwards message ─▶ /api/whatsapp/webhook ─▶ Claude reads it ─▶ Sanity draft
                                                                          │
approver taps Approve ◀── WhatsApp: summary + preview link + buttons ◀────┘
        │
        └─▶ draft published ─▶ live on the site (no deploy)
```

What it understands:

| Forwarded message | Becomes | Preview page |
| --- | --- | --- |
| Monthly prayer timetable (photo or PDF) | `monthlySchedule` for that month, which drives `/api/prayers/today` | `/preview/schedule?id=…` |
| Event flyer or event details | `event`, with the flyer image attached | `/preview/events?id=…` |
| General notice | `announcement` | `/preview/announcements?id=…` |

Safeguards:

- **Allowlisted senders only.** Messages from other numbers are logged and ignored.
- **Only the approver can publish.** Taps from other numbers are ignored.
- **Approval is tied to the exact draft version.** If a draft is edited in Sanity Studio after the request was sent, the old Approve button does nothing. Publish it from Studio instead.
- **Timetables are checked as they're read in.** Wrong day counts, unreadable times, and rows whose prayers are out of order (a likely am/pm misread) are rejected or flagged in the approval message.
- **Every message is logged** under "WhatsApp Bot Activity" in Sanity Studio.

## Setup

### 1. WhatsApp (Meta)

1. At [developers.facebook.com](https://developers.facebook.com), create an app of type **Business** and add the **WhatsApp** product. This creates a WhatsApp Business Account with a free test number. The test number can message up to 5 phone numbers that you verify. Use it until everything works, then add a real number that isn't already registered on WhatsApp.
2. In Business Settings, create a **System User** with access to the app and generate a permanent token with `whatsapp_business_messaging` and `whatsapp_business_management`. This is `WHATSAPP_TOKEN`.
3. Note the **Phone number ID** (WhatsApp → API Setup). This is `WHATSAPP_PHONE_NUMBER_ID`.
4. Note the **App secret** (App settings → Basic). This is `WHATSAPP_APP_SECRET`.
5. Under WhatsApp → Configuration → Webhook:
   - Callback URL: `https://<your-site>/api/whatsapp/webhook`
   - Verify token: any random string, which you also set as `WHATSAPP_VERIFY_TOKEN`
   - Subscribe to the **messages** field.
6. **Recommended:** create a message template so approval requests arrive even if the approver hasn't messaged the bot in the last 24 hours. Without a template, approval requests use reply buttons, which WhatsApp only delivers within 24 hours of the approver's last message to the bot.
   - Name: `icri_update_approval`
   - Category: Utility
   - Language: English (US)
   - Body: `New website update from {{1}}: {{2}} Preview: {{3}} Tap Approve to publish it or Reject to discard it.`
   - Buttons: Quick reply **Approve**, Quick reply **Reject**, in that order.
   
   Once Meta approves it, set `WHATSAPP_APPROVAL_TEMPLATE=icri_update_approval`.

### 2. Sanity

Create an API token with **Editor** permissions (manage.sanity.io → project → API → Tokens). This is `SANITY_API_WRITE_TOKEN`. It is only used on the server.

### 3. Anthropic

Create an API key at [console.anthropic.com](https://console.anthropic.com). This is `ANTHROPIC_API_KEY`. The bot reads messages with Claude Sonnet (`claude-sonnet-5-5`, set in `lib/updates/extract.ts`). API usage is billed separately from any Claude subscription. Reading one flyer costs a few cents.

### 4. Vercel environment variables

| Variable | Value |
| --- | --- |
| `WHATSAPP_TOKEN` | System user token |
| `WHATSAPP_PHONE_NUMBER_ID` | The bot number's phone number ID |
| `WHATSAPP_APP_SECRET` | App secret, used to verify webhook signatures |
| `WHATSAPP_VERIFY_TOKEN` | The verify token from step 1.5 |
| `WHATSAPP_APPROVER` | Approver's number with country code, e.g. `+1 401 555 0100` |
| `WHATSAPP_ALLOWED_SENDERS` | Comma-separated numbers allowed to send updates (the approver is always allowed) |
| `WHATSAPP_APPROVAL_TEMPLATE` | Optional: `icri_update_approval` once approved |
| `WHATSAPP_TEMPLATE_LANGUAGE` | Optional, defaults to `en_US` |
| `WHATSAPP_GRAPH_VERSION` | Optional Graph API version, defaults to `v24.0` |
| `SANITY_API_WRITE_TOKEN` | Sanity Editor token |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NEXT_PUBLIC_SITE_URL` | Optional, e.g. `https://masjidalkareem.org`. Defaults to the Vercel production URL. |

Redeploy after adding them. Until every required variable is set, the webhook answers `503` and lists what's missing.

## Testing

1. From an allowlisted phone, send the bot a short text such as "Announcement: the parking lot is closed this Saturday for repaving." You should get an approval message with a preview link.
2. Open the preview, then tap **Reject**. The draft disappears from Studio.
3. Forward a monthly timetable flyer. Compare the preview table with the flyer row by row, then tap **Approve**. `/api/prayers/today` should now report `"source": { "adhan": "schedule", … }` for days in that month.

If something goes wrong, check "WhatsApp Bot Activity" in Studio and the function logs in Vercel.
