const dropdownNodes = document.querySelectorAll('.js-dropdown');
if (dropdownNodes.length) {
    const dropdownTitles = document.querySelectorAll('.js-dropdown-title');
    dropdownTitles.forEach((dropdownTitle) => {
        dropdownTitle.addEventListener('click', function(event) {
            if(event.target.nextElementSibling.classList.contains('open')) {
                event.target.nextElementSibling.classList.remove('open');
                event.target.classList.remove('open');
            } else {
                dropdownTitles.forEach((dropdownTitle) => {
                    dropdownTitle.nextElementSibling.classList.remove('open');
                    dropdownTitle.classList.remove('open');
                });
                event.target.classList.add('open');
                event.target.nextElementSibling.classList.add('open');
            }
        });
    });
}