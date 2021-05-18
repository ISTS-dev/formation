const menuOpenBtn = document.querySelector('.js-menu-open-icon');
menuOpenBtn.addEventListener('click', function() {
    document.querySelector('.js-menu-close-icon').classList.remove('sr-only');
    document.querySelector('.js-mobile-menu').classList.add('open');
});

const menuCloseBtn = document.querySelector('.js-menu-close-icon');
menuCloseBtn.addEventListener('click', function() {
    document.querySelector('.js-menu-close-icon').classList.add('sr-only');
    document.querySelector('.js-mobile-menu').classList.remove('open');
});

const menuItemBtns = document.querySelectorAll('.js-mobile-menu-item');
menuItemBtns.forEach((menuItemBtn) => {
    menuItemBtn.addEventListener('click', function() {
        document.querySelector('.js-menu-close-icon').classList.add('sr-only');
        document.querySelector('.js-mobile-menu').classList.remove('open');
    });
});