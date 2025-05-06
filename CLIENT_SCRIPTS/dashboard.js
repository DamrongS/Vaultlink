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
    
    if (!user) {
        console.error("Failed to retrieve user data");
        alert('An error occurred while loading your data. Please try again.');
        window.location.href = 'loginPage.html';
    } else {
        displayUserInfo(user);
    }
});

function displayUserInfo(user) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <h2>User Information</h2>
        <p><strong>Name:</strong> ${user.profile.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>ID:</strong> ${user.id}</p>

        <h3>User Settings</h3>
        <p><strong>Dark Mode:</strong> ${user.settings.darkMode ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Language:</strong> ${user.settings.language}</p>

        <h3>Account Balance</h3>
        <p><strong>Current Balance:</strong> $${user.accounts?.Main?.balance || "Loading..."}</p>

        <h3>Recent Transactions</h3>
        <table class="transaction-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="transaction-body">
                <!-- Transactions will be inserted here -->
            </tbody>
        </table>
    `;

    // Check if user has accounts before attempting to populate transactions
    if (user.accounts && Object.keys(user.accounts).length > 0) {
        populateTransactionsTable(user);
    } else {
        console.warn("No accounts found for this user.");
        const noAccountsMessage = document.createElement('div');
        noAccountsMessage.textContent = "This user hasn't created any accounts yet.";
        document.querySelector('#transaction-body').appendChild(noAccountsMessage);
    }
}

function populateTransactionsTable(user) {
    const transactionBody = document.getElementById('transaction-body');
    transactionBody.innerHTML = '';

    if (user.accounts.Main && user.accounts.Main.transactions) {
        console.log("Transactions found, populating rows");
        user.accounts.Main.transactions.slice().reverse().forEach(tx => {
            console.log("Processing transaction:", tx);
            const row = document.createElement("tr");
            
            const date = new Date(tx.date).toLocaleString();
            row.innerHTML = `
                <td>${date}</td>
                <td>${tx.type}</td>
                <td>${tx.amount.toFixed(2)}</td>
                <td>${tx.description || 'N'}</td>
            `;
            
            transactionBody.appendChild(row);
        });
    } else {
        console.warn("No transactions found for this account.");
        const noTransactionsMessage = document.createElement('div');
        noTransactionsMessage.textContent = "This account hasn't had any transactions yet.";
        document.querySelector('#transaction-body').appendChild(noTransactionsMessage);
    }
}