import { products } from './data/products.js';
import { renderProductCards } from './components/productCard.js';

const DESKTOP_ITEMS_PER_PAGE = 12;
const MOBILE_ITEMS_PER_PAGE = 9;
const BREAKPOINT_SMALL_DESKTOP = 1340;

let itemsPerPage = getItemsPerPage();
let currentPage = 1;
let filteredProducts = [...products];

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('catalogFilters');
    const grid = document.querySelector('[data-product-grid="catalog"]');
    const countElement = document.querySelector('[data-product-count]');
    const sortSelect = document.getElementById('catalogSort');
    const clearBtn = document.getElementById('clearFilters');
    const paginationContainer = document.querySelector('[data-pagination]');
    const mobileFiltersBtn = document.querySelector('[data-catalog-filters-open]');
    const sidebar = document.querySelector('.catalog-sidebar');
    const mobileFiltersClose = document.querySelector('[data-catalog-filters-close]');
    const applyButton = filterForm.querySelector('.catalog-filters__submit');

    if (!filterForm || !grid) {
        return;
    }

    initFilterToggles();
    restoreFiltersFromURL();

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
        const scrollToProduct = () => {
            const productCard = document.querySelector(`[data-product-id="${productId}"], [data-productid="${productId}"]`);
            if (productCard) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 88;
                const cardTop = productCard.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({ top: cardTop - headerHeight - 20, behavior: 'smooth' });
                productCard.style.transition = 'box-shadow 0.3s ease';
                productCard.style.boxShadow = '0 0 0 3px rgba(93, 169, 255, 0.5)';
                setTimeout(() => {
                    productCard.style.boxShadow = '';
                }, 2000);
            }
        };
        
        setTimeout(scrollToProduct, 500);

        const observer = new MutationObserver(() => {
            scrollToProduct();
            observer.disconnect();
        });
        observer.observe(grid, { childList: true });
    }

    const applyFilters = () => {
        const formData = new FormData(filterForm);
        const criteria = {
            types: formData.getAll('type'),
            volumes: formData.getAll('volume'),
            volumeFrom: formData.get('volumeFrom'),
            volumeTo: formData.get('volumeTo'),
            necks: formData.getAll('neck'),
            purposes: formData.getAll('purpose'),
            sort: sortSelect ? sortSelect.value : 'default'
        };

        filteredProducts = products.filter((product) => matchesProduct(product, criteria));

        if (criteria.sort !== 'default') {
            filteredProducts = filteredProducts.slice().sort((a, b) => sortProducts(a, b, criteria.sort));
        }

        currentPage = 1;
        renderPage(grid);
        updateCount(filteredProducts.length, countElement);
        renderPagination(paginationContainer, filteredProducts.length);
        scrollToProducts();
        
        saveFiltersToURL(criteria);
    };

    function saveFiltersToURL(criteria) {
        const urlParams = new URLSearchParams();
        
        if (criteria.types.length > 0) {
            criteria.types.forEach(type => urlParams.append('type', type));
        }
        if (criteria.volumes.length > 0) {
            criteria.volumes.forEach(volume => urlParams.append('volume', volume));
        }
        if (criteria.necks.length > 0) {
            criteria.necks.forEach(neck => urlParams.append('neck', neck));
        }
        if (criteria.purposes.length > 0) {
            criteria.purposes.forEach(purpose => {
                urlParams.append('purpose', purpose);
            });
        }
        if (criteria.sort && criteria.sort !== 'default') {
            urlParams.set('sort', criteria.sort);
        }
        
        const currentProductId = new URLSearchParams(window.location.search).get('product');
        if (currentProductId) {
            urlParams.set('product', currentProductId);
        }

        const newURL = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, '', newURL);
        
        setTimeout(() => {
            filteredProducts.forEach((product, index) => {
                const card = grid.children[index];
                if (card) {
                    card.setAttribute('data-product-id', product.id);
                    card.dataset.productId = product.id;
                }
            });
        }, 100);
    }

    function restoreFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        urlParams.getAll('type').forEach(type => {
            const checkbox = filterForm.querySelector(`input[name="type"][value="${type}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        urlParams.getAll('volume').forEach(volume => {
            const checkbox = filterForm.querySelector(`input[name="volume"][value="${volume}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        urlParams.getAll('neck').forEach(neck => {
            const checkbox = filterForm.querySelector(`input[name="neck"][value="${neck}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        urlParams.getAll('purpose').forEach(purpose => {
            if (purpose.includes('|')) {
                const purposes = purpose.split('|').map(p => p.trim());
                purposes.forEach(singlePurpose => {
                    const checkbox = filterForm.querySelector(`input[name="purpose"][value="${singlePurpose}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else {
                const checkbox = filterForm.querySelector(`input[name="purpose"][value="${purpose}"]`);
                if (checkbox) checkbox.checked = true;
            }
        });
        
        if (sortSelect) {
            const sort = urlParams.get('sort');
            if (sort) {
                sortSelect.value = sort;
            }
        }
    }

    function scrollToProducts() {
        const gridTop = grid.getBoundingClientRect().top + window.pageYOffset;
        const scrollPosition = gridTop - 88;
        
        if (!isElementInViewport(grid)) {
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function initFilterToggles() {
        const filterLabels = filterForm.querySelectorAll('.catalog-filters__label');

        filterLabels.forEach((label) => {
            const group = label.parentElement;
            group.classList.add('filter-group--expanded');

            label.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                group.classList.toggle('filter-group--expanded');
            });
        });
    }

    const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (window.innerWidth > BREAKPOINT_SMALL_DESKTOP) {
                applyFilters();
            }
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filterForm.reset();
            applyFilters();
        });
    }

    function closeMobileFilters() {
        if (!sidebar) return;
        sidebar.classList.remove('catalog-sidebar--mobile-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        if (applyButton) {
            applyButton.textContent = 'Применить фильтр';
            applyButton.classList.remove('btn__outline');
            applyButton.classList.add('btn__primary');
            applyButton.dataset.state = 'apply';
        }
    }

    if (mobileFiltersBtn && sidebar) {
        mobileFiltersBtn.addEventListener('click', () => {
            sidebar.classList.add('catalog-sidebar--mobile-open');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            if (window.innerWidth <= BREAKPOINT_SMALL_DESKTOP) {
                const filterLabels = filterForm.querySelectorAll('.catalog-filters__label');
                filterLabels.forEach(label => {
                    const group = label.parentElement;
                    const checkboxes = group.querySelector('.catalog-filters__checkboxes');
                    
                    if (!group.classList.contains('filter-group--expanded')) {
                        group.classList.add('filter-group--expanded');
                        requestAnimationFrame(() => {
                            checkboxes.style.maxHeight = 'none';
                            const height = checkboxes.scrollHeight;
                            checkboxes.style.maxHeight = height + 'px';
                            checkboxes.style.opacity = '1';
                        });
                    }
                });
            }

            if (applyButton) {
                applyButton.textContent = 'Применить фильтр';
                applyButton.classList.remove('btn__outline');
                applyButton.classList.add('btn__primary');
                applyButton.dataset.state = 'apply';
            }
        });

        sidebar.addEventListener('click', (event) => {
            if (event.target === sidebar) {
                closeMobileFilters();
            }
        });

        if (mobileFiltersClose) {
            mobileFiltersClose.addEventListener('click', () => {
                closeMobileFilters();
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && sidebar.classList.contains('catalog-sidebar--mobile-open')) {
                closeMobileFilters();
            }
        });

        if (applyButton) {
            applyButton.addEventListener('click', (event) => {
                event.preventDefault();

                const currentState = applyButton.dataset.state || 'apply';

                if (currentState === 'apply') {
                    applyFilters();
                    applyButton.textContent = 'Показать';
                    applyButton.classList.remove('btn__primary');
                    applyButton.classList.add('btn__outline');
                    applyButton.dataset.state = 'show';
                } else {
                    closeMobileFilters();
                }
            });
        }

        filterForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    } else {
        filterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            applyFilters();
        });
    }

    applyFilters();
    
    window.restoreFiltersFromURL = restoreFiltersFromURL;

    window.addEventListener('resize', () => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1;
            renderPage(grid);
            renderPagination(paginationContainer, filteredProducts.length);
        }
    });
});

function getItemsPerPage() {
    return window.innerWidth < 768 ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE;
}

function matchesProduct(product, criteria) {
    if (criteria.types.length > 0 && !criteria.types.includes(product.type)) {
        return false;
    }

    if (criteria.necks.length > 0) {
        let matchesNeck = false;
        
        criteria.necks.forEach(neckFilter => {
            const productNeckCombined = `${product.neck} ${product.standard}`.trim();
            if (productNeckCombined.includes(neckFilter) || neckFilter.includes(productNeckCombined)) {
                matchesNeck = true;
                return;
            }
            
            if (product.neck && (neckFilter === product.neck || product.neck.includes(neckFilter))) {
                matchesNeck = true;
                return;
            }
            
            if (product.neck && product.neck.includes(';')) {
                const multipleNecks = product.neck.split(';').map(n => n.trim());
                if (multipleNecks.some(neck => neck.includes(neckFilter) || neckFilter.includes(neck))) {
                    matchesNeck = true;
                    return;
                }
            }
        });

        if (!matchesNeck) {
            return false;
        }
    }

    if (criteria.purposes.length > 0) {
        let matchesPurpose = false;
        
        const productPurposes = product.purpose.split(';').map(p => p.trim());
        
        criteria.purposes.forEach(filterPurpose => {
            if (productPurposes.some(productPurpose => 
                productPurpose.includes(filterPurpose) || filterPurpose.includes(productPurpose)
            )) {
                matchesPurpose = true;
                return;
            }
        });

        if (!matchesPurpose) {
            return false;
        }
    }

    if (criteria.volumes.length > 0 && product.volume) {
        const productVolume = parseFloat(product.volume.replace(' л', '').replace(',', '.'));
        const matchesVolumeRange = criteria.volumes.some((range) => {
            const [min, max] = range.split('-').map(parseFloat);
            return productVolume >= min && productVolume <= max;
        });

        if (!matchesVolumeRange) {
            return false;
        }
    }

    if (criteria.volumes.length > 0 && !product.volume) {
        return false;
    }

    return true;
}

function sortProducts(a, b, sortValue) {
    if (sortValue === 'priceAsc') {
        return a.price - b.price;
    }
    if (sortValue === 'priceDesc') {
        return b.price - a.price;
    }
    return 0;
}

function updateCount(count, element) {
    if (!element) {
        return;
    }

    const suffix = getCountSuffix(count);
    element.textContent = `Найдено ${count} ${suffix}`;
}

function getCountSuffix(count) {
    const remainder10 = count % 10;
    const remainder100 = count % 100;

    if (remainder10 === 1 && remainder100 !== 11) {
        return 'позиция';
    }

    if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 10 || remainder100 >= 20)) {
        return 'позиции';
    }

    return 'позиций';
}

function renderPagination(container, totalItems) {
    if (!container) {
        return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) {
                pages.push(i);
            }
            pages.push('ellipsis');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('ellipsis');
            for (let i = totalPages - 3; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            pages.push('ellipsis');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(i);
            }
            pages.push('ellipsis');
            pages.push(totalPages);
        }
    }

    container.innerHTML = `
        <button class="catalog-pagination__btn catalog-pagination__btn--prev btn__outline" ${currentPage === 1 ? 'disabled' : ''}>
            <img src="images/icons/arrow-blue.svg" alt="Назад">
        </button>
        <div class="catalog-pagination__pages">
            ${pages.map((page) => {
                if (page === 'ellipsis') {
                    return '<span class="pagination__ellipsis">...</span>';
                }
                const isActive = page === currentPage;
                return `<button class="catalog-pagination__page ${isActive ? 'catalog-pagination__page--active' : ''}" data-page="${page}">${page}</button>`;
            }).join('')}
        </div>
        <button class="catalog-pagination__btn catalog-pagination__btn--next btn__outline" ${currentPage === totalPages ? 'disabled' : ''}>
            <img src="images/icons/arrow-blue.svg" alt="Вперед">
        </button>
    `;

    const grid = document.querySelector('[data-product-grid="catalog"]');

    container.querySelectorAll('.catalog-pagination__page').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderPage(grid);
            renderPagination(container, totalItems);
            const gridTop = grid.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: gridTop - 88, behavior: 'smooth' });
        });
    });

    container.querySelector('.catalog-pagination__btn--prev')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(grid);
            renderPagination(container, totalItems);
            const gridTop = grid.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: gridTop - 88, behavior: 'smooth' });
        }
    });

    container.querySelector('.catalog-pagination__btn--next')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(grid);
            renderPagination(container, totalItems);
            const gridTop = grid.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: gridTop - 88, behavior: 'smooth' });
        }
    });
}

function renderPage(grid) {
    if (!grid) {
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    renderProductCards(grid, pageProducts, 'Нет товаров по заданным параметрам');
}