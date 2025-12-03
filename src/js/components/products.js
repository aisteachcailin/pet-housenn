import { renderProductCards } from './productCard.js';
import { topSalesProducts } from '../data/products.js';

export function initTopSales() {
    const sliderWrapper = document.querySelector('.top-sales__slider .swiper-wrapper');
    
    if (!sliderWrapper) {
        return; 
    }

    renderProductCardsToSlider(sliderWrapper, topSalesProducts, 'Нет популярных позиций');
}

function renderProductCardsToSlider(container, products, emptyMessage = 'Нет товаров для отображения') {
    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (!products.length) {
        const emptyState = document.createElement('div'); 
        emptyState.className = 'product-grid__empty';
        emptyState.textContent = emptyMessage;
        container.appendChild(emptyState);
        return;
    }

    const tempContainer = document.createElement('div');
    
    renderProductCards(tempContainer, products, emptyMessage);
    
    Array.from(tempContainer.children).forEach(card => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.appendChild(card);
        container.appendChild(slide);
    });
}