class Card 
{
    constructor(cardType, cardName, expirationDate, cardHolder)
    {
        this.cardType = cardType;
        this.cardName = cardName;
        this.expirationDate = expirationDate;
        this.cardHolder = cardHolder;
        this.cardNumber = this.confirmationNumberGen();
        this.confirmationNumber;
    }

    cardNumberGen()
    {
        
    }

    confirmationNumberGen()
    {
        //Generate a random number with 3 digits
        return String(Math.floor(Math.random() * 101).padStart('3', '0'))
    }
}