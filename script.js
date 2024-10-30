document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn?.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Registration form functionality
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const formSteps = document.querySelectorAll('.form-step');
        const progressSteps = document.querySelectorAll('.progress-step');
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const submitBtn = document.querySelector('.submit-btn');
        let currentStep = 1;

        // Handle next button
        nextBtn?.addEventListener('click', () => {
            if (validateCurrentStep(currentStep)) {
                currentStep++;
                updateFormSteps();
                updateProgressBar();
                updateNavigationButtons();
            }
        });

        // Handle previous button
        prevBtn?.addEventListener('click', () => {
            currentStep--;
            updateFormSteps();
            updateProgressBar();
            updateNavigationButtons();
        });

        // Add pickup person functionality
        const addPickupBtn = document.querySelector('.add-pickup-btn');
        const pickupPersonsContainer = document.getElementById('pickupPersons');

        addPickupBtn?.addEventListener('click', () => {
            const newPickupPerson = document.createElement('div');
            newPickupPerson.className = 'pickup-person form-grid';
            newPickupPerson.innerHTML = `
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="pickupName[]">
                </div>
                <div class="form-group">
                    <label>Relationship</label>
                    <input type="text" name="pickupRelation[]">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="pickupPhone[]">
                </div>
                <button type="button" class="remove-pickup-btn">Remove</button>
            `;
            pickupPersonsContainer.appendChild(newPickupPerson);
        });

        // Remove pickup person functionality
        pickupPersonsContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-pickup-btn')) {
                e.target.closest('.pickup-person').remove();
            }
        });

        // Form submission
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateCurrentStep(currentStep)) {
                try {
                    const formData = new FormData(registrationForm);
                    // Add your form submission logic here
                    console.log('Form submitted successfully');
                    // Show success message
                    showMessage('Registration submitted successfully!', 'success');
                } catch (error) {
                    console.error('Error submitting form:', error);
                    showMessage('Error submitting form. Please try again.', 'error');
                }
            }
        });

        // Helper functions
        function updateFormSteps() {
            formSteps.forEach(step => {
                step.classList.remove('active');
            });
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        }

        function updateProgressBar() {
            progressSteps.forEach((step, idx) => {
                if (idx < currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        }

        function updateNavigationButtons() {
            prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
            nextBtn.style.display = currentStep < formSteps.length ? 'block' : 'none';
            submitBtn.style.display = currentStep === formSteps.length ? 'block' : 'none';
        }

        function validateCurrentStep(step) {
            const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
            const requiredFields = currentStepElement.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showFieldError(field);
                } else {
                    field.classList.remove('error');
                    removeFieldError(field);
                }
            });

            return isValid;
        }

        function showFieldError(field) {
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (!errorMessage) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = 'This field is required';
                field.parentElement.appendChild(error);
            }
        }

        function removeFieldError(field) {
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }

        function showMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            setTimeout(() => messageDiv.remove(), 5000);
        }
    }

    // Gallery lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeLightbox = document.querySelector('.close-lightbox');

    function openLightbox(index) {
        const imgSrc = galleryItems[index].querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox?.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Make gallery items clickable
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
});