class User {
    constructor(username, password, name, email) {
      this.id = Date.now();
      this.username = username;
      this.password = password.hashEncode(); // hashed
      this.profile = { name, email };
      this.inbox = [];
      this.accounts = { /* your accounts data structure */ };
      this.settings = { darkMode: false, language: "en" };
      this.contact = { supportMessages: [] };
    }
  
    save() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.username === this.username)) {
        alert("Username already taken.");
        return false;
      }
      users.push(this);
      localStorage.setItem("users", JSON.stringify(users));
      alert("User registered!");
      return true;
    }
  
    static getAllUsers() {
      return JSON.parse(localStorage.getItem("users")) || [];
    }
  
    static findByUsername(username) {
      return User.getAllUsers().find(u => u.username === username);
    }
  
    static login(username, password) {
      const user = User.findByUsername(username);
      if (user && user.password === password.hashEncode()) {
        // Store user id in localStorage to track the logged-in user
        localStorage.setItem("loggedInUser", user.id);
        return user;
      }
      alert("Invalid credentials");
      return null;
    }
  
    static logout() {
      localStorage.removeItem("loggedInUser");
      alert("Logged out successfully");
    }
  
    static getLoggedInUser() {
      const loggedInUserId = localStorage.getItem("loggedInUser");
      return loggedInUserId ? User.getAllUsers().find(user => user.id == loggedInUserId) : null;
    }
  }
  