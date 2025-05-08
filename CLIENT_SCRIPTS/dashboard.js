let user;

document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('loggedInUserId');
    
    if (!userId) {
        alert('Please log in to view your dashboard.');
        window.location.href = 'loginPage.html';
        return;
    }
    
    console.log("Retrieved userId:", userId);
    
    user = User.getLoggedInUser();
    
    console.log("User retrieved:", user);
    
    if (!user) {
        console.error("Failed to retrieve user data");
        alert('An error occurred while loading your data. Please try again.');
        window.location.href = 'loginPage.html';
    } else {
        displayOverview(user);
    }

    console.log(document);
    document.getElementById('overview').addEventListener('click', function() {
        setActiveTab('overview', user);
    });
    
    // Deposit
    //deposit(user, "Main", 3450187239591293985.192);

    // Withdraw
    //withdraw(user, "Main", 3450187239591293985.192);

    // Transfer
    // transfer("#0949842", "#0406329", 2781023828);

    //transfer("christofferschjodt@gmail.com", "christofferdamrong@gmail.com", 75);

});

function displayOverview(user) {
    const content = document.querySelector('.tab-content');
    if (!content) return;

    content.innerHTML = tabContents.overview;

    updateAccountID()
    updateTotalBalance();

    const transactionsBody = document.getElementById('transaction-body');
    if (!transactionsBody) {
        console.error('Transaction table body not found');
        return;
    }

    transactionsBody.innerHTML = ''; // 👈 Clear previous rows to prevent duplication

    console.log("gg");

    const sampleTransactions = user.accounts.Main.transactions || [];

    sampleTransactions.forEach(tx => {
        const row = document.createElement('tr');
        
        // Ensure tx.amount is a number
        const amount = Number(tx.amount);
        
        if (isNaN(amount)) {
            console.error(`Invalid amount value: ${tx.amount}`);
            return; // Skip this transaction if the amount is invalid
        }
        
        const amountColor = amount < 0 ? 'red' : 'green';
        
        row.innerHTML = `
            <td>${formatDate(tx.date)}</td>
            <td>${tx.description}</td>
            <td style="color: ${amountColor};">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</td>
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
                <span>${formatDate(tx.date)}</span>
                <span>${tx.type}</span>
                <span>${tx.amount.toFixed(2)}</span>
                <span>${tx.description || 'N'}</span>
            `;
        });
    } else {
        console.warn("No transactions found for this account.");
        const noTransactionsMessage = document.createElement('li');
        noTransactionsMessage.className = "transaction-item";
        noTransactionsMessage.textContent = "This account hasn't had any transactions yet.";
        transactionList.appendChild(noTransactionsMessage);
    }
}

function createAccount() {
    const nameInput = document.getElementById('new-account-name');

    
    if (!nameInput) {
        alert('Inputfeltet kunne ikke findes.');
        alert('Input field could not be found.');
        return;
    }

    const accountName = nameInput.value.trim();

    
    if (accountName === '') {
        alert('Please enter an account name.');
        return;
    }

    console.log("Creating account:", accountName);
    user.createAccount(accountName);

    nameInput.value = '';
    const newAccount = user.createAccount(accountName);

    if (newAccount) {
        // Create a new row in the accounts table for the newly created account
        const accountBody = document.getElementById('account-body');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>+</td> <!-- Placeholder for expand/collapse action -->
            <td>${newAccount.name}</td>
            <td>$${newAccount.balance.toFixed(2)}</td>
        `;
        accountBody.appendChild(newRow);

        // Clear the input field
        nameInput.value = '';

        // Optionally, close the create account menu
        toggleMenu();
    } else {
        alert('There was an error creating the account. Please try again.');
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function setActiveTab(section, user) {
    currentSection = section;

    if (!user) {
        user = User.getLoggedInUser(); // fallback if not passed in
    }

    if (!user) {
        alert('Please log in again.');
        window.location.href = 'loginPage.html';
        return;
    }

    if (section === "overview") {
        document.innerHTML = tabContents.overview;
        displayOverview(user); // <- Rebuild overview tab
    }

    // Handle other sections...
    //updateSidebar();
}
