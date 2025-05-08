class User {
  constructor(id, password, name, email, registeredAt) {
    this.id = id;
    this.password = password.hashEncode?.() || password; // hash hvis muligt, ellers antag den er hashed
    this.profile = { name, email };
    this.inbox = [];
    this.accounts = {
      "Main": {
        id: "#000001",
        name: name || "Main",
        balance: 0.00,
        createdAt: Date.now(),
        locked: false,
        transactions: [{
          type: "deposit",
          amount: 0,
          date: Date.now(),
          description: "Initial deposit",
          status: ""
        }],
        cards: {}
      }
    };
    this.settings = { darkMode: false, language: "en" };
    this.contact = { supportMessages: [] };
    this.registeredAt = registeredAt;
  }

  save() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.email === this.profile.email)) {
      return false;
    }
    users.push(this);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  static findByEmail(email) {
    return User.getAllUsers().find(u => u.profile.email === email);
  }

  static findById(id) {
    return User.getAllUsers().find(u => u.id === id);
  }

  static login(email, password) {
    const user = User.findByEmail(email);
    if (user && password === user.password) {
      localStorage.setItem('loggedInUserId', user.id);
      window.location.href = 'vaultlinkDashboard.html';
    } else {
      showError(passwordElement, 'Incorrect password.');
    }
  }

  static logout() {
    localStorage.removeItem("loggedInUserId");
  }

  static getLoggedInUser() {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (!loggedInUserId) return null;

    const rawUser = User.getAllUsers().find(user => user.id == loggedInUserId);
    return rawUser ? User.fromJSON(rawUser) : null;
  }

  static getAllUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
  }

  static fromJSON(obj) {
    const user = new User(
      obj.id,
      obj.password, // antager allerede hashed
      obj.profile?.name || "",
      obj.profile?.email || "",
      obj.registeredAt || Date.now()
    );

    user.inbox = obj.inbox || [];
    user.accounts = obj.accounts || {};
    user.settings = obj.settings || { darkMode: false, language: "en" };
    user.contact = obj.contact || { supportMessages: [] };

    return user;
  }

  createAccount(accountName) {
    const count = Object.keys(this.accounts).length + 1;
    const newId = `#${String(count).padStart(7, '0')}`;
    const name = accountName || `Account${newId}`;

    this.accounts[name] = {
      id: newId,
      name,
      balance: 0.00,
      createdAt: Date.now(),
      locked: false,
      transactions: [],
      cards: {}
    };

    const users = User.getAllUsers().map(u =>
      u.id === this.id ? this : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    this.updateAccountTable();
  }

  addTransaction(accountName, type, amount, description) {
    const account = this.accounts[accountName];
    if (!account || account.locked) return;

    const transaction = {
      type,
      amount,
      date: Date.now(),
      description: description || ""
    };

    account.transactions.push(transaction);
    account.balance += (type === "deposit" ? amount : -amount);

    const users = User.getAllUsers().map(u =>
      u.id === this.id ? this : u
    );
    localStorage.setItem("users", JSON.stringify(users));
  }

  updateAccountTable() {
    const accountBody = document.getElementById('account-body');
    accountBody.innerHTML = ''; // Clear current content

    Object.values(this.accounts).forEach(account => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>+</td>
        <td>${account.name}</td>
        <td>$${account.balance.toFixed(2)}</td>
      `;
      accountBody.appendChild(newRow);
    });
  }
  
  addCard() {
    // Implementér senere
  }
}
