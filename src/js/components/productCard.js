export function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.setAttribute('data-product-id', product.id);
    card.innerHTML = `
        <div class="product-card__image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <h3 class="product-card__title">${product.title}</h3>
        <div class="product-card__info">
            ${createDetail('Горловина', product.neck)}
            ${createDetail('Стандарт', product.standard)}
            ${createDetail('Упаковка', product.pack)}
            ${createDetail('Назначение', product.purpose)}
        </div>
        <div class="product-card__footer">
            <span class="product-card__price">от <span>${formatPrice(product.price)}</span> р/шт</span>
            <button class="product-card__cart" type="button" aria-label="Добавить в корзину">
                <img src="/images/icons/basket.svg" alt="">
            </button>
        </div>
    `;
    return card;
}

function createDetail(label, value) {
    if (!value) {
        return '';
    }

    return `
        <p class="product-card__detail">
            <span>${label}:</span>
            <span class="text-value">${value}</span>
        </p>
    `;
}

function formatPrice(price) {
    if (typeof price === 'number') {
        return price.toFixed(2);
    }

    return price;
}

export function renderProductCards(container, products, emptyMessage = 'Нет товаров для отображения') {
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

    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
        fragment.appendChild(createProductCard(product));
    });

    container.appendChild(fragment);
}

export function initProductDetailToggle() {
    document.addEventListener('click', (event) => {
        const detail = event.target.closest('.product-card__detail');
        if (!detail) return;

        const textValue = detail.querySelector('.text-value');
        if (!textValue) return;

        const isTextOverflowing = textValue.scrollWidth > textValue.clientWidth;
        if (!isTextOverflowing && !detail.classList.contains('expanded')) return;

        textValue.style.transition = 'none';
        
        if (detail.classList.contains('expanded')) {
            const currentHeight = textValue.scrollHeight;
            textValue.style.maxHeight = currentHeight + 'px';
            textValue.style.whiteSpace = 'normal';
            
            requestAnimationFrame(() => {
                detail.classList.remove('expanded');
                textValue.style.transition = 'max-height 0.3s ease';
                textValue.style.maxHeight = '1.2em';
                
                setTimeout(() => {
                    textValue.style.whiteSpace = 'nowrap';
                    textValue.style.textOverflow = 'ellipsis';
                    textValue.style.maxHeight = '';
                    textValue.style.transition = '';
                }, 300);
            });
            
        } else {
            detail.classList.add('expanded');
            textValue.style.maxHeight = '1.2em';
            textValue.style.whiteSpace = 'normal';
            textValue.style.textOverflow = 'clip';
            
            requestAnimationFrame(() => {
                textValue.style.transition = 'max-height 0.3s ease';
                textValue.style.maxHeight = textValue.scrollHeight + 'px';
                
                setTimeout(() => {
                    textValue.style.maxHeight = 'none';
                    textValue.style.transition = '';
                }, 300);
            });
        }
    });
}

