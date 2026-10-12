(function () {
    const STORAGE_KEY = 'navillera-cart';
    const EMAILJS_PUBLIC_KEY = '-2tCjwFJUnT97N93w';
    const EMAILJS_SERVICE_ID = 'service_vc0fhb9';

    const EMAILJS_ORDER_SERVICE_ID = 'service_ff6chqi';
    const EMAILJS_ORDER_TEMPLATE_ID = 'template_k1boxcg';
    const EMAILJS_ORDER_PUBLIC_KEY = 'vvg-sBt7pyZ2SOfHk';

    const PROMO_CODES = {
        NEWBABE: 0.05,
    };
    const HAS_ORDERED_KEY = 'navillera-has-ordered';
    // --------------------------------------------------------------------

    let appliedPromo = null; // { code, percent } once a valid code is applied

    function hasOrderedBefore() {
        try { return localStorage.getItem(HAS_ORDERED_KEY) === '1'; } catch { return false; }
    }

    function markAsOrdered() {
        try { localStorage.setItem(HAS_ORDERED_KEY, '1'); } catch {}
    }

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

    function addToCart(item) {
        const key = itemKey(item);
        const existing = cart.find(i => itemKey(i) === key);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        persist();
        showToast(item.label);
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
        { id: 'ziina', icon: '💳', title: 'Pay online (Ziina)', detail: "We'll send you a payment link on WhatsApp" },
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

        if (hasOrderedBefore()) {
            promoInputEl.disabled = true;
            promoInputEl.placeholder = 'New customers only';
            promoApplyBtnEl.disabled = true;
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawerEl.classList.contains('is-open')) closeDrawer();
        });
    }

    function applyPromoCode() {
        const code = (promoInputEl.value || '').trim().toUpperCase();

        if (hasOrderedBefore()) {
            appliedPromo = null;
            promoMsgEl.textContent = "This code is for new customers only — looks like you've already placed an order from this device.";
            promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error';
            renderItems();
            return;
        }

        if (!code) {
            promoMsgEl.textContent = 'Enter a promo code.';
            promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error';
            return;
        }

        const percent = PROMO_CODES[code];
        if (percent === undefined) {
            appliedPromo = null;
            promoMsgEl.textContent = "That code isn't valid.";
            promoMsgEl.className = 'cart-promo__msg cart-promo__msg--error';
            renderItems();
            return;
        }

        appliedPromo = { code, percent };
        promoMsgEl.textContent = `"${code}" applied — ${Math.round(percent * 100)}% off!`;
        promoMsgEl.className = 'cart-promo__msg cart-promo__msg--success';
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
        updateFormTotals();
    }

    function hideOrderForm() {
        formEl.hidden = true;
        itemsEl.hidden = false;
        summaryEl.hidden = cart.length === 0;
        statusEl.textContent = '';
        statusEl.className = 'cart-order-status';
    }

    function buildOrderItemsHtml(discount, promoCode) {
        const cards = cart.map(item => `
            <tr><td style="padding:0 0 10px;">
                <table style="width:100%; border-collapse:collapse; background:#f7f9fc; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="width:72px; padding:12px;">
                            ${item.img
                                ? `<img src="${item.img}" alt="${item.label}" width="60" height="60" style="width:60px;height:60px;object-fit:contain;border-radius:8px;background:#ffffff;display:block;">`
                                : `<div style="width:60px;height:60px;border-radius:8px;background:#e9edf3;"></div>`
                            }
                        </td>
                        <td style="padding:12px 12px 12px 0; font-family:Arial,sans-serif; color:#1a2a44;">
                            <div style="font-size:16px; font-weight:bold;">${item.label}</div>
                            <div style="font-size:12px; color:#6b7a90; margin-top:2px;">${item.subcollection}</div>
                            <div style="font-size:13px; margin-top:6px;">Qty: ${item.qty} &middot; ${item.price.toFixed(2)} AED each</div>
                        </td>
                        <td style="padding:12px; font-family:Arial,sans-serif; font-size:15px; font-weight:bold; color:#1a2a44; text-align:right; white-space:nowrap; vertical-align:middle;">
                            ${(item.price * item.qty).toFixed(2)} AED
                        </td>
                    </tr>
                </table>
            </td></tr>
        `).join('');

        const discountRow = discount > 0 ? `
            <tr><td style="padding:0 0 10px;">
                <table style="width:100%; border-collapse:collapse; background:#e9f7ee; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="padding:12px; font-family:Arial,sans-serif; color:#2e7d4f;">
                            <div style="font-size:15px; font-weight:bold;">Promo code applied: ${promoCode}</div>
                        </td>
                        <td style="padding:12px; font-family:Arial,sans-serif; font-size:15px; font-weight:bold; color:#2e7d4f; text-align:right; white-space:nowrap;">
                            -${discount.toFixed(2)} AED
                        </td>
                    </tr>
                </table>
            </td></tr>
        ` : '';

        return `<table style="width:100%; border-collapse:collapse;">${cards}${discountRow}</table>`;
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
        const payment = PAYMENT_OPTIONS.find(p => p.id === paymentMethod).title;
        const subtotal = cartSubtotal();
        const discount = cartDiscount();
        const fee = getDeliveryFee();
        const total = cartTotalAfterDiscount() + fee;

        if (typeof emailjs === 'undefined' || EMAILJS_ORDER_TEMPLATE_ID === 'YOUR_ORDER_TEMPLATE_ID') {
            statusEl.textContent = "Order requests aren't connected yet — please DM us on Instagram instead.";
            statusEl.className = 'cart-order-status cart-order-status--error';
            return;
        }

        const submitBtn = document.getElementById('cartFormSubmitBtn');
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        statusEl.textContent = '';
        statusEl.className = 'cart-order-status';

        emailjs.send(EMAILJS_ORDER_SERVICE_ID, EMAILJS_ORDER_TEMPLATE_ID, {
            to_email: 'navilleracharmstudio@gmail.com',
            customer_name: data.name,
            phone: data.phone,
            customer_email: data.email,
            pickup_time: '',
            meetup_place: describeDelivery(option, data.address || ''),
            delivery_date: 'To be arranged on WhatsApp',
            payment_method: payment,
            subtotal: subtotal.toFixed(2),
            promo_code: appliedPromo ? appliedPromo.code : 'None',
            discount: discount.toFixed(2),
            delivery_fee: fee.toFixed(2),
            total: total.toFixed(2),
            // Payment is repeated in the notes so it shows even in a template without {{payment_method}}.
            notes: data.notes ? `Payment: ${payment}\n${data.notes}` : `Payment: ${payment}`,
            items_html: buildOrderItemsHtml(discount, appliedPromo ? appliedPromo.code : ''),
        }, { publicKey: EMAILJS_ORDER_PUBLIC_KEY })
            .then(() => {
                statusEl.textContent = "Thank you! 🎉 Your order is sent. We'll message you on WhatsApp soon.";
                statusEl.className = 'cart-order-status cart-order-status--success';
                cart = [];
                appliedPromo = null;
                markAsOrdered();
                if (promoInputEl) { promoInputEl.value = ''; promoInputEl.disabled = true; promoInputEl.placeholder = 'New customers only'; }
                if (promoApplyBtnEl) promoApplyBtnEl.disabled = true;
                if (promoMsgEl) { promoMsgEl.textContent = ''; promoMsgEl.className = 'cart-promo__msg'; }
                persist();
                formEl.reset();
                resetOrderChoices();
                setTimeout(closeDrawer, 3500);
            })
            .catch((err) => {
                console.error('Order email failed:', err);
                statusEl.textContent = 'Something went wrong sending your order — please try again or DM us on Instagram.';
                statusEl.className = 'cart-order-status cart-order-status--error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            });
    }

    buildDrawer();
    renderItems();
    updateBadge();

    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', openDrawer);

    window.NavilleraCart = { add: addToCart, getQty };
})();
