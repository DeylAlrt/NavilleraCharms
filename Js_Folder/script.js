// 2 Circle Slide Animation //
const grid = document.querySelector('.collections__grid');
const dots = document.querySelectorAll('.dot');

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

const gallery = document.querySelector('.image-gallery');

function rotateSlider() {
    // 1. Get current items
    const items = document.querySelectorAll('.gallery-item');
    
    // 2. Add transition for the slide
    gallery.style.transition = "all 0.8s ease-in-out";
    
    // 3. Move the first item to the end
    setTimeout(() => {
        gallery.appendChild(items[0]); // Moves the left image to the far right
        
        // 4. Re-assign the 'middle' and 'side' classes
        const newItems = document.querySelectorAll('.gallery-item');
        newItems.forEach(item => {
            item.classList.remove('middle', 'side');
            item.classList.add('side');
        });
        
        // The second item is always the one in the center
        newItems[1].classList.remove('side');
        newItems[1].classList.add('middle');
        
    }, 800); // Matches the transition speed
}

// Run every 1.5 seconds
setInterval(rotateSlider, 1500);