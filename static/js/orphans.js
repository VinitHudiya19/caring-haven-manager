
// Orphans page functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = '/index.html';
    return;
  }

  // Initialize orphans page
  initOrphansPage();
});

function initOrphansPage() {
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
  
  // Set up modal handlers
  initModals();

  // Load orphans data
  loadOrphans();
}

function initSearchAndFilters() {
  // Search input
  const searchInput = document.getElementById('searchOrphans');
  searchInput.addEventListener('input', debounce(() => {
    loadOrphans();
  }, 500));
  
  // Status filter
  const statusFilter = document.getElementById('statusFilter');
  statusFilter.addEventListener('change', () => {
    loadOrphans();
  });
  
  // Age filter
  const ageFilter = document.getElementById('ageFilter');
  ageFilter.addEventListener('change', () => {
    loadOrphans();
  });
}

function initModals() {
  // Add orphan button
  document.getElementById('addOrphanBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Orphan';
    document.getElementById('orphanForm').reset();
    document.getElementById('orphanId').value = '';
    toggleModal('orphanModal', true);
  });
  
  // Close modal buttons
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    toggleModal('orphanModal', false);
  });
  
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    toggleModal('deleteModal', false);
  });
  
  // Save orphan
  document.getElementById('saveOrphanBtn').addEventListener('click', saveOrphan);
  
  // Delete orphan
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    const orphanId = document.getElementById('confirmDeleteBtn').dataset.orphanId;
    if (orphanId) {
      await deleteOrphan(orphanId);
    }
  });
}

function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (show) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

async function loadOrphans(page = 1, limit = 10) {
  try {
    // Get filter values
    const searchQuery = document.getElementById('searchOrphans').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;
    
    // Build query parameters
    let queryParams = `?page=${page}&limit=${limit}`;
    if (searchQuery) queryParams += `&search=${encodeURIComponent(searchQuery)}`;
    if (statusFilter) queryParams += `&status=${encodeURIComponent(statusFilter)}`;
    if (ageFilter) queryParams += `&age=${encodeURIComponent(ageFilter)}`;
    
    // Show loading state
    const tableBody = document.getElementById('orphansTableBody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading orphans...
        </td>
      </tr>
    `;
    
    const response = await fetch(`${CONFIG.API_URL}/orphans${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orphans');
    }
    
    // For demonstration, we'll assume the API returns a simple array
    // In a real application, it would likely return pagination metadata too
    const data = await response.json();
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (!data || data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-10 text-center text-gray-500">
            No orphans found. Add one to get started.
          </td>
        </tr>
      `;
      return;
    }
    
    // Render orphans
    data.forEach(orphan => {
      const row = document.createElement('tr');
      
      // Determine status color
      const statusColorClass = 
        orphan.status === 'active' ? 'bg-purple-100 text-purple-800' : 
        orphan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
        'bg-blue-100 text-blue-800';
      
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
              ${orphan.name.charAt(0)}
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${orphan.name}</div>
              <div class="text-sm text-gray-500">${orphan.gender}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${orphan.age} years
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${orphan.gender}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDate(orphan.join_date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorClass}">
            ${orphan.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="text-primary hover:text-primary-dark mr-3 edit-button" data-id="${orphan.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-600 hover:text-red-900 delete-button" data-id="${orphan.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', () => editOrphan(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('confirmDeleteBtn').dataset.orphanId = button.dataset.id;
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
    console.error('Error loading orphans:', error);
    document.getElementById('orphansTableBody').innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-red-500">
          Failed to load orphans: ${error.message}
        </td>
      </tr>
    `;
    showToast('Failed to load orphans. Please try again.', 'error');
  }
}

async function editOrphan(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/orphans/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orphan details');
    }
    
    const orphan = await response.json();
    
    // Fill the form with orphan data
    document.getElementById('modalTitle').textContent = 'Edit Orphan';
    document.getElementById('orphanId').value = orphan.id;
    document.getElementById('orphanName').value = orphan.name;
    document.getElementById('orphanAge').value = orphan.age;
    document.getElementById('orphanGender').value = orphan.gender;
    document.getElementById('orphanStatus').value = orphan.status;
    document.getElementById('orphanBackground').value = orphan.background || '';
    
    // Show the modal
    toggleModal('orphanModal', true);
  } catch (error) {
    console.error('Error fetching orphan details:', error);
    showToast('Failed to load orphan details. Please try again.', 'error');
  }
}

async function saveOrphan() {
  try {
    // Get form data
    const id = document.getElementById('orphanId').value;
    const name = document.getElementById('orphanName').value;
    const age = document.getElementById('orphanAge').value;
    const gender = document.getElementById('orphanGender').value;
    const status = document.getElementById('orphanStatus').value;
    const background = document.getElementById('orphanBackground').value;
    
    // Form validation
    if (!name || !age || !gender) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    const orphanData = {
      name,
      age: parseInt(age),
      gender,
      status,
      background
    };
    
    let response;
    
    if (id) {
      // Update existing orphan
      response = await fetch(`${CONFIG.API_URL}/orphans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orphanData),
      });
    } else {
      // Create new orphan
      response = await fetch(`${CONFIG.API_URL}/orphans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orphanData),
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to save orphan');
    }
    
    // Close modal and refresh orphans list
    toggleModal('orphanModal', false);
    loadOrphans();
    
    showToast(`Orphan successfully ${id ? 'updated' : 'added'}`);
  } catch (error) {
    console.error('Error saving orphan:', error);
    showToast(`Failed to save orphan: ${error.message}`, 'error');
  }
}

async function deleteOrphan(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/orphans/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete orphan');
    }
    
    // Close modal and refresh orphans list
    toggleModal('deleteModal', false);
    loadOrphans();
    
    showToast('Orphan successfully deleted');
  } catch (error) {
    console.error('Error deleting orphan:', error);
    showToast(`Failed to delete orphan: ${error.message}`, 'error');
    toggleModal('deleteModal', false);
  }
}
