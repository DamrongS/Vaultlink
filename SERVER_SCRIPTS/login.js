document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validation
    if (!email || !password) {
        alert('Please fill out both email and password.');
        return;
    }

    // Retrieve users from localStorage
    const users = getUsers();

    // Check if the user exists
    const user = users.find(user => user.email === email);
    if (!user) {
        alert('No user found with this email.');
        return;
    }

    // Hash the entered password and compare with saved hashed password
    password.hashEncode().then(hashedPassword => {
        if (user.password !== hashedPassword) {
            alert('Incorrect password.');
            return;
        }

        //alert('Login successful!');
        window.location.href = 'vaultlinkDashboard.html';  // Redirect to the user's dashboard
    });
});