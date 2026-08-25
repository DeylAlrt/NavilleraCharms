(function () {
    const STORAGE_KEY = 'navillera-cart';
    const EMAILJS_PUBLIC_KEY = '-2tCjwFJUnT97N93w';
    const EMAILJS_SERVICE_ID = 'service_vc0fhb9';

    const EMAILJS_ORDER_SERVICE_ID = 'service_ff6chqi';
    const EMAILJS_ORDER_TEMPLATE_ID = 'template_k1boxcg';
    const EMAILJS_ORDER_PUBLIC_KEY = 'vvg-sBt7pyZ2SOfHk';

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

    function getDeliveryFee(place) {
        if (!place) return 0;
        if (place.includes('Mall of the Emirates Metro') || place.includes('DMCC Metro')) return 5;
        if (place.includes('Union Metro') || place.includes('Burjuman Metro')) return 10;
        if (place.includes('Dubai: 20 AED')) return 20;
        if (place.includes('Other Emirates: 25 AED')) return 25;
        return 0;
    }

    let overlayEl, drawerEl, itemsEl, emptyMsgEl, summaryEl;
    let subtotalValueEl, summaryTotalValueEl;
    let formEl, statusEl, deliveryFeeValueEl, totalValueEl;

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
                <div class="cart-drawer__row cart-drawer__row--total"><span>Order Total</span><span id="cartSummaryTotalValue">0.00 AED</span></div>
                <div class="cart-actions">
                    <button type="button" class="cart-btn cart-btn--secondary" id="cartBackBtn">Back</button>
                    <button type="button" class="cart-btn cart-btn--primary" id="cartProceedBtn">Proceed Order</button>
                </div>
            </div>

            <form class="cart-order-form" id="cartOrderForm" hidden>
                <h3>Order Details</h3>

                <label class="cart-form__label">Name
                    <input type="text" name="name" class="cart-form__input" required>
                </label>

                <label class="cart-form__label">Phone
                    <input type="tel" name="phone" class="cart-form__input" placeholder="971XXXXXXXXX" required>
                </label>

                <label class="cart-form__label">Email <span class="cart-form__optional">(optional)</span>
                    <input type="email" name="email" class="cart-form__input" placeholder="you@example.com">
                </label>

                <label class="cart-form__label">Pickup Time
                    <select name="pickupTime" class="cart-form__input" required>
                        <option value="">Select time</option>
                        <option value="Weekdays: 6PM - 8PM">Weekdays: 6PM - 8PM</option>
                        <option value="Weekends: 3PM - 8PM">Weekends: 3PM - 8PM</option>
                    </select>
                </label>

                <label class="cart-form__label">Place of Meet Up / Delivery
                    <select name="meetupPlace" class="cart-form__input" required>
                        <option value="">Select location</option>
                        <optgroup label="Free Delivery">
                            <option value="Dubai Internet City Metro">Dubai Internet City Metro</option>
                            <option value="Dubai Knowledge Park (Tuesday at 5:30 PM)">Dubai Knowledge Park (Tuesday at 5:30 PM)</option>
                        </optgroup>
                        <optgroup label="5 AED Delivery Fee">
                            <option value="Mall of the Emirates Metro">Mall of the Emirates Metro</option>
                            <option value="DMCC Metro">DMCC Metro</option>
                        </optgroup>
                        <optgroup label="10 AED Delivery Fee">
                            <option value="Union Metro">Union Metro</option>
                            <option value="Burjuman Metro">Burjuman Metro</option>
                        </optgroup>
                        <optgroup label="Home Delivery">
                            <option value="Dubai: 20 AED">Dubai: 20 AED</option>
                            <option value="Other Emirates: 25 AED">Other Emirates: 25 AED</option>
                        </optgroup>
                    </select>
                </label>

                <label class="cart-form__label">Date of Delivery
                    <input type="date" name="deliveryDate" class="cart-form__input" required>
                </label>

                <label class="cart-form__label">Notes <span class="cart-form__optional">(optional)</span>
                    <textarea name="notes" class="cart-form__input cart-form__textarea" placeholder="Anything else we should know?"></textarea>
                </label>

                <div class="cart-form__totals">
                    <h3 class="cart-form__totals-heading">Price Details</h3>
                    <div class="cart-drawer__row"><span>Total Product Price</span><span id="cartFormSubtotal">0.00 AED</span></div>
                    <div class="cart-drawer__row"><span>Delivery Fee</span><span id="cartDeliveryFeeValue">0.00 AED</span></div>
                    <div class="cart-drawer__row cart-drawer__row--total"><span>Order Total</span><span id="cartTotalValue">0.00 AED</span></div>
                </div>

                <div class="cart-actions">
                    <button type="button" class="cart-btn cart-btn--secondary" id="cartFormBackBtn">Back</button>
                    <button type="submit" class="cart-btn cart-btn--primary" id="cartFormSubmitBtn">Submit Order</button>
                </div>
                <p class="cart-order-status" id="cartOrderStatus" role="status" aria-live="polite"></p>
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

        overlayEl.addEventListener('click', closeDrawer);
        drawerEl.querySelector('#cartCloseBtn').addEventListener('click', closeDrawer);
        drawerEl.querySelector('#cartBackBtn').addEventListener('click', closeDrawer);
        drawerEl.querySelector('#cartProceedBtn').addEventListener('click', showOrderForm);
        drawerEl.querySelector('#cartFormBackBtn').addEventListener('click', hideOrderForm);
        formEl.querySelector('select[name="meetupPlace"]').addEventListener('change', updateFormTotals);
        formEl.addEventListener('submit', handleOrderSubmit);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawerEl.classList.contains('is-open')) closeDrawer();
        });
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
        if (subtotalValueEl) subtotalValueEl.textContent = `${subtotal.toFixed(2)} AED`;
        if (summaryTotalValueEl) summaryTotalValueEl.textContent = `${subtotal.toFixed(2)} AED`;

        updateFormTotals();
    }

    function updateFormTotals() {
        if (!formEl) return;
        const place = formEl.querySelector('select[name="meetupPlace"]').value;
        const subtotal = cartSubtotal();
        const fee = getDeliveryFee(place);
        formEl.querySelector('#cartFormSubtotal').textContent = `${subtotal.toFixed(2)} AED`;
        deliveryFeeValueEl.textContent = `${fee.toFixed(2)} AED`;
        totalValueEl.textContent = `${(subtotal + fee).toFixed(2)} AED`;
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

    function buildOrderItemsHtml() {
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

        return `<table style="width:100%; border-collapse:collapse;">${cards}</table>`;
    }

    function handleOrderSubmit(e) {
        e.preventDefault();

        if (cart.length === 0) return;

        const data = Object.fromEntries(new FormData(formEl).entries());
        const subtotal = cartSubtotal();
        const fee = getDeliveryFee(data.meetupPlace);

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
            customer_email: data.email || '',
            pickup_time: data.pickupTime,
            meetup_place: data.meetupPlace,
            delivery_date: data.deliveryDate,
            subtotal: subtotal.toFixed(2),
            delivery_fee: fee.toFixed(2),
            total: (subtotal + fee).toFixed(2),
            notes: data.notes || 'None',
            items_html: buildOrderItemsHtml(),
        }, { publicKey: EMAILJS_ORDER_PUBLIC_KEY })
            .then(() => {
                statusEl.textContent = 'Thanks! Your order request has been sent — we\'ll confirm within 1–2 days.';
                statusEl.className = 'cart-order-status cart-order-status--success';
                cart = [];
                persist();
                formEl.reset();
                setTimeout(closeDrawer, 2500);
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
