# Dev Notes

Internal notes for whoever edits this codebase next. Not linked from any
page and never shipped to the browser — the `.html`/`.css`/`.js` files
themselves are kept comment-free on purpose so nothing here shows up in a
visitor's DevTools/view-source.

## EmailJS setup — two separate accounts

There are **two separate EmailJS accounts** in play, because the free tier
caps out at 2 templates per account:

- **`navillera` account** — owns `service_vc0fhb9` / `template_ljnicp3`.
  Used by `Js_Folder/contact-form.js` for the plain "Send Us an Email"
  forms on about-us.html/FAQs.html.
- **`alertadale@gmail.com` account** — owns `service_ff6chqi` /
  `template_k1boxcg` / its own Public Key. Used by `Js_Folder/cart.js` for
  the order-confirmation email sent from the collection page's cart flow.

Templates, services, and public keys never work across accounts — a
template ID from one account is meaningless when sent through another
account's service/key. That's why `cart.js` calls `emailjs.send()` with an
explicit 4th-argument override (`{ publicKey: EMAILJS_ORDER_PUBLIC_KEY }`)
instead of relying on the page's single global `emailjs.init()` (which
stays pointed at the navillera account for the contact form). Both scripts
run on the same pages without conflict because of that per-call override.

If the Gmail connection on either EmailJS service ever expires (error:
`Gmail_API: Invalid grant`), it has to be reconnected from that specific
account's EmailJS dashboard → Email Services → the Gmail service →
Reconnect Account. This is unrelated to any code change.

The order-confirmation template (`template_k1boxcg`) expects a field
called `items_html`, populated by `buildOrderItemsHtml()` in `cart.js`. It
must be inserted into the template using **triple**-brace Mustache syntax
(`{{{items_html}}}`), not double braces — double braces HTML-escape the
content, which prints the raw `<table>` markup as visible text instead of
rendering it as the photo grid.

## Known cross-browser gotchas already fixed in this codebase

- **Flex child with `overflow-y/x: auto` growing instead of scrolling**:
  a flex item's default `min-width`/`min-height` is `auto`, which lets it
  grow to fit its content instead of respecting the parent's bounds. This
  bit the site three separate times (`.jumpnav-scrollbar`/`.charm-tile` in
  collection.css, `.cart-drawer__items` in cart.css). Fix: explicit
  `min-width: 0;` / `min-height: 0;` on the scrollable flex item itself.
- **`[hidden]` silently overridden**: any rule that sets `display` on an
  element unconditionally (e.g. `.some-class { display: flex; }`) beats
  the browser's default `[hidden] { display: none; }` UA rule, so toggling
  the `hidden` attribute stops working. Fix: add an explicit
  `.some-class[hidden] { display: none; }` rule. Hit this with
  `.collection-toolbar`, `.charm-tile`, and `.cart-order-form`/
  `.cart-drawer__items`.
- **iOS Safari input auto-zoom**: any `<input>`/`<select>`/`<textarea>`
  with a computed `font-size` under 16px makes iOS Safari zoom the whole
  page in when it's tapped. Keep form field font-sizes at `16px` or
  larger (all of them are, as of this note).
- **iOS Safari: horizontally-scrollable element under a `position:
  sticky` ancestor going unscrollable/untouchable**: hit this with the
  jump-nav chip row under `.collection-toolbar`'s sticky positioning.
  Worked around by giving the scrollable element (`.collection-jumpnav`)
  an explicit, definite width on mobile instead of relying on flex-stretch
  to size it, plus `transform: translateZ(0)` to force it onto its own
  compositing layer.
- **Overflow check running before the real webfont loads**: Google Fonts
  are loaded with `display=swap`, so text initially renders in a fallback
  font and swaps to the real one moments later, which can change element
  widths after an overflow check (`scrollWidth` vs `clientWidth`) already
  ran. `collection.js` re-runs that check via `document.fonts.ready`.

## Security note

Nothing in this static site is a real secret — the EmailJS public keys,
service IDs, and template IDs are all meant to be public (same category as
a Stripe *publishable* key), and there's no way to hide them from a static
site's visitors anyway since the browser has to receive them to make the
request. The real EmailJS-side protections are: domain-restrict the
account(s) under Account → Security so the keys only work from the actual
site's origin, and keep reCAPTCHA on for both templates. The one credential
in this whole project that's an actual secret — the Ziina payment API key,
for the separate charm-builder Next.js app — lives only in that app's
server-side code and must never be moved into any client-side file.
