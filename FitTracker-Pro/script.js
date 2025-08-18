// =========================
// FITTRACKER PRO JAVASCRIPT
// =========================

// Application State
const AppState = {
    counterValue: 0,
    isFormSubmitted: false
};

// DOM Elements Cache
const DOMElements = {
    // Counter elements
    counterValue: document.getElementById('counter-value'),
    counterDisplay: document.getElementById('counter-display'),
    incrementBtn: document.getElementById('increment'),
    decrementBtn: document.getElementById('decrement'),
    resetBtn: document.getElementById('reset'),
    
    // Form elements
    form: document.getElementById('signup-form'),
    successMessage: document.getElementById('success-message'),
    inputs: document.querySelectorAll('#signup-form input'),
    
    // Navigation elements
    navbar: document.querySelector('.navbar'),
    navLinks: document.querySelectorAll('.navbar__link'),
    
    // Feature cards
    featureCards: document.querySelectorAll('.card--feature')
};

// =========================
// UTILITY FUNCTIONS
// =========================

/**
 * Add CSS class to element
 * @param {HTMLElement} element - The element to add class to
 * @param {string} className - The class name to add
 */
function addClass(element, className) {
    if (element && className) {
        element.classList.add(className);
    }
}

/**
 * Remove CSS class from element
 * @param {HTMLElement} element - The element to remove class from
 * @param {string} className - The class name to remove
 */
function removeClass(element, className) {
    if (element && className) {
        element.classList.remove(className);
    }
}

/**
 * Toggle CSS class on element
 * @param {HTMLElement} element - The element to toggle class on
 * @param {string} className - The class name to toggle
 */
function toggleClass(element, className) {
    if (element && className) {
        element.classList.toggle(className);
    }
}

/**
 * Check if element has specific class
 * @param {HTMLElement} element - The element to check
 * @param {string} className - The class name to check for
 * @returns {boolean} - True if element has the class
 */
function hasClass(element, className) {
    return element && element.classList.contains(className);
}

// =========================
// COUNTER FUNCTIONALITY
// =========================

class WorkoutCounter {
    constructor() {
        this.value = AppState.counterValue;
        this.display = DOMElements.counterDisplay;
        this.valueElement = DOMElements.counterValue;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        console.log('💪 Workout Counter initialized');
    }

    bindEvents() {
        // Increment button
        if (DOMElements.incrementBtn) {
            DOMElements.incrementBtn.addEventListener('click', () => {
                this.increment();
            });
        }

        // Decrement button
        if (DOMElements.decrementBtn) {
            DOMElements.decrementBtn.addEventListener('click', () => {
                this.decrement();
            });
        }

        // Reset button
        if (DOMElements.resetBtn) {
            DOMElements.resetBtn.addEventListener('click', () => {
                this.reset();
            });
        }
    }

    increment() {
        this.value++;
        AppState.counterValue = this.value;
        this.updateDisplay();
        this.animateDisplay();
        console.log(`Counter incremented to: ${this.value}`);
    }

    decrement() {
        if (this.value > 0) {
            this.value--;
            AppState.counterValue = this.value;
            this.updateDisplay();
            this.animateDisplay();
            console.log(`Counter decremented to: ${this.value}`);
        } else {
            console.log('Counter cannot go below zero');
        }
    }

    reset() {
        this.value = 0;
        AppState.counterValue = this.value;
        this.updateDisplay();
        this.animateDisplay();
        console.log('Counter reset to 0');
    }

    updateDisplay() {
        if (this.valueElement) {
            this.valueElement.textContent = this.value;
        }
    }

    animateDisplay() {
        if (this.display) {
            addClass(this.display, 'counter__display--animate');
            setTimeout(() => {
                removeClass(this.display, 'counter__display--animate');
            }, 200);
        }
    }
}

// =========================
// FORM VALIDATION
// =========================

class FormValidator {
    constructor() {
        this.form = DOMElements.form;
        this.inputs = DOMElements.inputs;
        this.successMessage = DOMElements.successMessage;
        this.validationRules = {
            name: {
                pattern: /^[a-zA-Z\s]{2,}$/,
                message: 'Name must be at least 2 characters and contain only letters'
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                pattern: /^[\d\s\-\+\(\)]{10,}$/,
                message: 'Phone number must be at least 10 digits'
            },
            password: {
                pattern: /^.{6,}$/,
                message: 'Password must be at least 6 characters long'
            }
        };
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
            console.log('📋 Form Validator initialized');
        }
    }

    bindEvents() {
        // Add event listeners to each input
        this.inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e));
            input.addEventListener('input', (e) => this.clearError(e));
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(event) {
        const field = event.target;
        const fieldName = field.name;
        const value = field.value.trim();
        const formGroup = field.closest('.form__group');
        const errorElement = document.getElementById(`${fieldName}-error`);

        // Check if field is empty
        if (!value) {
            this.showError(
                formGroup, 
                errorElement, 
                `${this.capitalize(fieldName)} is required`
            );
            return false;
        }

        // Check pattern validation
        const rule = this.validationRules[fieldName];
        if (rule && !rule.pattern.test(value)) {
            this.showError(formGroup, errorElement, rule.message);
            return false;
        }

        // Field is valid
        this.showSuccess(formGroup);
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }

    clearError(event) {
        const field = event.target;
        const formGroup = field.closest('.form__group');
        
        if (hasClass(formGroup, 'form__group--error')) {
            removeClass(formGroup, 'form__group--error');
        }
    }

    showError(formGroup, errorElement, message) {
        removeClass(formGroup, 'form__group--success');
        addClass(formGroup, 'form__group--error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    showSuccess(formGroup) {
        removeClass(formGroup, 'form__group--error');
        addClass(formGroup, 'form__group--success');
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('Form submission attempted');
        
        let isFormValid = true;
        
        // Validate all fields
        this.inputs.forEach(input => {
            const fieldIsValid = this.validateField({ target: input });
            if (!fieldIsValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.showSuccessMessage();
            AppState.isFormSubmitted = true;
            console.log('✅ Form submitted successfully');
        } else {
            this.scrollToFirstError();
            console.log('❌ Form validation failed');
        }
    }

    showSuccessMessage() {
        // Hide form
        this.form.style.display = 'none';
        
        // Show success message
        this.successMessage.style.display = 'block';
        
        // Scroll to success message
        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Reset form after delay
        setTimeout(() => {
            this.resetForm();
        }, 1000);
    }

    resetForm() {
        this.form.reset();
        
        // Clear validation states
        this.inputs.forEach(input => {
            const formGroup = input.closest('.form__group');
            removeClass(formGroup, 'form__group--success');
            removeClass(formGroup, 'form__group--error');
        });
        
        // Show form and hide success message after 5 seconds
        setTimeout(() => {
            this.form.style.display = 'block';
            this.successMessage.style.display = 'none';
            AppState.isFormSubmitted = false;
        }, 5000);
    }

    scrollToFirstError() {
        const firstError = this.form.querySelector('.form__group--error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}


// NAVIGATION FUNCTIONALITY
// =========================

class Navigation {
    constructor() {
        this.navbar = DOMElements.navbar;
        this.navLinks = DOMElements.navLinks;
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('🧭 Navigation initialized');
    }

    bindEvents() {
        // Smooth scrolling for navigation link
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleSmoothScroll(event) {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleScroll() {
        if (window.scrollY > 50) {
            addClass(this.navbar, 'navbar--scrolled');
        } else {
            removeClass(this.navbar, 'navbar--scrolled');
        }
    }
}

// =========================
// SCROLL ANIMATIONS
// =========================

class ScrollAnimations {
    constructor() {
        this.featureCards = DOMElements.featureCards;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
            console.log('🎬 Scroll Animations initialized');
        } else {
            // Fallback for older browsers
            this.showAllCards();
        }
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    addClass(entry.target, 'animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all feature cards
        this.featureCards.forEach(card => {
            this.observer.observe(card);
        });
    }

    showAllCards() {
        // Fallback: show all cards immediately
        this.featureCards.forEach(card => {
            addClass(card, 'animate-in');
        });
    }
}

// =========================
// APPLICATION INITIALIZATION
// =========================

class FitTrackerApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.components.counter = new WorkoutCounter();
            this.components.formValidator = new FormValidator();
            this.components.navigation = new Navigation();
            this.components.scrollAnimations = new ScrollAnimations();

            // Log successful initialization
            this.logWelcomeMessage();
            console.log('🚀 FitTracker Pro fully initialized');
            
        } catch (error) {
            console.error('❌ Error initializing FitTracker Pro:', error);
        }
    }

    logWelcomeMessage() {
        console.log(`
🏋️‍♂️ Welcome to FitTracker Pro!

This project demonstrates:
✅ Responsive Design (Mobile-First)
✅ Interactive DOM Manipulation
✅ Form Validation with Real-time Feedback
✅ Smooth Animations & Transitions
✅ Semantic HTML & Accessibility
✅ Modern CSS (Flexbox & Grid)
✅ Vanilla JavaScript ES6+ Classes
✅ BEM CSS Methodology
✅ External CSS Architecture

Try the counter and form validation! 💪
        `);
    }

    // Public API methods
    getCounterValue() {
        return AppState.counterValue;
    }

    isFormSubmitted() {
        return AppState.isFormSubmitted;
    }

    resetCounter() {
        if (this.components.counter) {
            this.components.counter.reset();
        }
    }
}

// =========================
// INITIALIZE APPLICATION
// =========================

// Create global app instance
const FitTrackerProApp = new FitTrackerApp();

// Expose some methods globally for debugging
window.FitTracker = {
    getCounterValue: () => FitTrackerProApp.getCounterValue(),
    resetCounter: () => FitTrackerProApp.resetCounter(),
    isFormSubmitted: () => FitTrackerProApp.isFormSubmitted(),
    app: FitTrackerProApp
};