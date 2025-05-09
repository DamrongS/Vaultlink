class User {
  constructor(id, password, name, email, registeredAt) {
    this.id = id;
    this.password = password.hashEncode?.() || password; // hash hvis muligt, ellers antag den er hashed
    this.profile = { name, email };
    this.inbox = [];
    this.accounts = {
      "Main": {
        id: "#0000001",
        name: "Main",
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

  deleteAccount(accountName) {

    if (confirm(`Delete account with name: ${accountName}?`))
    {
      let accountKey = Object.keys(this.accounts).find(key => this.accounts[key].name === accountName);
      if (accountKey) {
        // Hvis vi har fundet den ønskede konto
        delete this.accounts[accountKey];  // Sletter konto baseret på nøgle (accountKey)
        console.log(`Account ${accountName} has been deleted.`);
        this.updateAccountTable();  // Opdaterer tabellen (eller gør noget andet)
      } else {
        console.log('Account not found');
      }
      const users = User.getAllUsers().map(u =>
        u.id === this.id ? this : u
      );
      localStorage.setItem("users", JSON.stringify(users));
      this.updateAccountTable();
    }
  }

  addTransaction(accountName, type, description) {

    const amount = parseFloat(prompt('Enter amount'));
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
    this.updateAccountTable();
  }

  transferMoney(fromAccountName) {
    let toAccountName = prompt('Enter receiving account name');
    if (!toAccountName) {
      alert("You must enter a valid account name.");
      return;
    }

    let amount = parseFloat(prompt('Enter amount to send'));
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount. Please enter a positive number.");
      return; 
    }

    const fromAccount = this.accounts[fromAccountName];
    const toAccount = this.accounts[toAccountName];

    if (!fromAccount || !toAccount) {
      alert("One of the accounts is invalid.");
      return; 
    }

    if (fromAccount.balance < amount) {
      alert("Insufficient funds in the source account.");
      return; 
    }

    const transactionFrom = {
      type: "withdrawal",
      amount: -amount,
      date: Date.now(),
      description: `Transfer to ${toAccountName}`
    };
  
    const transactionTo = {
      type: "deposit",
      amount: amount,
      date: Date.now(),
      description: `Transfer from ${fromAccountName}`
    };

    fromAccount.transactions.push(transactionFrom);
    fromAccount.balance -= amount;
  
    toAccount.transactions.push(transactionTo);
    toAccount.balance += amount;

    const users = User.getAllUsers().map(u => 
      u.id === this.id ? this : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    this.updateAccountTable();
  
    alert(`Successfully transferred ${amount} from ${fromAccountName} to ${toAccountName}.`);
  }
  
  

  updateAccountTable() {
    const accountBody = document.getElementById('account-body');
    accountBody.innerHTML = ''; // Clear current content

    Object.values(this.accounts).forEach(account => {
      console.log(account);
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${account.id}</td>
        <td>${account.name}</td>
        <td style='text-align:right'>$${account.balance.toFixed(2)}</td>
        <td>
            <button class="dropdown-btn" 
            data-account='{"name":"${account.name}"}'>🔽</button>
        </td>
        
      `;
      accountBody.appendChild(newRow);
    });
  }

  addCard(accountName) {
    const account = this.account[accountName];
    if (!account)
      return;

    const newCard = new Card(this.profile.name);
    const cardId = `card_${Object.keys(account.cards).length + 1}`;

    account.cards[cardId] = {
      cardName: newCard.cardName,
      cardNumber: newCard.cardNumber,
      expirationDate: newCard.expirationDate,
      confirmationNumber: newCard.confirmationNumber,
      createdAt: Date.now()
    };

    const users = User.getAllUsers().map(u => u.id === this.id ? this : u);
    localStorage.setItem("users", JSON.stringify(users));

    const cardContainer = document.getElementById('card-container');
    cardContainer.appendChild(newCard.createCardElement());
  }
}
