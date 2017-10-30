const Discord = require('discord.js');
const { Client } = require('pg');

module.exports = {
    register: (msg) => {
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'gambling',
            password: 'dsnook100',
            port: 5432,
        });
        client.connect();
        
        client.query('SELECT * FROM public."userData" WHERE userid = ' + msg.member.user.id, (err, res) => {
            if (res.rowCount > 0) {
                const embed = new Discord.RichEmbed()
                    .setColor(3447003)
                    .addField('Register - ' + msg.member.user.username, 'You are already an active user');
                msg.channel.send({ embed });
                msg.delete();
                client.end();
            } else {
                const query = {
                    text: 'INSERT INTO public."userData"(userid, username, amount) VALUES($1, $2, $3)',
                    values: [msg.member.user.id, msg.member.user.username, 5000],
                  }
                client.query(query, (err, res) => {
                    const embed = new Discord.RichEmbed()
                        .setColor(3447003)
                        .addField('Register - ' + msg.member.user.username, 'You have now been setup as a registered user. Type .bal!');
                    msg.channel.send({ embed });
                    msg.delete();
                    client.end();
                });
                
            }      
        }); 
    },
    balance: (msg) => {
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'gambling',
            password: 'dsnook100',
            port: 5432,
        });
        client.connect();

        var queryString = 'SELECT amount FROM public."userData" WHERE userid='+ msg.member.id;

        client.query(queryString, (err, res) => {

            if (res.rowCount > 0) {
                var balance = parseInt(res.rows[0].amount).toLocaleString("en-US");

                const embed = new Discord.RichEmbed()
                    .setColor(3447003)
                    .addField('Balance - ' + msg.member.user.username, 'You currently have :moneybag: ' + balance);
                msg.channel.send({ embed });
                msg.delete();
            } else {
                const embed = new Discord.RichEmbed()
                    .setColor(3447003)
                    .addField('Balance - ' + msg.member.user.username, 'Please type .reg to start using the currency system.');
                msg.channel.send({ embed });
                msg.delete();
            }
            client.end()
        })   
    },
    coinflip: (msg) => {
        var betArray = msg.content.split(' ');
        var coinChoice = betArray[1].toUpperCase();
        var betAmount = parseInt(betArray[2]);

        if((coinChoice == "T" || coinChoice == "H") && betAmount > 0) {
            const client = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'gambling',
                password: 'dsnook100',
                port: 5432,
            });
    
            client.connect();
    
            const queryString = 'SELECT amount FROM public."userData" WHERE userid='+ msg.member.id;
    
            client.query(queryString, (err, res) => {
                if (res.rowCount > 0) {
                    if (res.rows[0].amount >= betAmount) {
                        var currentBalance = parseInt(res.rows[0].amount);
                        var randPick = Math.floor(Math.random() * 2);
                        var coinDisplay;
    
                        if (randPick == 0) {
                            randPick = "H";
                            coinDisplay = "heads";
                        } else {
                            randPick = "T";
                            coinDisplay = "tails";
                        }
                        var winBalance = (currentBalance + betAmount).toLocaleString("en-US");
                        var loseBalance = (currentBalance - betAmount).toLocaleString("en-US");
    
                        if(randPick == coinChoice) {    
                            currentBalance += betAmount;
    
                            const query = {
                                text: 'UPDATE public."userData" SET amount=$1 WHERE userid =' + msg.member.id,
                                values: [currentBalance],
                            }
                            client.query(query, (err, res) => {
                                if (res) {
                                    const embed = new Discord.RichEmbed()
                                        .setTitle('Coinflip - ' + msg.member.user.username)
                                        .setColor(3447003)
                                        .addField('The coin landed on ' + coinDisplay + '. You have won :moneybag: ' + (betAmount * 2).toLocaleString("en-US"), 'Your new balance is :moneybag: ' + winBalance);
                                    msg.channel.send({ embed });
                                    msg.delete();
                                } else {
                                    const embed = new Discord.RichEmbed()
                                        .setTitle('Coinflip - ' + msg.member.user.username)
                                        .setColor(3447003)
                                        .addField('There was an issue processing your request. Please try again.');
                                    msg.channel.send({ embed });
                                    msg.delete();
                                }
                                client.end()
                            });
                        } else if (randPick != coinChoice) {    
                            currentBalance -= betAmount;
    
                            const query = {
                                text: 'UPDATE public."userData" SET amount=$1 WHERE userid =' + msg.member.id,
                                values: [currentBalance],
                            }
                            client.query(query, (err, res) => {
                                if (res) {
                                    const embed = new Discord.RichEmbed()
                                        .setTitle('Coinflip - ' + msg.member.user.username)
                                        .setColor(3447003)
                                        .addField('The coin landed on ' + coinDisplay + '. You have lost :moneybag: ' + betAmount.toLocaleString("en-US"), 'Your new balance is :moneybag: ' + loseBalance);
                                    msg.channel.send({ embed });
                                    msg.delete();
                                } else {
                                    const embed = new Discord.RichEmbed()
                                        .setTitle('Coinflip - ' + msg.member.user.username)
                                        .setColor(3447003)
                                        .addField('There was an issue processing your request. Please try again.');
                                    msg.channel.send({ embed });
                                    msg.delete();
                                }
                                client.end()
                            });
                        }
                    }
                } else {
                    const embed = new Discord.RichEmbed()
                        .setColor(3447003)
                        .addField('Balance - ' + msg.member.user.username, 'Please type .reg to start using the currency system.');
                    msg.channel.send({ embed });
                    msg.delete();
                    client.end();
                }
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setColor(3447003)
                .addField('Balance - ' + msg.member.user.username, 'Please use the format .cf <h or t> <bet amount>');
            msg.channel.send({ embed });
            msg.delete();
        }
    },
    /*roll: (msg) => {
        function diceRoll () {
            var result = [];
            for (var i=0; i<20; i++) {
                result.push(Math.floor(Math.random() * 6)+1);   
            }
            return result;npm 
        }
        console.log(diceRoll());
        console.log('test');
        
        msg.channel.send([new Attachment(buffer, '../images/dice-side-5.jpg')]);
    },*/
    give: (msg) => {
        var giveArray = msg.content.split(' ');
        var giveAmount = parseInt(giveArray[2]);
        var giveToId = msg.mentions.users.array()[0].id;
        var giveToName = msg.mentions.users.array()[0].username;

        if(giveToId != null && giveAmount > 0) {
            const client = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'gambling',
                password: 'dsnook100',
                port: 5432,
            });
    
            client.connect();
    
            const queryString = 'SELECT userid, amount FROM public."userData" WHERE userid='+ msg.member.id +  'OR userid=' + giveToId + ' ORDER BY CASE WHEN userid=' + msg.member.id + 'THEN 1 ELSE 2 END, userid' ;

            client.query(queryString, (err, res) => {
                if (res.rowCount > 1) {
                    
                    if (res.rows[0].amount >= giveAmount) {
                        console.log(res.rows);

                        var lostBalance = parseInt(res.rows[0].amount) - giveAmount;
                        var gainBalance = parseInt(res.rows[1].amount) + giveAmount;
                        
                        const query = {
                            text: 'UPDATE public."userData" SET amount=$1 WHERE userid =' + msg.member.id,
                            values: [lostBalance],
                        }
                        client.query(query, (err, res) => {
                            if (res) {
                                const query = {
                                    text: 'UPDATE public."userData" SET amount=$1 WHERE userid =' + giveToId,
                                    values: [gainBalance],
                                }
                                client.query(query, (err, res) => {
                                    if (res) {
                                        const embed = new Discord.RichEmbed()
                                            .setColor(65280)
                                            .addField('Payment/Gift Transaction - ' + msg.member.user.username, msg.member.user.username + ' gave :moneybag: ' + giveAmount.toLocaleString('en-US') + ' to ' + giveToName);
                                        msg.channel.send({ embed });
                                        msg.delete();
                                    } else {
                                        const embed = new Discord.RichEmbed()
                                            .setColor(16711680)
                                            .addField('Failed Transaction - ' + msg.member.user.username, 'There was an error, please try again.');
                                        msg.channel.send({ embed });
                                        msg.delete();
                                    }
                                    client.end();
                                });
                            } else {
                                const embed = new Discord.RichEmbed()
                                    .setColor(16711680)
                                    .addField('Failed Transaction - ' + msg.member.user.username, 'There was an error, please try again.');
                                msg.channel.send({ embed });
                                msg.delete();
                                client.end()
                            }
                        });
                        
                        
                    } else {
                        const embed = new Discord.RichEmbed()
                            .setColor(16711680)
                            .addField('Failed Transaction - ' + msg.member.user.username, 'You do not have enough cash in your bank!');
                        msg.channel.send({ embed });
                        msg.delete();
                    }
                } else {
                    const embed = new Discord.RichEmbed()
                        .setColor(3447003)
                        .addField('Failed Transaction - ' + msg.member.user.username, giveToName + ' is not registered in the currency system.');
                    msg.channel.send({ embed });
                    client.end();
                }
            });
        }
    },
    blackjack: (msg) => {
        var betArray = msg.content.split(' ');
        var betAmount = parseInt(betArray[1]);

        if(betAmount > 0) {
            const client = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'gambling',
                password: 'dsnook100',
                port: 5432,
            });
    
            client.connect();
    
            const queryString = 'SELECT amount FROM public."userData" WHERE userid='+ msg.member.id;
    
            client.query(queryString, (err, res) => {
                if (res.rowCount > 0) {
                    if (res.rows[0].amount >= betAmount) {
                        var currentBalance = parseInt(res.rows[0].amount);
                        var gameInProgress = false;

                        function card(value, name, suit){
                            this.value = value;
                            this.name = name;
                            this.suit = suit;
                        }

                        function deck(){
                            this.names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
                            this.suits = [':hearts:',':diamonds:',':spades:',':clubs:'];
                            var cards = [];
                            
                            for( var s = 0; s < this.suits.length; s++ ) {
                                for( var n = 0; n < this.names.length; n++ ) {
                                    cards.push( new card( n+1, this.names[n], this.suits[s] ) );
                                }
                            }
                            return cards;
                        }

                        function shuffle(array) {
                            var m = array.length, t, i;

                            while (m) {
                                i = Math.floor(Math.random() * m--);
                            
                                // And swap it with the current element.
                                t = array[m];
                                array[m] = array[i];
                                array[i] = t;
                            }
                            return array;
                        }

                        function deal() {
                            var randCard = shuffledDeck[0];
                            if (randCard.value >10){
                                randCard.value = 10;
                            } else if(randCard.value === 1) {
                                randCard.value = 11;
                            }
                            shuffledDeck.shift();
                            return randCard;
                        }

                        function Hand() {
                            var cardsInHand = [];
                            cardsInHand.push(deal());
                            cardsInHand.push(deal());
                            var totalScore = cardsInHand[0].value + cardsInHand[0].value;
                            console.log (cardsInHand[0].value);
                            var nextCard = 3;
                        
                            // Returns the amount of cards in play
                            this.getCardAmt = function() {
                                return nextCard - 1;
                            };
                        
                            // Adds new card & updates total score for a "hit"
                            this.hit = function() {
                                switch(nextCard) {
                                    case 3:
                                        cardsInHand.push(deal());
                                        totalScore += cardsInHand[2].value;
                                        nextCard++;
                                        break;
                                    case 4:
                                        cardsInHand.push(deal());
                                        totalScore += cardsInHand[3].value;
                                        nextCard++;
                                        break;
                                    case 5:
                                        cardsInHand.push(deal());
                                        totalScore += cardsInHand[4].value;
                                        nextCard++;
                                        break;
                                    case 6:
                                        cardsInHand.push(deal());
                                        totalScore += cardsInHand[5].value;
                                        nextCard++;
                                        break;
                                    case 7: 
                                        cardsInHand.push(deal());
                                        totalScore += cardsInHand[6].value;
                                }
                            };
                        
                            // Returns an otherwise private variable
                            this.getTotalScore = function() {
                                return totalScore;
                            };

                            // Initial shown player cards
                            this.displayTwoCards = function() {
                                var x = cardsInHand[0].name + " " + cardsInHand[0].suit;
                                var y = cardsInHand[1].name + " " + cardsInHand[1].suit;
                                return x + ", " + y;
                            };

                            //
                            this.displayAllCards = function() {
                                var allCards = [];
                                for (var i=0; i < cardsInHand.length; i++) {
                                   allCards.push(cardsInHand[i]);
                                   return cardsInHand[i].name + " " + cardsInHand[i].suit;
                                }
                            };
                        
                            // Initial shown dealer card
                            this.displayOneCard = function() {
                                var x = cardsInHand[0].name + " " + cardsInHand[0].suit;
                                return x;
                            };
                        }

                        var shuffledDeck = shuffle(deck());

                        var gameStart = function() {

                            var playerHand = new Hand();
                            var dealerHand = new Hand();

                            console.log("Your cards: " + playerHand.displayTwoCards());
                            console.log(playerHand.getTotalScore());
                            console.log("Dealers card: " + dealerHand.displayOneCard());
                            console.log(dealerHand.getTotalScore());
                            console.log("-------------");

                            myTurn();
                            
                            // Runs player hand, prompts to hit or stand
                            function myTurn() {
                                if(playerHand.getTotalScore() === 21 && playerHand.getCardAmt() === 2) {
                                    if(dealerHand.getTotalScore() === 21) {
                                        console.log("Both blackjacks! You tie!");
                                    } else {
                                        console.log("Blackjack! You win!");
                                    }
                                } else if (playerHand.getTotalScore() < 21) {
                                    
                                        //playerHand.hit();
                                       // myTurn();
                                    
                                } else if(playerHand.getTotalScore() > 21) {
                                    console.log("You busted. Dealer wins.");
                                } else {
                                    dealerTurn();
                                }
                            }

                            function dealerTurn() {
                                if(dealerHand.getTotalScore() === 21 && dealerHand.getCardAmt() === 2) {
                                    console.log("Blackjack. Dealer wins.");
                                } else if(dealerHand.getTotalScore() > 21) {
                                    console.log("Dealer busts. You win!");
                                } else if(dealerHand.getTotalScore() >= 17) {
                                    if(myHand.getTotalScore() > dealerHand.getTotalScore()) {
                                        console.log("You win!");
                                    } else {
                                        console.log("Dealer wins.");
                                    }
                                } else {
                                    dealerHand.hit();
                                    dealerTurn();
                                }
                            }
                        }
                        gameStart();
                        
                    }
                } else {
                    const embed = new Discord.RichEmbed()
                        .setColor(3447003)
                        .addField('Balance - ' + msg.member.user.username, 'Please type .reg to start using the currency system.');
                    msg.channel.send({ embed });
                    msg.delete();
                    client.end();
                }
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setColor(3447003)
                .addField('Blackjack - ' + msg.member.user.username, 'Please use the format .bj <bet amount>');
            msg.channel.send({ embed });
            msg.delete();
        }
    }
}