
// Initialize on page load
const initialize = () => {
  setupMobileMenu();
  setupVideoPlay();
  setupProjectsGrid();
  setupFormAnimations();
  setupCaseStudyAnimations();
  
  // Initialize animations
  setupScrollAnimations();
};

// Mobile menu functionality
function setupMobileMenu() {
  const mobileToggle = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      } else {
        mobileMenu.classList.add('active');
      }
    });
  }
}

// Handle video player functionality
function setupVideoPlay() {
  const playButtons = document.querySelectorAll('.play-button');
  
  playButtons.forEach(button => {
    button.addEventListener('click', function() {
      const videoContainer = this.closest('.video-container');
      const video = videoContainer.querySelector('video');
      
      if (video && video.paused) {
        video.play();
        this.classList.add('hidden');
      }
      
      video.addEventListener('pause', function() {
        button.classList.remove('hidden');
      });
      
      video.addEventListener('ended', function() {
        button.classList.remove('hidden');
      });
    });
  });
}

// Projects grid functionality
function setupProjectsGrid() {
  const projectsGrid = document.querySelector('.projects-grid');
  const firstCard = document.querySelector('.project-card');
  const allCards = document.querySelectorAll('.project-card');
  const pagination = document.querySelector('.pagination');
  
  if (projectsGrid && firstCard && allCards.length > 0) {
    // Hide all cards except the first one
    allCards.forEach((card, index) => {
      if (index > 0) {
        card.classList.add('hidden');
      }
    });
    
    // Add click event to expand grid
    firstCard.addEventListener('click', function() {
      if (!projectsGrid.classList.contains('expanded')) {
        projectsGrid.classList.add('expanded');
        
        // Show all cards with animation
        allCards.forEach((card, index) => {
          if (index > 0) {
            setTimeout(() => {
              card.classList.remove('hidden');
              card.classList.add('fadeInUp');
            }, 100 * index);
          }
        });
        
        // Show pagination
        if (pagination) {
          pagination.classList.remove('hidden');
        }
        
        // Add click event to cards for case study navigation
        allCards.forEach((card, index) => {
          card.onclick = function(e) {
            // Prevent clicks on the first card from navigating if we just expanded
            if (index === 0 && e.timeStamp - expandTimeStamp < 500) return;
            window.location.href = `case-study.html?id=project${index+1}`;
          };
        });
        
        // Store expand timestamp to prevent double-click issues
        expandTimeStamp = e.timeStamp;
      }
    });
  }
}

// Form animations and validation
function setupFormAnimations() {
  const formInputs = document.querySelectorAll('input, textarea');
  
  if (formInputs.length > 0) {
    formInputs.forEach(input => {
      // Focus animation
      input.addEventListener('focus', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup) {
          formGroup.classList.add('focused');
        }
      });
      
      // Blur animation
      input.addEventListener('blur', function() {
        if (this.value === '') {
          const formGroup = this.closest('.form-group');
          if (formGroup) {
            formGroup.classList.remove('focused');
          }
        }
      });
      
      // Check if input has value on load
      if (input.value !== '') {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
          formGroup.classList.add('focused');
        }
      }
    });
  }
  
  // Form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Form submitted successfully!');
    });
  }
}

// Setup case study animations
function setupCaseStudyAnimations() {
  // Get the project ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  if (projectId) {
    const titles = {
      'project1': 'UX/Branding Project',
      'project2': 'Web Design Project',
      'project3': 'Illustration Project',
      'project4': 'Motion Graphics Project',
      'project5': 'UX/Branding Project',
      'project6': 'Web Design Project'
    };
    
    const titleElement = document.getElementById('caseStudyTitle');
    const typeElement = document.getElementById('caseStudyType');
    
    if (titleElement && typeElement) {
      titleElement.textContent = projectId.replace(/project/, 'Project ');
      typeElement.textContent = titles[projectId] || 'Design Project';
    }
  }
  
  // Animate case study sections on load
  const caseStudySections = document.querySelectorAll('.case-study-section');
  if (caseStudySections.length > 0) {
    caseStudySections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, 200 * index);
    });
  }
  
  // Setup navigation dots
  const navDots = document.querySelectorAll('.case-study-nav-dot');
  const sections = document.querySelectorAll('.case-study-section');
  
  if (navDots.length > 0 && sections.length > 0) {
    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        // Remove active class from all dots
        navDots.forEach(d => d.classList.remove('active'));
        
        // Add active class to clicked dot
        dot.classList.add('active');
        
        // Scroll to corresponding section
        if (sections[index]) {
          sections[index].scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Animate elements on scroll
function setupScrollAnimations() {
  // Run animation on load
  animateOnScroll();
  
  // Set up scroll event listener
  window.addEventListener('scroll', animateOnScroll);
}

function animateOnScroll() {
  const elements = document.querySelectorAll('.section-title, .project-card, .meet-text p, .meet-image-container, .contact-form, .animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (elementPosition < screenPosition) {
      element.classList.add('visible');
    }
  });
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Global variable to store timestamp of grid expansion
let expandTimeStamp = 0;