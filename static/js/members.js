
// Members page functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = '/index.html';
    return;
  }

  // Initialize members page
  initMembersPage();
});

function initMembersPage() {
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
  
  // Set up modal functionality
  initModals();

  // Load members data
  loadMembers();
}

function initSearchAndFilters() {
  // Search input
  const searchInput = document.getElementById('searchMembers');
  searchInput.addEventListener('input', debounce(() => {
    loadMembers();
  }, 500));
  
  // Role filter
  const roleFilter = document.getElementById('roleFilter');
  roleFilter.addEventListener('change', () => {
    loadMembers();
  });
}

function initModals() {
  // Add member button
  document.getElementById('addMemberBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Member';
    document.getElementById('memberForm').reset();
    document.getElementById('memberId').value = '';
    toggleModal('memberModal', true);
  });
  
  // Close modal buttons
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    toggleModal('memberModal', false);
  });
  
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    toggleModal('deleteModal', false);
  });
  
  // Save member
  document.getElementById('saveMemberBtn').addEventListener('click', saveMember);
  
  // Delete member
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    const memberId = document.getElementById('confirmDeleteBtn').dataset.memberId;
    if (memberId) {
      await deleteMember(memberId);
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

async function loadMembers(page = 1, limit = 10) {
  try {
    // Get filter values
    const searchQuery = document.getElementById('searchMembers').value;
    const roleFilter = document.getElementById('roleFilter').value;
    
    // Build query parameters
    let queryParams = `?page=${page}&limit=${limit}`;
    if (searchQuery) queryParams += `&search=${encodeURIComponent(searchQuery)}`;
    if (roleFilter) queryParams += `&role=${encodeURIComponent(roleFilter)}`;
    
    // Show loading state
    const tableBody = document.getElementById('membersTableBody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading members...
        </td>
      </tr>
    `;
    
    const response = await fetch(`${CONFIG.API_URL}/members${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch members');
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
            No members found. Add one to get started.
          </td>
        </tr>
      `;
      return;
    }
    
    // Render members
    data.forEach(member => {
      const row = document.createElement('tr');
      
      // Create initial for avatar
      const initial = member.name ? member.name.charAt(0).toUpperCase() : 'M';
      
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
              ${initial}
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${member.name}</div>
              <div class="text-sm text-gray-500">${member.role}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900 capitalize">${member.role}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${member.phone}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${member.email}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDate(member.joined_date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="text-primary hover:text-primary-dark mr-3 edit-button" data-id="${member.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-600 hover:text-red-900 delete-button" data-id="${member.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', () => editMember(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('confirmDeleteBtn').dataset.memberId = button.dataset.id;
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
    console.error('Error loading members:', error);
    document.getElementById('membersTableBody').innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-red-500">
          Failed to load members: ${error.message}
        </td>
      </tr>
    `;
    showToast('Failed to load members. Please try again.', 'error');
  }
}

async function editMember(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/members/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch member details');
    }
    
    const member = await response.json();
    
    // Fill the form with member data
    document.getElementById('modalTitle').textContent = 'Edit Member';
    document.getElementById('memberId').value = member.id;
    document.getElementById('memberName').value = member.name;
    document.getElementById('memberRole').value = member.role;
    document.getElementById('memberPhone').value = member.phone;
    document.getElementById('memberEmail').value = member.email;
    document.getElementById('memberAddress').value = member.address || '';
    
    // Show the modal
    toggleModal('memberModal', true);
  } catch (error) {
    console.error('Error fetching member details:', error);
    showToast('Failed to load member details. Please try again.', 'error');
  }
}

async function saveMember() {
  try {
    // Get form data
    const id = document.getElementById('memberId').value;
    const name = document.getElementById('memberName').value;
    const role = document.getElementById('memberRole').value;
    const phone = document.getElementById('memberPhone').value;
    const email = document.getElementById('memberEmail').value;
    const address = document.getElementById('memberAddress').value;
    
    // Form validation
    if (!name || !role || !phone || !email) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    const memberData = {
      name,
      role,
      phone,
      email,
      address
    };
    
    let response;
    
    if (id) {
      // Update existing member
      response = await fetch(`${CONFIG.API_URL}/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
    } else {
      // Create new member
      response = await fetch(`${CONFIG.API_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to save member');
    }
    
    // Close modal and refresh members list
    toggleModal('memberModal', false);
    loadMembers();
    
    showToast(`Member successfully ${id ? 'updated' : 'added'}`);
  } catch (error) {
    console.error('Error saving member:', error);
    showToast(`Failed to save member: ${error.message}`, 'error');
  }
}

async function deleteMember(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/members/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete member');
    }
    
    // Close modal and refresh members list
    toggleModal('deleteModal', false);
    loadMembers();
    
    showToast('Member successfully deleted');
  } catch (error) {
    console.error('Error deleting member:', error);
    showToast(`Failed to delete member: ${error.message}`, 'error');
    toggleModal('deleteModal', false);
  }
}
