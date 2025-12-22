import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
export function initSliders() {
    const pictureSliders = document.querySelectorAll('[data-slider="pictures"]');
    pictureSliders.forEach((slider) => {
        const slidesDesktop = parseFloat(slider.dataset.slidesDesktop) || 3;
        const slidesTablet = parseFloat(slider.dataset.slidesTablet) || 2;
        const slidesMobile = parseFloat(slider.dataset.slidesMobile) || 1.2;
        const spaceDesktop = parseFloat(slider.dataset.spaceDesktop) || 60;
        const spaceTablet = parseFloat(slider.dataset.spaceTablet) || 20;
        const spaceMobile = parseFloat(slider.dataset.spaceMobile) || 16;

        new Swiper(slider, {
            slidesPerView: slidesDesktop,
            spaceBetween: spaceDesktop,
            grabCursor: true,
            watchOverflow: true,
            breakpoints: {
                320: {
                    slidesPerView: slidesMobile,
                    spaceBetween: spaceMobile,
                },
                768: {
                    slidesPerView: slidesTablet,
                    spaceBetween: spaceTablet,
                },
                1200: {
                    slidesPerView: slidesDesktop,
                    spaceBetween: spaceDesktop,
                },
            },
        });
    });

    const topSalesSliders = document.querySelectorAll('[data-slider="top-sales"]');
    topSalesSliders.forEach((slider) => {
        const slidesDesktop = parseFloat(slider.dataset.slidesDesktop) || 4;
        const slidesTablet = parseFloat(slider.dataset.slidesTablet) || 3;
        const slidesMobile = parseFloat(slider.dataset.slidesMobile) || 1.2;
        const spaceDesktop = parseFloat(slider.dataset.spaceDesktop) || 32;
        const spaceTablet = parseFloat(slider.dataset.spaceTablet) || 24;
        const spaceMobile = parseFloat(slider.dataset.spaceMobile) || 24;

        new Swiper(slider, {
            slidesPerView: slidesDesktop,
            spaceBetween: spaceDesktop,
            grabCursor: true,
            watchOverflow: true,
            breakpoints: {
                320: {
                    slidesPerView: 1.2, 
                    spaceBetween: 16, 
                },
                460: {
                    slidesPerView: 1.5, 
                    spaceBetween: 20,
                },
                600: {
                    slidesPerView: 2.2, 
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2.2, 
                    spaceBetween: 24,
                },
                820: {
                    slidesPerView: 3, 
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 3.2,
                    spaceBetween: 28,
                },
                1200: {
                    slidesPerView: 4, 
                    spaceBetween: 32,
                },
            },
        });
    });

    const benefitsSliders = document.querySelectorAll('[data-slider="benefits"]');
    benefitsSliders.forEach((slider) => {
        const paginationEl = slider.querySelector('.production-benefits__pagination');

        new Swiper(slider, {
            modules: [Pagination],
            slidesPerView: 1,
            spaceBetween: 0,
            grabCursor: true,
            watchOverflow: true,
            pagination: {
                el: paginationEl,
                clickable: true,
            },
            breakpoints: {
                768: {
                    enabled: false,
                },
            },
            observer: true,
            observeParents: true,
        });
    });

    const catalogFeatureSliders = document.querySelectorAll('[data-slider="catalog-features"]');
    catalogFeatureSliders.forEach((slider) => {
        const paginationEl = slider.querySelector('.features__pagination');

        new Swiper(slider, {
            modules: [Pagination],
            slidesPerView: 1,
            spaceBetween: 16,
            centeredSlides: false,
            grabCursor: true,
            watchOverflow: true,
            pagination: {
                el: paginationEl,
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                    centeredSlides: false,
                },
                600: {
                    slidesPerView: 1.6,
                    spaceBetween: 48,
                    centeredSlides: true,
                },
                1024: {
                    enabled: false,
                },
            },
            observer: true,
            observeParents: true,
        });
    });

    const mainFeatureSliders = document.querySelectorAll('[data-slider="main-features"]');
    mainFeatureSliders.forEach((slider) => {
        const paginationEl = slider.querySelector('.features__pagination');

        new Swiper(slider, {
            modules: [Pagination],
            slidesPerView: 1,
            spaceBetween: 16,
            centeredSlides: false,
            grabCursor: true,
            watchOverflow: true,
            pagination: {
                el: paginationEl,
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                    centeredSlides: false,
                },
                600: {
                    slidesPerView: 1.6,
                    spaceBetween: 48,
                    centeredSlides: true,
                },
                1024: {
                    enabled: false,
                },
            },
            observer: true,
            observeParents: true,
        });
    });


    const productionVideo = document.querySelector('.production-video');
    
    if (productionVideo) {
        const playVideo = () => {
            productionVideo.play().catch(error => {
                console.log('Автозапуск видео не удался:', error);
            });
        };
        
        if (productionVideo.readyState >= 2) {
            playVideo();
        } else {
            productionVideo.addEventListener('loadeddata', playVideo);
        }
        
        productionVideo.addEventListener('click', () => {
            if (productionVideo.paused) {
                productionVideo.play();
            }
        });
    }

    const videoLink = document.querySelector('.production-slider__big a');
    const videoElement = document.querySelector('.production-video');
    
    if (videoLink && videoElement) {
        videoLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            const videoClone = videoElement.cloneNode(true);
            videoClone.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            videoClone.controls = true;
            videoClone.muted = false;
            
            modal.appendChild(videoClone);
            document.body.appendChild(modal);
            
            modal.addEventListener('click', () => {
                videoClone.pause();
                modal.remove();
            });
            
            videoClone.play();
        });
    }
}