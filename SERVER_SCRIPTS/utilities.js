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

// In utilities.js
function deposit(user, accountName, amount) {
    if (amount <= 0) {
        console.warn("You can't deposit a negative amount!");
        return;
    }
    
    const account = user.accounts[accountName];
    if (!account) {
        console.error(`Account "${accountName}" not found.`);
        return;
    }
    
    account.balance += amount;
    account.transactions.push({
        type: "deposit",
        amount,
        date: Date.now(),
        description: `Deposit`,
        status: "Confirmed"
    });
    
    // Save updated user
    const users = User.getAllUsers().map(u =>
        u.id === user.id ? user : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    setActiveTab(activeTab, user);
    populateTransactionsList(user)
    
    console.log(`Deposited ${amount} into account "${accountName}".`);
}

function withdraw(user, accountName, amount) {
    if (amount <= 0) {
        console.warn("Invalid withdrawal amount.");
        return;
    }
    
    const account = user.accounts[accountName];
    if (!account) {
        console.error(`Account "${accountName}" not found.`);
        return;
    }
    
    if (account.balance < amount) {
        console.warn("Insufficient funds for withdrawal.");
        return;
    }
    
    account.balance -= amount;
    account.transactions.push({
        type: "withdrawal",
        amount: -amount,
        date: Date.now(),
        description: `Withdrawal`,
        status: "Confirmed"
    });
    
    // Save updated user
    const users = User.getAllUsers().map(u =>
        u.id === user.id ? user : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    setActiveTab(activeTab, user);
    populateTransactionsList(user)
    
    console.log(`Withdrew ${amount} from account "${accountName}".`);
}

function transfer(fromId, fromAccountName, toId, amount) {
    if (amount <= 0) {
        console.warn("Invalid transfer amount.");
        return;
    }
    
    const fromUser = User.findById(fromId);
    const fromfromAccountName = fromAccountName || "Main";
    const toUser = User.findById(toId);
    
    if (!fromUser || !toUser) {
        console.error("One or both users not found.");
        return;
    }

    // Ensure the "from" account has enough balance
    const fromAccount = fromUser.accounts[fromfromAccountName];
    if (fromAccount.balance < amount) {
        console.log(fromAccount.balance, amount);
        console.warn("Insufficient funds for transfer.");
        return;
    }

    // Deduct from the "from" account and add to the "to" account
    fromAccount.balance -= amount;
    toUser.accounts["Main"].balance += amount;

    // Create transfer-out transaction for the sender (negative amount for loss)
    fromAccount.transactions.push({
        type: "transfer-out",
        amount: -amount,  // Make the amount negative
        date: Date.now(),
        description: `Transfer to ${toUser.id} ${toUser.profile.name}`,
        status: "Confirmed"
    });

    // Create transfer-in transaction for the receiver
    toUser.accounts["Main"].transactions.push({
        type: "transfer-in",
        amount,
        date: Date.now(),
        description: `Transfer from ${fromUser.id} ${fromUser.profile.name}`,
        status: "Confirmed"
    });

    // Save updated users
    const users = User.getAllUsers().map(u => {
        if (u.id === fromUser.id) return fromUser;
        if (u.id === toUser.id) return toUser;
        return u;
    });

    localStorage.setItem("users", JSON.stringify(users));

    setActiveTab(activeTab, user);
    populateTransactionsList(user)

    console.log(`Transferred ${amount} from ${fromUser.id} ${fromUser.profile.name} ${fromAccountName} to ${toUser.id} ${toUser.profile.name}.`);
}

function updateTotalBalance() {
    let accountBalances = 0;
    //console.log("User Accounts: ", user.accounts);

    const accountKeys = Object.keys(user.accounts);
    for (let i = 0; i < accountKeys.length; i++) {
        const key = accountKeys[i];
        const balance = user.accounts[key].balance;
        accountBalances += balance;
    }

    //console.log("Total Account Balance: ", accountBalances);

    const total = accountBalances;
    const balanceElem = document.getElementById("total-balance");
    if (balanceElem) {
        balanceElem.textContent = `$${total.toFixed(2)}`;
    }

    //console.log("Formatted Total Balance: ", `$${total.toFixed(2)}`);
}

function updateAccountID() {
    const balanceElem = document.getElementById("ID");
    if (balanceElem) {
        balanceElem.textContent = `${user.id}`;
    }

    //console.log("Formatted Total Balance: ", `$${total.toFixed(2)}`);
}

//const users = getUsers();
//console.log("User object structure:", JSON.stringify(users[0], null, 2));