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
    //deposit(user, "Main", 100000000000000);

    // Withdraw
    //withdraw(user, "Main", 50);

    // Transfer
    //transfer("#000001", "#000002", 75);

    //transfer("christofferschjodt@gmail.com", "christofferdamrong@gmail.com", 75);

});

function displayOverview(user) {
    const content = document.querySelector('.tab-content');
    if (!content) return;

    content.innerHTML = tabContents.overview;

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
            <td style="color: ${amountColor};">${amount.toFixed(2)} USD</td>
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

document.addEventListener('DOMContentLoaded', function () {
    const creatButton = document.getElementById('create-new-account');
    const menu = document.getElementById('account-menu');

    createButton.addEventListener('click', function(e) {
        e.preventDefault();
        createNewAccount();
        isCreatingNewAccount = !isCreatingNewAccount;
    })

    function toggleMenuVisibility(menu) {
        menu.stlye.display = menu.style.display === 'none' ? 'block' : 'none';
    }
<<<<<<< HEAD

    async function createNewAccount() {
        const nameInput = document.getElementById('new-account-name');
        const name = nameInput.value.trim();
    
        if (!isCreatingNewAccount) {
            toggleMenuVisibility(accountMenu);
            return;
        } 
    }
})
=======
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
>>>>>>> aeb721623784529a975d081d9fb6142a4c0d5f61
