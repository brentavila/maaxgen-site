# GTM container: GTM-MF279RR2

`GTM-MF279RR2-import.json` is a container import for maaxgen.com. It sends the dataLayer events defined in `src/lib/tracking/contract.ts` to GA4 (G-W5R65NR85B) and Google Ads (customer 670-486-2856).

The container has no Meta or Facebook tags. Site code fires the Meta Pixel, so a pixel in GTM would count every event twice.

## What it contains

Everything is filed in three folders: **MaaxGen - Core**, **MaaxGen - GA4**, and **MaaxGen - Google Ads**.

### Tags

| Tag | Type | Trigger | Destination |
| --- | --- | --- | --- |
| Google tag - GA4 | Google tag | Initialization - All Pages | GA4 page views (`send_page_view` true; cookie settings left at defaults) |
| Google tag - Google Ads | Google tag | Initialization - All Pages | Loads `AW-{{Const - AW Conversion ID}}` on every page so Ads conversions and remarketing share one Google tag |
| Conversion Linker | Conversion Linker | All Pages | Saves Google Ads click ids (gclid) and links them across the domains in `Const - Cross-domain list` |
| GA4 - `<event>` (15 tags) | GA4 Event | CE - `<event>` | GA4 event of the same name, with the contract's parameters plus `page_type` |
| Ads - Lead - form | Google Ads Conversion Tracking | CE - generate_lead | Google Ads "Lead - form": value, currency, transaction id = `event_id`, enhanced conversions |
| Ads - Booked call | Google Ads Conversion Tracking | CE - book_appointment | Google Ads "Booked call": value, currency, transaction id = `event_id` |
| Ads - Click to call | Google Ads Conversion Tracking | CE - click_to_call | Google Ads "Click to call" (no value) |

There is one GA4 event tag for each contract event: generate_lead, book_appointment, qualify_lead, click_to_call, click_email, form_start, form_error, add_to_shortlist, begin_plan, view_item, view_promotion, select_promotion, grader_start, grader_complete, cta_click. Each tag sends its parameters under the names the site pushes them with. `GA4 - generate_lead` also sends user-provided data.

Every tag uses the built-in consent checks only, with no additional consent required. The site sets the Consent Mode v2 defaults before GTM loads, and Google's tags adjust to them on their own.

### Triggers

- **CE - `<event>`:** one Custom Event trigger per contract event, matching the exact event name.
- **Built-in triggers:** both Google tags use Initialization - All Pages; the Conversion Linker uses All Pages.

### Variables

- **Constants:**
  - `Const - GA4 Measurement ID`
  - `Const - AW Conversion ID`
  - `Const - AW Label - Lead form`, `Const - AW Label - Booked call`, `Const - AW Label - Click to call`
  - `Const - Cross-domain list`, which defaults to `maaxgen.com`. Add other domains to it as a comma-separated list.
- **Data Layer Variables:** `dlv - <name>` (version 2), one for every parameter in the contract plus `page_type`. There are also six for the enhanced-conversion fields: `dlv - user_data.email`, `dlv - user_data.phone_number`, and `dlv - user_data.address.first_name`, `.last_name`, `.postal_code`, `.country`.
- **User-Provided Data:** `UPD - user_data`, in Manual mode. Each field reads its matching `dlv - user_data.*` variable. Manual mode shows every field in the GTM interface, which makes a missing field easy to spot in Preview. The site pushes these fields as plain text, and Google hashes them before sending.
- **Built-in variables:** Page URL, Page Hostname, Page Path, Referrer, Event, Click Element, Click URL, Click Text, Container ID, Debug Mode.

## Conversion IDs (account 670-486-2856)

These constants are filled from the published GTM-MF279RR2 container. Re-import this file (Merge → Rename conflicting, then pause duplicates) so a workspace matches git.

| Variable | Value | Notes |
| --- | --- | --- |
| Const - AW Conversion ID | `18395450276` | Digits only. The Google tag ID is `AW-18395450276`. |
| Const - AW Label - Lead form | `QfdqCPndjrsdEKSX0cNE` | Primary conversion; enhanced conversions on |
| Const - AW Label - Booked call | `zBz3CIOwkLsdEKSX0cNE` | Primary conversion |
| Const - AW Label - Click to call | `REPLACE_ME_CALL_LABEL` | Still a placeholder in the live container. Create the secondary "Click to call" action in Google Ads, paste its **Conversion label** here, then re-import. |

`node scripts/verify-gtm-ads.mjs` checks that the Ads Google tag, Conversion Linker, three `awct` tags, and filled IDs are present, and that the site does not load a second AW snippet.

On the "Lead - form" action, also turn on enhanced conversions in Google Ads: Goals → Settings → Enhanced conversions, using Google Tag Manager.

For GA4, turn on Admin → Data collection → "User-provided data collection".

## Import

1. In GTM, open container GTM-MF279RR2 and go to **Admin → Import Container**.
2. Choose `GTM-MF279RR2-import.json`.
3. Pick a workspace. A new workspace named "Conversion tracking" makes the change easy to review.
4. Choose **Merge**, then **Rename conflicting tags, triggers, and variables**. This keeps anything that is already in the container.
5. Read the import summary and confirm.
6. Remove any old GA4 or Google Ads tags that duplicate these new ones, for example an older "GA4 Configuration" tag. Otherwise page views and conversions will be counted twice.

## Verify in Preview

1. Click **Preview**, enter `https://maaxgen.com`, and connect Tag Assistant.
2. On the first page load:
   - Under **Initialization**, "Google tag - GA4" and "Google tag - Google Ads" should fire.
   - Under **Container Loaded**, "Conversion Linker" should fire.
3. Click around the site. Each tracked action should show its event in the left column (form_start, cta_click, add_to_shortlist, and so on), with the matching `GA4 - <event>` tag fired.
4. Submit a test lead. Use a test name and email, and confirm with Brent that the live CRM will receive it.
   - On `generate_lead`, check that "GA4 - generate_lead" and "Ads - Lead - form" both fired.
   - In the Variables tab, check that `dlv - event_id`, `dlv - value`, and `dlv - currency` have values.
   - Check that `UPD - user_data` shows the email and phone number.
5. Click a `tel:` link and check that "Ads - Click to call" fired.
6. Confirm that no Meta or Facebook tag appears in the GTM tag list. The pixel requests in the Network tab come from site code, and that is expected.
7. In GA4, open **Admin → DebugView**. The events should arrive with their parameters.

## Publish

Click **Submit**. Name the version (for example "GA4 + Google Ads conversions from dataLayer contract"), add a short description, and click **Publish**.
