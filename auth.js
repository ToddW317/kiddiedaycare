import { client, account } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthStatus();

    // Tab switching functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.tab;
            
            // Update tabs
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update forms
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Create email session with Appwrite
            const session = await account.createEmailSession(email, password);
            
            // Get user details after successful login
            const user = await account.get();
            
            console.log('Login successful:', session);
            showMessage('Login successful! Welcome ' + user.name, 'success');
            
            // Store user info in localStorage
            localStorage.setItem('userSession', JSON.stringify(session));
            localStorage.setItem('userData', JSON.stringify(user));
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message, 'error');
        }
    });

    // Sign up form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                // Show loading state
                const submitButton = signupForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Creating Account...';

                console.log('Creating account...', { name, email }); // Debug log

                // Create user account with Appwrite
                const user = await account.create(
                    'unique()', // Unique ID
                    email,
                    password,
                    name
                );
                
                console.log('Account created:', user); // Debug log

                // Automatically log in the user after signup
                const session = await account.createEmailSession(email, password);
                
                console.log('Session created:', session); // Debug log
                
                // Store user info in localStorage
                localStorage.setItem('userSession', JSON.stringify(session));
                localStorage.setItem('userData', JSON.stringify(user));
                
                showMessage('Account created successfully! Welcome ' + name, 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                console.error('Signup error:', error);
                showMessage(error.message || 'Error creating account. Please try again.', 'error');
                
                // Reset button state
                const submitButton = signupForm.querySelector('button[type="submit"]');
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            }
        });
    }

    // Forgot password functionality
    const forgotPasswordLink = document.getElementById('forgotPassword');
    forgotPasswordLink?.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        
        if (!email) {
            showMessage('Please enter your email address', 'error');
            return;
        }

        try {
            // Create password recovery with Appwrite
            await account.createRecovery(
                email,
                'https://yourdomain.com/reset-password' // Replace with your actual reset password page URL
            );
            showMessage('Password reset email sent! Please check your inbox.', 'success');
        } catch (error) {
            console.error('Password reset error:', error);
            showMessage(error.message, 'error');
        }
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            // Delete the current session with Appwrite
            await account.deleteSession('current');
            
            // Clear local storage
            localStorage.removeItem('userSession');
            localStorage.removeItem('userData');
            
            showMessage('Logged out successfully!', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
            showMessage(error.message, 'error');
        }
    });
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const user = await account.get();
        if (user) {
            // User is logged in
            updateUIForLoggedInUser(user);
            
            // If on login page, redirect to home
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        // User is not logged in
        console.log('User not logged in');
        
        // If on protected page, redirect to login
        const protectedPages = ['registration.html']; // Add other protected pages
        if (protectedPages.some(page => window.location.pathname.includes(page))) {
            window.location.href = 'login.html';
        }
    }
}

// Update UI based on authentication status
function updateUIForLoggedInUser(user) {
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        link.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${user.name}</span>
                <div class="user-dropdown">
                    <a href="profile.html">Profile</a>
                    <a href="#" id="logoutBtn">Logout</a>
                </div>
            </div>
        `;
    });
}

// Helper function to show messages
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

// Add this to protect routes
export function requireAuth() {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await account.get();
            resolve(user);
        } catch (error) {
            window.location.href = 'login.html';
            reject(error);
        }
    });
} 