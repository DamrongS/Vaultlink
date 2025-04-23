String.prototype.hashEncode = function()
{
    let h1 = 0x6a09e667;
    let h2 = 0xbb67ae85;

    for (let i = 0; i < this.length(); i++)
    {
        let binaryChar = this.charCodeAt(i).toString(2).padStart(8, '0');
    }
}