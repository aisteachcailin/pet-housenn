export function initCategoryTags() {
    const categoryMap = {
        'Пивоварение': 'Пиво, газированные напитки',
        'Лимонады': 'Лимонады, соки, вода',
        'Молоко': 'Молоко',
        'Незамерзающая жидкость': 'Химия, удобрения, вода',
        'Соки': 'Лимонады, соки, вода',
        'Косметика': 'Косметика, другая тара',
        'Химия': 'Химия, удобрения, вода',
        'Масла': 'Масла, соусы',
        'Удобрения': 'Химия, удобрения, вода',
        'Соусы': 'Масла, соусы',
        'Электроды': 'БАДы, сыпучие и гранулированные продукты',
        'БАДы, сыпучие и гранулированные продукты': 'БАДы, сыпучие и гранулированные продукты',
        'Упаковка для электродов': 'БАДы, сыпучие и гранулированные продукты',
        'Упаковки для соусов': 'Масла, соусы',
        'Упаковка для БАДов, сыпучих и гранулированных продуктов': 'БАДы, сыпучие и гранулированные продукты'
    };

    document.querySelectorAll('.business__tag').forEach((tag) => {
        tag.addEventListener('click', () => {
            const category = tag.textContent.trim();
            const purpose = categoryMap[category];
            if (purpose) {
                const url = `catalog.html?purpose=${encodeURIComponent(purpose)}`;
                window.location.href = url;
            }
        });
    });

    document.querySelectorAll('.new-products__items .glass-block').forEach((tag) => {
        tag.addEventListener('click', () => {
            const category = tag.textContent.trim();
            const purpose = categoryMap[category];
            if (purpose) {
                const url = `catalog.html?purpose=${encodeURIComponent(purpose)}`;
                window.location.href = url;
            }
        });
    });
}


export function initProductionFilters() {
    const filterMap = {
        'Для пищевой промышленности': 'Пищевая промышленность',
        'Для косметики': 'Косметика, другая тара',
        'Для продуктов химической и иной промышленности': 'Химия, удобрения, вода'
    };

    document.querySelectorAll('[data-filter-link]').forEach((item) => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h4')?.textContent.trim();
            const filter = filterMap[title] || 'Пищевая промышленность';
            const url = `catalog.html?purpose=${encodeURIComponent(filter)}`;
            window.location.href = url;
        });
    });
}

