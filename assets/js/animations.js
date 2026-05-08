document.addEventListener('DOMContentLoaded', () => {
    initAll();
});

function initAll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    if (typeof Lenis !== 'undefined') {
        initLenis();
    }
    
    initHeroReveal();
    initScrollReveals();
    initHoverEffects();
    initParticlesCanvas();
    initLazyReveal();
}

function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenis;

    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (arguments.length) { lenis.scrollTo(value); }
            return lenis.scroll;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
}

function initHeroReveal() {
    gsap.set('.hero-tag, .text-mask, .hero-subtitle, .hero-cta, .hero-turma, .floating-card, .scroll-indicator', {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.5 } });
    
    tl.from('.hero-tag', { opacity: 0, y: 12 }, 0)
      .from('.text-mask', { y: 40, opacity: 0, stagger: 0.08 }, 0.05)
      .from('.hero-subtitle', { opacity: 0, y: 15 }, 0.15)
      .from('.hero-cta', { opacity: 0, y: 12 }, 0.2)
      .from('.hero-turma', { opacity: 0, y: 8 }, 0.25)
      .from('.floating-card', { opacity: 0, x: 20, scale: 0.96, stagger: 0.08 }, 0.3)
      .from('.scroll-indicator', { opacity: 0, y: 8 }, 0.35);

    gsap.to('.floating-card', {
        y: -8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.25,
        delay: 0.8,
    });
}

function initScrollReveals() {
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 88%' },
            opacity: 0, y: 35, duration: 0.7, ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const isLeft = item.classList.contains('left');
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 86%' },
            opacity: 0, x: isLeft ? -35 : 35, duration: 0.55, delay: i * 0.03, ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.achievement-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%' },
            opacity: 1, y: 45, scale: 0.95, duration: 0.55, delay: i * 0.05, ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.legacy-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            opacity: 1, y: 35, scale: 0.96, duration: 0.55, delay: i * 0.05, ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.article-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%' },
            opacity: 1, y: 35, scale: 0.96, duration: 0.55, delay: i * 0.04, ease: 'power3.out',
        });
    });

    const quote = document.querySelector('.legacy-quote');
    if (quote) {
        gsap.from(quote, {
            scrollTrigger: { trigger: quote, start: 'top 88%' },
            opacity: 1, y: 35, duration: 0.7, ease: 'power3.out',
        });
    }

    const footer = document.querySelector('.footer-brand');
    if (footer) {
        gsap.from(footer, {
            scrollTrigger: { trigger: '.footer', start: 'top 90%' },
            opacity: 1, y: 25, duration: 0.6, ease: 'power3.out',
        });
    }

    gsap.utils.toArray('.footer-column').forEach((col, i) => {
        gsap.from(col, {
            scrollTrigger: { trigger: '.footer', start: 'top 90%' },
            opacity: 1, y: 25, duration: 0.6, delay: 0.15 + i * 0.1, ease: 'power3.out',
        });
    });
}

function initHoverEffects() {
    document.querySelectorAll('.achievement-card').forEach(card => {
        const icon = card.querySelector('.achievement-icon');
        const glow = card.querySelector('.achievement-glow');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -5, scale: 1.015, duration: 0.3, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.22)' });
            if (icon) gsap.to(icon, { scale: 1.08, duration: 0.3, ease: 'back.out(2)' });
            if (glow) gsap.to(glow, { opacity: 1, duration: 0.25 });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.06)' });
            if (icon) gsap.to(icon, { scale: 1, duration: 0.35, ease: 'power3.out' });
            if (glow) gsap.to(glow, { opacity: 0, duration: 0.25 });
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, duration: 0.35, ease: 'power2.out' });
        });
    });

    document.querySelectorAll('.legacy-card').forEach(card => {
        const icon = card.querySelector('.legacy-card-icon');

        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -4, scale: 1.015, duration: 0.3, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.18)' });
            if (icon) gsap.to(icon, { scale: 1.08, duration: 0.3, ease: 'back.out(2)' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.06)' });
            if (icon) gsap.to(icon, { scale: 1, duration: 0.35, ease: 'power3.out' });
        });
    });

    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -5, scale: 1.015, duration: 0.3, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.18)' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.06)' });
        });
    });

    document.querySelectorAll('.timeline-content').forEach(content => {
        content.addEventListener('mouseenter', () => {
            gsap.to(content, { scale: 1.02, duration: 0.3, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.2)' });
        });
        content.addEventListener('mouseleave', () => {
            gsap.to(content, { scale: 1, duration: 0.3, ease: 'power3.out', borderColor: 'rgba(196,169,106,0.06)' });
        });
    });

    const ctaBtn = document.querySelector('.cta-button');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', () => {
            gsap.to(ctaBtn.querySelector('svg'), { x: 4, duration: 0.3, ease: 'back.out(2)' });
        });
        ctaBtn.addEventListener('mouseleave', () => {
            gsap.to(ctaBtn.querySelector('svg'), { x: 0, duration: 0.3, ease: 'power3.out' });
        });
    }
}

function initParticlesCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.25 + 0.08);
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.25 + 0.08;
            this.life = 0;
            this.maxLife = Math.random() * 250 + 130;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.life++;
            if (this.y < -10 || this.life > this.maxLife) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(196, 169, 106, ${this.opacity * (1 - this.life / this.maxLife)})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

function initLazyReveal() {
    gsap.utils.toArray('.section-title, .section-description').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 92%' },
            opacity: 0, y: 25, duration: 0.6, ease: 'power3.out',
        });
    });
}