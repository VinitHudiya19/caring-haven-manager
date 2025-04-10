
// Dashboard page functionality

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!isAuthenticated()) {
    window.location.href = '/index.html';
    return;
  }

  // Initialize dashboard page
  initDashboardPage();
});

async function initDashboardPage() {
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

  // Load dashboard data
  loadDashboardData();
}

async function loadDashboardData() {
  try {
    // Fetch dashboard stats
    const response = await fetch(`${CONFIG.API_URL}/dashboard/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard statistics');
    }
    
    const data = await response.json();
    
    // Update dashboard stats
    document.getElementById('orphanCount').textContent = data.orphan_count;
    document.getElementById('adoptionsCount').textContent = data.adopted_count;
    document.getElementById('donationsAmount').textContent = formatCurrency(data.total_donations);
    document.getElementById('expensesAmount').textContent = formatCurrency(data.total_expenses || 0);
    
    // Load recent orphans and donations
    loadRecentOrphans();
    loadRecentDonations();
    
    // Initialize donation chart
    initDonationChart();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Failed to load dashboard data. Please try again.', 'error');
  }
}

async function loadRecentOrphans() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/orphans?limit=4`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent orphans');
    }
    
    const orphans = await response.json();
    const container = document.getElementById('recentOrphans');
    
    // Clear loading indicator
    container.innerHTML = '';
    
    if (orphans.length === 0) {
      container.innerHTML = '<div class="text-center py-4 text-gray-500">No orphans found</div>';
      return;
    }
    
    // Display recent orphans (limited to 4)
    orphans.slice(0, 4).forEach(orphan => {
      const statusColor = 
        orphan.status === 'active' ? '#e5deff' : 
        orphan.status === 'pending' ? '#FEF7CD' : 
        '#D3E4FD';
      
      const statusTextColor = 
        orphan.status === 'active' ? '#7E69AB' : 
        orphan.status === 'pending' ? '#806A00' : 
        '#0A49A0';
      
      const orphanElement = createElement('div', {
        className: 'flex items-center justify-between'
      }, [
        createElement('div', { className: 'flex items-center' }, [
          createElement('div', { className: 'bg-primary-light text-primary font-semibold rounded-full w-10 h-10 flex items-center justify-center' }, orphan.name.charAt(0)),
          createElement('div', { className: 'ml-4' }, [
            createElement('p', { className: 'text-sm font-medium' }, orphan.name),
            createElement('p', { className: 'text-xs text-gray-500' }, `${orphan.age} years old`)
          ])
        ]),
        createElement('div', { className: 'text-right' }, [
          createElement('div', { 
            className: 'inline-block px-2 py-1 text-xs rounded-full font-medium capitalize',
            style: `background-color: ${statusColor}; color: ${statusTextColor}`
          }, orphan.status)
        ])
      ]);
      
      container.appendChild(orphanElement);
    });
  } catch (error) {
    console.error('Error loading recent orphans:', error);
    document.getElementById('recentOrphans').innerHTML = 
      '<div class="text-center py-4 text-red-500">Failed to load recent orphans</div>';
  }
}

async function loadRecentDonations() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/donations?limit=4`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent donations');
    }
    
    const donations = await response.json();
    const container = document.getElementById('recentDonations');
    
    // Clear loading indicator
    container.innerHTML = '';
    
    if (donations.length === 0) {
      container.innerHTML = '<div class="text-center py-4 text-gray-500">No donations found</div>';
      return;
    }
    
    // Display recent donations (limited to 4)
    donations.slice(0, 4).forEach(donation => {
      const donationElement = createElement('div', {
        className: 'flex items-center justify-between'
      }, [
        createElement('div', { className: 'flex flex-col' }, [
          createElement('p', { className: 'text-sm font-medium' }, donation.donor_name),
          createElement('p', { className: 'text-xs text-gray-500' }, formatDate(donation.donation_date))
        ]),
        createElement('div', { className: 'text-right' }, [
          donation.type === 'money' ?
            createElement('p', { className: 'text-sm font-semibold text-green-600' }, formatCurrency(donation.amount)) :
            createElement('p', { className: 'text-sm font-semibold text-blue-600' }, 'Supplies'),
          createElement('div', { className: 'text-xs text-gray-500 capitalize' }, donation.type)
        ])
      ]);
      
      container.appendChild(donationElement);
    });
  } catch (error) {
    console.error('Error loading recent donations:', error);
    document.getElementById('recentDonations').innerHTML = 
      '<div class="text-center py-4 text-red-500">Failed to load recent donations</div>';
  }
}

function initDonationChart() {
  // Sample data - ideally, this would come from the API
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Donations ($)',
      data: [2500, 3000, 2700, 4000, 3500, 5000, 4200, 4800, 3900, 4500, 5500, 6500],
      backgroundColor: '#9b87f5',
      borderRadius: 4,
      barThickness: 20,
    }]
  };

  // Get the canvas context
  const chartElement = document.getElementById('donationsChart');
  
  // Create a container for the chart
  const canvas = document.createElement('canvas');
  chartElement.appendChild(canvas);
  
  // Initialize chart
  new Chart(canvas, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.parsed.y.toLocaleString();
            }
          }
        }
      }
    }
  });
}
