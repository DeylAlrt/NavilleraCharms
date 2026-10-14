// Loading skeletons (Css_Folder/skeleton.css): pictures with class "sk"
// shimmer until they load. One listener covers pictures added later too.
(function () {
    const markLoaded = (e) => {
        if (e.target.classList && e.target.classList.contains('sk')) e.target.classList.add('is-loaded');
    };
    document.addEventListener('load', markLoaded, true);
    document.addEventListener('error', markLoaded, true);
    document.querySelectorAll('img.sk').forEach(img => {
        if (img.complete) img.classList.add('is-loaded');
    });
})();

// Press feedback (Css_Folder/interactions.css): buttons, cards and charm
// tiles give a quick squeeze when tapped or clicked, on phones too.
(function () {
    const PRESSABLE = 'button, .charm-tile.is-addable, .collections__card, .nav-build, .nav-item, .jumpnav-link, a[class*="btn"]';
    document.addEventListener('pointerdown', (e) => {
        const el = e.target.closest(PRESSABLE);
        if (!el || el.disabled) return;
        el.classList.remove('is-pressed');
        void el.offsetWidth; // restart the animation on quick repeat taps
        el.classList.add('is-pressed');
    });
    document.addEventListener('animationend', (e) => {
        if (e.animationName === 'press') e.target.classList.remove('is-pressed');
    });
})();

// Fade-up on scroll (home + About Us only). Only sections still below the
// screen when the page opens are hidden, so nothing visible ever blinks.
// Once a section has faded in, its classes are removed so its own hover
// effects work as before.
(function () {
    const REVEAL = [
        '.section_1', '.collections__card', '.info__main-img', '.info__point', '.left-image', '.discount-container',
        '.welcome-section', '.her-story-text', '.her-story-image', '.gallery-wrapper-item', '.contact-form-section',
    ].join(', ');
    const page = location.pathname.split('/').pop(); // "", "index", "about-us.html", ...
    if (!/^(index|about-us)?(\.html)?$/.test(page) || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            observer.unobserve(el);
            el.classList.add('is-visible');
            const done = (e) => {
                if (e.target !== el) return; // ignore transitions inside it
                el.removeEventListener('transitionend', done);
                el.classList.remove('reveal', 'is-visible');
                el.style.transitionDelay = '';
            };
            el.addEventListener('transitionend', done);
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    // Cards side by side fade in one after another
    const siblingCount = new Map();
    document.querySelectorAll(REVEAL).forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        const n = siblingCount.get(el.parentElement) || 0;
        siblingCount.set(el.parentElement, n + 1);
        el.style.transitionDelay = Math.min(n, 4) * 0.1 + 's';
        el.classList.add('reveal');
        observer.observe(el);
    });
})();

const grid = document.querySelector('.collections__grid');
const dots = document.querySelectorAll('.dot');

if (grid) {
    grid.addEventListener('scroll', () => {
        const scrollLeft = grid.scrollLeft;
        const halfWidth = grid.scrollWidth / 4;

        if (scrollLeft > halfWidth) {
            dots[0].classList.remove('active');
            dots[1].classList.add('active');
        } else {
            dots[1].classList.remove('active');
            dots[0].classList.add('active');
        }
    });
}

const hamBtn = document.getElementById('hamBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const navItems = document.querySelectorAll('.nav-item');

function setSidebarState(isOpen) {
    document.body.classList.toggle('menu-open', isOpen);

    if (isOpen) {
        sidebar.classList.add('active');
        sidebar.setAttribute('aria-hidden', 'false');
        hamBtn.classList.add('open');
        hamBtn.setAttribute('aria-expanded', 'true');
        sidebarOverlay.classList.add('active');
    } else {
        sidebar.classList.remove('active');
        sidebar.setAttribute('aria-hidden', 'true');
        hamBtn.classList.remove('open');
        hamBtn.setAttribute('aria-expanded', 'false');
        sidebarOverlay.classList.remove('active');
    }
}

if (hamBtn && sidebar) {
    hamBtn.addEventListener('click', () => {
        const isCurrentlyOpen = sidebar.classList.contains('active');
        setSidebarState(!isCurrentlyOpen);
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        setSidebarState(false);
    });
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        setSidebarState(false);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('active')) {
        setSidebarState(false);
    }
});

(function () {
    const gallery = document.querySelector('.image-gallery');
    if (!gallery) return;

    const MOBILE_SLOTS = [
        { x: '-220%', scale: 1.75, zIndex: 1 },
        { x: '0%',   scale: 2.4, zIndex: 3,  },
        { x: '220%',  scale: 1.75, zIndex: 0 },
    ];
    const DESKTOP_SLOTS = [
        { x: '-103%', scale: 0.82, zIndex: 1 },
        { x: '0%',    scale: 1.08, zIndex: 3 },
        { x: '103%',  scale: 0.82, zIndex: 0 },
    ];
    let isMobile = window.innerWidth <= 768;
    let slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;

    const images = [
        "https://ik.imagekit.io/jdwr5wztm/Image%201.jpg",
        "https://ik.imagekit.io/jdwr5wztm/Image%202.jpg",
        "https://ik.imagekit.io/jdwr5wztm/Image%203.jpg",
    ];

    const DURATION = 600;
    const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

    gallery.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 75%;
        top: 25%;
        max-width: 100%;
        height: 100%;
    `;

    function makeCard(src) {
        const card = document.createElement('div');
        card.style.cssText = `
            position: absolute;
            width: 28%;
            aspect-ratio: 3/4;
            border-radius: ${isMobile ? '12px' : '28px'};
            overflow: hidden;
            box-shadow: 0 12px 25px rgba(0,0,0,.30);
            will-change: transform, opacity;
            left: 50%;
            margin-left: -14%;
        `;
        const img = document.createElement('img');
        img.className = 'sk';
        img.src = src;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        card.appendChild(img);
        return card;
    }

    function applySlot(el, slotIndex, animate) {
        const s = slots[slotIndex];
        el.style.transition = animate
            ? `transform ${DURATION}ms ${EASING}, opacity ${DURATION}ms ${EASING}`
            : 'none';
        el.style.transform = `translateX(${s.x}) scale(${s.scale})`;
        el.style.opacity = '1';
        el.style.zIndex = s.zIndex;
    }

    let cards = images.map((src, i) => {
        const card = makeCard(src);
        gallery.appendChild(card);
        applySlot(card, i, false);
        return card;
    });

    // Shift every picture one place to the left. The picture leaving on the
    // left fades out and fades back in on the right, instead of sliding
    // across (behind) the other two.
    function rotate() {
        const [left, center, right] = cards;
        applySlot(center, 0, true);
        applySlot(right, 1, true);

        const half = DURATION / 2;
        left.style.transition = `opacity ${half}ms ease`;
        left.style.opacity = '0';
        setTimeout(() => {
            applySlot(left, 2, false);
            left.style.opacity = '0';
            void left.offsetWidth; // apply the jump before fading back in
            left.style.transition = `opacity ${half}ms ease`;
            left.style.opacity = '1';
        }, half);

        cards = [center, right, left];
    }

    // Don't rotate while the tab is hidden, so animations never pile up.
    setInterval(() => { if (!document.hidden) rotate(); }, 2000);

    // Switch between the phone and desktop layout if the screen size changes.
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth <= 768;
        if (nowMobile === isMobile) return;
        isMobile = nowMobile;
        slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
        cards.forEach((card, i) => {
            card.style.borderRadius = isMobile ? '12px' : '28px';
            applySlot(card, i, false);
        });
    });
})();

const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');

        const answer = button.nextElementSibling;

        if (button.classList.contains('active')) {
            answer.style.display = 'block';
        } else {
            answer.style.display = 'none';
        }
    });
});

(function () {
    const THEME_KEY = 'navillera-theme';
    const toggle = document.getElementById('darkModeToggle');

    function applyTheme(isDark) {
        document.documentElement.classList.toggle('dark-mode', isDark);
        if (toggle) toggle.checked = isDark;
    }

    applyTheme(localStorage.getItem(THEME_KEY) === 'dark');

    if (toggle) {
        toggle.addEventListener('change', () => {
            applyTheme(toggle.checked);
            localStorage.setItem(THEME_KEY, toggle.checked ? 'dark' : 'light');
        });
    }
})();

// "Charm Collection" / "Shop" links glide down to the Collections section.
// The scroll is animated here (not with CSS) so it is smooth on every
// device, even when the computer has animations turned off.
(function () {
    const target = document.getElementById('collections');
    if (!target) return; // only the Home page has the section

    const NAVBAR_GAP = 110;  // stop just below the fixed navbar
    const DURATION = 900;    // ms

    function glideTo(el) {
        const start = window.scrollY;
        const end = el.getBoundingClientRect().top + window.scrollY - NAVBAR_GAP;
        const startTime = performance.now();
        const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        function step(now) {
            const t = Math.min((now - startTime) / DURATION, 1);
            window.scrollTo({ top: start + (end - start) * ease(t), behavior: 'instant' });
            if (t < 1) requestAnimationFrame(step);
            else history.replaceState(null, '', '#collections');
        }
        requestAnimationFrame(step);
    }

    // Clicking a link to #collections while on the Home page
    document.querySelectorAll('a[href="#collections"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // let the mobile sidebar close (and unlock scrolling) first
            requestAnimationFrame(() => glideTo(target));
        });
    });

    // Arriving from another page via index.html#to-collections (a name the
    // browser won't jump to on its own): glide down once the page has loaded.
    if (location.hash === '#to-collections') {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.addEventListener('load', () => setTimeout(() => glideTo(target), 200));
    }
})();
