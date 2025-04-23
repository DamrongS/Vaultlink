class User {
    constructor(id, username, password, name, email) {
      this.id = id;
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
  
    static findByUsername(username) {
      return User.getAllUsers().find(u => u.username === username);
    }
  
    static login(username, password) {
      const user = User.findByUsername(username);
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
  
}
  