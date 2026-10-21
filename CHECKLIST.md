# Launch checklist

Everything below is missing or needs your confirmation. Nothing was invented: where a detail wasn't provided, the site leaves it out.

## 1. Contact details (`js/config.js`)

- [x] `email` (added)
- [x] `whatsappNumber` and `phone` (added; confirm the number is on WhatsApp)
- [ ] `formEndpoint`: connected to FormSubmit. **Send yourself a test message and click "Activate Form" in the email FormSubmit sends** (check spam).
- [ ] `github`
- [x] `linkedin` (added)
- [ ] `resume`: put `resume.pdf` next to `index.html` and set this to `'resume.pdf'`.

## 2. Publishing (see README.md)

- [ ] Repository created, files uploaded, Settings → Pages set to "Deploy from a branch", `main`, `/ (root)`.
- [ ] If the address has a sub-path (`username.github.io/portfolio/`): `<base href="/portfolio/" />` in `404.html`.
- [ ] Once live: the three "Replace in Files" steps for `example.com` and `SITE-URL`, and the `Sitemap:` line in `robots.txt`.

## 3. Project images and links (`projects/*.html`)

Each project now shows the illustration you supplied, labelled "Illustration, not a screenshot", with a caption saying the same on its page. Real screenshots are still worth adding where you have them (README, "Project images"). Add GitHub or demo links and context (e.g. "Personal project", or who it was built for) only once confirmed.

| Project | Image | Real screenshot | GitHub / live demo | Context |
| --- | --- | --- | --- | --- |
| Django E-commerce Platform | Illustration | [ ] needed | [ ] if public | [ ] |
| EPG Excel-to-XML Automation | Illustration | [ ] needed | [ ] if public | [ ] |
| Broadcast Content and Playlist Automation | Illustration | [ ] optional | [ ] if public | [ ] |
| Blackmagic HyperDeck Automation Tool | Illustration | [ ] needed | [ ] if public | [ ] |
| Blackmagic Videohub Controller | Illustration | [ ] needed | [ ] if public | [ ] |
| AsRunLog Processing | Illustration (addresses covered) | [ ] optional | [ ] if public | [ ] |
| Broadcast Tally and LED Control System | Illustration | [ ] photo of the LEDs | [ ] if public | [ ] |
| Live Streaming and Broadcast Operations | Illustration (addresses covered) | not needed | n/a | [ ] |

### Review the illustrations before uploading

- [ ] **Addresses:** `10.139.216.100` (AsRunLog) and `10.139.216.138` plus `239.201.18.15` (Live Streaming) look like real internal network addresses, since the same subnet appears in two separately generated images. The web copies replace them with `namenode`, `encoder` and `multicast`. Your originals are unchanged, so move them out of the site folder before uploading (README, step 2).
- [ ] **Live Streaming** shows a full software dashboard, while its page says this is operational work, not software you developed. It also shows the JioTV logo and stream details from what may be your Jio work; check you're allowed to publish them. Consider a photo of the real setup instead, or no image.
- [ ] **Numbers and features that aren't in the case studies:** e.g. 12,486 log entries and a 3.4-minute processing time (AsRunLog), 24,856 rows (EPG), presets, macros and live previews (Videohub), four decks and batch operations (HyperDeck), DMX control (Tally), and discount codes, reviews and PostgreSQL (e-commerce). Visitors may take them as things the software does.
- [ ] **E-commerce:** if Stellars is the real store, it can be named in the case study. Its checkout shows your name with a sample address and the phone number +91 98765 43210, which is small but legible at full size.
- [ ] **Brand logos:** the Blackmagic Design logo appears on the Videohub and HyperDeck images and the Hadoop logo on the AsRunLog one. Using them as decoration can suggest an endorsement.

## 4. Other content

- [x] `about.html`: portrait photo (added, from images/my.jpeg)
- [ ] `experience.html`, Deuro Broadcast Media and Services: start and end dates (currently "Approx. 1 year").
- [ ] `experience.html`, Video Headend Engineer at Jio Platforms Limited (JioMedia): dates or duration.
- [ ] Link projects to the Deuro role only where the work was done there. None are linked yet.

## 5. Wording to confirm

- **Videohub Controller** lists both Tkinter and CustomTkinter (the brief said "Tkinter or CustomTkinter"). Keep the one you used.
- **Broadcast Content and Playlist Automation** is labelled "Automation and operations", because the brief describes a mix. If it's all software you wrote, change its label to "Software I built" (and its dot class to `kind-dot--built`).
- **Live Streaming and Broadcast Operations** is labelled "Operational experience" and says it isn't software you developed, as the brief asked.
- **Tally and LED Control System** lists Python alongside Arduino and FastLED, as in the brief. Remove it if Python wasn't involved.
- **Skills:** Java, Flask, PostgreSQL, MySQL, Docker, Git, REST APIs and ATEM-related integrations are listed as in the brief but aren't tied to a project. Remove any you wouldn't want to be asked about.
- **Services** are presented as services offered, with a note that they aren't past client projects.

## 6. Final check results

Run on 20 October 2026 (after adding the images) in headless Chromium, against a server that behaves like GitHub Pages (clean URLs, `404.html` with a real 404 status).

- **Pages:** 14 pages (6 main pages and 8 case studies) at 390 px (phone), 820 px (tablet) and 1440 px (desktop). Each returns 200 with one `h1`, its stylesheet and fonts.
- **Console errors and failed requests:** none on any page. The 404 page loads its styles from a deep missing address with no failed requests.
- **Links:** every internal link points to a real file. No empty or `#` links. No external links yet; they appear as you fill in `js/config.js`.
- **HTML:** all 15 pages pass html-validate.
- **Images:** every project image loads on every page at every width, has alt text, and shows its "Illustration, not a screenshot" label. Each case study shows its caption.
- **Responsive layout:** no horizontal overflow on any page at any width. The mobile menu scrolls on short landscape screens.
- **Accessibility:** axe-core (WCAG 2.1 A/AA plus best practices) reports no violations on any page.
- **Interactions,** 160 automated checks, all passing:
  - Mobile menu opens, moves focus inside, locks page scrolling, and closes with Escape (focus returns to the button), a tap outside, choosing a page, or Back.
  - Every project filter shows the right count, updates the address and works from a shared link. All Projects resets. Whole project rows are clickable.
  - Routing-matrix crosspoints update the route, highlights and case-study link.
  - Skip link, previous/next project links and "Discuss" buttons (which pre-select the project type) all work.
  - Contact form, not connected: an empty submit lists 4 errors and focuses the summary, which updates as fields are fixed and jumps to each field. Invalid email, short WhatsApp numbers and short descriptions are flagged. A valid submission says it wasn't sent, with no network request and no fake success.
  - With every setting filled in: GitHub, LinkedIn, email, WhatsApp (`wa.me` link) and résumé links appear correctly. The form posts JSON to the endpoint and clears on success; on failure it keeps the text and offers email and WhatsApp.
  - Sub-path deployment (`/portfolio/`): pages, navigation and the 404 page all work with the one documented change.
  - Opened by double-click: pages, navigation, filters and "To add" markers work. Chrome uses the system font here, as noted in the README.
  - Reduced motion turns the animation off. Without JavaScript, all content shows and the filters hide instead of breaking.
- **Matches the React version:** the layout is the same as the React version at desktop and phone widths; project images are new in this version.
- **Page weight:** home page about 130 KB before images (HTML, CSS and JavaScript 24 KB gzipped; fonts 103 KB), about 330 KB once its four project images load. All 16 image files together are 1.5 MB, down from 14.6 MB for the originals.
