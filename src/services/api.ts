
// API service for making requests to the Flask backend

const API_BASE_URL = 'http://localhost:5000/api';

export async function login(credentials: { username: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

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

export async function updateOrphan(id: number, orphanData: any) {
  const response = await fetch(`${API_BASE_URL}/orphans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orphanData),
  });
  if (!response.ok) {
    throw new Error('Failed to update orphan');
  }
  return response.json();
}

export async function deleteOrphan(id: number) {
  const response = await fetch(`${API_BASE_URL}/orphans/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete orphan');
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

export async function fetchMembers() {
  const response = await fetch(`${API_BASE_URL}/members`);
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  return response.json();
}

export async function addMember(memberData: any) {
  const response = await fetch(`${API_BASE_URL}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) {
    throw new Error('Failed to add member');
  }
  return response.json();
}

export async function updateMember(id: number, memberData: any) {
  const response = await fetch(`${API_BASE_URL}/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) {
    throw new Error('Failed to update member');
  }
  return response.json();
}

export async function deleteMember(id: number) {
  const response = await fetch(`${API_BASE_URL}/members/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete member');
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
