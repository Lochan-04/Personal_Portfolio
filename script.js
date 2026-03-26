const body = document.body;
const navbarElement = document.querySelector('.navbar');
const menuButton = document.querySelector('.hamburger');
const menuIcon = menuButton.querySelector('i');
const navbar = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const cursorGlow = document.querySelector('.cursor-glow');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-box');
const contactForm = document.querySelector('.contact-form');
const statusText = document.querySelector('.form-status');
const yearElement = document.querySelector('#year');
const counterItems = document.querySelectorAll('[data-counter]');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDotsContainer = document.querySelector('.testimonial-dots');
const prevTestimonialButton = document.querySelector('#prev-testimonial');
const nextTestimonialButton = document.querySelector('#next-testimonial');
const faqItems = document.querySelectorAll('.faq-item');
const tiltCards = document.querySelectorAll('.tilt-card');

let testimonialIndex = 0;
let testimonialTimer;

const storedTheme = localStorage.getItem('portfolio-theme');

if (storedTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

menuButton.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-xmark');
    menuButton.setAttribute('aria-expanded', String(navbar.classList.contains('active')));
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-xmark');
        menuButton.setAttribute('aria-expanded', 'false');
    });
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    navbarElement.classList.toggle('sticky', scrollY > 40);

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 180;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
});

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');

    themeIcon.classList.toggle('fa-moon', !isLight);
    themeIcon.classList.toggle('fa-sun', isLight);
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selected = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        projectCards.forEach((card) => {
            const matches = selected === 'all' || card.dataset.category === selected;
            card.classList.toggle('is-hidden', !matches);
        });
    });
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        statusText.textContent = 'Please fill in your name, email, and message.';
        return;
    }

    if (!emailPattern.test(email)) {
        statusText.textContent = 'Please enter a valid email address.';
        return;
    }

    statusText.textContent = `Thanks ${name}, your message is ready to send. Connect this form to Formspree, EmailJS, or your backend when you want real submissions.`;
    contactForm.reset();
});

yearElement.textContent = new Date().getFullYear();

const counterObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const counter = entry.target;
            const target = Number(counter.dataset.counter);
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 32));

            const timer = setInterval(() => {
                current += increment;

                if (current >= target) {
                    counter.textContent = `${target}+`;
                    clearInterval(timer);
                    observer.unobserve(counter);
                    return;
                }

                counter.textContent = `${current}+`;
            }, 35);
        });
    },
    { threshold: 0.65 }
);

counterItems.forEach((item) => counterObserver.observe(item));

window.addEventListener('pointermove', (event) => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener('pointerleave', () => {
    cursorGlow.style.opacity = '0';
});

if (window.ScrollReveal) {
    ScrollReveal({
        distance: '50px',
        duration: 950,
        delay: 120,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        reset: false
    });

    ScrollReveal().reveal('.hero-copy, .hero-card, .about-panel, .journey-card, .projects-header, .testimonials-header, .contact-layout', { origin: 'bottom' });
    ScrollReveal().reveal('.services-box, .highlight-card, .project-box, .timeline-item, .faq-item', { interval: 110, origin: 'bottom' });
}

if (window.Typed) {
    new Typed('.multiple-text', {
        strings: ['Full-Stack Developer', 'MERN Stack Expert', 'Software Engineer'],
        typeSpeed: 70,
        backSpeed: 45,
        backDelay: 1200,
        loop: true
    });
}

function createTestimonialDots() {
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = index === 0 ? 'dot active' : 'dot';
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetTestimonialTimer();
        });
        testimonialDotsContainer.appendChild(dot);
    });
}

function showTestimonial(index) {
    const dots = testimonialDotsContainer.querySelectorAll('.dot');
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;

    testimonialCards.forEach((card, cardIndex) => {
        card.classList.toggle('active', cardIndex === testimonialIndex);
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === testimonialIndex);
    });
}

function startTestimonialTimer() {
    testimonialTimer = window.setInterval(() => {
        showTestimonial(testimonialIndex + 1);
    }, 5000);
}

function resetTestimonialTimer() {
    window.clearInterval(testimonialTimer);
    startTestimonialTimer();
}

createTestimonialDots();
startTestimonialTimer();

prevTestimonialButton.addEventListener('click', () => {
    showTestimonial(testimonialIndex - 1);
    resetTestimonialTimer();
});

nextTestimonialButton.addEventListener('click', () => {
    showTestimonial(testimonialIndex + 1);
    resetTestimonialTimer();
});

faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');

    button.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((faqItem) => {
            faqItem.classList.remove('active');
            faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
            item.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = (0.5 - (y / rect.height)) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});
