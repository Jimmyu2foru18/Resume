// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    createThemeToggle() {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <button class="theme-btn theme-light" data-theme="light" title="Light Theme"></button>
            <button class="theme-btn theme-dark" data-theme="dark" title="Dark Theme"></button>
            <button class="theme-btn theme-purple" data-theme="purple" title="Purple Theme"></button>
        `;
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-btn')) {
                const theme = e.target.getAttribute('data-theme');
                this.applyTheme(theme);
            }
        });
    }
}

// Navigation Management
class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Handle navigation links (both page navigation and section scrolling)
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // If it's a page link (contains .html), don't prevent default
                if (href.includes('.html')) {
                    return; // Let the browser handle page navigation
                }
                
                // If it's a section link (starts with #), handle smooth scrolling
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Active link highlighting
        window.addEventListener('scroll', () => this.highlightActiveLink());
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }

    highlightActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Projects Management
class ProjectsManager {
    constructor() {
        this.projectsGrid = document.getElementById('projectsGrid');
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.projects = this.getProjectsData();
        this.init();
    }

    init() {
        this.renderProjects('all');
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterProjects(category);
                this.updateActiveButton(e.target);
            });
        });
    }

    getProjectsData() {
        return [
            {
                title: "Traveling Salesman Problem",
                description: "Solves the TSP using Processing with visual representation of the algorithm's progress.",
                category: "algorithms",
                tech: ["Processing", "Java", "Algorithms"],
                icon: "fas fa-route",
                github: "https://github.com/Jimmyu2foru18/Traveling-Salesman"
            },
            {
                title: "Circuit Switch Simulation",
                description: "Network drag-and-drop simulation for understanding circuit switching concepts.",
                category: "algorithms",
                tech: ["JavaScript", "HTML5", "CSS3"],
                icon: "fas fa-network-wired",
                github: "https://github.com/Jimmyu2foru18/Circuit-Switch"
            },
            {
                title: "Fibonacci Web App",
                description: "Interactive web application to visualize Fibonacci sequence calculations.",
                category: "web",
                tech: ["JavaScript", "HTML", "CSS"],
                icon: "fas fa-calculator",
                github: "https://github.com/Jimmyu2foru18/FibonacciWebApp"
            },
            {
                title: "Linear Algebra Learning Tool",
                description: "HTML-based interactive learning platform for Linear Algebra concepts.",
                category: "web",
                tech: ["HTML", "JavaScript", "Math.js"],
                icon: "fas fa-square-root-alt",
                github: "https://github.com/Jimmyu2foru18/Simple-Linear-Algebra"
            },
            {
                title: "Financial Management App",
                description: "Automated finance management application with JavaScript automation features.",
                category: "web",
                tech: ["JavaScript", "Node.js", "Automation"],
                icon: "fas fa-chart-line",
                github: "https://github.com/Jimmyu2foru18/Financial-management-application-with-automation"
            },
            {
                title: "Tutorial Finder AI",
                description: "AI-powered tool to find and recommend coding tutorials based on user preferences.",
                category: "tools",
                tech: ["Python", "AI", "Machine Learning"],
                icon: "fas fa-robot",
                github: "https://github.com/Jimmyu2foru18/Tutorial-Finder-AI"
            },
            {
                title: "CarrotQuest Game",
                description: "Platformer game with character control and interactive gameplay mechanics.",
                category: "games",
                tech: ["GDScript", "Godot", "Game Development"],
                icon: "fas fa-gamepad",
                github: "https://github.com/Jimmyu2foru18/CarrotQuest"
            },
            {
                title: "Creature Battle Arena",
                description: "GDScript-based arena battle game with creature combat mechanics.",
                category: "games",
                tech: ["GDScript", "Godot", "Game Design"],
                icon: "fas fa-dragon",
                github: "https://github.com/Jimmyu2foru18/Creature-Battle-Arena"
            },
            {
                title: "GitHub Analyzer V2",
                description: "Python tool to analyze GitHub repositories and provide insights.",
                category: "tools",
                tech: ["Python", "GitHub API", "Data Analysis"],
                icon: "fab fa-github",
                github: "https://github.com/Jimmyu2foru18/github-analyzerV2"
            },
            {
                title: "LinkedIn Post Scheduler",
                description: "Automated tool to schedule LinkedIn posts using Python.",
                category: "tools",
                tech: ["Python", "LinkedIn API", "Automation"],
                icon: "fab fa-linkedin",
                github: "https://github.com/Jimmyu2foru18/Linkedin-Post-Scheduler"
            },
            {
                title: "RTT Logger",
                description: "AWS-based Round Trip Time monitoring solution for network analysis.",
                category: "tools",
                tech: ["AWS", "Python", "Networking"],
                icon: "fas fa-stopwatch",
                github: "https://github.com/Jimmyu2foru18/rtt-logger"
            },
            {
                title: "COVID Climate Analysis",
                description: "Machine learning and data analysis project examining COVID-19 and climate data.",
                category: "algorithms",
                tech: ["Python", "Machine Learning", "Data Science"],
                icon: "fas fa-chart-bar",
                github: "https://github.com/Jimmyu2foru18/covid-climate-analysis"
            }
        ];
    }

    renderProjects(category) {
        const filteredProjects = category === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.category === category);

        this.projectsGrid.innerHTML = filteredProjects.map(project => `
            <div class="project-card fade-in-up">
                <div class="project-icon">
                    <i class="${project.icon}"></i>
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link" style="opacity: 1; transform: translateY(0);">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                </div>
            </div>
        `).join('');
    }

    filterProjects(category) {
        this.renderProjects(category);
    }

    updateActiveButton(activeBtn) {
        this.categoryBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Contact Form Management
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Simulate form submission
        this.showLoading();
        
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
        }, 2000);
    }

    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
    }

    showSuccess() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            submitBtn.innerHTML = 'Send Message';
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
        }, 3000);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, this.observerOptions);

        // Observe all sections and cards
        const elementsToAnimate = document.querySelectorAll(
            'section, .project-card, .cert-card, .skill-category'
        );
        
        elementsToAnimate.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Navbar Scroll Effect
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                this.navbar.style.boxShadow = 'none';
            }
        });
    }
}

// GitHub Stats Integration
class GitHubStats {
    constructor() {
        this.username = 'Jimmyu2foru18';
        this.init();
    }

    init() {
        this.loadGitHubStats();
    }

    async loadGitHubStats() {
        try {
            // Replace iframe with GitHub stats cards
            const githubEmbed = document.querySelector('.github-embed');
            if (githubEmbed) {
                githubEmbed.innerHTML = `
                    <div class="github-stats-cards">
                        <img src="https://github-readme-stats.vercel.app/api?username=${this.username}&show_icons=true&theme=default&hide_border=true" alt="GitHub Stats" style="width: 100%; max-width: 500px; border-radius: 8px;">
                        <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${this.username}&layout=compact&theme=default&hide_border=true" alt="Top Languages" style="width: 100%; max-width: 500px; border-radius: 8px; margin-top: 1rem;">
                    </div>
                `;
            }
        } catch (error) {
            console.log('GitHub stats could not be loaded');
        }
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-subtitle');
        this.texts = [
            'Software Developer & Problem Solver',
            'Full-Stack Web Developer',
            'Algorithm Enthusiast',
            'Open Source Contributor'
        ];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const fullText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentText === fullText) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before starting new text
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new Navigation();
    new ProjectsManager();
    new ContactForm();
    new ScrollAnimations();
    new NavbarScrollEffect();
    new GitHubStats();
    new TypingAnimation();
    
    // Add smooth reveal animation to hero section
    setTimeout(() => {
        document.querySelector('.hero').classList.add('fade-in-up');
    }, 100);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll-based functionality can go here
}, 10));

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});