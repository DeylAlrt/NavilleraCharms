(function () {
    const resultsEl = document.getElementById('collectionResults');
    const emptyEl = document.getElementById('collectionEmpty');
    const toolbarEl = document.getElementById('collectionToolbar');
    const jumpNavEl = document.getElementById('jumpNav');
    const jumpNavScrollbarEl = document.getElementById('jumpNavScrollbar');
    const jumpNavTrackEl = document.getElementById('jumpNavTrack');
    const jumpNavThumbEl = document.getElementById('jumpNavThumb');
    const jumpNavButterflyEl = document.getElementById('jumpNavButterfly');
    const tabsEl = document.getElementById('collectionTabs');
    const searchEl = document.getElementById('collectionSearch');
    const titleEl = document.getElementById('collectionTitle');
    const blurbEl = document.getElementById('collectionBlurb');
    const crumbEl = document.getElementById('crumbCurrent');
    const noResultsEl = document.getElementById('collectionNoResults');

    if (!resultsEl) return;

    const GLYPH_MAP = [
        [/heart/i, '❤'], [/star/i, '★'], [/flower|rose/i, '✿'], [/paw/i, '🐾'],
        [/butterfly/i, '🦋'], [/moon/i, '🌙'], [/cherr/i, '🍒'], [/bow/i, '🎀'],
        [/clover/i, '🍀'], [/evil eye/i, '🧿'], [/christmas tree/i, '🎄'], [/santa/i, '🎅'],
        [/candy cane/i, '🍬'], [/gummy bear/i, '🐻'], [/coffee/i, '☕'], [/telephone/i, '☎'],
        [/ladybug/i, '🐞'], [/bunny|rabbit/i, '🐰'], [/cat/i, '🐱'], [/pup|dog|husky|corgi|retriever|bulldog/i, '🐶'],
        [/turtle/i, '🐢'], [/watch/i, '⌚'], [/keychain|key /i, '🔑'], [/spider/i, '🕷'],
        [/bat\b/i, '🦇'], [/camera/i, '📷'], [/envelope/i, '✉'], [/sun /i, '☀'],
        [/sparkle|diamond|gem/i, '✨'], [/crown/i, '👑'], [/yin yang/i, '☯'], [/boba/i, '🧋'],
        [/plane|airplane/i, '✈'], [/flag/i, '🏳'], [/ball/i, '⚽'], [/car\b|lamborghini|porsche|bmw|ferrari|mercedes/i, '🏎'],
        [/shell|pearl/i, '🐚'], [/lock/i, '🔒'], [/bag|purse/i, '👜'], [/tea|drink/i, '🧋']
    ];

    function glyphFor(label) {
        const hit = GLYPH_MAP.find(([re]) => re.test(label));
        return hit ? hit[1] : null;
    }

    function slugify(str) {
        return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function charmImageUrl(file) {
        const path = '/charms/' + file;
        return `https://navillera.vercel.app/_next/image?url=${encodeURIComponent(path)}&w=256&q=75`;
    }

    function parseItem(raw) {
        if (raw && typeof raw === 'object') {
            return { label: raw.label, soldOut: !!raw.soldOut, file: raw.file || null };
        }
        const soldOut = raw.trim().endsWith('*');
        const label = soldOut ? raw.trim().slice(0, -1).trim() : raw.trim();
        return { label, soldOut, file: null };
    }

    function materialClass(subName) {
        const n = subName.toLowerCase();
        if (n.includes('gold')) return 'charm-tile--gold';
        if (n.includes('silver')) return 'charm-tile--silver';
        return 'charm-tile--neutral';
    }

    function buildTile(item, matClass, sub) {
        const tile = document.createElement('div');
        const hasPhoto = !!item.file;
        const addable = !item.soldOut;
        tile.className = `charm-tile ${matClass}${hasPhoto ? ' has-photo' : ''}${item.soldOut ? ' is-sold-out' : ''}${addable ? ' is-addable' : ''}`;
        tile.title = item.soldOut ? `${item.label} — Sold out` : `Tap to add ${item.label} to cart`;
        tile.dataset.label = item.label.toLowerCase();

        if (addable) {
            tile.setAttribute('role', 'button');
            tile.setAttribute('tabindex', '0');
            tile.dataset.cartKey = `${sub.name}::${item.file}`;
            const addToCart = () => {
                if (!window.NavilleraCart) return;
                window.NavilleraCart.add({
                    file: item.file,
                    label: item.label,
                    price: sub.price,
                    subcollection: sub.name,
                    img: item.file ? charmImageUrl(item.file) : null,
                });
            };
            tile.addEventListener('click', addToCart);
            tile.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    addToCart();
                }
            });
        }

        if (hasPhoto) {
            const img = document.createElement('img');
            img.className = 'charm-photo';
            img.src = charmImageUrl(item.file);
            img.alt = item.label;
            img.loading = 'lazy';
            img.decoding = 'async';
            tile.appendChild(img);
        } else {
            const glyph = item.label.length === 1 ? item.label : (glyphFor(item.label) || item.label.charAt(0));
            const glyphSpan = document.createElement('span');
            glyphSpan.className = 'charm-glyph';
            glyphSpan.setAttribute('aria-hidden', 'true');
            glyphSpan.textContent = glyph;
            tile.appendChild(glyphSpan);
        }

        if (item.label.length > 1) {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'charm-label';
            labelSpan.textContent = item.label;
            tile.appendChild(labelSpan);
        }

        if (item.soldOut) {
            const badge = document.createElement('span');
            badge.className = 'sold-out-badge';
            badge.textContent = 'Sold Out';
            tile.appendChild(badge);
        } else {
            const addBadge = document.createElement('span');
            addBadge.className = 'charm-tile__add-badge';
            addBadge.setAttribute('aria-hidden', 'true');
            addBadge.textContent = '+';
            tile.appendChild(addBadge);
        }

        return tile;
    }

    function buildSubcollection(sub) {
        const slug = slugify(sub.name);
        const section = document.createElement('section');
        section.className = 'subcollection';
        section.id = slug;

        const header = document.createElement('div');
        header.className = 'subcollection__header';
        header.innerHTML = `
            <h2>${sub.name}</h2>
            <span class="subcollection__price">${sub.price} AED &middot; ${sub.unit}</span>
        `;
        section.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'charm-grid';
        const matClass = materialClass(sub.name);

        sub.items.map(parseItem).forEach(item => {
            grid.appendChild(buildTile(item, matClass, sub));
        });

        section.appendChild(grid);
        return { section, slug, itemCount: sub.items.length };
    }

    function render(category) {
        const meta = (typeof CATEGORY_META !== 'undefined') ? CATEGORY_META[category] : null;
        const data = (typeof CATALOGUE !== 'undefined') ? CATALOGUE[category] : null;

        if (!meta || !data) {
            titleEl.textContent = 'Collection Not Found';
            blurbEl.textContent = "We couldn't find that collection — pick one from the homepage.";
            crumbEl.textContent = 'Collections';
            if (toolbarEl) toolbarEl.hidden = true;
            emptyEl.hidden = false;
            emptyEl.querySelector('p').textContent = "We couldn't find that collection.";
            return;
        }

        document.title = `${meta.title} | NavilleraCharms`;
        titleEl.textContent = meta.title;
        blurbEl.textContent = meta.blurb;
        crumbEl.textContent = meta.title;

        if (data.length === 0) {
            if (toolbarEl) toolbarEl.hidden = true;
            emptyEl.hidden = false;
            return;
        }

        data.forEach(sub => {
            const { section, slug } = buildSubcollection(sub);
            resultsEl.appendChild(section);

            const chip = document.createElement('a');
            chip.href = `#${slug}`;
            chip.className = 'jumpnav__chip';
            chip.textContent = sub.name;
            jumpNavEl.appendChild(chip);
        });
    }

    let currentCategory = null;

    function updateActiveTab(category) {
        if (!tabsEl) return;
        tabsEl.querySelectorAll('.collection-tabs__btn').forEach(btn => {
            const isActive = btn.dataset.category === category;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    function switchCategory(category, { pushState = true, scroll = true } = {}) {
        currentCategory = category;

        resultsEl.innerHTML = '';
        jumpNavEl.innerHTML = '';
        if (searchEl) searchEl.value = '';
        if (noResultsEl) noResultsEl.hidden = true;
        if (emptyEl) emptyEl.hidden = true;
        if (toolbarEl) toolbarEl.hidden = false;

        render(category);
        updateJumpNavFade();
        syncCartBadges();
        updateActiveTab(category);

        if (pushState) {
            const url = `${window.location.pathname}?category=${category}`;
            history.pushState({ category }, '', url);
        }
        if (scroll) {
            const hero = document.querySelector('.collection-hero');
            if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateJumpNavThumb() {
        if (!jumpNavThumbEl || jumpNavEl.scrollWidth <= 0) return;
        const widthPct = Math.max((jumpNavEl.clientWidth / jumpNavEl.scrollWidth) * 100, 8);
        const maxScroll = jumpNavEl.scrollWidth - jumpNavEl.clientWidth;
        const leftPct = maxScroll > 0 ? (jumpNavEl.scrollLeft / maxScroll) * (100 - widthPct) : 0;
        jumpNavThumbEl.style.width = widthPct + '%';
        jumpNavThumbEl.style.left = leftPct + '%';
        if (jumpNavButterflyEl) jumpNavButterflyEl.style.left = (leftPct + widthPct) + '%';
    }

    function updateJumpNavFade() {
        const overflowing = jumpNavEl.scrollWidth > jumpNavEl.clientWidth + 1;
        jumpNavEl.classList.toggle('is-scrollable', overflowing);
        if (jumpNavScrollbarEl) jumpNavScrollbarEl.classList.toggle('is-visible', overflowing);
        updateJumpNavThumb();
    }

    function syncCartBadges() {
        if (!window.NavilleraCart || !window.NavilleraCart.getQty) return;
        resultsEl.querySelectorAll('.charm-tile[data-cart-key]').forEach(tile => {
            const badge = tile.querySelector('.charm-tile__add-badge');
            if (!badge) return;
            const qty = window.NavilleraCart.getQty(tile.dataset.cartKey);
            const inCart = qty > 0;
            badge.textContent = inCart ? (qty > 99 ? '99+' : String(qty)) : '+';
            badge.classList.toggle('has-qty', inCart);
        });
    }

    function applySearch(query) {
        const q = query.trim().toLowerCase();
        let anyVisible = false;

        resultsEl.querySelectorAll('.subcollection').forEach(section => {
            let sectionHasMatch = false;
            section.querySelectorAll('.charm-tile').forEach(tile => {
                const matches = !q || tile.dataset.label.includes(q);
                tile.hidden = !matches;
                if (matches) sectionHasMatch = true;
            });
            section.hidden = !sectionHasMatch;
            if (sectionHasMatch) anyVisible = true;

            const chip = jumpNavEl.querySelector(`a[href="#${section.id}"]`);
            if (chip) chip.hidden = !sectionHasMatch;
        });

        if (noResultsEl) noResultsEl.hidden = anyVisible || !q;
        updateJumpNavFade();
    }

    const params = new URLSearchParams(window.location.search);
    const category = (params.get('category') || '').toLowerCase();
    switchCategory(category, { pushState: false, scroll: false });
    window.addEventListener('navillera-cart-updated', syncCartBadges);

    if (tabsEl) {
        tabsEl.querySelectorAll('.collection-tabs__btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;
                if (cat === currentCategory) return;
                switchCategory(cat);
            });
        });
    }

    window.addEventListener('popstate', () => {
        const p = new URLSearchParams(window.location.search);
        const cat = (p.get('category') || '').toLowerCase();
        switchCategory(cat, { pushState: false, scroll: false });
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateJumpNavFade);
    }

    if (searchEl) {
        searchEl.addEventListener('input', () => applySearch(searchEl.value));
    }
    jumpNavEl.addEventListener('scroll', updateJumpNavThumb, { passive: true });
    window.addEventListener('resize', updateJumpNavFade);

    jumpNavEl.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        e.preventDefault();
        jumpNavEl.scrollLeft += e.deltaY;
    }, { passive: false });

    if (jumpNavTrackEl) {
        let dragging = false;

        const scrollToClientX = (clientX) => {
            const rect = jumpNavTrackEl.getBoundingClientRect();
            const maxScroll = jumpNavEl.scrollWidth - jumpNavEl.clientWidth;
            if (maxScroll <= 0 || rect.width <= 0) return;
            const fraction = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            jumpNavEl.scrollLeft = fraction * maxScroll;
        };

        jumpNavTrackEl.addEventListener('pointerdown', (e) => {
            dragging = true;
            jumpNavTrackEl.setPointerCapture(e.pointerId);
            scrollToClientX(e.clientX);
        });
        jumpNavTrackEl.addEventListener('pointermove', (e) => {
            if (dragging) scrollToClientX(e.clientX);
        });
        ['pointerup', 'pointercancel'].forEach(evt => {
            jumpNavTrackEl.addEventListener(evt, () => { dragging = false; });
        });
    }
})();
