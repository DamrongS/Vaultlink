class Card {
    constructor(cardName) {
        this.cardName = cardName;
        this.expirationDate = this.generateExpiryDate();
        this.cardNumber = this.cardNumberGen();
        this.confirmationNumber = this.confirmationNumberGen();
    }

    cardNumberGen() {
        //Create a 16 digit number with a space after every 4th digit
        let tempNumber = '';
        for (let i = 0; i < 16; i++) {
            tempNumber += Math.floor(Math.random() * 10);
        }
        return tempNumber.replace(/(\d{4})/g, '$1 ');
    }

    generateExpiryDate() {
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
        return `${month}/${String(year).slice(2)}`;
    }

    confirmationNumberGen() {
        //Generate a random number with 3 digits
        return String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = 'credit-card';
        card.innerHTML = `
          <div class="bank-name">Vaultlink</div>
          <div class="card-number">${this.cardNumber}</div>
          <div class="card-holder">
            <span>${this.cardName}</span>
            <span>${this.expirationDate}</span>
          </div>
          <div class="card-brand">BISA</div>
        `;
        return card;
    }
}