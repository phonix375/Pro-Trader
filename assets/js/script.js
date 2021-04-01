var userInformation = '';
var apiKey = 'MRZGIXHX6J4WPIDJ';
var stockWorth = 0;

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./resource/nasdaq.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
}

var lines = [];

var updateStockTotal = function(){
    $('#stockWorth').text(stockWorth.toFixed(2));
    console.log(parseFloat(document.querySelector('#stockWorth').innerHTML));
    console.log(parseFloat(document.querySelector('#stockWorth').innerHTML));
    var total = parseFloat(document.querySelector('.currentCash').innerHTML) + parseFloat(document.querySelector('#stockWorth').innerHTML);
    $('#total').text(total);
}
var checkIfUserExist = function(){
    userInformation = localStorage.getItem('userInformation');
    if(localStorage.getItem('userInformation') == null){
        var username = window.prompt("Please enter your name");
        var startCash = window.prompt("Please enter the start cash");
        userInformation = {
            username: username,
            ownStocks : [],
            cash : startCash,
            transactions : [],
            startInformation:[moment().format('DD/MM/YYYY'),startCash]

        };
        saveToLocalStorage();
    }
    else{
       
       userInformation = JSON.parse(localStorage.getItem('userInformation'));
    }
}
var updateDashbord = function(){
    $('#myStocksTable').html('');
    document.querySelector('.currentCash').innerHTML = userInformation['cash'].toFixed(2);
    $('#userName').html(userInformation.username);
    userInformation.ownStocks.forEach( async function(element){
        var response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${element.symbol}&apikey=${apiKey}`);
        var json = await response.json();
        console.log(json);
        stockWorth += json['Global Quote']['05. price'] * element.quantity;
        var tableRow = $("<tr>");
        var td = $('<td>').html(`${element['symbol']}`);
        var td1 = $('<td>').html(`${element.quantity}`);
        var td2 = $('<td>').html(`${stockWorth.toFixed(2)}$`);
        $(tableRow).append(td);
        $(tableRow).append(td1);
        $(tableRow).append(td2);
        $('#myStocksTable').append(tableRow);

        updateStockTotal(element);
    });

 };

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['30/03/2021', '29/03/2021', '28/03/2021', '27/03/2021', '26/03/2021', '25/03/2021'],
        datasets: [{
            label: 'My Portfolio worth',
            data: [10000, 11500, 12000, 9800, 9900, 16000],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var saveToLocalStorage = function(){
    localStorage.setItem('userInformation',JSON.stringify(userInformation));
}




$('#symbolSearch').submit(function (e) { 
    e.preventDefault();
    var serchSymbl = $('#symbolToSearch').val();
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${serchSymbl}&apikey=${apiKey}`)
  .then(response => response.json())
  .then(function(data){
      var searchResault = []
      data.bestMatches.forEach(element => {
        searchResault.push([element['1. symbol'],element['2. name']]);
      });
      $('#searchResults').html('');
      var table = $('<table>').attr('class','results')
      searchResault.forEach(function(element){
        var tableRow = $('<tr>');
        var data = $('<td>').text(element[0]);
        var data1 = $('<td>').text(element[1]);
         $(tableRow).append(data);
         $(tableRow).append(data1);
         $(table).append(tableRow);
      });
      $('#searchResults').append(table);
  });
});

$('#buyForm').submit(function(e){
    e.preventDefault();
    var symbolToBuy = $('#symbolToBuy').val();
    var buyQuantity = $('#buyQuantity').val();
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbolToBuy}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(function(data){
        if(Object.keys(data['Global Quote']).length == 0){
            alert('we didnt find this symble, please try again');
        }
        else if((data['Global Quote']['05. price'] * buyQuantity) > userInformation.cash){
            alert('sorry you dont have the money for this');
        }
        else{
            //reduce the cash from the user account
            userInformation.cash = userInformation.cash - (data['Global Quote']['05. price'] * buyQuantity);

            //record the transaction in transaction arry
            userInformation.transactions.push([symbolToBuy,'buy',buyQuantity]);


            //checking to make sure if the user have this stock
            var checkIfOwn = userInformation.ownStocks.find(a => a.symbol === symbolToBuy);
            //add to the array if the user dont have this stock
            if(checkIfOwn == null){
                userInformation.ownStocks.push({"symbol":symbolToBuy,"quantity":buyQuantity});

            }
            //if the user have this stock, loop over the array and increment the quantity
            else{
                for(var i = 0; i< userInformation.ownStocks.length;i++){
                    if(userInformation.ownStocks[i]['symbol'] == symbolToBuy){
                        var temp = parseInt(userInformation.ownStocks[i]['quantity']) + parseInt(buyQuantity);
                        userInformation.ownStocks[i]['quantity'] = '';
                        userInformation.ownStocks[i]['quantity'] = temp;
                    }
                }
            };
            //save the changes to local storage
            saveToLocalStorage();
            updateDashbord();
        }
    });

});

checkIfUserExist();
updateDashbord();