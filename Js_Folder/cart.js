(function () {
    const STORAGE_KEY = 'navillera-cart';

    // Orders, promo codes and online payments go through the charm builder's
    // server, which prices the cart itself from the products in Supabase and
    // emails the shop — prices and names in the browser are never trusted.
    const API = 'https://navillera.vercel.app/api';
    const ZIINA_PAYMENT_ENDPOINT = `${API}/shop-payment-intent`;
    const ORDER_ENDPOINT = `${API}/shop-order`;
    const PROMO_ENDPOINT = `${API}/check-promo`;

    // Spam protection (Js_Folder/human-check.js): set up when the order form first opens.
    const humanCheckTools = window.NavilleraHumanCheck || { honeypotHtml: () => '', mount: () => ({ enabled: false, getToken: () => '', reset() {} }) };
    let humanCheck = null;
    // --------------------------------------------------------------------

    let appliedPromo = null; // { code, percent } once the server accepts a code

    function readCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    let cart = readCart();

    function persist() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
        renderItems();
        updateBadge();
        window.dispatchEvent(new CustomEvent('navillera-cart-updated'));
    }

    function itemKey(item) {
        return `${item.subcollection}::${item.file}`;
    }

    function getQty(key) {
        const item = cart.find(i => itemKey(i) === key);
        return item ? item.qty : 0;
    }

    // `fromEl` (optional) is the tapped charm's picture: a copy of it flies
    // into the cart icon, then the icon bounces (Css_Folder/interactions.css).
    function addToCart(item, fromEl) {
        const key = itemKey(item);
        const existing = cart.find(i => itemKey(i) === key);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        persist();
        showToast(item.label);
        flyToCart(fromEl, bumpCartIcon);
    }

    function bumpCartIcon() {
        const btn = document.getElementById('cartBtn');
        if (!btn) return;
        btn.classList.remove('is-bumped');
        void btn.offsetWidth; // restart the animation on quick repeat taps
        btn.classList.add('is-bumped');
    }

    function flyToCart(fromEl, onArrive) {
        const btn = document.getElementById('cartBtn');
        const from = fromEl && fromEl.getBoundingClientRect();
        const to = btn && btn.getBoundingClientRect();
        if (!from || !to || !from.width || !to.width || !fromEl.animate) { onArrive(); return; }

        const fly = fromEl.cloneNode(true);
        fly.className = 'cart-fly';
        fly.removeAttribute('loading');
        fly.style.left = from.left + 'px';
        fly.style.top = from.top + 'px';
        fly.style.width = from.width + 'px';
        fly.style.height = from.height + 'px';
        document.body.appendChild(fly);

        const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
        const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
        fly.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 60}px) scale(0.75)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.4 },
        ], { duration: 650, easing: 'ease-in-out' }).onfinish = () => {
            fly.remove();
            onArrive();
        };
    }

    function removeFromCart(key) {
        cart = cart.filter(i => itemKey(i) !== key);
        persist();
    }

    function setQty(key, qty) {
        if (qty <= 0) { removeFromCart(key); return; }
        const item = cart.find(i => itemKey(i) === key);
        if (!item) return;
        item.qty = qty;
        persist();
    }

    function cartCount() {
        return cart.reduce((sum, i) => sum + i.qty, 0);
    }

    function cartSubtotal() {
        return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    }

    function cartDiscount() {
        if (!appliedPromo) return 0;
        return cartSubtotal() * appliedPromo.percent;
    }

    function cartTotalAfterDiscount() {
        return Math.max(cartSubtotal() - cartDiscount(), 0);
    }

    // --- Delivery & payment choices (kept in sync with the charm builder's
    // src/components/charmEditor/orderOptions.ts) ---
    const DELIVERY_OPTIONS = [
        { id: 'pickup', method: 'pickup', title: 'Pick up', detail: 'Barsha Heights (Tecom)', fee: 0 },
        { id: 'metro-dic-sat', method: 'metro', title: 'DIC Metro', detail: 'Saturday', fee: 0 },
        { id: 'metro-dic', method: 'metro', title: 'DIC Metro', detail: 'Thursday or Friday', fee: 3 },
        { id: 'metro-moe', method: 'metro', title: 'MOE Metro', detail: 'Thursday or Friday', fee: 6 },
        { id: 'metro-dmcc', method: 'metro', title: 'DMCC Metro', detail: 'Thursday or Friday', fee: 6 },
        { id: 'metro-burjuman', method: 'metro', title: 'Burjuman Metro', detail: 'Thursday or Friday', fee: 9 },
        { id: 'metro-union', method: 'metro', title: 'Union Metro', detail: 'Thursday or Friday', fee: 9 },
        { id: 'home', method: 'home', title: 'Home delivery', detail: 'Anywhere in the UAE (Jeebly)', fee: 20, needsAddress: true },
    ];
    const DELIVERY_METHODS = [
        { method: 'pickup', icon: '🛍️', title: 'Pick up', detail: 'Barsha Heights (Tecom)', price: 'FREE' },
        { method: 'metro', icon: '🚇', title: 'Metro meet-up', detail: 'We meet you at a metro station', price: 'FREE – 9 AED' },
        { method: 'home', icon: '🏠', title: 'Home delivery', detail: 'Anywhere in the UAE (Jeebly)', price: '20 AED' },
    ];
    const PAYMENT_OPTIONS = [
        { id: 'ziina', icon: '💳', title: 'Pay online now (Ziina)', detail: "You'll be redirected to Ziina to pay securely (card, Apple Pay or Google Pay)" },
        { id: 'cod', icon: '💵', title: 'Cash on Delivery', detail: 'Pay in cash when you get your order' },
        { id: 'bank', icon: '🏦', title: 'Bank Transfer', detail: "We'll send our bank details on WhatsApp" },
    ];

    let deliveryMethod = null;   // 'pickup' | 'metro' | 'home'
    let deliveryOptionId = '';   // one of DELIVERY_OPTIONS (metro needs a station picked too)
    let paymentMethod = null;    // one of PAYMENT_OPTIONS

    function getDeliveryOption() {
        return DELIVERY_OPTIONS.find(o => o.id === deliveryOptionId) || null;
    }

    function getDeliveryFee() {
        const option = getDeliveryOption();
        return option ? option.fee : 0;
    }

    function formatFee(fee) {
        return fee === 0 ? 'FREE' : `${fee} AED`;
    }

    function describeDelivery(option, address) {
        if (option.method === 'pickup') return `Pick up: ${option.detail}`;
        if (option.method === 'metro') return `Metro meet-up: ${option.title} (${option.detail})`;
        return `Home delivery (Jeebly) — Address: ${address.trim()}`;
    }

    /** A big tap-to-choose card that behaves like a radio button. */
    function optionCardHtml({ group, value, icon, title, detail, price, disabled }) {
        return `
            <button type="button" class="cart-option" role="radio" aria-checked="false" data-group="${group}" data-value="${value}"${disabled ? ' disabled' : ''}>
                ${icon ? `<span class="cart-option__icon" aria-hidden="true">${icon}</span>` : ''}
                <span class="cart-option__text">
                    <span class="cart-option__title">${title}</span>
                    <span class="cart-option__detail">${detail}</span>
                </span>
                ${price ? `<span class="cart-option__price${price === 'FREE' ? ' cart-option__price--free' : ''}">${price}</span>` : ''}
                <span class="cart-option__check" aria-hidden="true"></span>
            </button>`;
    }

    let overlayEl, drawerEl, itemsEl, emptyMsgEl, summaryEl;
    let subtotalValueEl, summaryTotalValueEl;
    let formEl, statusEl, deliveryFeeValueEl, totalValueEl;
    let promoInputEl, promoApplyBtnEl, promoMsgEl, discountRowEl, discountValueEl;
    let formDiscountRowEl, formDiscountValueEl;

    function buildDrawer() {
        overlayEl = document.createElement('div');
        overlayEl.className = 'cart-overlay';
        overlayEl.id = 'cartOverlay';

        drawerEl = document.createElement('aside');
        drawerEl.className = 'cart-drawer';
        drawerEl.setAttribute('aria-label', 'Shopping cart');
        drawerEl.innerHTML = `
            <div class="cart-drawer__header">
                <h2>My Cart</h2>
                <button type="button" class="cart-drawer__close" id="cartCloseBtn" aria-label="Close cart">&times;</button>
            </div>

            <div class="cart-drawer__items" id="cartItems"></div>
            <p class="cart-drawer__empty" id="cartEmptyMsg" hidden>
                Your cart is empty — browse the <a href="collection.html?category=links">charm collection</a> to add some.
            </p>

            <div class="cart-drawer__summary" id="cartSummary">
                <h3 class="cart-form__totals-heading">Price Details</h3>
                <div class="cart-drawer__row"><span>Total Product Price</span><span id="cartSubtotalValue">0.00 AED</span></div>

                <div class="cart-promo">
                    <input type="text" id="cartPromoInput" class="cart-promo__input" placeholder="Promo code" autocomplete="off">
                    <button type="button" class="cart-promo__btn" id="cartPromoApplyBtn">Apply</button>
                </div>
                <p class="cart-promo__msg" id="cartPromoMsg" role="status" aria-live="polite"></p>

                <div class="cart-drawer__row cart-drawer__row--discount" id="cartDiscountRow" hidden>
                    <span>Discount</span><span id="cartDiscountValue">-0.00 AED</span>
                </div>

                <div class="cart-drawer__row cart-drawer__row--total"><span>Order Total</span><span id="cartSummaryTotalValue">0.00 AED</span></div>
                <div class="cart-actions">
                    <button type="button" class="cart-btn cart-btn--secondary" id="cartBackBtn">Back</button>
                    <button type="button" class="cart-btn cart-btn--primary" id="cartProceedBtn">Proceed Order</button>
                </div>
            </div>

            <form class="cart-order-form" id="cartOrderForm" novalidate hidden>
                <p class="cart-form__intro">Just 3 easy steps ✨</p>

                <section class="cart-step">
                    <h3 class="cart-step__heading"><span class="cart-step__num">1</span>Your details</h3>
                    <label class="cart-form__label">Email address
                        <input type="email" name="email" class="cart-form__input" placeholder="you@example.com" autocomplete="email" required>
                    </label>
                    <label class="cart-form__label">Mobile number (WhatsApp)
                        <input type="tel" name="phone" class="cart-form__input" placeholder="971 5X XXX XXXX" inputmode="numeric" autocomplete="tel" required>
                        <span class="cart-form__hint">We'll message you on WhatsApp 💬</span>
                    </label>
                    <label class="cart-form__label">Your name
                        <input type="text" name="name" class="cart-form__input" autocomplete="name" required>
                    </label>
                </section>

                <section class="cart-step">
                    <h3 class="cart-step__heading"><span class="cart-step__num">2</span>How do you want to get it?</h3>
                    <div class="cart-options" role="radiogroup" aria-label="Delivery option">
                        ${DELIVERY_METHODS.map(m => optionCardHtml({ group: 'method', value: m.method, icon: m.icon, title: m.title, detail: m.detail, price: m.price })).join('')}
                        ${optionCardHtml({ group: 'method', value: 'international', icon: '✈️', title: 'International shipping', detail: 'Coming soon', disabled: true })}
                    </div>

                    <div class="cart-suboptions" id="cartMetroStations" hidden>
                        <span class="cart-form__label">Pick a metro station</span>
                        <div class="cart-options" role="radiogroup" aria-label="Metro station">
                            ${DELIVERY_OPTIONS.filter(o => o.method === 'metro').map(o => optionCardHtml({ group: 'station', value: o.id, title: o.title, detail: o.detail, price: formatFee(o.fee) })).join('')}
                        </div>
                    </div>

                    <label class="cart-form__label" id="cartAddressField" hidden>Your home address
                        <textarea name="address" class="cart-form__input cart-form__textarea" placeholder="Building, street, area, emirate"></textarea>
                    </label>
                </section>

                <section class="cart-step">
                    <h3 class="cart-step__heading"><span class="cart-step__num">3</span>How do you want to pay?</h3>
                    <div class="cart-options" role="radiogroup" aria-label="Payment option">
                        ${PAYMENT_OPTIONS.map(p => optionCardHtml({ group: 'payment', value: p.id, icon: p.icon, title: p.title, detail: p.detail })).join('')}
                    </div>
                </section>

                <label class="cart-form__label"><span>Anything else? <span class="cart-form__optional">(optional)</span></span>
                    <textarea name="notes" class="cart-form__input cart-form__textarea" placeholder="e.g. a gift message"></textarea>
                </label>

                <p class="cart-form__note">📱 <strong>Note:</strong> Further details will be sent to your WhatsApp number.</p>

                <div class="cart-form__totals">
                    <h3 class="cart-form__totals-heading">Price Details</h3>
                    <div class="cart-drawer__row"><span>Charms</span><span id="cartFormSubtotal">0.00 AED</span></div>
                    <div class="cart-drawer__row cart-drawer__row--discount" id="cartFormDiscountRow" hidden><span>Discount</span><span id="cartFormDiscountValue">-0.00 AED</span></div>
                    <div class="cart-drawer__row"><span>Delivery</span><span id="cartDeliveryFeeValue">—</span></div>
                    <div class="cart-drawer__row cart-drawer__row--total"><span>Total to pay</span><span id="cartTotalValue">0.00 AED</span></div>
                </div>

                ${humanCheckTools.honeypotHtml()}
                <div id="cartHumanCheck"></div>

                <p class="cart-order-status" id="cartOrderStatus" role="status" aria-live="polite"></p>
                <div class="cart-actions">
                    <button type="button" class="cart-btn cart-btn--secondary" id="cartFormBackBtn">Back</button>
                    <button type="submit" class="cart-btn cart-btn--primary" id="cartFormSubmitBtn">Place my order</button>
                </div>
            </form>
        `;

        document.body.appendChild(overlayEl);
        document.body.appendChild(drawerEl);
        buildToast();

        itemsEl = drawerEl.querySelector('#cartItems');
        emptyMsgEl = drawerEl.querySelector('#cartEmptyMsg');
        summaryEl = drawerEl.querySelector('#cartSummary');
        subtotalValueEl = drawerEl.querySelector('#cartSubtotalValue');
        summaryTotalValueEl = drawerEl.querySelector('#cartSummaryTotalValue');
        formEl = drawerEl.querySelector('#cartOrderForm');
        statusEl = drawerEl.querySelector('#cartOrderStatus');
        deliveryFeeValueEl = drawerEl.querySelector('#cartDeliveryFeeValue');
        totalValueEl = drawerEl.querySelector('#cartTotalValue');
        promoInputEl = drawerEl.querySelector('#cartPromoInput');
        promoApplyBtnEl = drawerEl.querySelector('#cartPromoApplyBtn');
        promoMsgEl = drawerEl.querySelector('#cartPromoMsg');
        discountRowEl = drawerEl.querySelector('#cartDiscountRow');
        discountValueEl = drawerEl.querySelector('#cartDiscountValue');
        formDiscountRowEl = drawerEl.querySelector('#cartFormDiscountRow');
        formDiscountValueEl = drawerEl.querySelector('#cartFormDiscountValue');

        overlayEl.addEventListener('click', closeDrawer);
        drawerEl.querySelector('#cartCloseBtn').addEventListener('click', closeDrawer);
        drawerEl.querySelector('#cartBackBtn').addEventListener('click', closeDrawer);
        drawerEl.querySelector('#cartProceedBtn').addEventListener('click', showOrderForm);
        drawerEl.querySelector('#cartFormBackBtn').addEventListener('click', hideOrderForm);
        formEl.addEventListener('click', handleOptionClick);
        formEl.querySelector('input[name="phone"]').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 15);
        });
        formEl.addEventListener('submit', handleOrderSubmit);
        promoApplyBtnEl.addEventListener('click', applyPromoCode);
        promoInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); applyPromoCode(); }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawerEl.classList.contains('is-open')) closeDrawer();
        });
    }

    /** Asks the server about the code (Supabase). "First order only" is checked again when ordering. */
    function applyPromoCode() {
        const code = (promoInputEl.value || '').trim().toUpperCase();
        if (!code) {
            promoMsgEl.textContent = 'Enter a promo code.';
            promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error';
            return;
        }

        promoApplyBtnEl.disabled = true;
        fetch(PROMO_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })
            .then(res => res.json().catch(() => ({ success: false })))
            .then(result => {
                if (!result.success) {
                    appliedPromo = null;
                    promoMsgEl.textContent = result.error || "That code isn't valid.";
                    promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error';
                } else {
                    appliedPromo = { code: result.code, percent: result.percent };
                    promoMsgEl.textContent = `"${result.code}" applied — ${Math.round(result.percent * 100)}% off!`;
                    promoMsgEl.className = 'cart-promo__msg cart-promo__msg--success';
                }
                renderItems();
            })
            .catch(() => {
                promoMsgEl.textContent = "We couldn't check the code right now — please try again.";
                promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error';
            })
            .finally(() => { promoApplyBtnEl.disabled = false; });
    }

    /** The server turned the code down when ordering: take it off, so the next try goes through without it. */
    function dropPromo(message) {
        appliedPromo = null;
        if (promoInputEl) promoInputEl.value = '';
        if (promoMsgEl) { promoMsgEl.textContent = message; promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error'; }
        renderItems();
    }

    function renderItems() {
        if (!itemsEl) return;
        itemsEl.innerHTML = '';

        const isEmpty = cart.length === 0;
        emptyMsgEl.hidden = !isEmpty;
        summaryEl.hidden = isEmpty;

        cart.forEach(item => {
            const key = itemKey(item);
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <button type="button" class="cart-item__remove" aria-label="Remove ${item.label}">&times;</button>
                <div class="cart-item__thumb">${item.img ? `<img src="${item.img}" alt="" loading="lazy" decoding="async">` : ''}</div>
                <div class="cart-item__info">
                    <span class="cart-item__label">${item.label}</span>
                    <span class="cart-item__sub">${item.subcollection}</span>
                    <div class="cart-item__qty-row">
                        <span class="cart-item__qty-text">Qty:</span>
                        <button type="button" class="cart-item__qty-btn" data-action="dec">&minus;</button>
                        <span class="cart-item__qty-value">${item.qty}</span>
                        <button type="button" class="cart-item__qty-btn" data-action="inc">+</button>
                    </div>
                    <span class="cart-item__price">${(item.price * item.qty).toFixed(2)} AED</span>
                </div>
            `;
            row.querySelector('[data-action="dec"]').addEventListener('click', () => setQty(key, item.qty - 1));
            row.querySelector('[data-action="inc"]').addEventListener('click', () => setQty(key, item.qty + 1));
            row.querySelector('.cart-item__remove').addEventListener('click', () => removeFromCart(key));
            itemsEl.appendChild(row);
        });

        const subtotal = cartSubtotal();
        const discount = cartDiscount();
        if (subtotalValueEl) subtotalValueEl.textContent = `${subtotal.toFixed(2)} AED`;
        if (discountRowEl) discountRowEl.hidden = discount <= 0;
        if (discountValueEl) discountValueEl.textContent = `-${discount.toFixed(2)} AED`;
        if (summaryTotalValueEl) summaryTotalValueEl.textContent = `${cartTotalAfterDiscount().toFixed(2)} AED`;

        updateFormTotals();
    }

    function updateFormTotals() {
        if (!formEl) return;
        const subtotal = cartSubtotal();
        const discount = cartDiscount();
        const fee = getDeliveryFee();
        const total = cartTotalAfterDiscount() + fee;
        formEl.querySelector('#cartFormSubtotal').textContent = `${subtotal.toFixed(2)} AED`;
        if (formDiscountRowEl) formDiscountRowEl.hidden = discount <= 0;
        if (formDiscountValueEl) formDiscountValueEl.textContent = `-${discount.toFixed(2)} AED`;
        deliveryFeeValueEl.textContent = getDeliveryOption() ? formatFee(fee) : '—';
        totalValueEl.textContent = `${total.toFixed(2)} AED`;
        const submitBtn = document.getElementById('cartFormSubmitBtn');
        if (submitBtn && !submitBtn.disabled) submitBtn.textContent = paymentMethod === 'ziina' ? 'Continue to payment' : 'Place my order';
    }

    function handleOptionClick(e) {
        const card = e.target.closest('.cart-option');
        if (!card || card.disabled) return;
        const { group, value } = card.dataset;
        if (group === 'method') {
            deliveryMethod = value;
            deliveryOptionId = value === 'metro' ? '' : DELIVERY_OPTIONS.find(o => o.method === value).id;
        } else if (group === 'station') {
            deliveryOptionId = value;
        } else if (group === 'payment') {
            paymentMethod = value;
        }
        updateDeliveryUI();
    }

    /** Syncs the option cards, the metro/address/date fields that depend on them, and the totals. */
    function updateDeliveryUI() {
        if (!formEl) return;
        const option = getDeliveryOption();
        const selectedFor = { method: deliveryMethod, station: deliveryOptionId, payment: paymentMethod };
        formEl.querySelectorAll('.cart-option').forEach(card => {
            card.setAttribute('aria-checked', String(selectedFor[card.dataset.group] === card.dataset.value));
        });

        formEl.querySelector('#cartMetroStations').hidden = deliveryMethod !== 'metro';
        formEl.querySelector('#cartAddressField').hidden = !(option && option.needsAddress);
        updateFormTotals();
    }

    function resetOrderChoices() {
        deliveryMethod = null;
        deliveryOptionId = '';
        paymentMethod = null;
        updateDeliveryUI();
    }

    /** Plain-language reason the form can't be sent yet, or null when it's complete. */
    function findMissingStep(data) {
        const option = getDeliveryOption();
        if (!data.email || !data.phone || !data.name) return 'Please fill in your email, WhatsApp number and name (step 1).';
        if (!deliveryMethod) return 'Please choose how you want to get your order (step 2).';
        if (!option) return 'Please choose a metro station (step 2).';
        if (option.needsAddress && !(data.address || '').trim()) return 'Please type your home address (step 2).';
        if (!paymentMethod) return 'Please choose how you want to pay (step 3).';
        if (humanCheck && humanCheck.enabled && !humanCheck.getToken()) return 'Please tick the "I\'m human" check.';
        return null;
    }

    function updateBadge() {
        const btn = document.getElementById('cartBtn');
        if (!btn) return;
        let badge = btn.querySelector('.cart-badge');
        const count = cartCount();

        if (count === 0) {
            if (badge) badge.remove();
            return;
        }

        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            btn.appendChild(badge);
        }
        badge.textContent = count > 99 ? '99+' : String(count);
    }

    function openDrawer() {
        overlayEl.classList.add('is-active');
        drawerEl.classList.add('is-open');
        document.body.classList.add('cart-open');
    }

    let toastEl, toastLabelEl, toastHideTimer;

    function buildToast() {
        toastEl = document.createElement('div');
        toastEl.className = 'cart-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        toastEl.innerHTML = `
            <span class="cart-toast__check" aria-hidden="true">&check;</span>
            <span class="cart-toast__text">Added <strong id="cartToastLabel"></strong> to cart</span>
            <button type="button" class="cart-toast__view-btn" id="cartToastViewBtn">View Cart</button>
        `;
        document.body.appendChild(toastEl);
        toastLabelEl = toastEl.querySelector('#cartToastLabel');
        toastEl.querySelector('#cartToastViewBtn').addEventListener('click', () => {
            hideToast();
            openDrawer();
        });
    }

    function showToast(label) {
        toastLabelEl.textContent = label;
        toastEl.classList.add('is-visible');
        clearTimeout(toastHideTimer);
        toastHideTimer = setTimeout(hideToast, 2500);
    }

    function hideToast() {
        toastEl.classList.remove('is-visible');
        clearTimeout(toastHideTimer);
    }

    function closeDrawer() {
        overlayEl.classList.remove('is-active');
        drawerEl.classList.remove('is-open');
        document.body.classList.remove('cart-open');
        hideOrderForm();
    }

    function showOrderForm() {
        summaryEl.hidden = true;
        itemsEl.hidden = true;
        formEl.hidden = false;
        if (!humanCheck) humanCheck = humanCheckTools.mount(formEl.querySelector('#cartHumanCheck'));
        updateFormTotals();
    }

    function hideOrderForm() {
        formEl.hidden = true;
        itemsEl.hidden = false;
        summaryEl.hidden = cart.length === 0;
        statusEl.textContent = '';
        statusEl.className = 'cart-order-status';
    }

    /** What the server needs for an order; it prices and describes the cart itself. */
    function orderBody(data, option) {
        return {
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address || '',
            notes: data.notes || '',
            deliveryOptionId: option.id,
            paymentMethod,
            promoCode: appliedPromo ? appliedPromo.code : '',
            items: cart.map(i => ({ subcollection: i.subcollection, file: i.file, qty: i.qty })),
            website: data.website || '',
            turnstileToken: humanCheck ? humanCheck.getToken() : '',
        };
    }

    /** Sends the order to the server and returns its answer. Each "I'm human" pass is good for one send. */
    function postOrder(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
            .then(res => res.json().catch(() => ({ success: false, error: 'No answer from the server — please try again.' })))
            .finally(() => { if (humanCheck) humanCheck.reset(); });
    }

    /** The promo code was refused when ordering: say why and take it off. True if that happened. */
    function handlePromoRefused(result) {
        if (!result.promoInvalid) return false;
        dropPromo(result.error);
        statusEl.textContent = `${result.error} The code has been removed — press the button again to continue without it.`;
        statusEl.className = 'cart-order-status cart-order-status--error';
        return true;
    }

    /** Pay online: ask the server for a Ziina payment, then go to Ziina's page. */
    function startZiinaPayment(data, option) {
        const submitBtn = document.getElementById('cartFormSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening Ziina...';
        statusEl.textContent = '';
        statusEl.className = 'cart-order-status';

        const resetButton = () => { submitBtn.disabled = false; submitBtn.textContent = 'Continue to payment'; };
        postOrder(ZIINA_PAYMENT_ENDPOINT, { ...orderBody(data, option), returnPath: window.location.pathname + window.location.search })
            .then(result => {
                if (handlePromoRefused(result)) { resetButton(); return; }
                if (!result.success) throw new Error(result.error || 'Could not start online payment.');
                // The cart stays saved until Ziina confirms the payment, so cancelling keeps it.
                window.location.assign(result.redirect_url);
            })
            .catch(err => {
                console.error('Ziina payment failed to start:', err);
                statusEl.textContent = 'Could not start online payment: ' + err.message;
                statusEl.className = 'cart-order-status cart-order-status--error';
                resetButton();
            });
    }

    /** Back from Ziina (?ziina=success / cancel / failed): show the result and tidy the address bar. */
    function handleZiinaReturn() {
        const params = new URLSearchParams(window.location.search);
        const outcome = params.get('ziina');
        if (!outcome) return;

        params.delete('ziina');
        const query = params.toString();
        window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : '') + window.location.hash);

        const messages = {
            success: ['Payment successful! 🎉', "Thank you! Your order is confirmed. We'll message you on WhatsApp soon."],
            cancel: ['Payment canceled', 'No payment was taken. Your cart is still saved — you can try again, or choose Cash on Delivery or Bank Transfer.'],
            failed: ['Payment failed', 'No payment was taken. Your cart is still saved — please try again or choose another way to pay.'],
        };
        const message = messages[outcome];
        if (!message) return;

        if (outcome === 'success') {
            // Only the webhook confirms the order (after re-checking with Ziina); this just clears the cart.
            cart = [];
            appliedPromo = null;
            persist();
        }

        const modal = document.createElement('div');
        modal.className = 'cart-result';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="cart-result__backdrop"></div>
            <div class="cart-result__box cart-result__box--${outcome}">
                <p class="cart-result__title"></p>
                <p class="cart-result__text"></p>
                <button type="button" class="cart-btn cart-btn--primary cart-result__btn">Close</button>
            </div>`;
        modal.querySelector('.cart-result__title').textContent = message[0];
        modal.querySelector('.cart-result__text').textContent = message[1];
        const close = () => {
            modal.remove();
            if (outcome !== 'success') openDrawer();
        };
        modal.querySelector('.cart-result__btn').addEventListener('click', close);
        modal.querySelector('.cart-result__backdrop').addEventListener('click', close);
        document.body.appendChild(modal);
    }

    function handleOrderSubmit(e) {
        e.preventDefault();

        if (cart.length === 0) return;

        const data = Object.fromEntries(new FormData(formEl).entries());
        const missing = findMissingStep(data);
        if (missing) {
            statusEl.textContent = missing;
            statusEl.className = 'cart-order-status cart-order-status--error';
            return;
        }

        const option = getDeliveryOption();

        if (paymentMethod === 'ziina') {
            startZiinaPayment(data, option);
            return;
        }

        const submitBtn = document.getElementById('cartFormSubmitBtn');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        statusEl.textContent = '';
        statusEl.className = 'cart-order-status';

        postOrder(ORDER_ENDPOINT, orderBody(data, option))
            .then(result => {
                if (handlePromoRefused(result)) return;
                if (!result.success) throw new Error(result.error || 'Something went wrong sending your order.');
                statusEl.textContent = result.orderNumber
                    ? `Thank you! 🎉 Your order #${result.orderNumber} is sent. We'll message you on WhatsApp soon.`
                    : "Thank you! 🎉 Your order is sent. We'll message you on WhatsApp soon.";
                statusEl.className = 'cart-order-status cart-order-status--success';
                cart = [];
                appliedPromo = null;
                if (promoInputEl) promoInputEl.value = '';
                if (promoMsgEl) { promoMsgEl.textContent = ''; promoMsgEl.className = 'cart-promo__msg'; }
                persist();
                formEl.reset();
                resetOrderChoices();
                setTimeout(closeDrawer, 3500);
            })
            .catch((err) => {
                console.error('Order failed to send:', err);
                statusEl.textContent = (err && err.message && err.message !== 'Failed to fetch')
                    ? err.message + ' — or DM us on Instagram.'
                    : 'Something went wrong sending your order — please try again or DM us on Instagram.';
                statusEl.className = 'cart-order-status cart-order-status--error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            });
    }

    /** Prices in a saved cart can be out of date: refresh them from Supabase. */
    function refreshCartFromSupabase() {
        if (!window.NavilleraProducts || cart.length === 0) return;
        window.NavilleraProducts.load().then(rows => {
            if (!rows) return;
            const latest = window.NavilleraProducts.byCartKey(rows);
            let changed = false;
            cart.forEach(item => {
                const now = latest.get(itemKey(item));
                if (now && now.price !== item.price) { item.price = now.price; changed = true; }
            });
            if (changed) persist();
        });
    }

    buildDrawer();
    renderItems();
    updateBadge();

    refreshCartFromSupabase();

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', openDrawer);

    handleZiinaReturn();

    window.NavilleraCart = { add: addToCart, getQty };
})();
