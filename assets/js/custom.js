document.addEventListener('DOMContentLoaded', function () {
    const CONTENT_AUTOPLAY_INTERVAL = 5000; // Regular sliders: 5 seconds
    const HERO_AUTOPLAY_INTERVAL = 5000;    // Hero slider: 5 seconds

    // Function to toggle theme
    function initThemeToggle() {
        // Don't add a new event listener - the one in _main.js will handle it

        // Just apply saved theme on load
        // const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        // document.documentElement.setAttribute('data-theme', savedTheme);

        // Use site's configured theme (dark) with no fallback option
        const savedTheme = 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const hrefAttribute = this.getAttribute('href');
                if (hrefAttribute && hrefAttribute !== '#' && hrefAttribute !== '#0') {
                    const targetElement = document.querySelector(hrefAttribute);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Mobile menu toggle
    function initMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }

    // Hero slider indicator functionality
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-container');
        if (!sliderContainer) return;

        let heroAutoplayTimer = null;
        const slides = Array.from(sliderContainer.children).filter(child => child.matches('.feature-style-hero'));
        if (slides.length <= 1) return; // No indicators needed for 0 or 1 slide

        let indicatorsContainer = document.querySelector('.hero-slider-indicators');
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'hero-slider-indicators';
            // Insert after the slider container, typically within the hero-image-container
            if (sliderContainer.parentNode) {
                sliderContainer.parentNode.appendChild(indicatorsContainer);
            }
        } else {
            indicatorsContainer.innerHTML = ''; // Clear existing indicators if any
        }

        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                sliderContainer.scrollTo({
                    left: slides[index].offsetLeft,
                    behavior: 'smooth'
                });
                resetHeroAutoplay(); // Reset autoplay on manual interaction
            });
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = indicatorsContainer.querySelectorAll('.indicator');

        function updateHeroIndicators() {
            const scrollLeft = sliderContainer.scrollLeft;
            const containerWidth = sliderContainer.offsetWidth;
            let activeIndex = 0;
            let minDistance = Infinity;

            slides.forEach((slide, index) => {
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const viewCenter = scrollLeft + containerWidth / 2;
                const distance = Math.abs(slideCenter - viewCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    activeIndex = index;
                }
            });

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndex);
            });
        }

        function startHeroAutoplay() {
            stopHeroAutoplay(); // Clear existing timer before starting a new one
            if (slides.length <= 1) return; // No autoplay for single or no slides
            heroAutoplayTimer = setInterval(() => {
                const currentIndex = getCurrentHeroSlideIndex();
                const nextIndex = (currentIndex + 1) % slides.length;
                sliderContainer.scrollTo({
                    left: slides[nextIndex].offsetLeft,
                    behavior: 'smooth'
                });
            }, HERO_AUTOPLAY_INTERVAL); // Use hero-specific interval here
        }

        function stopHeroAutoplay() {
            if (heroAutoplayTimer) {
                clearInterval(heroAutoplayTimer);
                heroAutoplayTimer = null;
            }
        }

        function resetHeroAutoplay() {
            stopHeroAutoplay();
            startHeroAutoplay();
        }

        function getCurrentHeroSlideIndex() { // Helper to get current slide index for autoplay
            const scrollLeft = sliderContainer.scrollLeft;
            const slideWidth = slides[0] ? slides[0].offsetWidth : sliderContainer.offsetWidth;
            if (slideWidth === 0) return 0;
            return Math.round(scrollLeft / slideWidth);
        }

        sliderContainer.addEventListener('scroll', updateHeroIndicators, { passive: true });
        sliderContainer.addEventListener('touchend', () => { setTimeout(updateHeroIndicators, 150); resetHeroAutoplay(); }, { passive: true });
        sliderContainer.addEventListener('mouseup', () => { setTimeout(updateHeroIndicators, 150); resetHeroAutoplay(); });
        // sliderContainer.addEventListener('mouseenter', stopHeroAutoplay);
        sliderContainer.addEventListener('mouseleave', startHeroAutoplay);

        updateHeroIndicators(); // Initial call
        window.addEventListener('resize', updateHeroIndicators);
        window.addEventListener('orientationchange', () => setTimeout(updateHeroIndicators, 200));
        startHeroAutoplay(); // Start autoplay
    }

    // Content sliders (custom-feature-section sliders)
    function initContentSliders() {
        const sliderSections = document.querySelectorAll('.custom-feature-section');

        sliderSections.forEach((section, sectionIndex) => {
            const sliderContainer = section.querySelector('.floating-slider-container');
            if (!sliderContainer) return;

            let contentAutoplayTimer = null;
            const slides = Array.from(sliderContainer.children).filter(child =>
                child.matches('.custom-feature__item, .custom-feature__item-2')
            );

            const prevArrow = section.querySelector('.slider-arrow-prev');
            const nextArrow = section.querySelector('.slider-arrow-next');

            // Initial check for slider necessity, will also be handled by updateUI on resize/load
            const itemsFitInContainerInitial = sliderContainer.scrollWidth <= sliderContainer.offsetWidth;
            if (slides.length <= 1 || itemsFitInContainerInitial) {
                const indicatorsToHide = section.querySelector(`.slider-indicators[data-slider-id="slider-${sectionIndex}"]`);
                if (indicatorsToHide) {
                    // Instead of removing, hide it. updateUI will manage visibility.
                    // indicatorsToHide.remove();
                    indicatorsToHide.style.display = 'none';
                }
                if (prevArrow) {
                    prevArrow.style.display = 'none';
                    prevArrow.disabled = true;
                }
                if (nextArrow) {
                    nextArrow.style.display = 'none';
                    nextArrow.disabled = true;
                }
                stopContentAutoplay(); // Ensure autoplay is not running
                // Don't return yet, let updateUI handle final state,
                // especially if indicators are created then hidden by updateUI.
                // However, if no indicators are created, this early return is fine.
                // For safety, let's ensure indicators are created if needed, then updateUI handles visibility.
                // The original code would return here, preventing indicator creation.
                // If slides.length <=1, it's safe to return. If itemsFit, updateUI will handle.
                if (slides.length <= 1) return;
            }

            if (prevArrow) prevArrow.style.display = '';
            if (nextArrow) nextArrow.style.display = '';

            let indicatorsContainer = section.querySelector(`.slider-indicators[data-slider-id="slider-${sectionIndex}"]`);
            if (!indicatorsContainer) {
                indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'slider-indicators';
                indicatorsContainer.dataset.sliderId = `slider-${sectionIndex}`;
                // Append indicators container relative to the slider container's parent (the section)
                sliderContainer.parentNode.appendChild(indicatorsContainer);

                slides.forEach((_, index) => {
                    const indicator = document.createElement('div');
                    indicator.className = 'indicator';
                    if (index === 0) indicator.classList.add('active');
                    indicatorsContainer.appendChild(indicator);
                });
            } else {
                 // Ensure it's visible if it was hidden and now slider is active
                indicatorsContainer.style.display = '';
            }
            const indicators = Array.from(indicatorsContainer.querySelectorAll('.indicator'));

            function getScrollTargetForIndex(index) {
                if (!slides[index]) return sliderContainer.scrollLeft;

                // For navigation, always align items to the left edge of the container
                // This ensures clean transitions with multiple visible items

                // Simply return the offsetLeft of the target slide
                // This places the item at the left edge of the viewport
                return slides[index].offsetLeft;
            }

            // This should be the version that finds the slide closest to the current scrollLeft
            function getCurrentSlideIndex() {
                const currentScroll = sliderContainer.scrollLeft;
                let closestIndex = 0;
                let minDiff = Infinity;

                if (slides.length === 0) return 0;

                slides.forEach((slide, index) => {
                    const slideStart = slide.offsetLeft;
                    const diff = Math.abs(slideStart - currentScroll);

                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = index;
                    }
                    // If a slide's start is very close to currentScroll, it's a strong candidate.
                    // Note: return from forEach callback doesn't exit the outer function,
                    // but closestIndex will hold the best match.
                    if (diff < 1) { // Use a small tolerance
                        closestIndex = index;
                        // return; // This return is for the forEach callback
                    }
                });
                return closestIndex;
            }

            function updateUI() {
                if (!slides.length) return;

                const itemsFitInContainer = sliderContainer.scrollWidth <= sliderContainer.offsetWidth + 2; // 2px tolerance
                const hasMultipleSlides = slides.length > 1;

                if (!hasMultipleSlides || itemsFitInContainer) {
                    if (prevArrow) {
                        prevArrow.style.display = 'none';
                        prevArrow.disabled = true;
                    }
                    if (nextArrow) {
                        nextArrow.style.display = 'none';
                        nextArrow.disabled = true;
                    }
                    if (indicatorsContainer) indicatorsContainer.style.display = 'none';
                    stopContentAutoplay(); // Stop autoplay if items fit or only one slide
                    return;
                }

                // If we are here, slider is active, ensure controls are visible
                if (prevArrow) prevArrow.style.display = '';
                if (nextArrow) nextArrow.style.display = '';
                if (indicatorsContainer) indicatorsContainer.style.display = '';

                const currentIndex = getCurrentSlideIndex();

                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });

                if (prevArrow && nextArrow) {
                    // Disable prev arrow if at the beginning
                    prevArrow.disabled = sliderContainer.scrollLeft < 2; // Small tolerance

                    // Disable next arrow if at the end
                    const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;
                    nextArrow.disabled = sliderContainer.scrollLeft >= maxScroll - 2; // Small tolerance
                }
            }

            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    const targetScrollLeft = getScrollTargetForIndex(index);
                    if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1) {
                        sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                        resetContentAutoplay();
                    }
                });
            });

            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const targetIndex = Math.max(0, currentIndex - 1);

                    if (currentIndex > 0 || (currentIndex === 0 && sliderContainer.scrollLeft > 1)) {
                        const targetScrollLeft = getScrollTargetForIndex(targetIndex);
                        if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1) {
                            sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                            resetContentAutoplay();
                        }
                    }
                });
            }

            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    const currentIndex = getCurrentSlideIndex();
                    const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;

                    if (sliderContainer.scrollLeft < maxScroll - 2) { // If not already at the very end
                        let targetNextIndex = currentIndex + 1;
                        let targetScrollLeft;

                        if (slides[targetNextIndex]) {
                            targetScrollLeft = getScrollTargetForIndex(targetNextIndex);
                            if (targetScrollLeft > maxScroll) {
                                targetScrollLeft = maxScroll;
                            }
                        } else {
                            targetScrollLeft = maxScroll;
                        }

                        if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1) {
                            sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                            resetContentAutoplay();
                        }
                    }
                });
            }

            function startContentAutoplay() {
                stopContentAutoplay();
                if (slides.length <= 1) return;

                const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;
                if (maxScroll <= 2) { // If not scrollable (or barely), don't start autoplay
                    return;
                }

                contentAutoplayTimer = setInterval(() => {
                    const currentFirstIndex = getCurrentSlideIndex();
                    let targetScrollLeft;
                    const maxScroll = sliderContainer.scrollWidth - sliderContainer.offsetWidth;
                    const isEffectivelyAtEnd = sliderContainer.scrollLeft >= maxScroll - 2;

                    if (isEffectivelyAtEnd && slides.length > 1) { // If at the end, loop to beginning
                        targetScrollLeft = 0;
                    } else {
                        const nextPotentialIndex = currentFirstIndex + 1;
                        // Target the start of the next slide, or maxScroll if it's the end
                        targetScrollLeft = slides[nextPotentialIndex] ? getScrollTargetForIndex(nextPotentialIndex) : maxScroll;
                        if (targetScrollLeft > maxScroll) {
                            targetScrollLeft = maxScroll;
                        }
                    }

                    if (Math.abs(sliderContainer.scrollLeft - targetScrollLeft) > 1 || (targetScrollLeft === 0 && sliderContainer.scrollLeft !== 0) ) {
                         sliderContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
                    }
                }, CONTENT_AUTOPLAY_INTERVAL);
            }

            function stopContentAutoplay() {
                if (contentAutoplayTimer) {
                    clearInterval(contentAutoplayTimer);
                    contentAutoplayTimer = null;
                }
            }

            function resetContentAutoplay() {
                stopContentAutoplay();
                startContentAutoplay();
            }

            // Event listeners for interaction
            sliderContainer.addEventListener('scroll', updateUI, { passive: true });
            sliderContainer.addEventListener('touchend', () => { setTimeout(updateUI, 150); resetContentAutoplay(); }, { passive: true });

            let isDragging = false;
            sliderContainer.addEventListener('mousedown', () => { isDragging = true; });
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    setTimeout(updateUI, 150);
                    resetContentAutoplay(); // Reset autoplay after drag
                }
                isDragging = false;
            }, { capture: true }); // Use capture to catch mouseup even if outside slider

            sliderContainer.addEventListener('mouseenter', stopContentAutoplay);
            sliderContainer.addEventListener('mouseleave', startContentAutoplay);

            updateUI();
            window.addEventListener('load', updateUI);
            window.addEventListener('resize', updateUI);
            window.addEventListener('orientationchange', () => setTimeout(updateUI, 200));
            startContentAutoplay(); // Start autoplay for this content slider
        });
    }

    function initAllSliders() {
        initHeroSlider();
        initContentSliders();
    }

    // PDF viewer selector based on device type
    function initPdfViewerSelector() {
        // Check if we're on a page with PDF viewers (using the exact IDs from your template)
        const desktopViewer = document.getElementById('desktop-file-viewer');
        const mobileViewer = document.getElementById('mobile-file-viewer');

        if (!desktopViewer && !mobileViewer) return; // Not a PDF viewer page

        function isMobileBrowser() {
            // Check for common mobile browser indicators
            var check = false;
            (function(a){
                if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
                    check = true;
            })(navigator.userAgent||navigator.vendor||window.opera);

            // Additional check for iOS devices
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                check = true;
            }

            // Additional check for touch devices
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                check = true;
            }

            return check;
        }

        // Apply the appropriate viewer based on browser detection
        function applyAppropriateViewer() {
            if (isMobileBrowser()) {
                // On mobile browser
                if (mobileViewer) {
                    // If mobile PDF is available, use it
                    desktopViewer.style.display = 'none';
                    mobileViewer.style.display = 'block';
                    console.log("Mobile browser: Using mobile PDF viewer");
                } else {
                    // If no mobile PDF, fallback to desktop version
                    desktopViewer.style.display = 'block';
                    console.log("Mobile browser: No mobile PDF available, using desktop version");
                }
            } else {
                // On desktop browser
                desktopViewer.style.display = 'block';
                if (mobileViewer) mobileViewer.style.display = 'none';
                console.log("Desktop browser: Using desktop PDF viewer");
            }
        }

        // Apply viewer settings
        applyAppropriateViewer();
    }

    // Initialize all functionalities
    initThemeToggle();
    initSmoothScroll();
    initMenuToggle();
    initAllSliders();
    initPdfViewerSelector();
});
