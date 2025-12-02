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
            centeredSlides: true,
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
                },
                768: {
                    slidesPerView: 1.4,
                    spaceBetween: 20,
                },
                1340: {
                    enabled: false,
                },
            },
            observer: true,
            observeParents: true,
        });
    });
}