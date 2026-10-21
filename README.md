# Prathamesh Shigwan: portfolio website

A multi-page portfolio in plain HTML, CSS and JavaScript: no frameworks, no build step, no `npm`. Every page is a normal `.html` file you can edit in any text editor and upload to any web host, including GitHub Pages.

## What's in the folder

```
index.html            Home
about.html            About
projects.html         Projects, with category filters
projects/*.html       One case study per project (8)
skills.html           Skills
experience.html       Experience
contact.html          Contact form
404.html              "Page not found"
css/style.css         All styles (colours and fonts at the top)
js/config.js          Your contact details and links: edit this first
js/main.js            Menu, filters, routing matrix, contact form
fonts/                IBM Plex (self-hosted, licence in fonts/OFL.txt)
images/               Favicons and the link-preview image
images/projects/      One illustration per project, at 800 and 1600 px wide
robots.txt, sitemap.xml, .nojekyll
```

All links are relative (`about.html`, `../css/style.css`), so the site works at any address: `username.github.io`, `username.github.io/portfolio/` or your own domain.

## Preview it on your computer

Double-click `index.html`. Everything works, but Chrome blocks web fonts on pages opened as files, so text uses your system font.

To see it exactly as it will look online, start a small local server in this folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. (VS Code's "Live Server" extension does the same.)

Missing details (GitHub, résumé) are simply left out until you add them to `js/config.js`.

## 1. Add your contact details

Open `js/config.js` and fill in what you have: email, WhatsApp number, GitHub, LinkedIn, résumé and the form endpoint. Anything left as `''` is hidden on the live site, so there are never broken links.

- **WhatsApp:** digits only, country code first (`91` followed by your number). The site builds the `wa.me` link and pre-fills the message from `whatsappMessage`.
- **Résumé:** put the PDF next to `index.html` and set `resume: 'resume.pdf'`.
- **Contact form:** see below.

## 2. Contact form

The form is connected to FormSubmit (formsubmit.co), a free service that emails each message to prathameshshigwan222@gmail.com, with the visitor's email as the reply-to address.

**One-time activation:** the first message anyone sends, including a test from you, triggers an email from FormSubmit asking you to confirm. Click **Activate Form** in it. Until then the form tells the sender their message wasn't delivered and offers email and WhatsApp buttons instead. After activation, every message arrives in your inbox. Check your spam folder for the activation email and the first few messages.

To use another service, change `formEndpoint` in `js/config.js`. Any endpoint that accepts a JSON `POST` and answers with a 2xx status works (for example Formspree's `https://formspree.io/f/…`). Fields sent: `name`, `business`, `email`, `whatsapp`, `projectType`, `message`, `_subject` and `_template`. A hidden field catches simple spam bots before anything is sent.

## 3. Publish on GitHub Pages

GitHub Pages is free for public repositories. With a private repository it needs a paid GitHub plan (the site itself is public either way).

1. On GitHub, create a new repository:
   - name it `yourusername.github.io` for the address `https://yourusername.github.io`, or
   - give it any name, such as `portfolio`, for `https://yourusername.github.io/portfolio/`.
2. First move your original PNG images out of `images/` to a folder outside the site. The site doesn't use them (it uses the smaller copies in `images/projects/`), they add 15 MB, and two of them show network addresses that the web copies cover up. If you use git, `.gitignore` already leaves them out.
3. Upload the **contents** of this folder (not the folder itself), so `index.html` sits at the top of the repository. Either drag the files onto the repository page ("Add file" → "Upload files", including the `css`, `js`, `fonts`, `images` and `projects` folders), or use git:
   ```bash
   git init
   git add .
   git commit -m "Portfolio website"
   git branch -M main
   git remote add origin https://github.com/yourusername/REPOSITORY.git
   git push -u origin main
   ```
4. In the repository, open **Settings → Pages**. Under "Build and deployment", set **Source** to "Deploy from a branch", choose **main** and **/ (root)**, then **Save**.
5. After a minute or two the address appears at the top of that page.

**If you used a sub-path** (a repository named anything other than `yourusername.github.io`), make one change: in `404.html`, change `<base href="/" />` to `<base href="/portfolio/" />` (your repository name between slashes). Everything else works as it is.

**Own domain:** in Settings → Pages → Custom domain, enter it and follow GitHub's DNS instructions, then tick "Enforce HTTPS". Keep `404.html` at `<base href="/" />`.

To update the site later, edit the files and upload or push them again.

## 4. When the site is live

Each page has link-preview tags (canonical link, page address and preview image) that need the final address, so they're switched off until you know it. In VS Code, use **Edit → Replace in Files** across the whole folder:

1. Replace `https://example.com` with your address, without a trailing slash (for example `https://yourusername.github.io` or `https://yourusername.github.io/portfolio`).
2. Replace `<!--SITE-URL ` with nothing.
3. Replace ` SITE-URL-->` with nothing.

Then in `robots.txt`, remove the `# ` in front of the `Sitemap:` line. Step 1 also fixes the addresses in `sitemap.xml`.

Check the result by sending a page link to yourself on WhatsApp, or with LinkedIn's Post Inspector. Optionally add the site to Google Search Console and submit `sitemap.xml`.

## Editing content

Text lives directly in the HTML files. Search the folder for the words you want to change.

A project's title and summary appear in several places. When you change one, search the folder for its old title. It appears in:

- its own page in `projects/`
- `projects.html`
- `index.html`, if it's one of the four featured projects, and in the routing-matrix button's `data-title` and `data-summary`
- the "Previous project" and "Next project" links on its neighbours' pages
- "See:", "Used in:" and "Related past work" links on `about.html`, `skills.html` and `index.html`

**Adding a project:** copy an existing file in `projects/`, edit it, copy a `<li class="project-row">` block in `projects.html` and point it at the new file. Update the filter counts in `projects.html` if needed (the number in each button's `aria-label` and in `<span class="filter-count">`).

**Project images:** each project shows a concept illustration from `images/projects/` (`<project>-800.webp` and `<project>-1600.webp`). Because these are illustrations rather than screenshots, each one carries an "Illustration, not a screenshot" label, and its case-study page has a caption saying the same. Keep both while an illustration is in use.

To swap an illustration for a real screenshot:

1. Export the screenshot as WebP at 800 and 1600 px wide, cropped to 16:9 (for example with Squoosh, or `cwebp -q 80 -resize 1600 0 in.png -o out.webp`), and overwrite that project's two files.
2. In the project's page, `projects.html`, and `index.html` if it's featured, delete `<span class="shot-label">Illustration, not a screenshot</span>` and rewrite the image's `alt` text to describe the screenshot.
3. In the project's page, change the caption (`<figcaption class="figure-note">`) to describe the screenshot, or delete it.

Before publishing any image, check it shows no internal IP addresses, credentials, client data or confidential employer systems.

**GitHub or demo links, and project context:** each project page has a comment showing the exact HTML to paste in.

**Colours and fonts:** the tokens at the top of `css/style.css`.

## Accessibility and performance

- Semantic HTML, one `h1` per page, a skip link and visible keyboard focus throughout.
- The mobile menu, project filters and routing matrix work with the keyboard; Escape closes the menu.
- Form errors are listed at the top of the form, linked to their fields and announced to screen readers.
- `prefers-reduced-motion` turns animations off. Without JavaScript, all content is still readable and the filters hide rather than appearing broken.
- No third-party requests until a form endpoint is set. The home page is about 130 KB before images, and about 330 KB once its four project images have loaded; they load as you scroll.
