class User {
    constructor(id, password, name, email, registeredAt) {
      this.id = id;
      this.password = password.hashEncode(); // hashed
      this.profile = { name, email };
      this.inbox = [];
      this.accounts = { Main : { id : "#000001", name : name, balance : 0.00, createdAt : Date.now(), locked : false, transactions : [{ type: "deposit", amount: 0, date: Date.now(), description: "Initial deposit" }], cards: {} } };
      this.settings = { darkMode: false, language: "en" };
      this.contact = { supportMessages: [] };
      this.registeredAt = registeredAt;
    }
  
    save() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.email === this.email)) {
        //alert("Username already taken.");
        return false;
      }
      users.push(this);
      localStorage.setItem("users", JSON.stringify(users));
      //alert("User registered!");
      return true;
    }
  
    static getAllUsers() {
      return JSON.parse(localStorage.getItem("users")) || [];
    }
  
    static findByEmail(email) {
      return User.getAllUsers().find(u => u.email === email);
    }
  
    static login(email, password) {
      const user = User.findByEmail(email);
      if (password === user.password) {
        console.log("Login successful. Storing user ID:", user.id);
        localStorage.setItem('loggedInUserId', user.id);
        window.location.href = 'vaultlinkDashboard.html';
      } else {
          showError(passwordElement, 'Incorrect password.');
          return;
      }
    }
  
    static logout() {
      localStorage.removeItem("loggedInUser");
      //alert("Logged out successfully");
    }
  
    static getLoggedInUser() {
      const loggedInUserId = localStorage.getItem("loggedInUserId");
      if (!loggedInUserId) return null;
      console.log("Retrieved userId:", loggedInUserId);
      return User.getAllUsers().find(user => user.id == loggedInUserId);
  }

  createAccount(accountName) {
    // Count existing accounts
    const count = Object.keys(this.accounts).length + 1;
    // Generate a new ID like "#0000002"
    const newId = `#${String(count).padStart(7, '0')}`;
    const name  = accountName || `Account${newId}`;

    this.accounts[name] = {
      id: newId,
      name,
      balance: 0.00,
      createdAt: Date.now(),
      locked: false,
      transactions: []
    };

    // Persist change
    const users = User.getAllUsers().map(u =>
      u.id === this.id ? this : u
    );
    localStorage.setItem("users", JSON.stringify(users));
  }
}