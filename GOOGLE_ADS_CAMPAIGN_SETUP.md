# Oasis Construction Google Ads setup

This is the complete, step-by-step runbook for rebuilding the first Oasis
Construction campaign from scratch. It covers the website, lead delivery,
Google Tag Manager, the Google Ads conversion, the Search campaign, testing,
launch and the first weeks of monitoring.

It was checked against the live website and current Google documentation on
2026-09-02. Google changes labels and moves settings regularly. If a label is
slightly different, choose the option with the meaning described here. Do not
accept a broader campaign type or targeting setting just because Google
recommends it.

## What this setup will produce

| Item                      | Final setting                                          |
| ------------------------- | ------------------------------------------------------ |
| Campaign type             | Standard Search campaign                               |
| Goal                      | Qualified website leads                                |
| Campaign name             | `FR - Réparation pavé uni - Laval et Rive-Nord`        |
| Language                  | French                                                 |
| Average daily budget      | `CA$50.00`                                             |
| Approximate monthly limit | `CA$1,520` when active for a full month                |
| Landing page              | `https://oasis-construction.ca/lp/pave-uni-reparation` |
| Primary conversion        | `Website - Qualified Lead`                             |
| Conversion signal         | `form_lead` data-layer event                           |
| Main phone                | `(438) 505-4846`                                       |
| Service area              | Laval and the listed Rive-Nord municipalities          |

`CA$50` is an average daily budget, not a strict daily cap. For most Search
campaigns Google may spend up to `CA$100` on a high-traffic day, but the
monthly charging limit is normally `CA$50 x 30.4 = CA$1,520` if the budget
does not change. Check the Budget report before launch if the business cannot
accept that monthly maximum.

## Realistic total ETA

Assuming all logins and permissions are available:

| Scenario                                                    | Hands-on work | Calendar time                |
| ----------------------------------------------------------- | ------------- | ---------------------------- |
| Everything is accessible and the email domain is verified   | 4 to 6 hours  | 1 to 2 business days         |
| Normal setup, including deployment and Google review        | 4 to 7 hours  | 2 to 3 business days         |
| Missing Business Profile, Netlify, Resend or billing access | 5 to 8 hours  | 3 to 7 or more business days |

After launch, allow another **7 to 14 days** for the bidding learning period.
That waiting period is not setup time. Do not judge the campaign from its
first few clicks.

### ETA by phase

| Phase                                       |                                     Active work |                                 Typical waiting time |   Cumulative active work |
| ------------------------------------------- | ----------------------------------------------: | ---------------------------------------------------: | -----------------------: |
| 0. Collect access and clean the old attempt |                                    20 to 40 min |                       None, unless access is missing |             20 to 40 min |
| 1. Prove lead delivery                      |                                    20 to 45 min | Up to 24 to 48 h if the email domain is not verified |     40 min to 1 h 25 min |
| 2. Verify landing page and install GTM      |                                    30 to 60 min |                   5 to 15 min for Netlify deployment | 1 h 10 min to 2 h 25 min |
| 3. Create and test the conversion           |                                    45 to 90 min |          Google status can take up to 48 h to update | 1 h 55 min to 3 h 55 min |
| 4. Build the Search campaign                |                                    60 to 90 min |                                                 None | 2 h 55 min to 5 h 25 min |
| 5. Add assets, billing and launch checks    |                                    30 to 60 min |           Ad review is usually within 1 business day | 3 h 25 min to 6 h 25 min |
| 6. Launch and first-week review             | 10 to 20 min at launch, then 10 to 20 min daily |                          7 to 14 day learning period |                  Ongoing |

Waiting times can overlap. For example, the Search campaign can be built and
left paused while Google detects the conversion tag.

---

## Phase 0 - Collect access and clean the old attempt

**ETA: 20 to 40 minutes.** If an owner must grant access, add however long
that approval takes.

### 0.1 Required access

Confirm that the Google account doing the setup can access all of these:

- Google Ads with **Admin** or **Standard** access.
- Google Tag Manager with **Publish** access.
- Netlify for the production Oasis Construction project.
- The Google Business Profile for Oasis Construction.
- The inbox receiving leads at `contact@oasis-construction.ca`.
- Resend, or the person who controls the verified sending domain.
- The Google Ads billing profile and payment method.

Do not share passwords or API keys in this guide, screenshots, chat messages
or Git. Real secrets belong only in Netlify's environment-variable settings.

### 0.2 Preserve history and stop duplicate spending

1. Open [Google Ads](https://ads.google.com/).
2. Go to **Campaigns**.
3. Find every earlier Oasis campaign.
4. Click the status dot and choose **Pause** for each old campaign.
5. Do not remove the old campaigns. Their settings and history may be useful.
6. Confirm that no other enabled campaign can spend from this account.
7. Record the old campaign names in the private setup notes.

### 0.3 Check the account before creating anything

1. Open **Billing > Settings** or **Billing > Summary**.
2. Confirm the currency is **Canadian dollars (CAD)**.
3. Confirm the payment method is active.
4. Confirm the billing country and business details belong to Oasis
   Construction.
5. Confirm the account time zone is Eastern time for Quebec.

Google Ads account currency cannot be changed after account creation. If this
account is not in CAD, stop and create a new serving account in CAD. Do not
build a CA$50 campaign in an INR or USD account.

### 0.4 Audit old conversions and tags

1. In Google Ads, open **Goals > Conversions > Summary**.
2. Look for an existing conversion named `Website - Qualified Lead`.
3. In Google Tag Manager, inspect **Tags**, **Triggers** and **Variables** for
   an earlier Oasis conversion setup.
4. Use one of these paths:
   - If the old conversion and tag can be proven correct, reuse them and do
     not create duplicates.
   - If they cannot be proven correct, rename the old Google Ads action to
     `OLD - Website - Qualified Lead - do not use`, set it to **Secondary**,
     and pause its old GTM tag. Then create the clean setup in Phase 3.
5. Never leave two tags capable of sending the same accepted lead.

### Phase 0 completion check

- [ ] Every old campaign is paused.
- [ ] There is no duplicate campaign spending.
- [x] The account currency is CAD.
- [ ] The payment method is active.
- [ ] Old conversion tags are understood or paused.
- [ ] Required account access is available.

---

## Phase 1 - Prove that website leads are delivered

**ETA: 20 to 45 minutes.** If Resend still needs domain verification, allow up
to 24 to 48 hours of waiting for DNS propagation and verification.

This phase is mandatory. A conversion should only be counted after the server
accepts and delivers the form. Advertising before delivery works would pay
for leads that nobody receives.

### 1.1 Check the public pages

Open each URL in a private browser window:

1. [Paid landing page](https://oasis-construction.ca/lp/pave-uni-reparation)
2. [French thank-you page](https://oasis-construction.ca/merci)

Expected results:

- The landing page loads without a redirect or browser warning.
- It shows French pavé-uni repair content and the guided form.
- A direct visit to `/merci` says there is no request to confirm. A direct
  visit must not count as a conversion.

### 1.2 Verify production form-delivery settings in Netlify

The live site is hosted on Netlify. Local `.env` values do not configure the
production site.

1. Sign in to [Netlify](https://app.netlify.com/).
2. Open the Oasis Construction project.
3. Go to **Project configuration > Environment variables**.
4. Confirm these production variables exist:

```text
RESEND_API_KEY
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
```

5. Confirm `CONTACT_TO_EMAIL` is the inbox that the business actively reads.
6. Confirm `CONTACT_FROM_EMAIL` is on a domain verified in Resend.
7. Never copy the actual `RESEND_API_KEY` into this file or the repository.
8. If the variables were added or changed, go to **Deploys > Trigger deploy >
   Deploy project**. Environment changes require a new build and deployment.
9. Wait for the production deploy to say **Published**.

The webhook alternative is `CONTACT_WEBHOOK_URL`, but it does not send photo
attachments. Prefer Resend for this campaign because the guided form accepts
photos.

### 1.3 Submit one real test lead

1. Open the paid landing page in a private window.
2. Complete the guided form normally. Do not rush through it because the form
   rejects submissions completed unrealistically fast.
3. Use contact details controlled by the person performing the test.
4. Select pavé uni and a realistic test path through the options.
5. Add a harmless test image if photo delivery needs verification.
6. Submit the form.
7. Confirm the browser goes to `https://oasis-construction.ca/merci`.
8. Confirm the recipient inbox receives the lead.
9. Confirm the email has the selected service, problem, location and timeline.
10. If a photo was attached, confirm it arrived and opens.
11. Mark the email clearly as a test before deleting or filing it.

If the page reports that delivery is unavailable, stop here and fix Resend or
the webhook. Do not proceed to campaign launch.

### Phase 1 completion check

- [ ] The landing page works on mobile and desktop.
- [ ] The accepted form redirects to `/merci`.
- [ ] A real test email is received.
- [ ] Structured answers are present in the email.
- [ ] A test photo arrives when one is attached.
- [ ] A direct visit to `/merci` does not show a false successful submission.

---

## Phase 2 - Verify the paid landing page and install Google Tag Manager

**ETA: 30 to 60 minutes, plus 5 to 15 minutes for the Netlify deployment.**

### 2.1 Verify the completed landing-page integration

**ETA: 5 to 10 minutes.**

The paid `/lp/...` page has a separate HTML shell, so it must carry the same
measurement and consent components as the regular site. This repository now
includes that integration. Verify it before deployment because removing it
would let Google lose the ad click identifier before the visitor reaches
`/merci`, and a first-time visitor would not be able to grant consent before
`form_lead` occurs.

Open `src/app/lp/[campaign]/page.tsx` and confirm:

1. `Analytics` and `GtmNoScript` are imported from `@/components/Analytics`.
2. `CookieBanner` is imported from `@/components/CookieBanner`.
3. `<GtmNoScript />` is immediately after the opening `<body>` tag.
4. `<Analytics />` and `<CookieBanner />` are near the end of `<body>`.
5. The banner uses `t.cookies` and `pagePath(locale, 'privacy')`.
6. Google's raw snippets are not pasted into the page. The existing
   components generate them once from `NEXT_PUBLIC_GTM_ID`.
7. Run:

```bash
npm run verify
```

8. Do not deploy if verification fails.
9. After deployment, open the paid landing page in a fresh private window and
   confirm the cookie banner is visible before continuing.

### 2.2 Create or choose the GTM container

1. Open [Google Tag Manager](https://tagmanager.google.com/).
2. If Oasis already has a web container, open it and confirm nobody else uses
   it for an unrelated website.
3. If there is no suitable container, choose **Create Account**.
4. Enter:

| Field           | Value                   |
| --------------- | ----------------------- |
| Account name    | `Oasis Construction`    |
| Country         | `Canada`                |
| Container name  | `oasis-construction.ca` |
| Target platform | `Web`                   |

5. Accept the Tag Manager terms.
6. Copy the container ID beginning with `GTM-`.
7. Save it in the private setup notes as `GTM_CONTAINER_ID`.

### 2.3 Install the GTM ID on Netlify

1. In Netlify, open **Project configuration > Environment variables**.
2. Choose **Add a variable > Add a single variable**.
3. Enter:

```text
Key: NEXT_PUBLIC_GTM_ID
Value: GTM-WSXTTT7R
```

4. Confirm the value is exactly `GTM-WSXTTT7R`.
5. Apply it to the **Production** deploy context. Include the **Builds** scope
   if Netlify asks for scopes because `NEXT_PUBLIC_` values are embedded at
   build time.
6. Save the variable.
7. Go to **Deploys > Trigger deploy > Deploy project**.
8. Wait until the deploy is **Published**.

Do not also set `NEXT_PUBLIC_GA4_ID`. This website deliberately loads GTM or
GA4, not both. GA4 can be configured inside GTM later if required.

### 2.4 Verify that the container is installed

1. Return to the GTM workspace.
2. Choose **Preview**.
3. Enter:

```text
https://oasis-construction.ca/lp/pave-uni-reparation
```

4. Choose **Connect**.
5. Confirm Tag Assistant connects to the correct `GTM-` container.
6. Do not publish an empty container merely to make the warning disappear.

### 2.5 Create consent variables and the granted-consent trigger

The website pushes a `consent_update` event with `granted` or `denied` values.
GTM itself may load before a choice, but advertising and analytics tags must
not fire until the visitor accepts.

Create four Data Layer Variables:

1. Go to **Variables > User-Defined Variables > New**.
2. Choose **Data Layer Variable**.
3. Create these one at a time:

| Variable name              | Data Layer Variable Name |
| -------------------------- | ------------------------ |
| `DLV - analytics_storage`  | `analytics_storage`      |
| `DLV - ad_storage`         | `ad_storage`             |
| `DLV - ad_user_data`       | `ad_user_data`           |
| `DLV - ad_personalization` | `ad_personalization`     |

4. Leave the data-layer version at the default and save each variable.

Create the granted-consent trigger:

1. Go to **Triggers > New**.
2. Name it `CE - consent_update - granted`.
3. Choose **Custom Event**.
4. Set **Event name** to `consent_update`.
5. Select **Some Custom Events**.
6. Add both conditions:

```text
DLV - ad_storage equals granted
DLV - ad_user_data equals granted
```

7. Save it.

This is the trigger used for the Google tag and Conversion Linker later. A
visitor who refuses must not activate either tag.

### Phase 2 completion check

- [ ] The landing page renders `GtmNoScript`, `Analytics` and `CookieBanner`.
- [ ] `npm run verify` passed after the landing-page change.
- [ ] The verified code is deployed and the consent banner appears on `/lp/`.
- [ ] The correct GTM web container exists.
- [ ] `NEXT_PUBLIC_GTM_ID` is set in Netlify Production.
- [ ] A new production deploy completed.
- [ ] Tag Assistant connects to the container.
- [ ] All four consent variables exist.
- [ ] `CE - consent_update - granted` exists.
- [ ] No measurement tag fires after a refusal.

---

## Phase 3 - Create and test the qualified-lead conversion

**ETA: 45 to 90 minutes.** Google Ads may take up to 48 hours to change a new
conversion's status from unverified or inactive even when Tag Assistant shows
the implementation working.

### 3.1 Create the conversion action in Google Ads

1. Open Google Ads.
2. Go to **Goals > Conversions > Summary**.
3. Choose **+ Create conversion action**.
4. Choose **Conversions on a website**.
5. Enter the base domain:

```text
https://oasis-construction.ca
```

6. Choose **Scan**.
7. Choose **Set up manually using code** or **Manually using code**.
8. Do not choose an automatic URL/page-load conversion. The direct `/merci`
   page is intentionally accessible and must not count without an accepted
   form submission.
9. Enter these settings:

| Setting              | Value                      |
| -------------------- | -------------------------- |
| Goal/category        | `Submit lead form`         |
| Conversion name      | `Website - Qualified Lead` |
| Action optimization  | `Primary`                  |
| Value                | `Don't use a value`        |
| Count                | `One`                      |
| Click-through window | Leave Google's default     |
| Engaged-view window  | Leave Google's default     |
| View-through window  | Leave Google's default     |
| Attribution          | `Data-driven`              |
| Enhanced conversions | Off for this initial setup |

10. Save and continue.
11. Choose the Google Tag Manager installation method if offered.
12. Copy the generated values into the private setup notes:

```text
GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXXXX
```

Do not put these values into a public issue or screenshot. They are not login
secrets, but keeping account identifiers in the private setup record is a
good operational habit.

### 3.2 Create the Google tag in GTM

1. In GTM, go to **Tags > New**.
2. Name the tag `Google tag - Oasis Ads`.
3. Choose **Google tag** as the tag type.
4. Enter the `AW-...` conversion ID as the Tag ID.
5. Attach the trigger `CE - consent_update - granted`.
6. Save the tag.

### 3.3 Create the Conversion Linker tag

1. Go to **Tags > New**.
2. Name it `Conversion Linker - consent granted`.
3. Choose **Conversion Linker**.
4. Leave linker options at their defaults.
5. Attach `CE - consent_update - granted`.
6. Save the tag.

### 3.4 Create the accepted-lead trigger

1. Go to **Triggers > New**.
2. Name it `CE - form_lead - consent granted`.
3. Choose **Custom Event**.
4. Set **Event name** to `form_lead`.
5. Select **Some Custom Events**.
6. Add both conditions:

```text
DLV - ad_storage equals granted
DLV - ad_user_data equals granted
```

7. Save the trigger.

The website emits `form_lead` only after `/api/contact` accepted the form. It
contains service, problem, location, timeline, photo count and completion
time, but no name, phone number, email, message or photograph.

### 3.5 Create the Google Ads conversion tag

1. Go to **Tags > New**.
2. Name it `Google Ads - Website - Qualified Lead`.
3. Choose **Google Ads Conversion Tracking**.
4. Enter the Conversion ID from Google Ads.
5. Enter the Conversion Label from Google Ads.
6. Leave Conversion Value, Transaction ID and Currency Code empty.
7. Do not enable user-provided data or enhanced conversions in this first
   setup.
8. Attach `CE - form_lead - consent granted`.
9. Save the tag.

### 3.6 Test consent and conversion behavior in Preview

Use a private window or clear only the site's consent choice before this test.

1. In GTM, choose **Preview** and connect to the landing page.
2. Before answering the cookie banner, confirm neither the Google tag nor the
   Conversion Linker fires.
3. Choose **Refuse** once.
4. Confirm the Google tag, Conversion Linker and conversion tag do not fire.
5. Start a fresh private session and reconnect Preview.
6. Choose **Accept**.
7. Confirm `Google tag - Oasis Ads` fires once.
8. Confirm `Conversion Linker - consent granted` fires once.
9. Complete and submit a real test lead.
10. Confirm the browser reaches `/merci`.
11. In Tag Assistant, select the `form_lead` event.
12. Confirm `Google Ads - Website - Qualified Lead` fired exactly once.
13. Confirm the recipient inbox received the same test lead.
14. Refresh `/merci`.
15. Confirm `form_lead` and the conversion tag do not fire again.
16. Open `/merci` directly in another tab.
17. Confirm the conversion tag does not fire.
18. Inspect the `form_lead` data-layer event and confirm it contains no name,
    phone, email, message text or photo contents.

If the conversion tag fires on a direct `/merci` visit, stop and fix the
trigger. It must use `form_lead`, not a page-view or URL trigger.

### 3.7 Publish GTM

Only publish after all Preview tests pass:

1. In GTM, choose **Submit**.
2. Choose **Publish and Create Version**.
3. Use this version name:

```text
Oasis Ads qualified lead conversion
```

4. Use this description:

```text
Adds consent-gated Google tag, Conversion Linker and form_lead Google Ads conversion.
```

5. Review the workspace changes.
6. Choose **Publish**.
7. Run one final production test without Preview and confirm lead delivery.
8. In Google Ads, return to **Goals > Conversions > Summary** and check the
   conversion status. Status updates may lag behind the successful test.

### Phase 3 completion check

- [ ] `Website - Qualified Lead` exists and is Primary.
- [ ] It counts One and has no invented value.
- [ ] Attribution is Data-driven.
- [ ] The Google tag and Conversion Linker require granted consent.
- [ ] The conversion tag uses `form_lead`.
- [ ] The conversion fires once after an accepted test lead.
- [ ] Refreshing or directly opening `/merci` does not fire it.
- [ ] The lead email is received.
- [ ] The GTM container version is published.
- [ ] No personal data reaches the data layer or Google Ads tag.

---

## Phase 4 - Build the standard Search campaign

**ETA: 60 to 90 minutes.** The campaign must remain paused while it is built.

### 4.1 Start the correct campaign type

1. In Google Ads, go to **Campaigns**.
2. Choose the **+** button, then **New campaign**.
3. Select the objective **Leads**.
4. Select **Search** as the campaign type.
5. If Google opens a Smart Campaign flow, switch to the full or Expert
   campaign creation flow and select Search.
6. Do not select Performance Max, Display, Demand Gen or Smart Campaign.
7. Choose **Website visits** if Google asks how leads will reach the business.
8. Enter the landing page URL:

```text
https://oasis-construction.ca/lp/pave-uni-reparation
```

9. If Google asks for a phone number, select Canada and enter
   `+1 438-505-4846`.

### 4.2 Select the campaign conversion goal

1. In **Use these conversion goals for campaign performance optimization**,
   choose campaign-specific goals if necessary.
2. Keep only **Submit lead form > Website - Qualified Lead** selected for
   bidding.
3. Remove page views, button clicks, directions and unqualified call clicks
   from this campaign's bidding goals.
4. If Google creates a calls conversion automatically, keep it Secondary
   until the business defines what length and type of call is qualified.

### 4.3 Name the campaign

Enter exactly:

```text
FR - Réparation pavé uni - Laval et Rive-Nord
```

### 4.4 Choose bidding

1. Choose **Conversions** as the bidding focus.
2. Choose **Maximize conversions**.
3. Do not set a target CPA at launch because the account does not yet have a
   reliable qualified-lead CPA.
4. Do not choose **Maximize conversion value** because the conversion has no
   assigned monetary value.

### 4.5 Restrict the networks

1. Expand **Networks**.
2. Uncheck **Display Network**.
3. Uncheck **Google Search Partners** for the controlled initial launch.
4. Keep only Google Search traffic.

Search Partners can be tested later in a deliberate experiment after the core
campaign has clean conversion data.

### 4.6 Turn off uncontrolled expansion

If any of these options appear, leave them off for the initial campaign:

- AI Max for Search campaigns.
- Broad-match campaign setting.
- Final URL expansion.
- Automatically created text assets or text customization that can rewrite
  the advertisement.
- Automatically applying recommendations.

These features can be tested later. At launch the ad must stay tied to the
approved pavé-uni repair message and verified landing page.

### 4.7 Set the language

1. Open **Languages**.
2. Select **French**.
3. Remove English and All languages if they were selected automatically.

### 4.8 Add precise locations

Add these locations individually. Include `Quebec, Canada` in the search text
when Google shows similarly named places.

```text
Laval, Quebec, Canada
Terrebonne, Quebec, Canada
Blainville, Quebec, Canada
Boisbriand, Quebec, Canada
Sainte-Thérèse, Quebec, Canada
Rosemère, Quebec, Canada
Lorraine, Quebec, Canada
Bois-des-Filion, Quebec, Canada
Mascouche, Quebec, Canada
Repentigny, Quebec, Canada
Mirabel, Quebec, Canada
Saint-Eustache, Quebec, Canada
Deux-Montagnes, Quebec, Canada
```

Then:

1. Remove Canada, Quebec and Montréal if any were added as broad targets.
2. Expand **Location options**.
3. Under Target, select **Presence: People in or regularly in your targeted
   locations**.
4. Do not use the default option that also includes people merely interested
   in the locations.
5. For exclusions, keep the default **Presence** option.

The business address is not the campaign territory. The campaign targets the
service municipalities above, not all of Montréal or Quebec.

### 4.9 Choose schedule and dates

1. Leave the campaign start date unset until the final launch step, or set it
   to a future date after review.
2. Do not set an end date unless the business gives a specific seasonal stop.
3. Leave website ads eligible all day at launch because the form can accept a
   lead at any time.
4. Schedule the call asset for the verified business hours, 9:00 to 20:00
   daily, if Google offers asset scheduling.

### 4.10 Create one tightly focused ad group

Ad group name:

```text
Pavé uni - Réparation
```

Do not mix murets, pressure washing, drainage-only work or general landscape
construction into this ad group.

### 4.11 Add the starting keywords

Paste these one per line. Keep the quotation marks and square brackets:

```text
[réparation pavé uni]
"réparation pavé uni"
[pavé uni laval]
"pavé uni laval"
"réparation pavé uni rive nord"
"pavé uni affaissé"
"réparer pavé uni"
"réparation entrée pavé uni"
"entrepreneur pavé uni"
```

Do not add plain-text broad-match versions at launch. If Google changes the
punctuation into a Match Type column, confirm every keyword is Exact or
Phrase before continuing.

### 4.12 Add campaign-level negative keywords

1. Open **Keywords > Negative keywords**, or add them after saving the draft.
2. Apply them at the campaign level.
3. Paste one per line:

```text
emploi
emplois
job
jobs
salaire
formation
formations
cours
tutoriel
tutoriels
DIY
comment faire
matériau
matériaux
à vendre
Kijiji
RONA
Home Depot
location machine
location équipement
fabricant
fournisseur
grossiste
```

Negative keywords do not automatically cover every singular, plural or close
variant, which is why useful variants appear separately.

Do not exclude these terms:

```text
prix
devis
soumission
coût
```

They can indicate a homeowner ready to hire.

### 4.13 Set the average daily budget

Enter:

```text
CA$50.00 per day
```

Confirm the interface shows `CA$`, not `$US`, INR or a monthly budget. Do not
create a shared budget for this first campaign.

### Phase 4 completion check

- [ ] The campaign type is Search.
- [ ] The campaign is still paused or scheduled for the future.
- [ ] Only `Website - Qualified Lead` is used for bidding.
- [ ] Bidding is Maximize conversions with no target CPA.
- [ ] Display Network and Search Partners are off.
- [ ] Language is French only.
- [ ] All 13 target locations are present.
- [ ] Location targeting uses Presence.
- [ ] No broad region such as Canada, Quebec or all Montréal is targeted.
- [ ] The ad group contains only pavé-uni repair keywords.
- [ ] Keywords are Exact or Phrase.
- [ ] Negative keywords are applied.
- [ ] Budget is CA$50 average per day.

---

## Phase 5 - Create ads and assets, then perform launch checks

**ETA: 30 to 60 minutes.** Google reviews most ads within one business day,
although some reviews take longer.

### 5.1 Responsive Search Ad A - repair and diagnosis

Final URL:

```text
https://oasis-construction.ca/lp/pave-uni-reparation
```

Display paths:

```text
Path 1: reparation
Path 2: pave-uni
```

Headlines:

```text
Réparation de pavé uni
Pavé uni à Laval
Pavé uni sur la Rive-Nord
Pavé uni affaissé?
Réparation à la source
Évaluation gratuite
Devis transparent
Oasis Construction
Diagnostic avant travaux
Réparation ciblée
Pavé qui bouge?
Entrée en pavé à réparer
```

Descriptions:

```text
Pavé uni affaissé? On trouve la cause et on répare.
Réparation ciblée et devis transparent. Évaluation gratuite à Laval et Rive-Nord.
Pavé qui bouge, joints qui se vident ou creux qui se forment? Demandez une évaluation.
```

### 5.2 Responsive Search Ad B - easy first contact

Use the same final URL and display paths.

Headlines:

```text
Réparation de pavé uni
Pavé uni sur la Rive-Nord
Pavé uni affaissé?
Évaluation gratuite
Oasis Construction
Envoyez vos photos
Décrivez votre problème
Réparation ciblée
Joints de pavé vidés?
Entrée en pavé à réparer
```

Descriptions:

```text
Pavé uni affaissé? On trouve la cause et on répare.
Décrivez le problème et ajoutez vos photos. On évalue la réparation, sans obligation.
Réparation ciblée et devis transparent. Évaluation gratuite à Laval et Rive-Nord.
```

All headlines are within Google's 30-character limit and all descriptions are
within the 90-character limit. Do not pin headlines unless Google requires a
position for a legal reason. Each line must be able to make sense in different
combinations.

### 5.3 Add the call asset

1. Go to **Campaigns > Assets**.
2. Choose **+ > Call**.
3. Add it at the campaign level.
4. Select **Create new**.
5. Change the country from India or any default country to **Canada (+1)**.
6. Enter:

```text
+1 438-505-4846
```

7. If scheduling is available, show the call asset daily from **9:00 to
   20:00** in the Google Ads account's Eastern time zone.
8. Enable call reporting if the business wants call reporting.
9. Keep any raw call-click conversion Secondary until a qualified-call rule
   is agreed.

Do not use the secondary business number in this campaign.

### 5.4 Link the Google Business Profile as a location asset

Use the existing verified profile. Do not create a duplicate listing.

Expected verified address:

```text
10955 avenue Massé
Montréal, QC H1G 4G5
Canada
```

Google may display the locality as Montréal-Nord. Keep it only if it is the
same verified Business Profile.

To link a profile managed by the same Google account:

1. Go to **Tools > Shared library > Location manager**.
2. Choose **+ > Our locations > Continue**.
3. Choose **Google Business Profile**.
4. Choose **Select a Business Profile Manager account**.
5. Select the account that owns Oasis Construction.
6. Confirm the business name and address match exactly.
7. Save.

If another email owns it:

1. In the same flow, choose **Request access to another Business Profile
   Manager account**.
2. Enter the owner's email.
3. Have the owner approve the request.
4. Return to Google Ads and confirm the location syncs.

The address asset does not change the campaign's 13 targeted service areas.

### 5.5 Add useful campaign assets

Add these sitelinks at campaign level:

| Sitelink text         | Final URL                                |
| --------------------- | ---------------------------------------- |
| `Service de pavé uni` | `https://oasis-construction.ca/pave-uni` |
| `Nos projets`         | `https://oasis-construction.ca/projets`  |
| `Secteurs desservis`  | `https://oasis-construction.ca/secteurs` |
| `Nous joindre`        | `https://oasis-construction.ca/contact`  |

Add these callouts:

```text
Évaluation gratuite
Devis transparent
Réparation ciblée
Laval et Rive-Nord
```

Do not add ratings, project counts, licence claims, warranty claims or years
in business as assets because those facts have not been supplied in writing.

### 5.6 Review billing and potential spend

1. Go to **Billing > Summary**.
2. Confirm the payment method says active.
3. Confirm the account currency is CAD.
4. Confirm there is no overdue balance or billing suspension.
5. Confirm all old campaigns remain paused.
6. Confirm the owner understands:
   - Average daily budget: CA$50.
   - Possible high-traffic day: up to CA$100 for most campaigns.
   - Approximate full-month charging limit: CA$1,520.

### 5.7 Review the complete campaign before enabling it

Check every item:

- [ ] Campaign name is exact.
- [ ] Campaign type is Search, not Smart or Performance Max.
- [ ] Campaign is still paused.
- [ ] Final URL opens the paid landing page.
- [ ] Both ads use only verified copy.
- [ ] The primary phone country is Canada.
- [ ] The number is `(438) 505-4846`.
- [ ] The existing Business Profile is linked without duplication.
- [ ] Language is French only.
- [ ] Only the 13 intended municipalities are targeted.
- [ ] Location option is Presence.
- [ ] Display Network and Search Partners are off.
- [ ] Keywords are Exact and Phrase only.
- [ ] Campaign-level negatives are present.
- [ ] Average daily budget is CA$50.
- [ ] Billing is active and in CAD.
- [ ] The production form delivered a real test lead.
- [ ] GTM is published.
- [ ] `form_lead` fired the Google Ads conversion exactly once.
- [ ] Direct and refreshed `/merci` visits did not fire the conversion.
- [ ] `Website - Qualified Lead` is the only bidding goal.
- [ ] No old campaign is enabled.

### Phase 5 completion check

- [ ] Both responsive Search ads are saved.
- [ ] Call, location, sitelink and callout assets are added.
- [ ] Billing and maximum expected spend are understood.
- [ ] Google shows no blocking policy or destination error.
- [ ] The final review checklist is complete.

---

## Phase 6 - Launch and monitor

**Launch ETA: 10 to 20 minutes.** Ad review is usually completed within one
business day. The campaign then needs 7 to 14 days to move through its early
learning period.

### 6.1 Enable the campaign

Only after every previous checklist passes:

1. Open **Campaigns**.
2. Find `FR - Réparation pavé uni - Laval et Rive-Nord`.
3. Click the status dot.
4. Choose **Enable**.
5. Confirm every old campaign remains paused.
6. Record the launch date and time in the private setup notes.
7. Check the ad status. `Under review` is normal initially.

If the ad is disapproved, leave the campaign paused while fixing the stated
policy issue. Do not repeatedly edit approved copy because each edit restarts
review.

### 6.2 First 24 hours

**ETA: 10 to 20 minutes of review.**

Check:

- Campaign and ads are Eligible or Under review, not Disapproved.
- Billing has no alert.
- The landing page still loads.
- Spend is coming only from the new campaign.
- Click locations are inside the intended territory.
- No unexpected conversion action appears in the Conversions column.

Do not change bidding, budget or keywords because of one click.

### 6.3 Days 2 to 7

**ETA: 10 to 20 minutes per day.**

Each day review:

1. **Campaigns > Insights & reports > Search terms**.
2. Search terms that spent money.
3. Cost by location.
4. Calls received.
5. Accepted `Website - Qualified Lead` conversions.
6. Actual lead emails received by the business.
7. Cost per accepted lead.

Actions allowed during the first week:

- Add clearly irrelevant search terms as negative keywords.
- Pause a disapproved or broken asset.
- Fix a broken URL, delivery failure or tracking failure immediately.
- Pause the whole campaign if leads are not being delivered.

Actions to avoid during the learning period:

- Large budget changes.
- Adding broad match.
- Setting an unproven target CPA.
- Changing the primary conversion goal.
- Rewriting ads after every click.
- Enabling Display Network or Search Partners without a separate test.

### 6.4 End of week 1

**ETA: 30 to 45 minutes.**

Prepare this report:

| Metric                          | Record |
| ------------------------------- | ------ |
| Spend                           | CA$    |
| Clicks                          | Number |
| Accepted website leads          | Number |
| Qualified calls                 | Number |
| Cost per accepted lead          | CA$    |
| Search terms excluded           | List   |
| Locations with irrelevant spend | List   |
| Form delivery failures          | Number |

Compare Google Ads conversions to the lead emails. Investigate any mismatch
before optimizing bids.

### 6.5 End of days 14 to 30

**ETA: 45 to 60 minutes per review.**

After the early learning period:

1. Review search terms, keywords, devices, hours and matched locations.
2. Keep Exact and Phrase terms that produce accepted leads.
3. Add negatives for repeat irrelevant intent.
4. Consider Search Partners only as a controlled experiment.
5. Consider a target CPA only after enough real lead data exists.
6. Do not assign conversion values until the business supplies a defensible
   qualified-lead value.
7. Do not add other services to this ad group. Build separate campaigns or
   ad groups with their own relevant landing pages when ready.

Optimize toward accepted leads, not page views, button clicks, form starts or
unqualified calls.

---

## Troubleshooting

### The form does not redirect to `/merci`

1. Confirm the form shows a success or delivery error.
2. Check Netlify Function logs for `/api/contact`.
3. Verify `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in
   Netlify Production.
4. Confirm the Resend sending domain is verified.
5. Redeploy after environment-variable changes.
6. Do not launch until a real test email is received.

### Tag Assistant cannot connect

1. Confirm the latest Netlify deploy is Published.
2. Confirm `NEXT_PUBLIC_GTM_ID` starts with `GTM-`.
3. Confirm it is available to the Production build context.
4. Open the live site, not a stale deploy preview.
5. Temporarily disable browser extensions that block Tag Assistant during the
   test, then retry.

### The conversion does not fire

1. Confirm the visitor selected Accept in the cookie banner.
2. In Tag Assistant, confirm `consent_update` shows granted values.
3. Confirm `form_lead` appears only after the accepted form.
4. Confirm the conversion tag uses the correct Conversion ID and Label.
5. Confirm its trigger is `CE - form_lead - consent granted`.
6. Confirm the GTM workspace version was published.
7. Confirm no trigger filter contains a spelling or capitalization error.

### The conversion fires twice

1. Pause the campaign until measurement is fixed.
2. Check for a second Google Ads conversion tag in GTM.
3. Check for a hard-coded Google tag outside GTM.
4. Confirm the trigger is the custom event `form_lead`, not `/merci` page
   view.
5. Confirm refreshing `/merci` produces no `form_lead` event.
6. Re-test in Preview before republishing.

### Clicks come from outside the territory

1. Open campaign **Settings > Locations > Location options**.
2. Confirm Target is **Presence: People in or regularly in your targeted
   locations**.
3. Remove Canada, Quebec, Montréal or any radius added accidentally.
4. Review the Matched locations report.
5. Add exclusions only when the report shows a repeat problem.

### Google recommends broad match, Performance Max or a larger area

Dismiss the recommendation for this initial campaign. The deliberate setup
is one focused French Search campaign, Exact and Phrase keywords, precise
local presence targeting and one accepted-lead conversion.

---

## Claims that must not appear in the campaign

Do not advertise any of these until Oasis Construction supplies them in
writing and the website's verified business facts are updated:

- RBQ licence number.
- Licensed or insured claims.
- Insurance provider or coverage.
- Warranty length or terms.
- Google rating or review count.
- Number of completed projects.
- Years in business.
- Guaranteed response time.

The safe, verified selling points are the pavé-uni repair service, Laval and
Rive-Nord territory, diagnostic-first approach, free evaluation, transparent
quote, photo option and primary phone number.

---

## Private setup record

Keep this in a separate private note, not in Git. Fill it during the setup:

```text
Google Ads customer ID:
Google Ads account currency:
Google Ads account time zone:
GTM container ID:
Google Ads conversion ID:
Google Ads conversion label:
Netlify project name:
Business Profile owner email:
Conversion test date/time:
Test lead received by:
GTM published version:
Campaign creation date:
Campaign launch date/time:
Person who approved launch:
```

---

## Official references

- [Create a Search campaign](https://support.google.com/google-ads/answer/9510373?hl=en)
- [Set up website conversions](https://support.google.com/google-ads/answer/16560108?hl=en)
- [Google Ads conversions in Tag Manager](https://support.google.com/tagmanager/answer/6105160?hl=en)
- [Create a custom-event trigger](https://support.google.com/tagmanager/answer/7679219?hl=en)
- [Install a GTM web container](https://support.google.com/tagmanager/answer/14847097?hl=en)
- [Verify and publish GTM tags](https://support.google.com/tagmanager/answer/14842769?hl=en)
- [Advanced location options](https://support.google.com/google-ads/answer/1722038?hl=en)
- [Add negative keywords](https://support.google.com/google-ads/answer/7102995?hl=en)
- [Responsive Search Ads](https://support.google.com/google-ads/answer/7684791?hl=en)
- [Link Google Business Profile location assets](https://support.google.com/google-ads/answer/2404182?hl=en)
- [Create a call asset](https://support.google.com/google-ads/answer/7159409?hl=en)
- [Google Ads spending limits](https://support.google.com/google-ads/answer/10486637?hl=en)
- [Google Ads ad-review timing](https://support.google.com/google-ads/answer/1722120?hl=en)
- [Netlify environment variables](https://docs.netlify.com/build/environment-variables/get-started/)
