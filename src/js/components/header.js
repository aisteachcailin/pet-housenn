export function initHeader() {
    initHeaderScroll();
    initSmoothScroll();
    initMobileMenu();
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) {
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 72;
                const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: targetTop - headerHeight, behavior: 'smooth' });
            }
            return;
        }
        
        if (href.includes('company') && href.includes('#margcom-more')) {
            if (link.textContent.includes('Подробнее о ГК') || link.textContent.includes('Подробнее')) {
                e.preventDefault();
                const urlParts = href.split('#');
                const baseUrl = urlParts[0];
                const anchor = urlParts[1];
                
                window.location.href = baseUrl;
                
                setTimeout(() => {
                    const slider = document.getElementById(anchor) || document.querySelector('.pictures-slider');
                    if (slider) {
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 72;
                        const sliderTop = slider.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({ top: sliderTop - headerHeight, behavior: 'smooth' });
                    }
                }, 300);
            }
        }
    });
    
    if (window.location.pathname.includes('company') && window.location.hash === '#margcom-more') {
        setTimeout(() => {
            const slider = document.getElementById('margcom-more') || document.querySelector('.pictures-slider');
            if (slider) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 72;
                const sliderTop = slider.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: sliderTop - headerHeight, behavior: 'smooth' });
            }
        }, 300);
    }
}

function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    
    if (!burger || !mobileMenu || !closeBtn) {
        return;
    }

    burger.addEventListener('click', () => {
        mobileMenu.classList.add('mobile-menu--open');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        closeMobileMenu();
    });

    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
            closeMobileMenu();
        }
    });

    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', () => {
            const contactBtn = document.getElementById('contactBtn');
            if (contactBtn) {
                contactBtn.click();
            }
        });
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    function setActiveLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        menuLinks.forEach(link => {
            link.classList.remove('mobile-menu__link--active');
            
            try {
                const linkUrl = new URL(link.href, window.location.origin);
                const linkPath = linkUrl.pathname;
                const linkHash = linkUrl.hash;
                
                const pathMatches = currentPath === linkPath || 
                    (currentPath.endsWith('/index.html') && (linkPath === '/' || linkPath === '/index.html')) ||
                    (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html'));
                
                if (pathMatches && (!linkHash || linkHash === currentHash)) {
                    link.classList.add('mobile-menu__link--active');
                }
            } catch (e) {
                const linkHref = link.getAttribute('href');
                if (linkHref && currentPath.includes(linkHref.replace(/^\//, '').replace(/\.html$/, ''))) {
                    link.classList.add('mobile-menu__link--active');
                }
            }
        });
    }
    
    setActiveLink();
}

