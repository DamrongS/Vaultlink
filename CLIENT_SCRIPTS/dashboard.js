// dashboard.js

document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('loggedInUserId');
    
    if (!userId) {
        alert('Please log in to view your dashboard.');
        window.location.href = 'loginPage.html';
        return;
    }

    console.log("Retrieved userId:", userId);

    const user = User.getLoggedInUser();
    
    console.log("User retrieved:", user);

    if (user) {
        displayUserInfo(user);
    } else {
        console.error("Failed to retrieve user data");
        alert('An error occurred while loading your data. Please try again.');
        window.location.href = 'loginPage.html';
    }
});

function displayUserInfo(user) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <h2>User Information</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Name:</strong> ${user.profile.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>ID:</strong> ${user.id}</p>
        
        <h3>User Settings</h3>
        <p><strong>Dark Mode:</strong> ${user.settings.darkMode ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Language:</strong> ${user.settings.language}</p>
        
        <h3>Profile</h3>
        <p><strong>Name:</strong> ${user.profile.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        
        <button onclick="logoutUser()">Logout</button>
    `;
}

function logoutUser() {
    localStorage.removeItem('loggedInUserId');
    //salert('Logged out successfully.');
    window.location.href = 'loginPage.html';
}