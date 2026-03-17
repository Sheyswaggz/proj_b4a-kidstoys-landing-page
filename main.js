/**
 * KidsToys Landing Page - Interactive Features
 * Implements smooth scroll, lazy loading, animations, and form validation
 */

(function() {
  'use strict';

  /**
   * Configuration
   */
  const CONFIG = {
    scrollRevealDelay: 100,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    formValidationMessages: {
      name: {
        required: 'Please enter your name',
        minLength: 'Name must be at least 2 characters'
      },
      email: {
        required: 'Please enter your email address',
        invalid: 'Please enter a valid email address'
      },
      message: {
        required: 'Please enter a message',
        minLength: 'Message must be at least 10 characters'
      }
    }
  };

  /**
   * Utility Functions
   */
  const utils = {
    /**
     * Query selector helper
     */
    qs: (selector, parent = document) => parent.querySelector(selector),

    /**
     * Query selector all helper
     */
    qsa: (selector, parent = document) => Array.from(parent.querySelectorAll(selector)),

    /**
     * Debounce function to limit function execution rate
     */
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Add error message to form field
     */
    showError: (input, message) => {
      const formGroup = input.closest('.form-group');
      if (!formGroup) return;

      utils.removeError(input);

      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.textContent = message;
      errorDiv.setAttribute('role', 'alert');
      errorDiv.style.cssText = 'color: var(--color-accent-pink-dark); font-size: var(--font-size-sm); margin-top: var(--space-xs); font-weight: var(--font-weight-medium);';

      formGroup.appendChild(errorDiv);
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', `${input.id}-error`);
      errorDiv.id = `${input.id}-error`;
    },

    /**
     * Remove error message from form field
     */
    removeError: (input) => {
      const formGroup = input.closest('.form-group');
      if (!formGroup) return;

      const existingError = formGroup.querySelector('.form-error');
      if (existingError) {
        existingError.remove();
      }
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  };

  /**
   * Smooth Scroll Navigation
   * Implements smooth scrolling for internal anchor links
   */
  const smoothScroll = {
    init: () => {
      const navLinks = utils.qsa('a[href^="#"]');

      navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll.handleClick);
      });
    },

    handleClick: (e) => {
      const href = e.currentTarget.getAttribute('href');

      if (!href || href === '#') return;

      const target = utils.qs(href);
      if (!target) return;

      e.preventDefault();

      const headerOffset = utils.qs('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: CONFIG.reducedMotion ? 'auto' : 'smooth'
      });

      if (target.hasAttribute('tabindex')) {
        target.focus();
      } else {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    }
  };

  /**
   * Mobile Menu Toggle
   * Handles hamburger menu functionality (prepared for future implementation)
   */
  const mobileMenu = {
    init: () => {
      const menuToggle = utils.qs('.menu-toggle');
      const navMenu = utils.qs('.nav-menu');

      if (!menuToggle || !navMenu) {
        return;
      }

      menuToggle.addEventListener('click', mobileMenu.toggle);

      utils.qsa('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 768) {
            mobileMenu.close();
          }
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          mobileMenu.close();
        }
      });
    },

    toggle: () => {
      const menuToggle = utils.qs('.menu-toggle');
      const navMenu = utils.qs('.nav-menu');
      const isActive = navMenu.classList.contains('active');

      if (isActive) {
        mobileMenu.close();
      } else {
        mobileMenu.open();
      }
    },

    open: () => {
      const menuToggle = utils.qs('.menu-toggle');
      const navMenu = utils.qs('.nav-menu');

      navMenu.classList.add('active');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    },

    close: () => {
      const menuToggle = utils.qs('.menu-toggle');
      const navMenu = utils.qs('.nav-menu');

      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  /**
   * Lazy Loading with Intersection Observer
   * Implements lazy loading for images with skeleton placeholders
   */
  const lazyLoading = {
    observer: null,

    init: () => {
      if (!('IntersectionObserver' in window)) {
        lazyLoading.loadAllImages();
        return;
      }

      lazyLoading.observer = new IntersectionObserver(
        lazyLoading.handleIntersection,
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.01
        }
      );

      const lazyImages = utils.qsa('img[loading="lazy"]');
      lazyImages.forEach(img => {
        lazyLoading.observer.observe(img);
      });
    },

    handleIntersection: (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          lazyLoading.loadImage(img);
          observer.unobserve(img);
        }
      });
    },

    loadImage: (img) => {
      const src = img.getAttribute('src');

      if (!src) return;

      img.addEventListener('load', () => {
        img.classList.add('loaded');
        const wrapper = img.closest('.toy-image-wrapper, .store-image-wrapper');
        if (wrapper) {
          const skeleton = wrapper.querySelector('.skeleton-loader');
          if (skeleton) {
            skeleton.style.opacity = '0';
            setTimeout(() => skeleton.remove(), 300);
          }
        }
      }, { once: true });

      img.addEventListener('error', () => {
        console.error(`Failed to load image: ${src}`);
        img.alt = 'Image failed to load';
      }, { once: true });

      if (img.complete) {
        img.dispatchEvent(new Event('load'));
      }
    },

    loadAllImages: () => {
      const lazyImages = utils.qsa('img[loading="lazy"]');
      lazyImages.forEach(img => lazyLoading.loadImage(img));
    }
  };

  /**
   * Scroll-Triggered Reveal Animations
   * Implements fade-in animations with staggered delays as elements enter viewport
   */
  const scrollReveal = {
    observer: null,

    init: () => {
      if (CONFIG.reducedMotion) {
        scrollReveal.disableAnimations();
        return;
      }

      if (!('IntersectionObserver' in window)) {
        scrollReveal.disableAnimations();
        return;
      }

      scrollReveal.observer = new IntersectionObserver(
        scrollReveal.handleIntersection,
        {
          root: null,
          rootMargin: '-50px',
          threshold: 0.1
        }
      );

      const revealElements = utils.qsa('.toy-card, .detail-block, .contact-form, .social-links');

      revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`;
        el.dataset.revealDelay = index * CONFIG.scrollRevealDelay;

        scrollReveal.observer.observe(el);
      });

      const sectionHeadings = utils.qsa('section h2');
      sectionHeadings.forEach(heading => {
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(20px)';
        heading.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        scrollReveal.observer.observe(heading);
      });
    },

    handleIntersection: (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.dataset.revealDelay || 0);

          setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, delay);

          observer.unobserve(element);
        }
      });
    },

    disableAnimations: () => {
      const allElements = utils.qsa('.toy-card, .detail-block, .contact-form, .social-links, section h2');
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  };

  /**
   * Form Validation
   * Implements client-side validation for contact form with error messaging
   */
  const formValidation = {
    form: null,

    init: () => {
      formValidation.form = utils.qs('.contact-form');

      if (!formValidation.form) return;

      formValidation.form.setAttribute('novalidate', 'true');

      formValidation.form.addEventListener('submit', formValidation.handleSubmit);

      const inputs = utils.qsa('input, textarea', formValidation.form);
      inputs.forEach(input => {
        input.addEventListener('blur', () => formValidation.validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            formValidation.validateField(input);
          }
        });
      });
    },

    handleSubmit: (e) => {
      e.preventDefault();

      const inputs = utils.qsa('input[required], textarea[required]', formValidation.form);
      let isValid = true;
      let firstInvalidField = null;

      inputs.forEach(input => {
        const fieldValid = formValidation.validateField(input);
        if (!fieldValid) {
          isValid = false;
          if (!firstInvalidField) {
            firstInvalidField = input;
          }
        }
      });

      if (!isValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      formValidation.submitForm();
    },

    validateField: (input) => {
      const value = input.value.trim();
      const type = input.type;
      const name = input.name;
      const messages = CONFIG.formValidationMessages[name];

      utils.removeError(input);
      input.classList.remove('error');

      if (input.hasAttribute('required') && !value) {
        utils.showError(input, messages?.required || 'This field is required');
        input.classList.add('error');
        return false;
      }

      if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          utils.showError(input, messages?.invalid || 'Invalid email address');
          input.classList.add('error');
          return false;
        }
      }

      if (name === 'name' && value && value.length < 2) {
        utils.showError(input, messages?.minLength || 'Name too short');
        input.classList.add('error');
        return false;
      }

      if (name === 'message' && value && value.length < 10) {
        utils.showError(input, messages?.minLength || 'Message too short');
        input.classList.add('error');
        return false;
      }

      return true;
    },

    submitForm: () => {
      const submitButton = utils.qs('.submit-button', formValidation.form);
      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      submitButton.style.opacity = '0.7';

      const formData = new FormData(formValidation.form);
      const data = Object.fromEntries(formData.entries());

      console.log('Form submission data:', data);

      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Message Sent!';
        submitButton.style.background = 'linear-gradient(135deg, var(--color-accent-green) 0%, var(--color-accent-green-light) 100%)';

        formValidation.form.reset();

        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.style.background = '';
          submitButton.style.opacity = '';
        }, 3000);
      }, 1500);
    }
  };

  /**
   * Active Navigation State
   * Updates active navigation link based on scroll position
   */
  const activeNav = {
    sections: [],
    navLinks: [],

    init: () => {
      activeNav.sections = utils.qsa('section[id]');
      activeNav.navLinks = utils.qsa('.nav-menu a[href^="#"]');

      if (activeNav.sections.length === 0 || activeNav.navLinks.length === 0) return;

      window.addEventListener('scroll', utils.debounce(activeNav.update, 100));
      activeNav.update();
    },

    update: () => {
      const scrollPosition = window.pageYOffset + 150;

      let currentSection = '';

      activeNav.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      activeNav.navLinks.forEach(link => {
        link.removeAttribute('aria-current');

        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  };

  /**
   * Initialize all features when DOM is ready
   */
  const init = () => {
    smoothScroll.init();
    mobileMenu.init();
    lazyLoading.init();
    scrollReveal.init();
    formValidation.init();
    activeNav.init();

    console.log('KidsToys Landing Page initialized successfully');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('resize', utils.debounce(() => {
    if (window.innerWidth >= 768) {
      const navMenu = utils.qs('.nav-menu');
      const menuToggle = utils.qs('.menu-toggle');

      if (navMenu?.classList.contains('active')) {
        mobileMenu.close();
      }
    }
  }, 250));

})();
