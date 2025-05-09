let user;
let activeTab = "overview";

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

    document.getElementById('accounts').addEventListener('click', function() {
        console.log('goob');
        setActiveTab('accounts', user);
    });

    populateTransactionsList(user);
    setActiveTab(activeTab, user);
    
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

    transactionsBody.innerHTML = ''; // Clear previous rows to prevent duplication

    // Display transactions for all accounts
    Object.entries(user.accounts).forEach(([accountName, account]) => {
        if (account.transactions && account.transactions.length > 0) {
            account.transactions.slice().reverse().forEach(tx => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(tx.date)}</td>
                    <td>${tx.description || 'N'}</td>
                    <td style="color: ${tx.amount < 0 ? 'red' : 'green'}">${Math.abs(tx.amount).toFixed(2)}</td>
                    <td>${tx.status}</td>
                    <td>${accountName}</td>
                `;
                transactionsBody.appendChild(row);
            });
        }
    });

    if (transactionsBody.innerHTML === '') {
        console.warn("No transactions found for any account.");
        const noTransactionsMessage = document.createElement('tr');
        noTransactionsMessage.className = "transaction-item";
        noTransactionsMessage.textContent = "No transactions found across any accounts.";
        transactionsBody.appendChild(noTransactionsMessage);
    }
}

function populateTransactionsList(user) {
    const transactionTable = document.querySelector('.transaction-table');
    if (!transactionTable) {
        console.warn("transaction-table element not found");
        return;
    }

    transactionTable.innerHTML = '';

    let anyTransactions = false;

    for (const [accountName, account] of Object.entries(user.accounts)) {
        if (account.transactions && account.transactions.length > 0) {
            anyTransactions = true;
            console.log(`Transactions found for account: ${accountName}`);

            // Create table header
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Account</th>
            `;
            transactionTable.appendChild(headerRow);

            // Reverse so most recent appear first
            account.transactions.slice().reverse().forEach(tx => {
                console.log("Processing transaction:", tx);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(tx.date)}</td>
                    <td>${tx.description || 'N'}</td>
                    <td style="color: ${tx.amount < 0 ? 'red' : 'green'}">${Math.abs(tx.amount).toFixed(2)}</td>
                    <td>${tx.status}</td>
                    <td>${accountName}</td>
                `;
                transactionTable.appendChild(row);
            });
        }
    }

    if (!anyTransactions) {
        console.warn("No transactions found for any account.");
        const noTransactionsMessage = document.createElement('tr');
        noTransactionsMessage.className = "transaction-item";
        noTransactionsMessage.textContent = "No transactions found across any accounts.";
        transactionTable.appendChild(noTransactionsMessage);
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
    toggleMenu();
}


function renderAccountsTable(user) {
    const accountBody = document.getElementById('account-body');
    if (!accountBody) {
        console.error('Account body table element not found');
        return;
    }
    console.log(accountBody);
    accountBody.innerHTML = ''; // Clear existing rows

    Object.entries(user.accounts).forEach(([accountName, account]) => {
        const row = document.createElement('tr');
        const balance = Number(account.balance);
        const balanceDisplay = isNaN(balance) ? 'N/A' : balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        row.innerHTML = `
            <td>${account.id}</td>
            <td>${accountName}</td>
            <td style='text-align:right'>$${balanceDisplay}</td>
            <td>
                <button class="dropdown-btn" 
                data-account='{"name":"${accountName}"}'>🔽</button>
            </td>
        `;

        accountBody.appendChild(row);

        const detailRow = document.createElement('tr');
        detailRow.id = `details-${accountName}`;
        detailRow.style.display = 'none';
        detailRow.innerHTML = `
            <td colspan="3">
                <strong>Account ID:</strong> ${account.id}<br>
                <strong>Created:</strong> ${formatDate(account.createdAt)}<br>
                <strong>Transactions:</strong> ${account.transactions.length}
            </td>
        `;
        accountBody.appendChild(detailRow);
    });
}

function toggleAccountDetails(accountName) {

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
        user = User.getLoggedInUser();
    }

    if (!user) {
        alert('Please log in again.');
        window.location.href = 'loginPage.html';
        return;
    }

    if (section === "overview") {
        //document.innerHTML = tabContents.overview;
        displayOverview(user);
    }

    if (section === "accounts") {
        document.innerHTML = tabContents.accounts;
        renderAccountsTable(user);
    }

    if (section === "investments") {
        setTimeout(() => {
            const select = document.getElementById("stockSelect");
            renderChart(select.value);
            select.addEventListener("change", () => renderChart(select.value));
        }, 0);
    }

    activeTab = section;
}
