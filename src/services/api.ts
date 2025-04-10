
// API service for making requests to the Flask backend

const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchOrphans() {
  const response = await fetch(`${API_BASE_URL}/orphans`);
  if (!response.ok) {
    throw new Error('Failed to fetch orphans');
  }
  return response.json();
}

export async function fetchOrphanById(id: number) {
  const response = await fetch(`${API_BASE_URL}/orphans/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch orphan details');
  }
  return response.json();
}

export async function addOrphan(orphanData: any) {
  const response = await fetch(`${API_BASE_URL}/orphans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orphanData),
  });
  if (!response.ok) {
    throw new Error('Failed to add orphan');
  }
  return response.json();
}

export async function fetchDonations() {
  const response = await fetch(`${API_BASE_URL}/donations`);
  if (!response.ok) {
    throw new Error('Failed to fetch donations');
  }
  return response.json();
}

export async function addDonation(donationData: any) {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donationData),
  });
  if (!response.ok) {
    throw new Error('Failed to add donation');
  }
  return response.json();
}

export async function fetchDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard statistics');
  }
  return response.json();
}
