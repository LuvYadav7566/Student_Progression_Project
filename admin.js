// ================== LOGOUT ==================

function logout() {
  window.location.href = "/index.html";
}


// ================== ADMIN FEATURES ==================

// Load users
async function loadUsers() {
  const res = await fetch("/users");
  const data = await res.json();
  const container = document.getElementById("usersList");
  container.innerHTML = "";

  data.forEach(u => {
    // Don't show the delete button for the admin itself
    const deleteButton = u.role !== 'admin' 
      ? `<button class="delete-btn" onclick="deleteUser('${u.username}')">Delete</button>`
      : '';

    container.innerHTML += `
      <div class="admin-card-item">
        <div class="item-header">
            <strong>${u.username}</strong>
            <span class="item-detail">Role: <span>${u.role}</span></span>
        </div>
        ${deleteButton}
      </div>`;
  });
}

// Delete user
async function deleteUser(username) {
  if (!confirm(`Are you sure you want to delete user: ${username}?`)) return;
  await fetch(`/users/${username}`, { method: "DELETE" });
  loadUsers(); // Refresh the list
}

// Load queries
async function loadQueries() {
  const res = await fetch("/queries");
  const data = await res.json();
  const container = document.getElementById("queriesList");
  container.innerHTML = "";

  data.forEach(q => {
    container.innerHTML += `
      <div class="admin-card-item">
        <div class="item-header">
            <strong>${q.name}</strong>
            <span class="item-detail">Email: <span>${q.email}</span></span>
        </div>
        <p class="item-message">${q.message}</p>
        <span class="item-detail">Submitted: <span>${new Date(q.date).toLocaleString()}</span></span>
        <button class="delete-btn" onclick="deleteQuery(${q.id})">Delete</button>
      </div>`;
  });
}

// Delete query
async function deleteQuery(id) {
  if (!confirm(`Are you sure you want to delete query #${id}?`)) return;
  await fetch(`/queries/${id}`, { method: "DELETE" });
  loadQueries(); // Refresh the list
}

// Load data when the admin page is opened
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadQueries();
});