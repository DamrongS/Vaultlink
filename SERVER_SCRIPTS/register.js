document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    const registerButton = document.getElementById('registerButton');
    if (!registerButton) {
        console.error('Register button not found in the DOM');
        return;
    }

    console.log("Register button found");
    console.log("Button ID:", registerButton.id);
    console.log("Button attributes:", Object.keys(registerButton.attributes));

    registerButton.addEventListener('click', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const name = document.getElementById("fullname");
        const confirmPassword = document.getElementById("confirm");

        console.log("Registration attempt with:", {
            email: email.value,
            password: password.value,
            name: name.value,
            confirmPassword: confirmPassword.value,
            registeredAt: Date.now(),
        });

        // Validation
        if  (!validateInput(email, 'Email') || 
            !validateInput(password, 'Password') || !validateInput(name, 'Name') ||
            !validateInput(confirmPassword, 'Confirm Password')) {
            return;
        }

        if (!email.value || !password.value) {
            alert('Please fill out both email and password.');
            return;
        }

        // Check if the email already exists
        const users = getUsers();
        console.log("Retrieved users:", users);
        if (users.some(user => user.email === email.value.toLowerCase())) {
            alert('User already exists with this email.');
            return;
        }

        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match, please make sure you match both the password and confirm password');
            return;
        }

        // Hash the password before saving
        const hashedPassword = await password.value.hashEncode();
        console.log("Hashed password:", hashedPassword);

        // Create new user object
        const newUser = {
            id: GenerateUserId(),
            password: hashedPassword,
            name: name.value,
            email: email.value.toLowerCase(),
            profile: { name: name.value, email: email.value },
            accounts: { "Main" : { id : "#0000001", name : "Main", balance : 0.00, createdAt : Date.now(), locked : false, transactions : [{ type: "deposit", amount: 0, date: Date.now(), description: "Initial deposit" }], cards: {} } },
            settings: { darkMode: false, language: "en" },
            contact: { supportMessages: [] },
            registeredAt: Date.now()
        };

        console.log("New user object:", newUser);

        // Save the new user
        await saveUser(newUser);

        //alert('Registration successful!');
        window.location.href = 'loginPage.html';
    });
});

function validateInput(input, fieldName) {
    if (!input.value.trim()) {
        showError(input, `${fieldName} cannot be empty.`);
        return false;
    }
    return true;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        formGroup.appendChild(errorMessage);
    }

    errorMessage.textContent = message;
    formGroup.style.border = '1px solid red';
}

function GenerateUserId() {
    const min = 1;
    const max = 1000000;
    let id, padded, fullId;
  
    do {
      // 1. Generate random integer
      const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
      // 2. Zero‑pad to 7 digits and prefix with '#'
      padded = String(randomInt).padStart(7, '0');
      fullId = `#${padded}`;
      // loop until we find one that isn’t in use
    } while (ValidateUserId(fullId));
  
    return fullId;
}

/**
 * Checks whether the given user ID already exists.
 * Replace the body of this function with your actual lookup logic.
 * E.g., querying a database or checking localStorage.
 *
 * @param {string} id — the candidate ID (e.g. "#0000123")
 * @returns {boolean} true if the ID is already taken, false otherwise
 */
function ValidateUserId(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(u => u.id === id);
}