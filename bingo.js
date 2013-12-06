var socketClient = require('socket.io-client');

var client = socketClient.connect('ws://yahoobingo.herokuapp.com');
var payload = { name: 'Scott Zuke',  email: 'scottzuke@gmail.com', url: 'https://github.com/szuke/yahoo-bingo' };
client.emit('register', payload);

var myCard;
var numbers = [];

client.on('connect', function () {
  console.log("connected"); 
});

client.on('card', function (payload) {
	myCard = payload;
	console.log("Retrieve card ", myCard);
});

client.on('number', function (number) {
	var bingoNumber = parseInt(number.replace(/[a-z]/i,''));
	numbers.push(bingoNumber);

	var hasBingo = checkForBingo(numbers, myCard);
	if (hasBingo){
		client.emit('bingo'); 
	}
});

client.on('win', function (message) { console.log("BINGO"); });
client.on('lose', function (message) { console.log("nope :("); });
client.on('disconnect', function () { console.log("disconnected"); });

function checkForBingo(calledNumbers, card){ 
	if (bingoCheckHorizontal(calledNumbers, card)){
		console.log("HORIZONTAL BINGO!");
		return true;
	}
	if (bingoCheckVertical(calledNumbers, card)){
		console.log("VERTICAL BINGO!");
		return true;
	}
	if (bingoCheckDiagonal(calledNumbers, card)){ 
		console.log("DIAGONAL BINGO!");
		return true;
	}
	return false;
}

function bingoCheckHorizontal(calledNumbers, myCard){ 
	for (var i in myCard.slots) {
		var myCardLine = myCard.slots[i];
		var matchHorizontal = true;
		myCardLine.forEach(function (myCardNumber){ 
			if(calledNumbers.indexOf(myCardNumber) === -1){ 
				matchHorizontal = false;
			}
		});
		return matchHorizontal;
	}
}

function bingoCheckVertical(calledNumbers, myCard){ 
	var matchVertical = [true,true,true,true,true];
	for (var i in myCard.slots) {
		var myCardLine = myCard.slots[i];
		myCardLine.forEach(function(myCardNumber, j){ 
			var myCardNumber = myCard.slots[i][j];
			if(calledNumbers.indexOf(myCardNumber) === -1){ 
				matchVertical[j] = false;
			}
		});
	}

	for (var k=0; k<matchVertical.length; k++){ 
		if (matchVertical[k]){ 
 			return true;
	    }
	} 
}

function bingoCheckDiagonal(calledNumbers, myCard){ 
	var matchDiag1 = true, matchDiag2 = true; 
	var index = 0; 
	for (var i in myCard.slots) {
		var myCardLine = myCard.slots[i];
		myCardLine.forEach(function(myCardNumber, j){ 
			if (index===j){
				var myCardNumber = myCard.slots[i][j];
				if(calledNumbers.indexOf(myCardNumber) === -1){
					matchDiag1 = false;
				}
			}
			if ((parseInt(index)+parseInt(j)===4)){ 
				var myCardNumber = myCard.slots[i][j];
				if(calledNumbers.indexOf(myCardNumber) === -1){ 
					matchDiag2 = false;
				} 
			}
		});
		index++;
	}
	return matchDiag1 || matchDiag2;
}
exports.checkForBingo = checkForBingo;

