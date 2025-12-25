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
    });
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
        const currentPath = window.location.pathname
            .replace(/^\//, '') 
            .replace(/\.html$/, ''); 
        
        const currentHash = window.location.hash;
        
        menuLinks.forEach(link => {
            link.classList.remove('mobile-menu__link--active');
            
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;
            
            const [linkPath, linkHash] = linkHref.split('#');
            
            const cleanLinkPath = linkPath
                .replace(/^\//, '')
                .replace(/\.html$/, '');
            
            const pathsMatch = 
                (cleanLinkPath === '' && (currentPath === '' || currentPath === 'index')) || 
                (cleanLinkPath && currentPath.includes(cleanLinkPath));
            
            const hashesMatch = 
                !linkHash || 
                !currentHash ||  
                linkHash === currentHash.replace('#', '');
            
            if (pathsMatch && hashesMatch) {
                link.classList.add('mobile-menu__link--active');
            }
        });
    }
    
    setActiveLink();
}

