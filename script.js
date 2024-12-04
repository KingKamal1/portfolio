const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    updateIcon();
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    updateIcon();
    
    // Save theme preference
    const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : '';
    localStorage.setItem('theme', currentTheme);
});

function updateIcon() {
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Project Loading Function
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Generate technology tags
    const techTags = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    // Generate category tags
    const categoryTags = project.category.map(cat => 
        `<span class="category-tag">${cat}</span>`
    ).join('');

    card.innerHTML = `
        <div class="project-card-inner">
            <div class="project-details">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    <div class="tech-tags">${techTags}</div>
                    <div class="category-tags">${categoryTags}</div>
                </div>
                <div class="project-links">
                    <a href="${project.demoUrl}" class="btn btn-demo" target="_blank">
                        <i class="fas fa-eye"></i> Live Demo
                    </a>
                    <a href="${project.githubUrl}" class="btn btn-github" target="_blank">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Filter Projects
function filterProjects(projects, filter = 'all') {
    return projects.filter(project => {
        if (filter === 'all') return true;
        return project.technologies.some(tech => 
            tech.toLowerCase().includes(filter.toLowerCase())
        ) || project.category.some(cat => 
            cat.toLowerCase().includes(filter.toLowerCase())
        );
    });
}

// Render Projects
async function renderProjects(filter = 'all') {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    try {
        const projects = await loadProjects();
        const filteredProjects = filterProjects(projects, filter);
        
        projectsContainer.innerHTML = ''; // Clear existing content
        
        filteredProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        });

        // Update filter button active state
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    } catch (error) {
        console.error('Failed to render projects:', error);
        projectsContainer.innerHTML = '<p>Unable to load projects. Please try again later.</p>';
    }
}

// Initialize projects and filter functionality
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            renderProjects(filter);
        });
    });
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Validation and Submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formProps = Object.fromEntries(formData);
        
        // Basic validation
        let isValid = true;
        const email = formProps.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            isValid = false;
        }
        
        if (formProps.message.length < 10) {
            alert('Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (isValid) {
            try {
                // Here you would typically send the form data to a server
                // For now, we'll just show a success message
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                alert('There was an error sending your message. Please try again later.');
            }
        }
    });
}

// Skills Animation
const skillBars = document.querySelectorAll('.progress');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Animate skills when they come into view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
}
