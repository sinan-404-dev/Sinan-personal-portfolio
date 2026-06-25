document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // Interactive Network Node Canvas Background (SaaS Premium Visual)
    // ==========================================================================
    const initNetworkCanvas = () => {
        const canvas = document.createElement('canvas');
        canvas.className = 'network-canvas';
        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const maxParticles = Math.min(60, Math.floor((width * height) / 25000)); // limit for performance
        const connectionDistance = 140;
        let mouseX = null;
        let mouseY = null;

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.radius = Math.random() * 1.5 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce boundaries
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (slowly push away)
                if (mouseX !== null && mouseY !== null) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const force = (100 - dist) / 100;
                        this.x += (dx / dist) * force * 1.2;
                        this.y += (dy / dist) * force * 1.2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(225, 221, 207, 0.25)'; // Cream particles
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouseX = null;
            mouseY = null;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update & Draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - (dist / connectionDistance)) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        // Faint orange/grey connection line
                        ctx.strokeStyle = `rgba(255, 140, 0, ${opacity})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();
    };

    initNetworkCanvas();

    // ==========================================================================
    // Scroll Progress Indicator & Navbar Handle
    // ==========================================================================
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.prepend(progressContainer);

    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Update Scroll Progress Bar
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;

        // Sticky nav transition
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking (Scrollspy)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init on load

    // ==========================================================================
    // Mobile Navigation Toggle
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileBackdrop = document.querySelector('.mobile-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    const closeMenu = () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileBackdrop?.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active', isOpen);
        mobileBackdrop?.classList.toggle('active', isOpen);
        document.body.classList.toggle('overflow-hidden', isOpen);
    };

    mobileToggle.addEventListener('click', toggleMenu);
    mobileBackdrop?.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // ==========================================================================
    // Scroll Reveal Observers (Scroll Flow Control)
    // ==========================================================================
    const initScrollReveals = () => {
        // Automatically inject reveal-on-scroll class to content sections
        const targetSelectors = [
            '.section-header', 
            '.service-card', 
            '.about-text', 
            '.terminal-card', 
            '.project-tabs',
            '.project-card',
            '.contact-info-col', 
            '.glass-form'
        ];

        targetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('reveal-on-scroll');
                // Stagger columns/cards reveals
                if (selector === '.service-card' || selector === '.project-card') {
                    el.classList.add(`delay-${(index % 3) + 1}`);
                }
            });
        });

        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // triggers slightly before scrolling fully in
        });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    initScrollReveals();

    // ==========================================================================
    // 3D Tilt Cards Effect (SaaS Sleek Interactives)
    // ==========================================================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - e.target.offsetTop;  // fix positioning offset if targeting kids
            
            // Set mouse vars for gradient tracking
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);

            // Compute 3D rotation based on mouse vector from center
            const width = rect.width;
            const height = rect.height;
            const centerX = rect.left + width / 2;
            const centerY = rect.top + height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Tilt limit: 12deg max
            const rotateX = (-1 * (mouseY / height) * 12).toFixed(2);
            const rotateY = ((mouseX / width) * 12).toFixed(2);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // ==========================================================================
    // Mouse Interactive Hero Cutout Parallax Effect
    // ==========================================================================
    const heroImageCol = document.querySelector('.hero-image-col');
    const heroImg = document.querySelector('.subject-img');
    const radar = document.querySelector('.tech-radar');

    if (heroImageCol && heroImg && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        heroImageCol.addEventListener('mousemove', (e) => {
            const rect = heroImageCol.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerX = rect.left + width / 2;
            const centerY = rect.top + height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            // Subtle parallax transforms
            const imgTranslateX = (mouseX / width * 15).toFixed(2);
            const imgTranslateY = (mouseY / height * 15).toFixed(2);
            
            const radarTranslateX = (-1 * mouseX / width * 30).toFixed(2);
            const radarTranslateY = (-1 * mouseY / height * 30).toFixed(2);

            heroImg.style.transform = `translateY(10px) translateX(${imgTranslateX}px) translateY(${imgTranslateY}px) scale(1.25)`;
            if (radar) {
                radar.style.transform = `translateX(${radarTranslateX}px) translateY(${radarTranslateY}px)`;
            }
        });

        heroImageCol.addEventListener('mouseleave', () => {
            heroImg.style.transform = `translateY(10px) scale(1.25)`;
            if (radar) {
                radar.style.transform = `none`;
            }
        });
    }

    // ==========================================================================
    // Numeric Counter Animations (Stats Counter)
    // ==========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const speed = target / 30; // speed of increment
            
            const updateCount = () => {
                if (count < target) {
                    count += Math.ceil(speed);
                    if (count > target) count = target;
                    stat.innerText = count;
                    setTimeout(updateCount, 30);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Observer to trigger counter on scroll
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    animateCounters();
                    counted = true;
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(statsSection);
    }

    // ==========================================================================
    // Portfolio Filtering
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectItems = document.querySelectorAll('.project-item');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    });

    // ==========================================================================
    // Contact Form Action
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const successOverlay = document.querySelector('.form-success-overlay');
    const successResetBtn = document.querySelector('.btn-success-reset');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) return;

        submitBtn.classList.add('loading');
        submitBtn.setAttribute('disabled', 'true');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.removeAttribute('disabled');
            successOverlay.classList.add('show');
            contactForm.reset();
        }, 2200);
    });

    successResetBtn.addEventListener('click', () => {
        successOverlay.classList.remove('show');
    });

});
