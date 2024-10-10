import API from './api.js';

class UserModal {
  constructor() {
    this.modal = document.getElementById('add-user-modal');
    this.addUserButton = document.getElementById('add-user-button');
    this.closeButton = document.getElementById('close-add-modal');
    this.addUserForm = document.getElementById('add-user-form');

    this.addUserButton.addEventListener('click', () => this.openAddModal());
    this.closeButton.addEventListener('click', () => this.closeAddModal());
    this.addUserForm.addEventListener('submit', (event) => this.handleAddFormSubmit(event));
  }

  openAddModal() {
    this.modal.style.display = 'flex';
  }

  closeAddModal() {
    this.modal.style.display = 'none';
  }

  async handleAddFormSubmit(event) {
    event.preventDefault();

    const newUser = {
      firstName: document.getElementById('add-first-name').value,
      lastName: document.getElementById('add-last-name').value,
      email: document.getElementById('add-email').value,
      jobTitle: document.getElementById('add-job-title').value,
      phone: document.getElementById('add-phone').value,
    };

    try {
      await API.createUser(newUser);
      this.closeAddModal();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  }
}

new UserModal();