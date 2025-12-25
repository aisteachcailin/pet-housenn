export function initCategoryTags() {
    function normalizeText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    const categoryMap = {
        'Пивоварение': ['Пиво, газированные напитки'],
        'Лимонады': ['Лимонады, соки, вода'],
        'Молоко': ['Молоко'],
        'Незамерзающая жидкость': ['Химия, удобрения, вода'],
        'Соки': ['Лимонады, соки, вода'],
        'Косметика': ['Косметика, другая тара'],
        'Химия': ['Химия, удобрения, вода'],
        'Масла': ['Масла, соусы'],
        'Удобрения': ['Химия, удобрения, вода'],
        'Соусы': ['Масла, соусы'],
        'Электроды': 'type=Другая тара',
        'БАДы, сыпучие и гранулированные продукты': ['БАДы, сыпучие и гранулированные продукты'],
        'Упаковка для электродов': 'type=Другая тара', 
        'Упаковки для соусов': ['Масла, соусы'],
        'Упаковка для БАДов, сыпучих и гранулированных продуктов': ['БАДы, сыпучие и гранулированные продукты']
    };

    const businessTags = document.querySelectorAll('.business__tag');
    const newProductTags = document.querySelectorAll('.new-products__items .glass-block');
    
    if (businessTags.length === 0 && newProductTags.length === 0) {
        return; 
    }

    businessTags.forEach((tag) => {
        tag.addEventListener('click', () => {
            const category = normalizeText(tag.textContent);
            const filters = categoryMap[category];
            
            if (!filters) {
                console.warn(`Категория "${category}" не найдена в маппинге`);
                return;
            }
            
            if (typeof filters === 'string' && filters.startsWith('type=')) {
                const typeValue = filters.replace('type=', '');
                const url = `catalog.html?type=${encodeURIComponent(typeValue)}`;
                window.location.href = url;
            } else {
                const filtersString = filters.join('|');
                const url = `catalog.html?purpose=${encodeURIComponent(filtersString)}`;
                window.location.href = url;
            }
        });
    });

    newProductTags.forEach((tag) => {
        tag.addEventListener('click', () => {
            let category = normalizeText(tag.textContent);
            const filters = categoryMap[category];
            
            if (!filters) {
                const similarKey = Object.keys(categoryMap).find(key => {
                    const normalizedKey = normalizeText(key);
                    return normalizedKey === category || 
                           (category.includes('БАД') && normalizedKey.includes('БАД') && 
                            category.includes('сыпучих') && normalizedKey.includes('сыпучих'));
                });
                
                if (similarKey) {
                    const similarFilters = categoryMap[similarKey];
                    
                    if (typeof similarFilters === 'string' && similarFilters.startsWith('type=')) {
                        const typeValue = similarFilters.replace('type=', '');
                        const url = `catalog.html?type=${encodeURIComponent(typeValue)}`;
                        window.location.href = url;
                    } else {
                        const filtersString = similarFilters.join('|');
                        const url = `catalog.html?purpose=${encodeURIComponent(filtersString)}`;
                        window.location.href = url;
                    }
                    return;
                }
                
                console.warn(`Категория "${category}" не найдена в маппинге`);
                return;
            }
            
            if (typeof filters === 'string' && filters.startsWith('type=')) {
                const typeValue = filters.replace('type=', '');
                const url = `catalog.html?type=${encodeURIComponent(typeValue)}`;
                window.location.href = url;
            } else {
                const filtersString = filters.join('|');
                const url = `catalog.html?purpose=${encodeURIComponent(filtersString)}`;
                window.location.href = url;
            }
        });
    });
}

export function initProductionFilters() {
    function normalizeText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    const filterMap = {
        'Для пищевой промышленности': {
            purposes: [
                'Лимонады, соки, вода',
                'Молоко', 
                'Пиво, газированные напитки',
                'Масла, соусы'
            ],
            volumes: ['0.25-0.5', '0.95-2.0'] 
        },
        'Для косметики': {
            purposes: [
                'Косметика, другая тара',
                'БАДы, сыпучие и гранулированные продукты',
                'Масла, соусы'
            ],
            volumes: ['0.1-0.2', '0.25-0.5']
        },
        'Для продуктов химической и иной промышленности': {
            purposes: [
                'Химия, удобрения, вода',
                'Косметика, другая тара'
            ]
        }
    };

    const filterLinks = document.querySelectorAll('[data-filter-link]');

    if (filterLinks.length === 0) {
        return;
    }

    filterLinks.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const titleElement = item.querySelector('.production-assortment__item-title') || item.querySelector('h4');
            if (!titleElement) {
                console.warn('Не найден заголовок для элемента фильтра');
                return;
            }
            
            const title = normalizeText(titleElement.textContent);
            const filterConfig = filterMap[title];
            
            if (!filterConfig) {
                console.warn(`Фильтр для "${title}" не найден в маппинге`);
                return;
            }
            
            const urlParams = new URLSearchParams();
            
            filterConfig.purposes.forEach(purpose => {
                urlParams.append('purpose', purpose);
            });
            
            if (filterConfig.volumes && filterConfig.volumes.length > 0) {
                filterConfig.volumes.forEach(volume => {
                    urlParams.append('volume', volume);
                });
            }
            
            if (filterConfig.types && filterConfig.types.length > 0) {
                filterConfig.types.forEach(type => {
                    urlParams.append('type', type);
                });
            }
            
            const url = `catalog.html?${urlParams.toString()}`;
            window.location.href = url;
        });
    });

    const productionCatalogLink = document.querySelector('.production-assortment__visual a[href="catalog.html"]');
    if (productionCatalogLink) {
        productionCatalogLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'catalog.html';
        });
    }
}

export function initCatalogLinks() {

    const businessSection = document.querySelector('.business');
    
    if (businessSection) {
        const businessCatalogLink = businessSection.querySelector('a[href="catalog.html"]');
        if (businessCatalogLink) {
            businessCatalogLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'catalog.html';
            });
        }
    }
}