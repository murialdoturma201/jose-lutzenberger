document.addEventListener('DOMContentLoaded', () => {
    initArticleCards();
    initArticleModal();
    initArticleExpandButtons();
});

function initArticleCards() {
    const articleCards = document.querySelectorAll('.article-card');
    
    if (articleCards.length === 0) return;

    articleCards.forEach(card => {
        const expandBtn = card.querySelector('.article-expand-btn');
        const readMoreLink = card.querySelector('.read-more-link');

        card.addEventListener('mouseenter', () => {
            const tag = card.querySelector('.article-tag');
            const title = card.querySelector('.article-card-content h3');
            
            if (tag) {
                gsap.to(tag, {
                    scale: 1.04,
                    duration: 0.4,
                    ease: 'power3.out',
                });
            }
            
            if (title) {
                gsap.to(title, {
                    x: 3,
                    color: 'var(--color-champagne)',
                    duration: 0.4,
                    ease: 'power3.out',
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            const tag = card.querySelector('.article-tag');
            const title = card.querySelector('.article-card-content h3');
            
            if (tag) {
                gsap.to(tag, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power3.out',
                });
            }
            
            if (title) {
                gsap.to(title, {
                    x: 0,
                    color: 'var(--color-pampas)',
                    duration: 0.4,
                    ease: 'power3.out',
                });
            }
        });

        if (expandBtn) {
            expandBtn.addEventListener('mouseenter', () => {
                const svg = expandBtn.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        x: 3,
                        y: -3,
                        duration: 0.4,
                        ease: 'back.out(2)',
                    });
                }
                
                gsap.to(expandBtn, {
                    background: 'rgba(196, 169, 106, 0.12)',
                    borderColor: 'var(--color-champagne)',
                    color: 'var(--color-champagne)',
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });

            expandBtn.addEventListener('mouseleave', () => {
                const svg = expandBtn.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        x: 0,
                        y: 0,
                        duration: 0.4,
                        ease: 'power3.out',
                    });
                }
                
                gsap.to(expandBtn, {
                    background: 'rgba(196, 169, 106, 0.05)',
                    borderColor: 'rgba(196, 169, 106, 0.1)',
                    color: 'var(--color-text-light)',
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });

            expandBtn.addEventListener('mousedown', () => {
                gsap.to(expandBtn, {
                    scale: 0.88,
                    duration: 0.2,
                    ease: 'power2.out',
                });
            });

            expandBtn.addEventListener('mouseup', () => {
                gsap.to(expandBtn, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(2)',
                });
            });

            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const articleUrl = readMoreLink ? readMoreLink.getAttribute('href') : null;
                const articleId = card.getAttribute('data-article');
                
                if (articleUrl && articleUrl !== '#') {
                    openArticleInModal(articleUrl, articleId);
                }
            });
        }

        if (readMoreLink) {
            readMoreLink.addEventListener('mouseenter', () => {
                gsap.to(readMoreLink, {
                    gap: '14px',
                    duration: 0.4,
                    ease: 'power3.out',
                });
                
                const svg = readMoreLink.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        x: 4,
                        duration: 0.4,
                        ease: 'back.out(2)',
                    });
                }
            });

            readMoreLink.addEventListener('mouseleave', () => {
                gsap.to(readMoreLink, {
                    gap: '10px',
                    duration: 0.4,
                    ease: 'power3.out',
                });
                
                const svg = readMoreLink.querySelector('svg');
                if (svg) {
                    gsap.to(svg, {
                        x: 0,
                        duration: 0.4,
                        ease: 'power3.out',
                    });
                }
            });

            readMoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const articleUrl = readMoreLink.getAttribute('href');
                const articleId = card.getAttribute('data-article');
                
                if (articleUrl && articleUrl !== '#') {
                    openArticleInModal(articleUrl, articleId);
                }
            });
        }

        card.addEventListener('click', (e) => {
            if (e.target.closest('.article-expand-btn') || e.target.closest('.read-more-link')) {
                return;
            }
            
            const articleUrl = readMoreLink ? readMoreLink.getAttribute('href') : null;
            const articleId = card.getAttribute('data-article');
            
            if (articleUrl && articleUrl !== '#') {
                openArticleInModal(articleUrl, articleId);
            }
        });
    });
}

function initArticleModal() {
    const existingModal = document.getElementById('articleModal');
    
    if (!existingModal) {
        const modalHTML = `
            <div class="article-modal" id="articleModal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <button class="modal-close" id="modalClose">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <div class="modal-content" id="modalContent"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modalEl = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modalEl ? modalEl.querySelector('.modal-overlay') : null;

    if (!modalEl || !modalContent) return;

    function closeModal() {
        const closeAnimation = gsap.timeline({
            onComplete: () => {
                modalEl.classList.remove('active');
                modalContent.innerHTML = '';
                document.body.style.overflow = '';
                
                if (window.lenis) {
                    window.lenis.start();
                }
            }
        });
        
        closeAnimation
            .to('.modal-container', {
                opacity: 0,
                y: 50,
                scale: 0.94,
                duration: 0.5,
                ease: 'power3.in',
            })
            .to('.modal-overlay', {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
            }, '-=0.3');
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalEl.classList.contains('active')) {
            closeModal();
        }
    });

    window.closeArticleModal = closeModal;
}

function openArticleInModal(url, articleId) {
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;

    if (window.lenis) {
        window.lenis.stop();
    }

    const loadingHTML = `
        <div class="article-loading">
            <div class="article-loading-spinner"></div>
            <p>Carregando artigo...</p>
        </div>
    `;
    
    modalContent.innerHTML = loadingHTML;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    gsap.fromTo('.modal-container', 
        { opacity: 0, y: 50, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
    );
    
    gsap.fromTo('.modal-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Artigo não encontrado');
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            let articleHTML = '';
            
            const fullContent = doc.querySelector('.article-full-content');
            if (fullContent) {
                const closeBtn = fullContent.querySelector('.close-article');
                if (closeBtn) closeBtn.remove();
                articleHTML = fullContent.innerHTML;
            } else {
                const main = doc.querySelector('main');
                if (main) {
                    articleHTML = main.innerHTML;
                } else {
                    const body = doc.querySelector('body');
                    if (body) {
                        const header = body.querySelector('header');
                        const footer = body.querySelector('footer');
                        const nav = body.querySelector('nav');
                        if (header) header.remove();
                        if (footer) footer.remove();
                        if (nav) nav.remove();
                        articleHTML = body.innerHTML;
                    }
                }
            }

            if (articleHTML.trim()) {
                modalContent.innerHTML = articleHTML;
                modalContent.scrollTop = 0;
                
                gsap.fromTo('.modal-content > *',
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        stagger: 0.06, 
                        ease: 'power3.out',
                        delay: 0.1,
                    }
                );
            } else {
                throw new Error('Conteúdo do artigo não encontrado');
            }
        })
        .catch(error => {
            const errorHTML = `
                <div class="article-error">
                    <div class="article-error-icon"></div>
                    <h3>Artigo Indisponível</h3>
                    <p>${error.message}. O conteúdo deste artigo ainda está sendo preparado pela equipe.</p>
                    <button onclick="closeArticleModal()">Fechar</button>
                </div>
            `;
            modalContent.innerHTML = errorHTML;
            
            gsap.fromTo('.article-error > *',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
            );
        });
}

function initArticleExpandButtons() {
    const expandButtons = document.querySelectorAll('.article-expand-btn');
    
    expandButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const svg = btn.querySelector('svg');
            if (svg) {
                gsap.to(svg, {
                    x: 3,
                    y: -3,
                    duration: 0.4,
                    ease: 'back.out(2)',
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            const svg = btn.querySelector('svg');
            if (svg) {
                gsap.to(svg, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: 'power3.out',
                });
            }
        });

        btn.addEventListener('mousedown', () => {
            gsap.to(btn, {
                scale: 0.88,
                duration: 0.2,
                ease: 'power2.out',
            });
        });

        btn.addEventListener('mouseup', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'back.out(2)',
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power3.out',
            });
        });
    });
}

function loadArticleContent(articleId) {
    const articleUrls = {
        'agapan': 'artigos/artigo-agapan.html',
        'rincao-gaia': 'artigos/artigo-rincao-gaia.html',
        'carreira-ambientalista': 'artigos/artigo-carreira-ambientalista.html',
        'industria-quimica': 'artigos/artigo-industria-quimica.html'
    };

    const url = articleUrls[articleId];
    
    if (!url) {
        console.error('Artigo não encontrado:', articleId);
        return;
    }

    openArticleInModal(url, articleId);
}

window.addEventListener('popstate', () => {
    const modal = document.getElementById('articleModal');
    if (modal && modal.classList.contains('active')) {
        closeArticleModal();
    }
});

document.addEventListener('click', (e) => {
    const link = e.target.closest('.read-more-link');
    
    if (link) {
        e.preventDefault();
        e.stopPropagation();
        
        const url = link.getAttribute('href');
        const card = link.closest('.article-card');
        const articleId = card ? card.getAttribute('data-article') : null;
        
        if (url && url !== '#') {
            openArticleInModal(url, articleId);
        }
    }
});