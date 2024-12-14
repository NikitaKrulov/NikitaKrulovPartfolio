document.addEventListener('DOMContentLoaded', function () {
    function updateAnchorScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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
    }

    updateAnchorScrolling();

    window.addEventListener('resize', updateAnchorScrolling);


    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('load', checkScreenSize);

    function checkScreenSize() {
        const image = document.querySelector('.support__wrapper img');
        const wrapperTitle = document.querySelector('.support__wrapper-title');
        const wrapper = document.querySelector('.support__wrapper');

        const actions = document.querySelector('.players__top-actions');
        const container = document.querySelector('.players .container');
        const playersTop = document.querySelector('.players__top');

        const airplaneImg = document.querySelector('.airplaneImg');
        const stagesContainer = document.querySelector('.stages .container');
        const stagesGrid = document.querySelector('.stages__grid');
        const stageItems = document.querySelectorAll('.stageItem');
        const stagesHeading = document.querySelector('.stages .container h2');

        if (window.innerWidth < 997) {
            if (image && wrapperTitle && !wrapperTitle.contains(image)) {
                wrapperTitle.appendChild(image);
            }

            if (actions && container && actions.parentElement !== container) {
                container.appendChild(actions);
            }

            if (airplaneImg && stagesContainer && stagesHeading && airplaneImg.parentElement !== stagesContainer) {
                stagesHeading.insertAdjacentElement('afterend', airplaneImg);
            }
        } else {
            if (image && wrapper && wrapperTitle.contains(image)) {
                wrapper.appendChild(image);
            }

            if (actions && playersTop && actions.parentElement !== playersTop) {
                playersTop.appendChild(actions);
            }

            if (airplaneImg && stagesGrid && stageItems.length > 0 && airplaneImg.parentElement !== stageItems[stageItems.length - 1]) {
                stageItems[stageItems.length - 1].appendChild(airplaneImg);
            }
        }
    }

    const tickers = document.querySelectorAll('.ticker');

    tickers.forEach(ticker => {
        const wrapper = ticker.querySelector('.ticker__wrapper');
        const originalContent = wrapper.innerHTML;

        wrapper.innerHTML = originalContent.repeat(3);

        let animationId;
        let position = 0;
        const speed = 100;

        function animate() {
            position += speed / 60;

            if (position >= wrapper.firstElementChild.offsetWidth) {
                position = 0;
                wrapper.appendChild(wrapper.firstElementChild);
            }

            wrapper.style.transform = `translateX(${-position}px)`;
            animationId = requestAnimationFrame(animate);
        }
        animate();
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('.players__wrapper');
    const slides = Array.from(document.querySelectorAll('.playerSlide'));
    const pageIndicator = document.querySelector('.players__top-pagination span:first-child');
    const totalIndicator = document.querySelector('.players__top-pagination span:last-child');
    const prevButton = document.querySelector('.players__top-actions .players__top-btn:first-child');
    const nextButton = document.querySelector('.players__top-actions .players__top-btn:last-child');
    let currentIndex = 0;
    let visibleSlides = 3;
    let autoSlideInterval;
    let autoSlideTimeout;

    const totalSlides = slides.length;

    function getVisibleSlides() {
        if (window.innerWidth <= 720) {
            return 1;
        } else if (window.innerWidth <= 996) {
            return 2;
        }
        return 3;
    }

    function updateSlides() {
        visibleSlides = getVisibleSlides();
        const slideWidth = slider.parentElement.offsetWidth / visibleSlides;
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
        slider.style.width = `${slideWidth * totalSlides}px`;

        updateIndicator();

        currentIndex = 0;
        slider.style.transition = 'none';
        slider.style.transform = 'translateX(0)';
    }

    function updateIndicator() {
        const startSlide = currentIndex + 1;
        const endSlide = Math.min(currentIndex + visibleSlides, totalSlides);

        pageIndicator.textContent = `${endSlide}`;
        totalIndicator.textContent = totalSlides;
    }

    function moveSlides(offset) {
        const maxIndex = totalSlides - visibleSlides;
        currentIndex += offset;

        if (currentIndex < 0) {
            currentIndex = maxIndex;
        } else if (currentIndex > maxIndex) {
            currentIndex = 0;
        }

        const slideWidth = slider.parentElement.offsetWidth / visibleSlides;
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
        updateIndicator();
    }

    function startAutoSlide() {
        if (window.innerWidth >= 720) {
            if (!autoSlideInterval) {
                autoSlideInterval = setInterval(() => moveSlides(1), 4000);
            }
        } else {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
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
        stopAutoSlide();
    });

    slider.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.pageX;
        const distance = endX - startX;

        if (distance > 50) moveSlides(-1);
        if (distance < -50) moveSlides(1);
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
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

    updateSlides();
    window.addEventListener('resize', () => {
        updateSlides();
        startAutoSlide();
    });
    startAutoSlide();
});




document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".stages__grid");
    const items = document.querySelectorAll(".stageItem");
    const circles = document.querySelectorAll(".circle");
    const btnPrev = document.querySelector(".stages__pagination-btnPrev");
    const btnNext = document.querySelector(".stages__pagination-btnNext");

    const groups = [
        [items[0], items[1]],
        [items[2]],
        [items[3], items[4]],
        [items[5]],
        [items[6]]
    ];

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    function enableSlider() {
        grid.style.overflow = "visible";
        grid.style.position = "relative";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${groups.length}, 100%)`;
        grid.style.transition = "transform 0.5s ease";

        groups.forEach((group) => {
            group.forEach((item) => {
                item.style.transition = isDragging ? "none" : "transform 0.5s ease";
                item.style.opacity = "1";
                item.style.pointerEvents = "auto";
            });
        });

        updateSliderPosition();
        updatePagination();

        grid.addEventListener("mousedown", handleDragStart);
        grid.addEventListener("mousemove", handleDragMove);
        grid.addEventListener("mouseup", handleDragEnd);
        grid.addEventListener("mouseleave", handleDragEnd);

        grid.addEventListener("touchstart", handleDragStart);
        grid.addEventListener("touchmove", handleDragMove);
        grid.addEventListener("touchend", handleDragEnd);
    }

    function disableSlider() {
        grid.style.overflow = "";
        grid.style.position = "";
        grid.style.display = "";
        grid.style.gridTemplateColumns = "";
        grid.style.transition = "";
        grid.style.transform = "";
        grid.style.cursor = "";

        groups.forEach((group) => {
            group.forEach((item) => {
                item.style.transition = "";
                item.style.transform = "";
                item.style.pointerEvents = "";
                item.style.opacity = "";
            });
        });

        grid.removeEventListener("mousedown", handleDragStart);
        grid.removeEventListener("mousemove", handleDragMove);
        grid.removeEventListener("mouseup", handleDragEnd);
        grid.removeEventListener("mouseleave", handleDragEnd);

        grid.removeEventListener("touchstart", handleDragStart);
        grid.removeEventListener("touchmove", handleDragMove);
        grid.removeEventListener("touchend", handleDragEnd);
    }

    function updateSliderPosition() {
        grid.style.transform = `translateX(${-currentIndex * 101.5}%)`;
    }

    function updatePagination() {
        circles.forEach((circle, index) => {
            circle.classList.toggle("circle--active", index === currentIndex);
        });

        btnPrev.classList.toggle("stages__pagination-btnPrev--off", currentIndex === 0);
        btnNext.classList.toggle("stages__pagination-btnNext--off", currentIndex === groups.length - 1);
    }

    function nextSlide() {
        if (currentIndex < groups.length - 1) {
            currentIndex++;
            updateSliderPosition();
            updatePagination();
        }
    }

    function previousSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            updatePagination();
        }
    }

    function handleResize() {
        if (window.innerWidth <= 997) {
            enableSlider();
        } else {
            disableSlider();
        }
    }

    function handleDragStart(event) {
        isDragging = true;
        startX = event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
        grid.style.cursor = "grabbing";
    }

    function handleDragMove(event) {
        if (!isDragging) return;

        const currentX = event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
        const deltaX = currentX - startX;
        currentTranslate = deltaX;

        grid.style.transform = `translateX(calc(${-currentIndex * 100}% + ${currentTranslate}px))`;
    }

    function handleDragEnd() {
        isDragging = false;
        grid.style.cursor = "grab";

        if (Math.abs(currentTranslate) > 50) {
            if (currentTranslate < 0 && currentIndex < groups.length - 1) nextSlide();
            else if (currentTranslate > 0 && currentIndex > 0) previousSlide();
            else updateSliderPosition();
        } else {
            updateSliderPosition();
        }

        currentTranslate = 0;
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    document.querySelector(".stages").addEventListener("click", (e) => {
        if (e.target.matches(".stages__pagination-btnNext")) nextSlide();
        if (e.target.matches(".stages__pagination-btnPrev")) previousSlide();
    });
});











