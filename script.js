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
		if (!document.body) return;
		
		const themeToggle = document.createElement('div');
		themeToggle.className = 'theme-toggle';
		themeToggle.innerHTML = `
			<button class="theme-btn theme-light" data-theme="light" title="Light Theme"></button>
			<button class="theme-btn theme-dark" data-theme="dark" title="Dark Theme"></button>
			<button class="theme-btn theme-purple" data-theme="purple" title="Purple Theme"></button>
		`;
		
		document.body.appendChild(themeToggle);
		
		themeToggle.addEventListener('click', (e) => {
			const btn = e.target.closest('.theme-btn');
			if (btn) {
				const theme = btn.getAttribute('data-theme');
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
		if (this.hamburger && this.navMenu) {
			this.hamburger.addEventListener('click', () => this.toggleMenu());
		}

		this.navLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				this.closeMenu();
				
				const href = link.getAttribute('href');
				if (href && href.startsWith('#')) {
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
		
		if (document.querySelectorAll('section[id]').length > 0) {
			window.addEventListener('scroll', () => this.highlightActiveLink());
		}
	}

	toggleMenu() {
		if (this.navMenu && this.hamburger) {
			this.navMenu.classList.toggle('active');
			this.hamburger.classList.toggle('active');
		}
	}

	closeMenu() {
		if (this.navMenu && this.hamburger) {
			this.navMenu.classList.remove('active');
			this.hamburger.classList.remove('active');
		}
	}

	highlightActiveLink() {
		const sections = document.querySelectorAll('section[id]');
		const scrollPos = window.scrollY + 100;

		sections.forEach(section => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const sectionId = section.getAttribute('id');
			
			if (sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
				this.navLinks.forEach(link => {
					if (link.getAttribute('href') === `#${sectionId}`) {
						this.navLinks.forEach(l => l.classList.remove('active'));
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
		this.projects = [];
		if (this.projectsGrid) {
			this.init();
		}
	}

	async init() {
		await this.loadProjectsData();
		this.categoryBtns.forEach(btn => {
			btn.addEventListener('click', (e) => {
				const category = e.target.getAttribute('data-category');
				this.filterProjects(category);
				this.updateActiveButton(e.target);
			});
		});
	}

	async loadProjectsData() {
		try {
			const response = await fetch('https://api.github.com/users/Jimmyu2foru18/repos?sort=updated&per_page=15');
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			
			const repos = await response.json();
			if (!Array.isArray(repos)) return;

			this.projects = repos.filter(repo => !repo.fork).map(repo => {
				let category = "tools";
				if (repo.language && ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP'].includes(repo.language)) {
					category = "web";
				} else if (repo.language && ['Java', 'C++', 'Python', 'Jupyter Notebook'].includes(repo.language)) {
					category = "algorithms";
				} else if (repo.language === 'GDScript') {
					category = "games";
				}
				
				let icon = "fas fa-code";
				if (category === "web") icon = "fas fa-globe";
				if (category === "algorithms") icon = "fas fa-calculator";
				if (category === "games") icon = "fas fa-gamepad";
				if (category === "tools") icon = "fas fa-wrench";

				return {
					title: repo.name.replace(/-/g, ' '),
					description: repo.description || "Repository for " + repo.name,
					category: category,
					tech: repo.language ? [repo.language] : ["Various"],
					icon: icon,
					github: repo.html_url
				};
			});
			this.renderProjects('all');
		} catch (error) {
			console.error("Failed to load GitHub projects", error);
			if (this.projectsGrid) {
				this.projectsGrid.innerHTML = `
					<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary, #666);">
						Unable to load projects dynamically. Visit 
						<a href="https://github.com/Jimmyu2foru18" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color, #2563eb);">GitHub</a> 
						to view repositories.
					</p>
				`;
			}
		}
	}

	renderProjects(category) {
		if (!this.projectsGrid) return;
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
					<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link" style="opacity: 1; transform: translateY(0);">
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
		
		this.showLoading();
		
		setTimeout(() => {
			this.showSuccess();
			this.form.reset();
		}, 2000);
	}

	showLoading() {
		const submitBtn = this.form.querySelector('button[type="submit"]');
		if (submitBtn) {
			submitBtn.innerHTML = '<span class="loading"></span> Sending...';
			submitBtn.disabled = true;
		}
	}

	showSuccess() {
		const submitBtn = this.form.querySelector('button[type="submit"]');
		if (submitBtn) {
			submitBtn.innerHTML = '✓ Message Sent!';
			submitBtn.style.backgroundColor = '#10b981';
			
			setTimeout(() => {
				submitBtn.innerHTML = 'Send Message';
				submitBtn.disabled = false;
				submitBtn.style.backgroundColor = '';
			}, 3000);
		}
	}
}

// Scroll & Skill Bar Animations
class ScrollAnimations {
	constructor() {
		this.observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};
		this.init();
	}

	init() {
		const elementsToAnimate = document.querySelectorAll(
			'section, .project-card, .cert-card, .skill-category'
		);

		if (elementsToAnimate.length > 0) {
			this.observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('fade-in-up');
					}
				});
			}, this.observerOptions);
			
			elementsToAnimate.forEach(el => this.observer.observe(el));
		}

		// Skill Bar Width Animation
		const skillBars = document.querySelectorAll('.skill-bar');
		if (skillBars.length > 0) {
			const skillObserver = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const bar = entry.target;
						const level = bar.getAttribute('data-level');
						if (level) {
							bar.style.width = level + '%';
						}
						skillObserver.unobserve(bar);
					}
				});
			}, { threshold: 0.2 });

			skillBars.forEach(bar => skillObserver.observe(bar));
		}
	}
}

// Navbar Scroll Effect
class NavbarScrollEffect {
	constructor() {
		this.navbar = document.querySelector('.navbar');
		this.init();
	}

	init() {
		if (!this.navbar) return;

		window.addEventListener('scroll', () => {
			if (window.scrollY > 100) {
				this.navbar.classList.add('scrolled');
			} else {
				this.navbar.classList.remove('scrolled');
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

	loadGitHubStats() {
		const githubEmbed = document.querySelector('.github-embed');
		if (githubEmbed) {
			githubEmbed.innerHTML = `
				<div class="github-stats-cards">
					<img src="https://awesome-github-stats.azurewebsites.net/user-stats/${this.username}?cardType=level&fontFamily=Alice&preferLogin=false&Text=35ABFF&Ring=30DD00&borderRadius=30&Border=65DD83&Title=F00000&Background=000000" alt="GitHub Awesome Stats" style="width: 100%; max-width: 500px; border-radius: 8px;">
				</div>
			`;
		}
	}
}

// Typing Animation for Hero Section
class TypingAnimation {
	constructor() {
		this.element = document.querySelector('.hero-subtitle');
		this.texts = [
			'Data Science & Education Professional',
			'Mathematics & CIS Tutor',
			'Information Systems Graduate',
			'Tech & Analytics Enthusiast'
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
		if (!this.element) return;

		const fullText = this.texts[this.currentIndex];
		
		if (this.isDeleting) {
			this.currentText = fullText.substring(0, this.currentText.length - 1);
		} else {
			this.currentText = fullText.substring(0, this.currentText.length + 1);
		}

		this.element.textContent = this.currentText;

		let typeSpeed = this.isDeleting ? 50 : 100;

		if (!this.isDeleting && this.currentText === fullText) {
			typeSpeed = 2000;
			this.isDeleting = true;
		} else if (this.isDeleting && this.currentText === '') {
			this.isDeleting = false;
			this.currentIndex = (this.currentIndex + 1) % this.texts.length;
			typeSpeed = 500;
		}

		setTimeout(() => this.type(), typeSpeed);
	}
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	new ThemeManager();
	new Navigation();
	new ProjectsManager();
	new ContactForm();
	new ScrollAnimations();
	new NavbarScrollEffect();
	new GitHubStats();
	new TypingAnimation();
	
	const hero = document.querySelector('.hero');
	if (hero) {
		setTimeout(() => {
			hero.classList.add('fade-in-up');
		}, 100);
	}
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

window.addEventListener('load', () => {
	document.body.classList.add('loaded');
});