# Conversion tracking setup for maaxgen.com

Complete these steps in order before ads go live. Each step says why it matters. The code is on the `conversion-tracking` branch. Steps 1 to 8 are setup; step 9 is the launch test; step 10 is the follow-up that makes bidding much smarter.

## How it works (read once)

Every lead form on the site does one thing: it sends the lead to `/api/lead`, a small function on our own Vercel site. That function then:

1. forwards the lead to GoHighLevel (or n8n) with the full attribution: first and last campaign touch, gclid, gbraid, wbraid, fbclid, Meta and GA ids;
2. sends a `Lead` event to Meta's Conversions API, server-to-server, with hashed email, phone, and name.

At the same moment the browser fires the Meta Pixel `Lead` and a `generate_lead` event into Google Tag Manager, which sends it to GA4 and Google Ads (with enhanced conversions). All copies share one event id, so Meta and Google count the lead once.

Why this design: the browser alone loses leads to ad blockers and iOS privacy. The server copy cannot be blocked. The shared event id keeps you from double counting.

What fires where:

| Site event | GA4 | Google Ads | Meta |
|---|---|---|---|
| `generate_lead` (any form) | key event | **Lead - form** (primary) | Lead (browser + server) |
| `book_appointment` | key event | **Booked call** (primary) | Schedule |
| `qualify_lead` (Growth System) | key event | | SubmitApplication |
| `click_to_call` | event | Click to call (secondary) | Contact |
| `begin_plan`, `add_to_shortlist`, `view_item` | event | | InitiateCheckout, AddToWishlist, ViewContent |
| `form_start`, `form_error`, `click_email`, `cta_click`, promo, grader | event | | |

---

## Step 1. Get your keys and IDs

**1a. Meta Conversions API token.** Events Manager → your Pixel (1528990838912009) → Settings → Conversions API → *Generate access token*. Copy it somewhere safe. Do not paste it in chat or commit it.
*Why:* Meta only accepts server events signed with this token.

**1b. Meta domain verification.** Business Settings → Brand safety → Domains → add `maaxgen.com` and verify it. The DNS TXT method is the easiest on Vercel.
*Why:* Meta gives full event attribution only to verified domains.

**1c. Google Ads conversion actions.** Google Ads (670-486-2856) → Goals → Conversions → New conversion action → Website → *Add a conversion action manually*. Create:

| Name | Category | Value | Count | Primary? |
|---|---|---|---|---|
| Lead - form | Submit lead form | Use different values (default 75) | **One** | Primary |
| Booked call | Book appointment | Use different values (default 200) | One | Primary |
| Click to call | Contact | Don't use a value | One | **Secondary** |

For each one, open *Tag setup → Use Google Tag Manager* and note the **Conversion ID** (digits only, without `AW-`) and the **Conversion label**.
*Why:* the GTM tags report to these actions. Use "Count: One" because one person submitting twice is still one lead.

**1d. Enhanced conversions.** Google Ads → Goals → Settings → *Enhanced conversions for web* → on → method **Google Tag Manager**. Accept the customer data terms.
*Why:* this is Google's version of Meta's Conversions API. Hashed email and phone let Google match leads it would otherwise miss.

**1e. Auto-tagging.** Google Ads → Admin → Account settings → Auto-tagging → on.
*Why:* without it, no gclid reaches the site and nothing can be attributed to a click.

## Step 2. Set Vercel environment variables

Vercel → the maaxgen-site project → Settings → Environment Variables.

| Name | Production | Preview | Why |
|---|---|---|---|
| `LEAD_WEBHOOK_URL` | your GHL inbound webhook URL (or n8n URL) | leave empty | Where leads go. Kept on the server so spammers cannot find it in the page code. |
| `META_CAPI_ACCESS_TOKEN` | token from 1a | same token | Turns on the server-side Meta event. |
| `META_TEST_EVENT_CODE` | **only during the launch test**, then delete | the test code | Sends events to Meta's *Test events* tab instead of live data. |
| `TRACKING_DRY_RUN` | **never set** | `1` | Preview deploys log leads instead of sending them, so testing never creates fake CRM contacts. |

Redeploy after changing variables. Vercel only reads them at deploy time.

Required: if `LEAD_WEBHOOK_URL` is missing on the project that serves www.maaxgen.com, every form shows its error message and the Vercel logs show `LEAD_WEBHOOK_URL is not set`. Set it on that project (Settings → Domains shows which one) and redeploy.

## Step 3. Set up GoHighLevel to receive the leads

The site now sends one flat JSON object per lead. Its keys are always the same, and empty values are sent as `""`.

**3a. Create custom contact fields** (Settings → Custom Fields) for the attribution you want on the contact: `first_source`, `first_medium`, `first_campaign`, `first_landing_page`, `last_source`, `last_medium`, `last_campaign`, `last_term`, `last_landing_page`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `fbc`, `fbp`, `form_id`, `lead_source`, `event_id`, `industry`, `qualifier`, `interested_services`, `promo_id`.
*Why:* `gclid`, `gbraid`, `wbraid`, `fbc`, and `fbp` are what let you send *qualified* and *closed* results back to Google and Meta later (step 10). If they are not stored now, that history is gone.

**3b. Workflow.** Automation → new workflow → trigger **Inbound Webhook**. Copy its URL into `LEAD_WEBHOOK_URL` (step 2). Send one test lead from a Preview deploy with dry-run turned off, or use the sample payload printed in the Vercel function log. Then map the fields in a **Create/Update Contact** action:
- `first_name`, `last_name`, `email`, `phone` (already E.164), `company`, `website`, `zip` → standard fields
- the step 3a keys → your custom fields
- `message` → a note
- `sms_consent`: keep your existing SMS consent handling

Then add your opportunity creation (pipeline stage "New lead"), owner assignment, and the AI follow-up.

The full key list is `CRM_KEYS` in `src/lib/tracking/contract.ts`. `extra_json` holds anything a form collects that has no column of its own, such as grader answers and Growth System details.

Webhook or n8n? Point `LEAD_WEBHOOK_URL` straight at GHL. Fewer hops means fewer ways to lose a lead. Use n8n for step 10, where it earns its place.

**3c. Calendar redirect.** On the GHL calendar used in the Growth System, set the confirmation action to *redirect* to
`https://maaxgen.com/thank-you/?booked=1`
*Why:* the site also listens for GHL's booking message from the embedded calendar, but that message is not officially documented. The redirect is the reliable backup, and the thank-you page counts each booking only once.

## Step 4. Import the GTM container

Full detail is in `tracking/gtm/README.md`. In short:

1. GTM (GTM-MF279RR2) → Admin → **Import Container** → file `tracking/gtm/GTM-MF279RR2-import.json` → workspace: new → **Merge** → **Rename conflicting**.
2. Variables → confirm `Const - AW Conversion ID` is `18395450276` and the Lead / Booked call labels match Google Ads. Paste the Click to call label when that conversion action exists (it is still a placeholder). Confirm **Google tag - Google Ads** fires on Initialization.
3. **Delete or pause any older tags** that fire GA4 or Google Ads, and **any Meta/Facebook pixel tag**. The site fires the Meta Pixel itself, so a GTM pixel tag would double count every event.
4. If the journey crosses to another domain, add it to `Const - Cross-domain list` (comma-separated). Subdomains of maaxgen.com need nothing: they share cookies automatically.

*Why:* GTM reads the site's events and sends them to GA4 and Google Ads, so all Google tagging is managed in one place.

The site loads GTM with an async `gtm.js?id=GTM-MF279RR2` script plus `gtag('js')` (Consent Mode defaults run first). Do not paste a second GTM or gtag.js snippet into the page or into GTM — that would double count every event.

## Step 5. Configure GA4

GA4 property G-W5R65NR85B → Admin:

1. **Events → mark as key events:** `generate_lead`, `book_appointment`, `qualify_lead`. These appear after the first one fires; you can also create them in advance.
2. **Custom definitions → custom dimensions (event scope):** `form_id`, `lead_source`, `industry`, `business_type`, `interested_services`, `promo_id`, `booking_source`, `service_id`, `cta_id`, `placement`, `page_type`, `grade`.
   *Why:* GA4 throws away parameters that are not registered, so you could not report leads by form or industry.
3. **Data streams → Configure tag settings → List unwanted referrals:** `leadconnectorhq.com`, `msgsndr.com`, `gohighlevel.com`.
   *Why:* when a visitor comes back from the GHL calendar, GA4 would otherwise start a new session credited to GHL, and the real ad source would be lost.
4. **Configure your domains:** add only domains that are *not* maaxgen.com (for example a GHL funnel on its own domain). maaxgen.com subdomains work automatically.
5. **Data retention:** 14 months.
6. **Product links → Google Ads:** link 670-486-2856 with auto-tagging and personalized advertising on.
   *Why:* this lets you import GA4 audiences into Google Ads and compare data across the two.

## Step 6. Set lead values

Tell me the rough worth of each lead type and I will update `LEAD_VALUES` in `src/lib/tracking/contract.ts`. The current placeholders are: contact 50, plan dialog 75, industry 75, Black Friday 75, grader 40, Growth System 100, booked call 200.
*Why:* with values, Google and Meta can bid for the leads worth more, not just the most leads.

## Step 7. Merge and deploy

Open the pull request for `conversion-tracking`. Vercel builds a Preview, which runs in dry-run per step 2. When the step 9 checks pass on Preview, merge to `main` and Vercel deploys Production.

## Step 8. Consent note

The site's cookie banner is a notice, not a choice. Visitors in the US are tracked by default. Visitors in the EU, UK, and Switzerland default to "denied" in Google Consent Mode. If you plan to advertise outside the US, we need a real accept/decline banner.

## Step 9. Launch test (do this on Production)

1. Set `META_TEST_EVENT_CODE` (Events Manager → Test events → *Test server events* code) and redeploy.
2. Open GTM **Preview** on `https://maaxgen.com/contact/?utm_source=test&utm_medium=cpc&utm_campaign=launch-test&gclid=TEST123`.
3. Submit the contact form with your own email. Check each of these:
   - **Tag Assistant:** `generate_lead` fired `GA4 - generate_lead` and `Ads - Lead - form`. In the Ads tag, *User-provided data* is filled in.
   - **Meta Events Manager → Test events:** a **Lead** from *Browser* and a **Lead** from *Server* with the same Event ID, marked *Deduplicated*.
   - **GHL:** the contact exists with `last_campaign = launch-test` and `gclid = TEST123`.
   - **GA4 → Realtime / DebugView:** `generate_lead` with `form_id = contact`.
4. Repeat once on an industry page, the Black Friday page, and the grader.
5. Book a test call through the Growth System calendar. Confirm `book_appointment` and Meta **Schedule** fire once.
6. Click a phone number on your phone. Confirm `click_to_call` fires.
7. Delete `META_TEST_EVENT_CODE`, redeploy, and **Submit/Publish** the GTM container.
8. After 24 to 48 hours: Google Ads → Conversions shows *Recording conversions*, and Enhanced conversions diagnostics show a healthy match rate. Meta Events Manager shows an Event Match Quality score for Lead.

## Step 10. Close the loop (recommended next, after launch)

Form fills are a proxy for revenue. Bidding gets much better when Google and Meta learn which leads became qualified and which became customers.

- **Google Ads:** create conversion actions "Qualified lead" and "Closed deal" (Import → CRM / click conversions). When a GHL opportunity moves to *Qualified* or *Won*, send the stored `gclid`, `gbraid`, or `wbraid` (or hashed email/phone for enhanced conversions for leads) with the stage time and value. Use either GHL's built-in Google Ads conversion sync or an n8n workflow on the stage-change trigger.
- **Meta:** on the same stage changes, send a Conversions API event (`action_source: "system_generated"`, custom names such as `QualifiedLead` and `Purchase` with the deal value), carrying the stored `fbc`, `fbp`, hashed email, and phone.

This is where n8n is the right tool. I can build it once GHL is mapped and you confirm your pipeline stage names.
