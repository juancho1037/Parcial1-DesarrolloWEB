const addUserForm = document.getElementById('add-user-form');
    const addUserSubmitButton = document.getElementById('add-user-submit');

    // Función para habilitar o deshabilitar el botón de envío según los valores de entrada del formulario
    function toggleSubmitButton() {
        // Compruebe si todos los campos son válidos
        const isValid = addUserForm.checkValidity();
        addUserSubmitButton.disabled = !isValid;
    }

    
    function validateInput(input, errorElementId, message) {
        const errorElement = document.getElementById(errorElementId);
        if (input.validity.valueMissing) {
            errorElement.textContent = 'Este campo es obligatorio.';
            return false;
        }
        if (input.validity.tooShort) {
            errorElement.textContent = `Debe ser al menos ${input.minLength} caracteres`;
            return false;
        }
        if (input.validity.tooLong) {
            errorElement.textContent = `No debe ser más que ${input.maxLength} caracteres.`;
            return false;
        }
        if (input.validity.patternMismatch) {
            errorElement.textContent = message;
            return false;
        }
        if (input.validity.typeMismatch) {
            errorElement.textContent = message;
            return false;
        }
        errorElement.textContent = '';
        return true;
    }

    
    addUserForm.addEventListener('input', function() {
        validateInput(
            document.getElementById('add-first-name'),
            'add-first-name-error',
            'El nombre debe tener entre 2 y 50 caracteres y solo contener letras y espacios.'
        );
        validateInput(
            document.getElementById('add-last-name'),
            'add-last-name-error',
            'El apellido debe tener entre 2 y 50 caracteres y solo contener letras y espacios.'
        );
        validateInput(
            document.getElementById('add-email'),
            'add-email-error',
            'Por favor, introduce una dirección de correo electrónico válida.'
        );
        validateInput(
            document.getElementById('add-job-title'),
            'add-job-title-error',
            'El título del puesto debe tener entre 2 y 100 caracteres y puede incluir letras, números, comas, puntos y guiones.'
        );
        validateInput(
            document.getElementById('add-phone'),
            'add-phone-error',
            'El número de teléfono debe tener entre 7 y 15 dígitos y puede comenzar con un "+".'
        );
        toggleSubmitButton();
    });

    
    addUserForm.addEventListener('submit', function(event) {
        let isValid = true;

        isValid &= validateInput(
            document.getElementById('add-first-name'),
            'add-first-name-error',
            'El nombre debe tener entre 2 y 50 caracteres y solo contener letras y espacios.'
        );
        isValid &= validateInput(
            document.getElementById('add-last-name'),
            'add-last-name-error',
            'El apellido debe tener entre 2 y 50 caracteres y solo contener letras y espacios.'
        );
        isValid &= validateInput(
            document.getElementById('add-email'),
            'add-email-error',
            'Por favor, introduce una dirección de correo electrónico válida.'
        );
        isValid &= validateInput(
            document.getElementById('add-job-title'),
            'add-job-title-error',
            'El título del puesto debe tener entre 2 y 100 caracteres y puede incluir letras, números, comas, puntos y guiones.'
        );
        isValid &= validateInput(
            document.getElementById('add-phone'),
            'add-phone-error',
            'El número de teléfono debe tener entre 7 y 15 dígitos y puede comenzar con un "+".'
        );

        if (!isValid) {
            event.preventDefault();
        }
    });