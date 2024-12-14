document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1); 
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const offset = targetElement.getBoundingClientRect().top + window.scrollY; 
            const scrollToPosition = offset - (window.innerHeight / 2) + (targetElement.offsetHeight / 2); 

            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth' 
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const tickers = document.querySelectorAll('.ticker__wrapper');
    
    tickers.forEach(ticker => {
        const originalContent = ticker.innerHTML;
        const paragraphs = ticker.querySelectorAll('p');

        function addParagraphs() {
            const screenWidth = window.innerWidth;
            let tickerWidth = ticker.offsetWidth;

            while (tickerWidth < screenWidth * 2) {
                paragraphs.forEach(paragraph => {
                    const clone = paragraph.cloneNode(true);
                    ticker.appendChild(clone);
                });
                tickerWidth = ticker.offsetWidth;
            }
        }

        function resetTicker() {
            ticker.innerHTML = originalContent;
            addParagraphs();
            setAnimation();
        }

        function setAnimation() {
            const tickerWidth = ticker.offsetWidth;
            const duration = tickerWidth / 500;
            ticker.style.animationDuration = `${duration}s`;
        }

        addParagraphs();
        setAnimation();

        window.addEventListener('resize', resetTicker);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('.players__wrapper');
    const slides = document.querySelectorAll('.playerSlide');
    const visibleSlides = 3; 
    const slideWidth = slider.parentElement.offsetWidth / visibleSlides; 
    let currentIndex = 0;

    const totalSlides = slides.length;
    const pageIndicator = document.querySelector('.players__top-pages span:first-child');
    const totalIndicator = document.querySelector('.players__top-pages span:last-child');
    const prevButton = document.querySelector('.players__top-actions .players__top-btn:first-child');
    const nextButton = document.querySelector('.players__top-actions .players__top-btn:last-child');

    let autoSlideInterval;
    let autoSlideTimeout;

    slides.forEach(slide => {
        slide.style.width = `${slideWidth}px`;
    });
    
    const clonedSlides = [...slides].map(slide => slide.cloneNode(true));
    clonedSlides.forEach(slide => slider.appendChild(slide));

    slider.style.width = `${slideWidth * (slides.length + clonedSlides.length)}px`;


    function updateIndicator() {
        const displayIndex = (currentIndex % totalSlides + totalSlides) % totalSlides + 1;
        pageIndicator.textContent = displayIndex;
        totalIndicator.textContent = totalSlides;
    }
    updateIndicator();

    function moveSlides(offset) {
        currentIndex += offset;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(${-slideWidth * currentIndex}px)`;

        if (currentIndex >= totalSlides) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = 0;
                slider.style.transform = `translateX(0)`;
            }, 500);
        } else if (currentIndex < 0) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = totalSlides - 1;
                slider.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            }, 500);
        }

        updateIndicator();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => moveSlides(1), 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        clearTimeout(autoSlideTimeout);
        autoSlideTimeout = setTimeout(startAutoSlide, 4000);
    }

    prevButton.addEventListener('click', () => {
        stopAutoSlide();
        moveSlides(-1);
    });

    nextButton.addEventListener('click', () => {
        stopAutoSlide();
        moveSlides(1);
    });

    let startX = 0;
    let isDragging = false;

    slider.addEventListener('mousedown', (e) => {
        startX = e.pageX;
        isDragging = true;
        slider.style.cursor = 'grabbing';
        stopAutoSlide();
    });

    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.pageX;
        const distance = endX - startX;
        slider.style.cursor = 'grab';

        if (distance > 50) moveSlides(-1); 
        if (distance < -50) moveSlides(1); 
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        isDragging = true;
        stopAutoSlide();
    });

    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].pageX;
        const distance = endX - startX;

        if (distance > 50) moveSlides(-1);
        if (distance < -50) moveSlides(1); 
    });

    startAutoSlide();
});



