document.addEventListener('DOMContentLoaded', () => {
    // Функция для проверки, является ли устройство мобильным или сенсорным
    function isTouchDevice() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0) ||
            (window.innerWidth <= 768);
    }

    // Если устройство не сенсорное, применяем hover-эффекты
    if (!isTouchDevice()) {
        // Эффект для карточек портфолио
        const cards = document.querySelectorAll('.portfolio__card');

        cards.forEach(card => {
            const descriptionWrapper = card.querySelector('.portfolio__card-description-wrapper');

            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = (x / rect.width) * 100;
                const centerY = (y / rect.height) * 100;

                descriptionWrapper.style.clipPath = `circle(0% at ${centerX}% ${centerY}%)`;

                // Форсируем перерисовку
                descriptionWrapper.offsetWidth;

                descriptionWrapper.style.clipPath = `circle(150% at ${centerX}% ${centerY}%)`;
            });

            card.addEventListener('mouseleave', () => {
                descriptionWrapper.style.clipPath = 'circle(150% at 50% 50%)';

                // Форсируем перерисовку
                descriptionWrapper.offsetWidth;

                descriptionWrapper.style.clipPath = 'circle(0% at 50% 50%)';
            });
        });

        // Эффект для ссылок в футере
        const linksWrapper = document.querySelector('.footer__wrapper-links');
        const links = linksWrapper.querySelectorAll('a');

        const border = document.createElement('div');
        border.classList.add('footer__magnetic-border');
        linksWrapper.appendChild(border);

        let currentX = 0, currentY = 0, aimX = 0, aimY = 0;
        let currentWidth = 0, currentHeight = 0, aimWidth = 0, aimHeight = 0;

        function animate() {
            currentX += (aimX - currentX) * 0.2;
            currentY += (aimY - currentY) * 0.2;
            currentWidth += (aimWidth - currentWidth) * 0.2;
            currentHeight += (aimHeight - currentHeight) * 0.2;

            border.style.left = `${currentX}px`;
            border.style.top = `${currentY}px`;
            border.style.width = `${currentWidth}px`;
            border.style.height = `${currentHeight}px`;

            requestAnimationFrame(animate);
        }

        animate();

        linksWrapper.addEventListener('mousemove', (e) => {
            const rect = linksWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let targetLink = null;
            links.forEach(link => {
                const linkRect = link.getBoundingClientRect();
                if (y >= linkRect.top - rect.top && y <= linkRect.bottom - rect.top) {
                    targetLink = link;
                }
            });

            if (targetLink) {
                const targetRect = targetLink.getBoundingClientRect();
                aimX = targetRect.left - rect.left - 5;
                aimY = targetRect.top - rect.top - 5;
                aimWidth = targetRect.width + 10;
                aimHeight = targetRect.height + 10;
                border.style.opacity = '1';
            } else {
                border.style.opacity = '0';
            }
        });

        linksWrapper.addEventListener('mouseleave', () => {
            border.style.opacity = '0';
        });

        // Эффект для кнопки действий
        const btn = document.querySelector('.portfolio__actions-btn');

        // Создаем элемент круга
        const circle = document.createElement('div');
        circle.classList.add('portfolio__actions-btn-circle');
        btn.appendChild(circle);

        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = (x / rect.width) * 100;
            const centerY = (y / rect.height) * 100;

            circle.style.clipPath = `circle(0% at ${centerX}% ${centerY}%)`;
            circle.style.opacity = '1';

            requestAnimationFrame(() => {
                circle.style.clipPath = `circle(150% at ${centerX}% ${centerY}%)`;
            });
        });

        btn.addEventListener('mouseleave', () => {
            circle.style.clipPath = 'circle(150% at 50% 50%)';

            requestAnimationFrame(() => {
                circle.style.clipPath = 'circle(0% at 50% 50%)';
                circle.style.opacity = '0';
            });
        });
    }

    // Код для переключения темы (работает на всех устройствах)
    const switchInput = document.querySelector('.switch__input');
    switchInput.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', switchInput.checked);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
});

// Фильтрация карточек портфолио 
document.addEventListener('DOMContentLoaded', function () {
    const filterSelect = document.getElementById('portfolioFilter');
    const portfolioWrapper = document.querySelector('.portfolio__wrapper');

    function filterCards() {
        const cards = Array.from(portfolioWrapper.querySelectorAll('.portfolio__card'));

        cards.sort((a, b) => {
            const aTitle = a.querySelector('h2').textContent;
            const bTitle = b.querySelector('h2').textContent;
            const aYear = parseInt(a.querySelector('p').textContent);
            const bYear = parseInt(b.querySelector('p').textContent);

            switch (filterSelect.value) {
                case 'newest':
                    return bYear - aYear;
                case 'oldest':
                    return aYear - bYear;
                case 'name':
                    return aTitle.localeCompare(bTitle);
                default:
                    return 0;
            }
        });

        portfolioWrapper.innerHTML = '';
        cards.forEach(card => portfolioWrapper.appendChild(card));
    }

    // Применяем фильтр при загрузке страницы
    filterCards();

    // Применяем фильтр при изменении выбора
    filterSelect.addEventListener('change', filterCards);
});