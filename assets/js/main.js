document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initModal();
});

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mx = 0, my = 0, cx = 0, cy = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    document.querySelectorAll('a, button, .article-card, .achievement-card, .legacy-card, .cta-button, .hamburger, .article-expand-btn, .modal-close, .timeline-content, .floating-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hover');
            cursor.style.transform = 'scale(1.8)';
            cursor.style.background = 'var(--color-pampas)';
            cursor.style.mixBlendMode = 'normal';
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hover');
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--color-champagne)';
            cursor.style.mixBlendMode = 'difference';
        });
    });

    function animate() {
        cx += (mx - cx) * 0.15;
        cy += (my - cy) * 0.15;
        fx += (mx - fx) * 0.07;
        fy += (my - fy) * 0.07;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        follower.style.left = (fx - 20) + 'px';
        follower.style.top = (fy - 20) + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
    document.addEventListener('mousedown', () => { cursor.style.transform = 'scale(0.7)'; });
    document.addEventListener('mouseup', () => { cursor.style.transform = 'scale(1)'; });
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let visible = true;

    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        if (current > 400 && current > lastScroll && visible) {
            gsap.to(navbar, { y: -120, duration: 0.4, ease: 'power3.inOut' });
            visible = false;
        } else if ((current < lastScroll || current < 200) && !visible) {
            gsap.to(navbar, { y: 0, duration: 0.4, ease: 'power3.inOut' });
            visible = true;
        }
        lastScroll = current;
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            if (window.lenis) {
                window.lenis.scrollTo(target, { offset: -80, duration: 1.4 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initModal() {
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    if (!modal || !modalContent) return;

    function closeModal() {
        gsap.timeline({
            onComplete: () => {
                modal.classList.remove('active');
                modalContent.innerHTML = '';
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }
        })
        .to('.modal-container', { opacity: 0, y: 40, scale: 0.94, duration: 0.4, ease: 'power3.in' })
        .to('.modal-overlay', { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2');
    }

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    window.closeArticleModal = closeModal;
}