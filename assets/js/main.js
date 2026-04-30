lucide.createIcons();

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });

    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    });

    const animateCounter = (element, target, duration) => {
        const start = 0;
        const startTime = performance.now();
        const isFloat = target.toString().includes('.');
        const decimals = isFloat ? (target.toString().split('.')[1] || '').length : 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            let current = start + (target - start) * easeOut;

            if (isFloat) {
                element.textContent = current.toFixed(decimals) + '%';
            } else if (target.toString().includes('+')) {
                element.textContent = Math.round(current) + '+';
            } else {
                element.textContent = Math.round(current) + '%';
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValues = entry.target.querySelectorAll('.stat-value');
                statValues.forEach(stat => {
                    const text = stat.textContent;
                    let target;

                    if (text.includes('%')) {
                        target = parseFloat(text);
                        animateCounter(stat, target, 2000);
                    } else if (text.includes('+')) {
                        target = parseInt(text);
                        animateCounter(stat, target, 2000);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const modalClose = document.querySelector('.modal-close');

    if (aboutLink && aboutModal) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

(function() {
    var options = document.querySelectorAll('.service-option input[type="checkbox"]');
    for (var i = 0; i < options.length; i++) {
        options[i].addEventListener('change', function() {
            var label = this.parentNode;
            if (this.checked) {
                label.classList.add('checked');
            } else {
                label.classList.remove('checked');
            }
        });
    }
})();

    const form = document.getElementById('project-form');
    if (form) {
        const showToast = (message, type) => {
            const toast = document.getElementById('form-toast');
            if (!toast) return;
            const icon = type === 'success' ? 'check-circle' : 'alert-circle';
            toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
            toast.className = 'form-toast show ' + type;
            lucide.createIcons();
            if (type === 'success') {
                setTimeout(() => {
                    toast.className = 'form-toast';
                    toast.innerHTML = '';
                }, 5000);
            }
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const toast = document.getElementById('form-toast');
            if (toast) {
                toast.className = 'form-toast';
                toast.innerHTML = '';
            }
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader"></i> Envoi en cours...';
            submitBtn.disabled = true;
            lucide.createIcons();

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showToast(result.message, 'success');
                    form.reset();
                    document.querySelectorAll('.service-option.checked').forEach(el => el.classList.remove('checked'));
                } else {
                    showToast(result.message || 'Une erreur est survenue.', 'error');
                }
            } catch (error) {
                showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
                console.error('Form submission error:', error);
            }

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            lucide.createIcons();
        });
    }

    lucide.createIcons();
});
