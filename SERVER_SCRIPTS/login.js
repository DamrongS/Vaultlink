document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');

    // Clear previous error messages
    emailElement.nextElementSibling?.removeAttribute('style'); 
    passwordElement.nextElementSibling?.removeAttribute('style'); 

    // Validate inputs
    if (!validateInput(emailElement, 'Email') || !validateInput(passwordElement, 'Password')) {
        return;
    }

    console.log("Attempting login for user:", emailElement.value);

    // Fetch users from localStorage
    const users = getUsers();
    console.log("Number of users found:", users.length);

    // Find the user
    const user = users.find(u => u.profile.email.toLowerCase() === emailElement.value.toLowerCase());
    console.log("User found:", user);

    if (!user) {
        showError(emailElement, 'No user found with this email.');
        return;
    }

    console.log("Comparing passwords...");
    
    // Hash the entered password before comparison
    const enteredPasswordHash = await passwordElement.value.hashEncode();
    console.log("Entered password hash:", enteredPasswordHash);

    console.log(user.password)
    console.log(enteredPasswordHash)
    console.log(password == enteredPasswordHash)
    
    // Compare hashed passwords
    if (enteredPasswordHash !== user.password) {
        console.log(enteredPasswordHash);
        console.log(user.password);
        showError(passwordElement, 'Incorrect password.');
        return;
    }

    console.log("Login successful!");
    loginSuccessful(user);
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

function loginSuccessful(user) {
    // Store user ID in localStorage
    localStorage.setItem('loggedInUserId', user.id);

    //alert('Login successful! Welcome, ' + user.username + '.');

    window.location.href = 'vaultlinkDashboard.html';  // Redirect to the user's dashboard
}