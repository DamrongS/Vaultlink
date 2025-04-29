String.prototype.hashEncode = function () {
    // Initialization with constants (from SHA-like schemes)
    let h1 = 0x6a09e667;
    let h2 = 0xbb67ae85;
    let h3 = 0x3c6ef372;
    let h4 = 0xa54ff53a;

    // Loop through each character in the string
    for (let i = 0; i < this.length; i++) {
        let c = this.charCodeAt(i);

        // Add complexity using shifting and XOR
        h1 = (h1 ^ (c + (h2 << 5) - (h1 >>> 3))) >>> 0;
        h2 = (h2 ^ (c + (h3 << 7) + (h2 >>> 2))) >>> 0;
        h3 = (h3 ^ (c + (h4 << 3) - (h3 >>> 1))) >>> 0;
        h4 = (h4 ^ (c + (h1 << 9) + (h4 >>> 4))) >>> 0;

        // Rotate values to mix them better
        h1 = ((h1 << 13) | (h1 >>> 19)) >>> 0;
        h2 = ((h2 << 11) | (h2 >>> 21)) >>> 0;
        h3 = ((h3 << 7)  | (h3 >>> 25)) >>> 0;
        h4 = ((h4 << 5)  | (h4 >>> 27)) >>> 0;

        // Multiply with different primes to further scramble
        h1 = (h1 * 2654435761) >>> 0;
        h2 = (h2 * 1597334677) >>> 0;
        h3 = (h3 * 374761393)  >>> 0;
        h4 = (h4 * 3266489917) >>> 0;
    }

    // Combine all hashes into one long binary string
    let binary =
        h1.toString(2).padStart(32, '0') +
        h2.toString(2).padStart(32, '0') +
        h3.toString(2).padStart(32, '0') +
        h4.toString(2).padStart(32, '0');

    // Convert binary to ASCII string (printable characters only)
    return binaryToAscii(binary);
};

function binaryToAscii(binStr) {
    return binStr
      .match(/.{1,8}/g) // split into 8‑bit chunks
      .map(byte => String.fromCharCode(parseInt(byte, 2)))
      .join('');
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
//console.log("User object structure:", JSON.stringify(users[0], null, 2));