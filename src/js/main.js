import { loadComponent } from './utils/componentLoader.js';
import { initHeader } from './components/header.js';
import { initContactModal } from './components/modal.js';
import { initProductDetailToggle } from './components/productCard.js';
import { initTopSales } from './components/products.js';
import { initSliders } from './components/slider.js';
import { initCategoryTags, initProductionFilters } from './components/filters.js';
import { initFancyboxGallery } from './components/gallery.js';

const $ = selector => document.querySelector(selector);

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', 'header.html', initHeader);
    loadComponent('footer', 'footer.html');
    
    initContactModal();
    initTopSales();
    initSliders();
    initCategoryTags();
    initProductionFilters();
    initFancyboxGallery();
});