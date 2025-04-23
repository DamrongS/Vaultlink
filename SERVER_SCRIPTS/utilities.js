String.prototype.hashEncode = function() {
    let h1 = 0x6a09e667;
    let h2 = 0xbb67ae85;

    return new Promise((resolve) => {
        for (let i = 0; i < this.length; i++) {
            let binaryChar = this.charCodeAt(i).toString(2).padStart(8, '0');
            // ... (rest of the hashEncode implementation)
        }
        resolve(h1.toString(16));
    });
}

// Save the user data (simulated localStorage)
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Check if a user already exists
function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}