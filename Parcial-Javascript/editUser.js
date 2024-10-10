import API from './api.js';

class UserTable {
  constructor() {
    this.tableBody = document.getElementById('user-table-body');
    this.editModal = document.getElementById('edit-user-modal');
    this.editForm = document.getElementById('edit-user-form');
    this.closeModalButton = document.getElementById('close-modal');

    document.addEventListener('DOMContentLoaded', () => this.populateUserTable());
    this.closeModalButton.addEventListener('click', () => this.closeEditModal());
    this.editForm.addEventListener('submit', (event) => this.handleEditFormSubmit(event));
  }

  async populateUserTable() {
    try {
      const users = await API.getUsers(); 
      this.tableBody.innerHTML = ''; 

      users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td><img class="user-photo" src="${user.photo}" alt="${user.firstName} ${user.lastName}"></td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.jobTitle}</td>
          <td>${user.phone}</td>
          <td><button class="edit-user-button" data-id="${user.id}">Edit</button></td>
        `;

        this.tableBody.appendChild(row);
      });

      document.querySelectorAll('.edit-user-button').forEach(button => {
        button.addEventListener('click', (event) => {
          const userId = event.target.dataset.id;
          this.openEditModal(userId, users);
        });
      });
    } catch (error) {
      console.error('Error populating user table:', error);
    }
  }

  openEditModal(userId, users) {
    const user = users.find(user => user.id == userId);
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-first-name').value = user.firstName;
    document.getElementById('edit-last-name').value = user.lastName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-job-title').value = user.jobTitle;
    document.getElementById('edit-phone').value = user.phone;

    this.editModal.style.display = 'flex';
  }

  closeEditModal() {
    this.editModal.style.display = 'none';
  }

  async handleEditFormSubmit(event) {
    event.preventDefault();

    const userId = document.getElementById('edit-user-id').value;
    const updatedUser = {
      firstName: document.getElementById('edit-first-name').value,
      lastName: document.getElementById('edit-last-name').value,
      email: document.getElementById('edit-email').value,
      jobTitle: document.getElementById('edit-job-title').value,
      phone: document.getElementById('edit-phone').value,
    };

    try {
      await API.updateUser(userId, updatedUser);
      this.closeEditModal();
      this.populateUserTable(); 
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
}

new UserTable();