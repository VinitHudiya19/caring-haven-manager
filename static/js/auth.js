
// Authentication related functions

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
function isAuthenticated() {
  const authData = localStorage.getItem(CONFIG.STORAGE_KEY);
  return authData !== null;
}

/**
 * Get current user data
 * @returns {Object|null} - User data or null if not authenticated
 */
function getCurrentUser() {
  const authData = localStorage.getItem(CONFIG.STORAGE_KEY);
  if (!authData) return null;
  
  try {
    return JSON.parse(authData);
  } catch (error) {
    logout();
    return null;
  }
}

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise} - Login response
 */
async function login(username, password) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store auth data in local storage
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
      username: data.username,
      isAuthenticated: true,
    }));
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem(CONFIG.STORAGE_KEY);
  window.location.href = '/index.html';
}

/**
 * Check authentication status and redirect if needed
 * @param {boolean} requireAuth - Whether authentication is required
 * @param {string} redirectPath - Path to redirect to if authentication check fails
 */
function checkAuth(requireAuth = true, redirectPath = '/index.html') {
  const isLoggedIn = isAuthenticated();
  
  if (requireAuth && !isLoggedIn) {
    // Require auth but user is not logged in
    window.location.href = redirectPath;
    return false;
  } else if (!requireAuth && isLoggedIn) {
    // Don't require auth but user is logged in
    window.location.href = '/dashboard.html';
    return false;
  }
  
  return true;
}

/**
 * Set up authentication headers for fetch requests
 * @param {Object} options - Fetch options
 * @returns {Object} - Updated fetch options with auth headers
 */
function withAuth(options = {}) {
  const user = getCurrentUser();
  if (!user) return options;
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${user.token}`, // If you implement token-based auth
    },
  };
}
