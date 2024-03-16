class NhiTools {
    // nhi main value table object
    #table = ['^', 'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z']
    #alphaNumeric = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789"; // uppercase alphanumeric value provider
    #numeric = "0123456789"; // numeric value provider
    #isAlpha = false; // store check if 6th character is alpha. boolean
    #nhiInitialString; // store initial nhi string
    nhiNumber; // store resultant generated / validated nhi. Available at class level
    #remainder; // store remainder total % modulas
    #check; // store check value
    #MODHIGH = 23
    #MODLOW = 11
  
    #randomOption(arr, exclude) {
      var randOption = arr[Math.floor(Math.random()*arr.length)];
      if(randOption===exclude){
          return this.#randomOption(arr, exclude);
      }else{
          return randOption;
      }
    }
  
    #getFirstSection() {
      // Set first 3 Characters as alpha
      let sectionOne = '';
      for (let i=0; i<3; i++) {
        sectionOne += this.#randomOption(this.#table, '^')
      };
      return sectionOne;
    }
  
    #getSecondSection() {
      // Set second 2 Characters as numeric
      let sectionTwo = '';
      for (let i=0; i<2; i++) {
        sectionTwo += this.#randomOption(this.#numeric);
      };
      return sectionTwo
    }
  
    #getThirdSection() {
      // Set third section value which determines Old or New type   
      return this.#randomOption(this.#alphaNumeric);
    }
  
    generateNhi() {
      this.#generateNhiInitialString()
      if(this.isNhiValid(this.#nhiInitialString)) {
        console.log(`generated nhi: ${this.nhiNumber}`);
        return this.nhiNumber;
      } else {
        this.generateNhi()
      }
    };
  
    #generateNhiInitialString() {
      this.#nhiInitialString = this.#getFirstSection() + this.#getSecondSection() + this.#getThirdSection()
      return this.#nhiInitialString
    }

    #setThirdChar(nhiNumber) {
      if (this.#table.includes(nhiNumber[5])) {
        this.#isAlpha = true
        return this.#table.indexOf(nhiNumber[5]) * 2;
      } else {
        this.#isAlpha = false
        return parseInt(nhiNumber[5]) * 2;
      }
    }

    #setRemainderCheckAndNhi(total, nhiNumber) {
      if (this.#isAlpha) {
        // if last character is alpha
        this.#remainder = total % this.#MODHIGH;
        this.#check = this.#table[this.#MODHIGH-this.#remainder];
        this.nhiNumber = `${nhiNumber}${this.#check}`
      } else {
        // if last character is not alpha
        this.#remainder = total % this.#MODLOW;
        this.#check = this.#MODLOW - this.#remainder;
        if (this.#check == 10) {
            this.#check = 0
        };
        this.nhiNumber = `${nhiNumber}${this.#check}`
      }
    }
  
    isNhiValid(nhiNumber) {
      /**
       * Checks parsed NHI string and returns valid NHI string
       * Algorythm based on documentation from MoH
       */
      if (nhiNumber.length <= 6 && nhiNumber != this.#nhiInitialString) return false 
      // Set objects for validation
      let sectionOne = (this.#table.indexOf(nhiNumber[0]) * 7) + (this.#table.indexOf(nhiNumber[1]) * 6) + (this.#table.indexOf(nhiNumber[2]) * 5);
      let firstNumber = parseInt(nhiNumber[3]) * 4;
      let secondNumber = parseInt(nhiNumber[4]) * 3;
      let thirdChar = this.#setThirdChar(nhiNumber)
      let total = sectionOne + firstNumber + secondNumber + thirdChar;
      this.#setRemainderCheckAndNhi(total, nhiNumber);
      if (this.#check == 11) return false
      if (nhiNumber.length === 7) this.nhiNumber = nhiNumber.slice(0, -1) + this.#check
      if (this.nhiNumber === nhiNumber | this.#nhiInitialString === nhiNumber && this.nhiNumber.length === 7 | nhiNumber.length < 8 | typeof(this.nhiNumber) != 'undefined' ) {
        return true
      } else {
        return false
      }
    }
  
  };

  module.exports = { NhiTools }