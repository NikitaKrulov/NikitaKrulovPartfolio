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
    const showMoreBtn = document.getElementById('showMoreBtn');
    
    // Определяем максимальное количество карточек для начального отображения
    const initialCardCount = 6;
    let isExpanded = false;
    
    // Находим все карточки
    const getAllCards = () => Array.from(portfolioWrapper.querySelectorAll('.portfolio__card'));
    
    // Функция для фильтрации и сортировки карточек
    function filterCards() {
        const cards = getAllCards();
        
        // Сортировка карточек
        cards.sort((a, b) => {
            const aTitle = a.querySelector('.portfolio__card-title h2').textContent;
            const bTitle = b.querySelector('.portfolio__card-title h2').textContent;
            const aYear = parseInt(a.querySelector('.portfolio__card-title p').textContent);
            const bYear = parseInt(b.querySelector('.portfolio__card-title p').textContent);

            switch (filterSelect.value) {
                case 'newest':
                    return bYear - aYear;
                case 'oldest':
                    return aYear - bYear;
                case 'name':
                    return aTitle.localeCompare(bTitle, 'ru');
                default:
                    return 0;
            }
        });
        
        // Удаляем все карточки из DOM
        portfolioWrapper.innerHTML = '';
        
        // Добавляем карточки обратно в отсортированном порядке
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            card.style.transition = 'opacity 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transitionDelay = `${index * 0.07}s`;
            
            portfolioWrapper.appendChild(card);
            
            // Используем setTimeout для плавного появления
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 10);
            
            // Скрываем карточки, если их больше initialCardCount и список свернут
            if (index >= initialCardCount && !isExpanded) {
                card.style.display = 'none';
            } else {
                card.style.display = '';
            }
        });
        
        // Обновляем состояние кнопки "Показать все"
        updateShowMoreButton();
    }
    
    // Функция для обновления текста и состояния кнопки "Показать все"
    function updateShowMoreButton() {
        const cards = getAllCards();
        
        if (cards.length <= initialCardCount) {
            showMoreBtn.style.display = 'none';
            return;
        }
        
        showMoreBtn.style.display = 'flex';
        
        const buttonText = showMoreBtn.querySelector('span');
        buttonText.textContent = isExpanded ? 'Скрыть' : 'Показать все';
    }
    
    // Функция для переключения видимости карточек с улучшенной анимацией
    function toggleCards() {
        const cards = getAllCards();
        isExpanded = !isExpanded;
        
        const animationEffects = [
            { transform: 'translateY(25px) scale(0.95)', opacity: '0' },
            { transform: 'translateY(-10px) scale(0.98) rotate(1deg)', opacity: '0' },
            { transform: 'translateY(20px) scale(0.97) rotate(-1deg)', opacity: '0' },
            { transform: 'translateX(15px) scale(0.96)', opacity: '0' },
            { transform: 'translateX(-15px) scale(0.96)', opacity: '0' }
        ];
        
        cards.forEach((card, index) => {
            if (index >= initialCardCount) {
                if (isExpanded) {
                    // Выбираем случайный эффект анимации для разнообразия
                    const effectIndex = Math.floor(Math.random() * animationEffects.length);
                    const effect = animationEffects[effectIndex];
                    
                    // Показываем скрытые карточки с улучшенной анимацией
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = effect.transform;
                    card.style.transition = 'opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    card.style.transitionDelay = `${(index - initialCardCount) * 0.08 + 0.1}s`;
                    
                    // Запускаем анимацию через небольшую задержку
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                    }, 20);
                } else {
                    // Скрываем карточки с анимацией
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.transitionDelay = `${(cards.length - index) * 0.03}s`;
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            }
        });
        
        updateShowMoreButton();
        
        // Прокручиваем к кнопке, если список сворачивается
        if (!isExpanded) {
            setTimeout(() => {
                showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }
    
    // Обработчик события для кнопки "Показать все"
    showMoreBtn.addEventListener('click', toggleCards);
    
    // Обработчик события для фильтра
    filterSelect.addEventListener('change', filterCards);
    
    // Инициализация при загрузке страницы
    filterCards();
});

document.addEventListener('DOMContentLoaded', function() {
    const originalLinks = document.querySelectorAll('.portfolio__card-original');
    originalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Останавливаем всплытие события
            const url = this.getAttribute('data-href');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const portfolioWrapper = document.querySelector('.portfolio__wrapper');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const cards = portfolioWrapper.querySelectorAll('.portfolio__card');
    let visibleCards = window.innerWidth < 768 ? 2 : 4;
    let allCardsVisible = false;

    function updateVisibleCards() {
        cards.forEach((card, index) => {
            if (index < visibleCards) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 380); // Соответствует времени transition в CSS
            }
        });

        updateButtonText();
    }

    function updateButtonText() {
        if (allCardsVisible) {
            showMoreBtn.querySelector('span').textContent = 'Скрыть';
        } else {
            showMoreBtn.querySelector('span').textContent = 'Показать все';
        }
    }

    function toggleCards() {
        if (allCardsVisible) {
            visibleCards = window.innerWidth < 768 ? 2 : 4;
            allCardsVisible = false;
        } else {
            visibleCards = cards.length;
            allCardsVisible = true;
        }
        updateVisibleCards();
    }

    showMoreBtn.addEventListener('click', toggleCards);

    window.addEventListener('resize', function() {
        if (!allCardsVisible) {
            visibleCards = window.innerWidth < 768 ? 2 : 4;
            updateVisibleCards();
        }
    });

    updateVisibleCards();
});