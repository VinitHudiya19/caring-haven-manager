
// Donations page functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = '/index.html';
    return;
  }

  // Initialize donations page
  initDonationsPage();
});

function initDonationsPage() {
  // Show admin name
  const user = getCurrentUser();
  if (user) {
    document.getElementById('adminName').textContent = user.username;
    document.getElementById('mobileAdminName').textContent = user.username;
  }

  // Set up mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileSidebar = document.getElementById('mobileSidebar');
  const menuIcon = document.getElementById('menuIcon');
  
  mobileMenuBtn.addEventListener('click', function() {
    const isOpen = mobileSidebar.classList.contains('translate-x-0');
    
    if (isOpen) {
      mobileSidebar.classList.remove('translate-x-0');
      mobileSidebar.classList.add('-translate-x-full');
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    } else {
      mobileSidebar.classList.remove('-translate-x-full');
      mobileSidebar.classList.add('translate-x-0');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-times');
    }
  });

  // Set up logout functionality
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('mobileLogoutBtn').addEventListener('click', logout);

  // Initialize search and filters
  initSearchAndFilters();
  
  // Load donations data
  loadDonations();
  
  // Set up donation type listener
  document.getElementById('donationType').addEventListener('change', toggleDonationFields);
  
  // Set up add donation button
  document.getElementById('addDonationBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Record New Donation';
    document.getElementById('donationForm').reset();
    document.getElementById('donationId').value = '';
    document.getElementById('donationDate').valueAsDate = new Date();
    toggleModal('donationModal', true);
  });
  
  // Set up close modal button
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    toggleModal('donationModal', false);
  });
  
  // Set up save donation button
  document.getElementById('saveDonationBtn').addEventListener('click', saveDonation);
}

function initSearchAndFilters() {
  // Search input
  const searchInput = document.getElementById('searchDonations');
  searchInput.addEventListener('input', debounce(() => {
    loadDonations();
  }, 500));
  
  // Type filter
  const typeFilter = document.getElementById('typeFilter');
  typeFilter.addEventListener('change', () => {
    loadDonations();
  });
  
  // Date filter
  const dateFilter = document.getElementById('dateFilter');
  dateFilter.addEventListener('change', () => {
    loadDonations();
  });
}

function toggleDonationFields() {
  const donationType = document.getElementById('donationType').value;
  const amountField = document.getElementById('amountField');
  const itemsField = document.getElementById('itemsField');
  
  if (donationType === 'money') {
    amountField.classList.remove('hidden');
    document.getElementById('donationAmount').setAttribute('required', true);
    itemsField.classList.add('hidden');
    document.getElementById('donationItems').removeAttribute('required');
  } else {
    amountField.classList.add('hidden');
    document.getElementById('donationAmount').removeAttribute('required');
    itemsField.classList.remove('hidden');
    document.getElementById('donationItems').setAttribute('required', true);
  }
}

function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (show) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

async function loadDonations(page = 1, limit = 10) {
  try {
    // Get filter values
    const searchQuery = document.getElementById('searchDonations').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    // Build query parameters
    let queryParams = `?page=${page}&limit=${limit}`;
    if (searchQuery) queryParams += `&search=${encodeURIComponent(searchQuery)}`;
    if (typeFilter) queryParams += `&type=${encodeURIComponent(typeFilter)}`;
    if (dateFilter) queryParams += `&date=${encodeURIComponent(dateFilter)}`;
    
    // Show loading state
    const tableBody = document.getElementById('donationsTableBody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-10 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading donations...
        </td>
      </tr>
    `;
    
    const response = await fetch(`${CONFIG.API_URL}/donations${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }
    
    // For demonstration, we'll assume the API returns a simple array
    // In a real application, it would likely return pagination metadata too
    const data = await response.json();
    
    // Also fetch donation statistics
    loadDonationStats();
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-10 text-center text-gray-500">
            No donations found. Add one to get started.
          </td>
        </tr>
      `;
      return;
    }
    
    // Render donations
    data.forEach(donation => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${donation.donor_name}</div>
          ${donation.contact ? `<div class="text-sm text-gray-500">${donation.contact}</div>` : ''}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${donation.type === 'money' 
            ? `<div class="text-sm font-medium text-green-600">${formatCurrency(donation.amount)}</div>`
            : `<div class="text-sm font-medium text-blue-600">${donation.items || 'Supplies'}</div>`
          }
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${donation.type === 'money' 
              ? 'bg-green-100 text-green-800' 
              : donation.type === 'supplies' 
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }">
            ${donation.type}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDate(donation.donation_date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="text-primary hover:text-primary-dark mr-3 edit-button" data-id="${donation.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-600 hover:text-red-900 delete-button" data-id="${donation.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', () => editDonation(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('confirmDeleteBtn').dataset.donationId = button.dataset.id;
        toggleModal('deleteModal', true);
      });
    });
    
    // Update pagination info
    document.getElementById('paginationInfo').innerHTML = `
      Showing <span class="font-medium">${(page - 1) * limit + 1}</span> to 
      <span class="font-medium">${Math.min(page * limit, data.length)}</span> of 
      <span class="font-medium">${data.length}</span> results
    `;
    
  } catch (error) {
    console.error('Error loading donations:', error);
    document.getElementById('donationsTableBody').innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-10 text-center text-red-500">
          Failed to load donations: ${error.message}
        </td>
      </tr>
    `;
    showToast('Failed to load donations. Please try again.', 'error');
  }
}

async function loadDonationStats() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/donations/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donation statistics');
    }
    
    const stats = await response.json();
    
    // Update statistics
    document.getElementById('totalDonations').textContent = formatCurrency(stats.total || 0);
    document.getElementById('monthlyDonations').textContent = formatCurrency(stats.monthly || 0);
    document.getElementById('totalDonors').textContent = stats.donors || 0;
    
  } catch (error) {
    console.error('Error loading donation statistics:', error);
    // Don't show a toast for this as it's not critical
  }
}

async function editDonation(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/donations/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch donation details');
    }
    
    const donation = await response.json();
    
    // Fill the form with donation data
    document.getElementById('modalTitle').textContent = 'Edit Donation';
    document.getElementById('donationId').value = donation.id;
    document.getElementById('donorName').value = donation.donor_name;
    document.getElementById('donationType').value = donation.type;
    
    if (donation.type === 'money') {
      document.getElementById('donationAmount').value = donation.amount;
    } else {
      document.getElementById('donationItems').value = donation.items || '';
    }
    
    // Toggle fields based on type
    toggleDonationFields();
    
    document.getElementById('donationDate').value = donation.donation_date ? donation.donation_date.split('T')[0] : '';
    document.getElementById('donationNotes').value = donation.notes || '';
    
    // Show the modal
    toggleModal('donationModal', true);
  } catch (error) {
    console.error('Error fetching donation details:', error);
    showToast('Failed to load donation details. Please try again.', 'error');
  }
}

async function saveDonation() {
  try {
    // Get form data
    const id = document.getElementById('donationId').value;
    const donor_name = document.getElementById('donorName').value;
    const type = document.getElementById('donationType').value;
    const donation_date = document.getElementById('donationDate').value;
    const notes = document.getElementById('donationNotes').value;
    
    // Form validation
    if (!donor_name || !type || !donation_date) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    const donationData = {
      donor_name,
      type,
      donation_date,
      notes
    };
    
    // Add type-specific fields
    if (type === 'money') {
      const amount = document.getElementById('donationAmount').value;
      if (!amount) {
        showToast('Please enter an amount', 'error');
        return;
      }
      donationData.amount = parseFloat(amount);
    } else {
      const items = document.getElementById('donationItems').value;
      if (!items) {
        showToast('Please enter item details', 'error');
        return;
      }
      donationData.items = items;
      donationData.amount = 0; // Set amount to 0 for non-money donations
    }
    
    let response;
    
    if (id) {
      // Update existing donation
      response = await fetch(`${CONFIG.API_URL}/donations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
    } else {
      // Create new donation
      response = await fetch(`${CONFIG.API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to save donation');
    }
    
    // Close modal and refresh donations list
    toggleModal('donationModal', false);
    loadDonations();
    
    showToast(`Donation successfully ${id ? 'updated' : 'added'}`);
  } catch (error) {
    console.error('Error saving donation:', error);
    showToast(`Failed to save donation: ${error.message}`, 'error');
  }
}
