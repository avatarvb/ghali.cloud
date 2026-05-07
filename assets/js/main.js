document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const nav = document.querySelector('.nav');
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    window.addEventListener('scroll', function() {
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    themeToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    });

    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            const isActive = mobileMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
        });
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-controls', 'mobile-menu');
    }

    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const animateCounter = function(element, target, duration) {
            const start = 0;
            const startTime = performance.now();
            const isFloat = target.toString().indexOf('.') !== -1;
            const decimals = isFloat ? (target.toString().split('.')[1] || '').length : 0;

            const update = function(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = start + (target - start) * easeOut;

                if (isFloat) {
                    element.textContent = current.toFixed(decimals) + '%';
                } else if (target.toString().indexOf('+') !== -1) {
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

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const statValues = entry.target.querySelectorAll('.stat-value');
                    statValues.forEach(function(statEl) {
                        const text = statEl.textContent;
                        const target = text.indexOf('%') !== -1 ? parseFloat(text) : parseInt(text);
                        animateCounter(statEl, target, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const modalClose = document.querySelector('.modal-close');

    if (aboutLink && aboutModal) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            aboutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        aboutModal.addEventListener('click', function(e) {
            if (e.target === aboutModal) {
                aboutModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            if (aboutModal) {
                aboutModal.classList.remove('active');
            }
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && aboutModal && aboutModal.classList.contains('active')) {
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    const serviceCheckboxes = document.querySelectorAll('.service-option input[type="checkbox"]');
    serviceCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const parent = this.parentNode;
            parent.classList.toggle('checked', this.checked);
        });
    });

    const multiWrappers = document.querySelectorAll('[data-multi-select]');
    multiWrappers.forEach(function(wrapper) {
        const trigger = wrapper.querySelector('.multi-select-trigger');
        const placeholder = wrapper.querySelector('.multi-select-placeholder');
        const countSpan = wrapper.querySelector('.multi-select-count');
        const checkboxes = wrapper.querySelectorAll('.multi-select-option input[type="checkbox"]');

        function openDropdown() {
            wrapper.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            wrapper.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        function updateDisplay() {
            const checked = wrapper.querySelectorAll('.multi-select-option input:checked');
            if (checked.length > 0) {
                wrapper.classList.add('has-selections');
                if (countSpan) {
                    countSpan.textContent = checked.length + ' choisi' + (checked.length > 1 ? 's' : '');
                }
            } else {
                wrapper.classList.remove('has-selections');
            }
        }

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                wrapper.classList.contains('open') ? closeDropdown() : openDropdown();
            }
            if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                updateDisplay();
            });
        });

        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                closeDropdown();
            }
        });
    });

    const form = document.getElementById('project-form');
    if (form) {
        const showToast = function(message, type) {
            const toast = document.getElementById('form-toast');
            if (!toast) return;
            const icon = type === 'success' ? 'check-circle' : 'alert-circle';
            toast.innerHTML = '<i data-lucide="' + icon + '"></i><span>' + message + '</span>';
            toast.className = 'form-toast show ' + type;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            if (type === 'success') {
                setTimeout(function() {
                    toast.className = 'form-toast';
                    toast.innerHTML = '';
                }, 5000);
            }
        };

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const toast = document.getElementById('form-toast');
            if (toast) {
                toast.className = 'form-toast';
                toast.innerHTML = '';
            }
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader"></i> Envoi en cours...';
            submitBtn.disabled = true;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            const formData = new FormData(form);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', form.action || 'contact.php');
            xhr.onload = function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                try {
                    const result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        showToast(result.message, 'success');
                        form.reset();
                        document.querySelectorAll('.service-option.checked').forEach(function(el) {
                            el.classList.remove('checked');
                        });
                        document.querySelectorAll('[data-multi-select]').forEach(function(mWrap) {
                            mWrap.classList.remove('has-selections');
                            mWrap.querySelectorAll('.multi-select-option input').forEach(function(mCheck) {
                                mCheck.checked = false;
                            });
                        });
                    } else {
                        showToast(result.message || 'Une erreur est survenue.', 'error');
                    }
                } catch (err) {
                    showToast('Une erreur est survenue. Veuillez reessayer.', 'error');
                }
            };
            xhr.onerror = function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                showToast('Une erreur est survenue. Veuillez reessayer.', 'error');
            };
            xhr.send(formData);
        });
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
