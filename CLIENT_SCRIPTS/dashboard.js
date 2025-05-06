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
        displayOverview(user);
    }
});

function displayOverview(user) {
    // Set tab content to the Overview tab
    const content = document.querySelector('.tab-content');
    content.innerHTML = tabContents.overview;

    // Now modify elements inside the Overview content
    // For example, you could update the transactions table like this:
    const transactionsBody = document.getElementById('transaction-body');

    if (!transactionsBody) {
        console.error('Transaction table body not found in Overview tab');
        return;
    }

    // Example: Populate with dummy transactions (replace with actual user data)
    const sampleTransactions = user.accounts.Main.transactions;

    sampleTransactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.date}</td>
            <td>${tx.description}</td>
            <td>${tx.amount}</td>
            <td>${tx.status}</td>
        `;
        transactionsBody.appendChild(row);
    });
}

function populateTransactionsList(user) {
    const transactionList = document.getElementById('transaction-list');
    if (!transactionList) {
        console.warn("transaction-list element not found");
        return;
    }

    transactionList.innerHTML = '';

    if (user.accounts.Main && user.accounts.Main.transactions) {
        console.log("Transactions found, populating list");
        user.accounts.Main.transactions.slice().reverse().forEach(tx => {
            console.log("Processing transaction:", tx);
            const li = document.createElement("li");
            li.className = "transaction-item";
            li.innerHTML = `
                <span>${new Date(tx.date).toLocaleString()}</span>
                <span>${tx.type}</span>
                <span>${tx.amount.toFixed(2)}</span>
                <span>${tx.description || 'N'}</span>
            `;
            transactionList.appendChild(li);
        });
    } else {
        console.warn("No transactions found for this account.");
        const noTransactionsMessage = document.createElement('li');
        noTransactionsMessage.className = "transaction-item";
        noTransactionsMessage.textContent = "This account hasn't had any transactions yet.";
        transactionList.appendChild(noTransactionsMessage);
    }
}