
// Expenses page functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = '/index.html';
    return;
  }

  // Initialize expenses page
  initExpensesPage();
});

function initExpensesPage() {
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

  // Load expenses data
  loadExpenses();
}

function initSearchAndFilters() {
  // Search input
  const searchInput = document.getElementById('searchExpenses');
  searchInput.addEventListener('input', debounce(() => {
    loadExpenses();
  }, 500));
  
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.addEventListener('change', () => {
    loadExpenses();
  });
  
  // Date filter
  const dateFilter = document.getElementById('dateFilter');
  dateFilter.addEventListener('change', () => {
    loadExpenses();
  });
}

function initModals() {
  // Add expense button
  document.getElementById('addExpenseBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Expense';
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('expenseDate').valueAsDate = new Date();
    toggleModal('expenseModal', true);
  });
  
  // Close modal buttons
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    toggleModal('expenseModal', false);
  });
  
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    toggleModal('deleteModal', false);
  });
  
  // Save expense
  document.getElementById('saveExpenseBtn').addEventListener('click', saveExpense);
  
  // Delete expense
  document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    const expenseId = document.getElementById('confirmDeleteBtn').dataset.expenseId;
    if (expenseId) {
      await deleteExpense(expenseId);
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

async function loadExpenses(page = 1, limit = 10) {
  try {
    // Get filter values
    const searchQuery = document.getElementById('searchExpenses').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    // Build query parameters
    let queryParams = `?page=${page}&limit=${limit}`;
    if (searchQuery) queryParams += `&search=${encodeURIComponent(searchQuery)}`;
    if (categoryFilter) queryParams += `&category=${encodeURIComponent(categoryFilter)}`;
    if (dateFilter) queryParams += `&date=${encodeURIComponent(dateFilter)}`;
    
    // Show loading state
    const tableBody = document.getElementById('expensesTableBody');
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading expenses...
        </td>
      </tr>
    `;
    
    const response = await fetch(`${CONFIG.API_URL}/expenses${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
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
            No expenses found. Add one to get started.
          </td>
        </tr>
      `;
      return;
    }
    
    // Render expenses
    data.forEach(expense => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${expense.description}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-red-600">${formatCurrency(expense.amount)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            ${expense.category}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDate(expense.expense_date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${expense.approved_by || 'N/A'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="text-primary hover:text-primary-dark mr-3 edit-button" data-id="${expense.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="text-red-600 hover:text-red-900 delete-button" data-id="${expense.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', () => editExpense(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('confirmDeleteBtn').dataset.expenseId = button.dataset.id;
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
    console.error('Error loading expenses:', error);
    document.getElementById('expensesTableBody').innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-red-500">
          Failed to load expenses: ${error.message}
        </td>
      </tr>
    `;
    showToast('Failed to load expenses. Please try again.', 'error');
  }
}

async function editExpense(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/expenses/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch expense details');
    }
    
    const expense = await response.json();
    
    // Fill the form with expense data
    document.getElementById('modalTitle').textContent = 'Edit Expense';
    document.getElementById('expenseId').value = expense.id;
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseDate').value = expense.expense_date ? expense.expense_date.split('T')[0] : '';
    document.getElementById('expenseApprovedBy').value = expense.approved_by || '';
    document.getElementById('expenseReceiptUrl').value = expense.receipt_url || '';
    
    // Show the modal
    toggleModal('expenseModal', true);
  } catch (error) {
    console.error('Error fetching expense details:', error);
    showToast('Failed to load expense details. Please try again.', 'error');
  }
}

async function saveExpense() {
  try {
    // Get form data
    const id = document.getElementById('expenseId').value;
    const description = document.getElementById('expenseDescription').value;
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory').value;
    const expense_date = document.getElementById('expenseDate').value;
    const approved_by = document.getElementById('expenseApprovedBy').value;
    const receipt_url = document.getElementById('expenseReceiptUrl').value;
    
    // Form validation
    if (!description || !amount || !category || !expense_date) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    const expenseData = {
      description,
      amount: parseFloat(amount),
      category,
      expense_date,
      approved_by,
      receipt_url
    };
    
    let response;
    
    if (id) {
      // Update existing expense
      response = await fetch(`${CONFIG.API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });
    } else {
      // Create new expense
      response = await fetch(`${CONFIG.API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });
    }
    
    if (!response.ok) {
      throw new Error('Failed to save expense');
    }
    
    // Close modal and refresh expenses list
    toggleModal('expenseModal', false);
    loadExpenses();
    
    showToast(`Expense successfully ${id ? 'updated' : 'added'}`);
  } catch (error) {
    console.error('Error saving expense:', error);
    showToast(`Failed to save expense: ${error.message}`, 'error');
  }
}

async function deleteExpense(id) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    
    // Close modal and refresh expenses list
    toggleModal('deleteModal', false);
    loadExpenses();
    
    showToast('Expense successfully deleted');
  } catch (error) {
    console.error('Error deleting expense:', error);
    showToast(`Failed to delete expense: ${error.message}`, 'error');
    toggleModal('deleteModal', false);
  }
}
