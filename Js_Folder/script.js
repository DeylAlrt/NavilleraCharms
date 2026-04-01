// 2 Circle Slide Animation //
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

// Hamburger Menu Toggle //
const hamBtn = document.getElementById('hamBtn');
    const sidebar = document.getElementById('sidebar');

    if (hamBtn && sidebar) {
        hamBtn.addEventListener('click', () => {
            hamBtn.classList.toggle('open');
            sidebar.classList.toggle('active');
        });
    }

// 3D Image Gallery //
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