lucide.createIcons();

document.addEventListener('DOMContentLoaded', function() {
    var nav = document.querySelector('.nav');
    var themeToggles = document.querySelectorAll('.theme-toggle');
    var html = document.documentElement;
    var savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    for (var i = 0; i < themeToggles.length; i++) {
        themeToggles[i].addEventListener('click', function() {
            var current = html.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    var mobileLinks = document.querySelectorAll('.mobile-menu a');
    for (var j = 0; j < mobileLinks.length; j++) {
        mobileLinks[j].addEventListener('click', function() {
            var menu = document.querySelector('.mobile-menu');
            if (menu) menu.classList.remove('active');
        });
    }

    var statsSection = document.querySelector('.stats');
    if (statsSection) {
        var animateCounter = function(element, target, duration) {
            var start = 0;
            var startTime = performance.now();
            var isFloat = target.toString().indexOf('.') !== -1;
            var decimals = isFloat ? (target.toString().split('.')[1] || '').length : 0;

            var update = function(currentTime) {
                var elapsed = currentTime - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var easeOut = 1 - Math.pow(1 - progress, 3);
                var current = start + (target - start) * easeOut;

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

        var observer = new IntersectionObserver(function(entries) {
            for (var k = 0; k < entries.length; k++) {
                if (entries[k].isIntersecting) {
                    var statValues = entries[k].target.querySelectorAll('.stat-value');
                    for (var m = 0; m < statValues.length; m++) {
                        var text = statValues[m].textContent;
                        var target = text.indexOf('%') !== -1 ? parseFloat(text) : parseInt(text);
                        animateCounter(statValues[m], target, 2000);
                    }
                    observer.unobserve(entries[k].target);
                }
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    var aboutLink = document.getElementById('about-link');
    var aboutModal = document.getElementById('about-modal');
    var modalClose = document.querySelector('.modal-close');

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
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    var serviceCheckboxes = document.querySelectorAll('.service-option input[type="checkbox"]');
    for (var n = 0; n < serviceCheckboxes.length; n++) {
        serviceCheckboxes[n].addEventListener('change', function() {
            var parent = this.parentNode;
            if (this.checked) {
                parent.classList.add('checked');
            } else {
                parent.classList.remove('checked');
            }
        });
    }

    var customSelects = document.querySelectorAll('.custom-select');
    for (var s = 0; s < customSelects.length; s++) {
        (function(sel) {
            var wrapper = sel.closest('.custom-select-wrapper');
            var chevron = wrapper.querySelector('.select-chevron');
            sel.addEventListener('focus', function() {
                chevron.style.transform = 'translateY(-50%) rotate(180deg)';
            });
            sel.addEventListener('blur', function() {
                chevron.style.transform = 'translateY(-50%) rotate(0deg)';
            });
            sel.addEventListener('change', function() {
                if (sel.value) {
                    sel.style.color = '';
                    sel.classList.add('has-value');
                } else {
                    sel.style.color = '';
                    sel.classList.remove('has-value');
                }
            });
        })(customSelects[s]);
    }

    var form = document.getElementById('project-form');
    if (form) {
        var showToast = function(message, type) {
            var toast = document.getElementById('form-toast');
            if (!toast) return;
            var icon = type === 'success' ? 'check-circle' : 'alert-circle';
            toast.innerHTML = '<i data-lucide="' + icon + '"></i><span>' + message + '</span>';
            toast.className = 'form-toast show ' + type;
            lucide.createIcons();
            if (type === 'success') {
                setTimeout(function() {
                    toast.className = 'form-toast';
                    toast.innerHTML = '';
                }, 5000);
            }
        };

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var toast = document.getElementById('form-toast');
            if (toast) {
                toast.className = 'form-toast';
                toast.innerHTML = '';
            }
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader"></i> Envoi en cours...';
            submitBtn.disabled = true;
            lucide.createIcons();

            var formData = new FormData(form);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', form.action);
            xhr.onload = function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                lucide.createIcons();
                try {
                    var result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        showToast(result.message, 'success');
                        form.reset();
                        var checkedItems = document.querySelectorAll('.service-option.checked');
                        for (var p = 0; p < checkedItems.length; p++) {
                            checkedItems[p].classList.remove('checked');
                        }
                    } else {
                        showToast(result.message || 'Une erreur est survenue.', 'error');
                    }
                } catch (err) {
                    showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            };
            xhr.onerror = function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                lucide.createIcons();
                showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
            };
            xhr.send(formData);
        });
    }

    lucide.createIcons();
});
