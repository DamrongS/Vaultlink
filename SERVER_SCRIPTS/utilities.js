String.prototype.hashEncode = function()
{
    let h1 = 0x6a09e667;
    let h2 = 0xbb67ae85;

    for (let i = 0; i < this.length; i++)
    {
        let binaryChar = this.charCodeAt(i).toString(2).padStart(8, '0');

        h1 = h1 ^ parseInt(binaryChar, 2) + (h2 << 5) - (h1 >> 2);
        h2 = h2 ^ parseInt(binaryChar, 2) + (h1 << 7) - (h2 >> 3);

        h1 = (h1 * 0x1000193) >>> 0;
        h2 = (h2 * 0x85ebca6b) >>> 0;
    }

    let hashPassword = (h1 ^h2).toString(2).padStart(32, '0');
    return hashPassword;
}

// Save the user data (simulated localStorage)
async function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("User saved successfully:", user);
}

// Get users from localStorage
function getUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    console.log("Retrieved users:", users);
    return users;
}

// Check if a user already exists
function userExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

const users = getUsers();
console.log("User object structure:", JSON.stringify(users[0], null, 2));