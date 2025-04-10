
// Main application logic

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initApp();
});

function initApp() {
  // Check if user is on login page
  const isLoginPage = document.getElementById('loginPage') && !document.getElementById('loginPage').classList.contains('hidden');

  if (isLoginPage) {
    // Initialize login page
    initLoginPage();
  } else {
    // Check authentication for other pages
    if (!isAuthenticated()) {
      window.location.href = '/index.html';
      return;
    }
    
    // Initialize appropriate page based on URL
    if (window.location.pathname.includes('dashboard')) {
      initDashboardPage();
    } else if (window.location.pathname.includes('orphans')) {
      initOrphansPage();
    } else if (window.location.pathname.includes('donations')) {
      initDonationsPage();
    } else if (window.location.pathname.includes('members')) {
      initMembersPage();
    } else if (window.location.pathname.includes('expenses')) {
      initExpensesPage();
    }
  }
}

function initLoginPage() {
  // If already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    window.location.href = '/dashboard.html';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const loginButton = document.getElementById('loginButton');
  
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
      showToast('Please enter both username and password', 'error');
      return;
    }
    
    try {
      loginButton.textContent = 'Logging in...';
      loginButton.disabled = true;
      
      await login(username, password);
      showToast('Login successful! Welcome back admin.');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      loginButton.textContent = 'Login';
      loginButton.disabled = false;
    }
  });
}

// Additional initialization functions for other pages will be added as needed
