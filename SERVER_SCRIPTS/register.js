document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    console.log("Submitting");

    const username = document.getElementById("username").value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById("fullname").value;
    const confirmPassword = document.getElementById("confirm").value;

    // Validation
    if (!email || !password) {
        alert('Please fill out both email and password.');
        return;
    }

    // Check if the email already exists
    if (userExists(email)) {
        alert('User already exists with this email.');
        return;
    }

    if (password != confirmPassword)
    {
        alert('Passwords do not match, please make sure you match both the password and confirm password');
        return;
    }

    // Hash the password before saving
    password.hashEncode().then(hashedPassword => {
        // Create new user object
        const newUser = {
            id: Date.now(),  // Simple unique ID (timestamp)
            username: username,
            password: hashedPassword,
            name: name,
            email: email,
            profile: {
                name: '',
                email: email
            }
        };

        // Save the new user
        saveUser(newUser);

        //alert('Registration successful!');
        window.location.href = 'loginPage.html';  // Redirect to login page
    });
});