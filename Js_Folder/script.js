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

const hamBtn = document.getElementById('hamBtn');
    const sidebar = document.getElementById('sidebar');

    if (hamBtn && sidebar) {
        hamBtn.addEventListener('click', () => {
            hamBtn.classList.toggle('open');
            sidebar.classList.toggle('active');
        });
    }