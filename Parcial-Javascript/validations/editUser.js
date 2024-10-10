document.getElementById('edit-user-form').addEventListener('submit', function(event) {
    let isValid = true;

    //Borrar mensajes de error anteriores
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    //Validar el primer nombre
    const firstName = document.getElementById('edit-first-name').value;
    if (firstName.length < 2 || firstName.length > 50) {
        document.getElementById('first-name-error').textContent = 'El nombre debe tener entre 2 y 50 caracteres.';
        isValid = false;
    }

    //Validar apellido
    const lastName = document.getElementById('edit-last-name').value;
    if (lastName.length < 2 || lastName.length > 50) {
        document.getElementById('last-name-error').textContent = 'El apellido debe tener entre 2 y 50 caracteres.';
        isValid = false;
    }

    // Validar el formato del correo electrónico (el tipo de entrada HTML5="email" también se validará)
    const email = document.getElementById('edit-email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Por favor, introduce una dirección de correo electrónico válida.';
        isValid = false;
    }

    // Validar título del puesto
    const jobTitle = document.getElementById('edit-job-title').value;
    if (jobTitle.length < 2 || jobTitle.length > 100) {
        document.getElementById('job-title-error').textContent = 'El título del puesto debe tener entre 2 y 100 caracteres.';
        isValid = false;
    }

    // Validar número de teléfono (permite '+' opcional al inicio y 10-15 dígitos)
    const phone = document.getElementById('edit-phone').value;
    const phonePattern = /^\+?\d{10,15}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById('phone-error').textContent = 'El número de teléfono debe tener entre 10 y 15 dígitos y puede incluir un "+" al principio.';
        isValid = false;
    }

    // Prevent form submission if any validation fails
    if (!isValid) {
        event.preventDefault();
    }
});