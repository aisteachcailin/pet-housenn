import { loadComponent } from './utils/componentLoader.js';
import { initHeader } from './components/header.js';
import { initContactModal } from './components/modal.js';
import { initProductDetailToggle } from './components/productCard.js';
import { initTopSales } from './components/products.js';
import { initSliders } from './components/slider.js';
import { initCategoryTags, initProductionFilters, initCatalogLinks } from './components/filters.js';
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
    initCatalogLinks();
    initFancyboxGallery();
    initProductDetailToggle()

    const shortWords = [
        'в', 'на', 'под', 'над', 'за', 'из', 'от', 'до', 'по', 
        'со', 'ко', 'о', 'у', 'без', 'для', 'к', 'с', 'и', 'а', 
        'но', 'или', 'как', 'что', 'то', 'же', 'бы', 'ль', 'ли', 
        'ни', 'не', 'но', 'ну', 'во', 'об', 'то', 'же', 'би'
    ];
    
    const selectors = 'p, h1, h2, h3, h4, h5, h6, li, span:not(.icon):not(.btn), div.text-content';
    
    function processElement(element) {
        const text = element.innerHTML;
        if (!text || text.length < 10) return;
        
        let processedText = text;
        
        shortWords.forEach(word => {
            const regex = new RegExp(`(\\s|^|>)(${word})\\s+`, 'gi');
            processedText = processedText.replace(regex, (match, space, preposition) => {
                return space + preposition + '&nbsp;';
            });
        });
        
        if (processedText !== text) {
            element.innerHTML = processedText;
        }
    }
    
    document.querySelectorAll(selectors).forEach(processElement);
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { 
                    if (node.matches && node.matches(selectors)) {
                        processElement(node);
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll(selectors).forEach(processElement);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});