
// Toast notification system

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type ('success', 'error', etc.)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'success', duration = CONFIG.TOAST_DURATION) {
  const container = document.getElementById('toastContainer');
  
  // Create toast element
  const toast = createElement('div', {
    className: `toast toast-${type}`
  }, [
    createElement('span', { textContent: message }),
    createElement('span', { 
      className: 'toast-close',
      textContent: '×',
      onClick: () => container.removeChild(toast)
    })
  ]);
  
  // Add to container
  container.appendChild(toast);
  
  // Auto remove after duration
  setTimeout(() => {
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, duration);
}
