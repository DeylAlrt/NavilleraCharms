// ========================================
// 1. CAROUSEL SLIDE ANIMATION
// ========================================
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

// ========================================
// 2. MOBILE SIDEBAR MANAGEMENT
// ========================================

// Get sidebar elements
const hamBtn = document.getElementById('hamBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarCloseBtn = document.querySelector('.sidebar-close');
const navItems = document.querySelectorAll('.nav-item');

// Function to set sidebar state
function setSidebarState(isOpen) {
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

// Hamburger button toggle
if (hamBtn && sidebar) {
    hamBtn.addEventListener('click', () => {
        const isCurrentlyOpen = sidebar.classList.contains('active');
        setSidebarState(!isCurrentlyOpen);
    });
}

// Close button in sidebar
if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
        setSidebarState(false);
    });
}

// Overlay click to close sidebar
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        setSidebarState(false);
    });
}

// Nav item clicks to close sidebar
navItems.forEach(item => {
    item.addEventListener('click', () => {
        setSidebarState(false);
    });
});

// Escape key to close sidebar
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('active')) {
        setSidebarState(false);
    }
});

// ========================================
// 3. 3D IMAGE GALLERY
// ========================================
(function () {
    const gallery = document.querySelector('.image-gallery');
    if (!gallery) return;

    const isMobile = window.innerWidth <= 768;
    const slots = isMobile ? [
        { x: '-220%', scale: 1.75, zIndex: 1 },  // left
        { x: '0%',   scale: 2.4, zIndex: 3,  },  // mid
        { x: '220%',  scale: 1.75, zIndex: 0 },  // right
    ] : [
        { x: '-103%', scale: 0.82, zIndex: 1 }, // left
        { x: '0%',    scale: 1.08, zIndex: 3 }, // mid
        { x: '103%',  scale: 0.82, zIndex: 0 }, // right
    ];

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
        top: 23%;
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
        el.style.opacity = s.opacity;
        el.style.zIndex = s.zIndex;
    }

    let cards = images.map((src, i) => {
        const card = makeCard(src);
        gallery.appendChild(card);
        applySlot(card, i, false);
        return card;
    });

    function rotate() {
        applySlot(cards[0], 2, true);   // left → right
        applySlot(cards[1], 0, true);   // mid → left
        applySlot(cards[2], 1, true);   // right → mid

        setTimeout(() => {
            cards = [cards[1], cards[2], cards[0]];
        }, DURATION);
    }

    setInterval(rotate, 2000);
})();

// ========================================
// 4. FAQ ACCORDION
// ========================================
const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle 'active' class on the button itself
        button.classList.toggle('active');
        
        // Find the answer box immediately after the button
        const answer = button.nextElementSibling;
        
        // Show/Hide the answer
        if (button.classList.contains('active')) {
            answer.style.display = 'block';
        } else {
            answer.style.display = 'none';
        }
    });
});
