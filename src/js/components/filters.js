export function initCategoryTags() {
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
        'Электроды': ['БАДы, сыпучие и гранулированные продукты'],
        'БАДы, сыпучие и гранулированные продукты': ['БАДы, сыпучие и гранулированные продукты'],
        'Упаковка для электродов': ['БАДы, сыпучие и гранулированные продукты'],
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
            const category = tag.textContent.trim();
            const filters = categoryMap[category] || ['Лимонады, соки, вода'];
            const filtersString = filters.join('|');
            const url = `catalog.html?purpose=${encodeURIComponent(filtersString)}`;
            window.location.href = url;
        });
    });

    newProductTags.forEach((tag) => {
        tag.addEventListener('click', () => {
            const category = tag.textContent.trim();
            const filters = categoryMap[category] || ['Лимонады, соки, вода'];
            const filtersString = filters.join('|');
            const url = `catalog.html?purpose=${encodeURIComponent(filtersString)}`;
            window.location.href = url;
        });
    });
}

export function initProductionFilters() {
    const filterMap = {
        'Для пищевой промышленности': [
            'Лимонады, соки, вода',
            'Молоко', 
            'Пиво, газированные напитки',
            'БАДы, сыпучие и гранулированные продукты',
            'Масла, соусы'
        ],
        'Для косметики': [
            'Косметика, другая тара',
            'Масла, соусы'
        ],
        'Для продуктов химической и иной промышленности': [
            'Химия, удобрения, вода',
            'БАДы, сыпучие и гранулированные продукты'
        ]
    };

    const filterLinks = document.querySelectorAll('[data-filter-link]');

    if (filterLinks.length === 0) {
        return;
    }

    document.querySelectorAll('[data-filter-link]').forEach((item) => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h4')?.textContent.trim();
            const filters = filterMap[title] || ['Пищевая промышленность'];
            const filtersString = filters.join('|');
            const url = `catalog.html?purpose=${encodeURIComponent(filtersString)}`;
            window.location.href = url;
        });
    });
}