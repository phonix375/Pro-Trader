var userInformation = '';
/* var apiKey = 'MRZGIXHX6J4WPIDJ'; */
var apiKey = "SRKIT2G4W4EWBWB5";
var stockWorth = 0;
var conversionModel = {
        rates : {USD : 1},
        selectedCurrency : "USD",
};

function fetchConversionRates() {  
    fetch ('https://currencyapi.net/api/v1/rates?key=0jDY0YoYl8170GvF1NbLAmPOqJimi4mjTo5o&base=USD')//some amount of time 
    .then(function(response) {//promise === callback same idea
        return response.json();//returns in thus call back response
    }).then(function(data){// only execute once the request is completed
        conversionModel.rates = data.rates;
        // view variables
        var currencyDropdown = $("#currency-picker");
        

        // update view function  : cash display
        var displayCash = function() {
            $(".currency").text(conversionModel.selectedCurrency);
            

        }

        // update model function: change currency
        var changeCurrencyTo = function(newCurrency) {
            conversionModel.selectedCurrency = newCurrency;
            displayCash();
        
        }
        
        var initializeView = function () {
            // initialize view: populate currency picker
            $.each(conversionModel.rates, function(currency, rate) {
                currencyDropdown.append(
                    $('<option></option>').val(currency).html(currency)
                );
            });

            //Display cash
            displayCash();
        }

        // User Action listener : Changed currency
        var currencyChangedListener = function () {
            alert( " Changed Currency to " + currencyDropdown.val() );
            changeCurrencyTo(currencyDropdown.val());
            updateDashbord();
        };

        // initializer: register listener for the drop down
        currencyDropdown.change(currencyChangedListener); 
        initializeView();
    });
}


  function convertToSelectedCurrency(amountInUSD) {

    var selectedCurrency = conversionModel.selectedCurrency;
    var currencyConversionRate = conversionModel.rates[selectedCurrency];
    return amountInUSD * currencyConversionRate;

  };



function apiKey(){;
    apiKeyIndex ++
    if(apiKeyIndex > apiKeys.length - 1 ){
        apiKeyIndex = 0;
        return apiKeys[apiKeyIndex];
    }
    else{
        return apiKeys[apiKeyIndex];
    }
}

//load the CSV file to the application
$(document).ready(function() {
    fetchConversionRates();
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
    createDropDown(lines);
}

var lines = [];

var updateStockTotal = function(){
    $('#stockWorth').text(convertToSelectedCurrency(stockWorth).toFixed(2));
    console.log(parseFloat(document.querySelector('#stockWorth').innerHTML));
    console.log(parseFloat(document.querySelector('#stockWorth').innerHTML));
    var total = userInformation.cash + stockWorth;
    $('#total').text(convertToSelectedCurrency(total).toFixed(2));
}

var checkIfUserExist = function(){
    userInformation = localStorage.getItem('userInformation');
    if(localStorage.getItem('userInformation') == null){
        var username = window.prompt("Please enter your name");
        var startCash = window.prompt("Please enter the start cash");
        userInformation = {
            transactions : [],
            username: username,
            ownStocks : [],
            cash : startCash,
            startInformation:[moment().format('YYYY-MM-DD'),startCash]

        };
        console.log(userInformation);
        saveToLocalStorage();
    }
    else{
       
       userInformation = JSON.parse(localStorage.getItem('userInformation'));
    }
}

var updateChart = function(){
    listOfDays = [];
    for(var i = 0; i < moment().diff(moment(userInformation.startInformation[0]),'days') + 1; i++ ){
        listOfDays.push({'Date' : moment(userInformation.startInformation[0]).add(i, 'days').format('YYYY-MM-DD'), 'Stocks' : [], 'cash' : 0});
    }
    for(var i = 0; i < userInformation.transactions.length ; i++){
        
        var index = listOfDays.findIndex(x => x.Date === userInformation.transactions[i][3]);
        console.log(index)
        if(userInformation.transactions[i][1] === 'buy'){
            var index2 = listOfDays[index].Stocks.findIndex(x => x.symbol === userInformation.transactions[i][0])
            if(index2 > -1){
                listOfDays[index].Stocks[index2].amount = parseInt(listOfDays[index].Stocks[index2].amount) + parseInt(userInformation.transactions[i][2]);
            }
            else{
                listOfDays[index].Stocks.push({'symbol':userInformation.transactions[i][0],'amount' :userInformation.transactions[i][2]});
            }
        }
        else{
            var index2 = listOfDays[index].Stocks.findIndex(x => x.symbol === userInformation.transactions[i][0])
            if(parseInt(listOfDays[index].Stocks[index2].amount) === parseInt(userInformation.transactions[i][2])){
                listOfDays[index].Stocks.splice(index2,1);
            }
            else{
                listOfDays[index].Stocks[index2].amount = parseInt(listOfDays[index].Stocks[index2].amount) - parseInt(userInformation.transactions[i][2]);
            }
        }
    }
    var listForChartDays = [];
    //get the last 7 days
    for(var i = 7; i > 0; i -- ){
        listForChartDays.push(listOfDays[listOfDays.length - i].Date);
    }
    console.log(listForChartDays);
    //calculate the worth of the days
    worth = []
    listForChartDays.forEach(async function(item){
        var index = listOfDays.findIndex(x => x.Date ===item);
        if(listOfDays[index].Stocks.length > 0){
            listOfDays[index].Stocks.forEach(async function(stock){
                const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.symbol}&apikey=${apiKey()}`);
                const json = await response.json();
               if(json['Time Series (Daily)'][item] != undefined ){
                   console.log(json['Time Series (Daily)'][item]['4. close']);
               }
               else{
                   console.log('the same as the day before');
               }
            })
        }
        //const json = await response.json();
        //json['Weekly Time Series'][]
    });
    console.log(worth);
    

}

var updateStockTotal = function(){
    $('#stockWorth').text(stockWorth.toFixed(2));
    var total = parseFloat(document.querySelector('.currentCash').innerHTML) + parseFloat(document.querySelector('#stockWorth').innerHTML);
    $('#total').text(total);
}
var updateDashbord = function(){
    $('#myStocksTable').html('');
    document.querySelector('.currentCash').innerHTML = convertToSelectedCurrency(parseFloat(userInformation['cash'])).toFixed(2);
    $('#userName').html(userInformation.username);
    stockWorth=0;
    userInformation.ownStocks.forEach( async function(element){
        var response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${element.symbol}&apikey=${apiKey()}`);
        var json = await response.json();
        console.log(json);
        stockWorth += json['Global Quote']['05. price'] * element.quantity ;
        var tableRow = $("<tr>");
        var td = $('<td>').html(`${element['symbol']}`);
        var td1 = $('<td>').html(`${element.quantity}`);
        var td2 = $('<td>').html(`${convertToSelectedCurrency(json['Global Quote']['05. price'] * element.quantity).toFixed(2) + " " + conversionModel.selectedCurrency}`);
        $(tableRow).append(td);
        $(tableRow).append(td1);
        $(tableRow).append(td2);
        $('#myStocksTable').append(tableRow);
        updateStockTotal(element);
    });
    userInformation.transactions.forEach(function(transaction){
        var tableRow = $("<tr>");
        var td = $('<td>').html(`${transaction[3]}`);
        var td1 = $('<td>').html(`${transaction[0]}`);
        var td2 = $('<td>').html(`${transaction[1]}`);
        var td3 = $('<td>').html(`${transaction[2]}`);
        var td4 = $('<td>').html(`${transaction[4]}$`);
        $(tableRow).append(td);
        $(tableRow).append(td1);
        $(tableRow).append(td2);
        $(tableRow).append(td3);
        $(tableRow).append(td4);
        $('#myTransactionTable').append(tableRow);
    });
    updateChart();

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


var checkIfUserExist = function(){
    userInformation = localStorage.getItem('userInformation');
    if(localStorage.getItem('userInformation') == null){
        var username = window.prompt("Please enter your name");
        var startCash = window.prompt("Please enter the start cash");
        userInformation = {
            username: username,
            ownStocks : [],
            cash : startCash
        };
        saveToLocalStorage();
    }
    else{
       userInformation = JSON.parse(localStorage.getItem('userInformation'));
       console.log(userInformation) ;
    }
}

/*Sell functions*/

//get the array of the Stocks owned by the user from Local Storage and display in Sell Modal
var availableStocksToSell = function(){
    var userInformation = JSON.parse(localStorage.getItem('userInformation'));
    var ownedStocks = userInformation.ownStocks
    $("#inlineFormCustomSelect").empty()
    for(var i = 0; i < ownedStocks.length ; i++){
        $("#inlineFormCustomSelect").append(`<option id="${ownedStocks[i].symbol}" value="${ownedStocks[i].symbol}">${ownedStocks[i].symbol}</option>`)
    }
}

//Substract the sell worth from the total stock worth and total
var substractSellInStockTotal = function(sellStockSymbol, sellStockQuantity){
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sellStockSymbol}&apikey=CAQK57WJYT0W3JUP`
    fetch(url)
    .then(response => response.json())
    .then(function(data){
        const priceSellStock = parseFloat(data["Global Quote"]["05. price"]).toFixed(2)
        //Substract the sell amount from total stock worth
        stockWorth-= priceSellStock*sellStockQuantity
        $("#stockWorth").text(stockWorth)
        //Substract the sell amount from total
        currentTotal = parseFloat($("#total").text())
        newTotal= parseFloat(currentTotal - priceSellStock*sellStockQuantity).toFixed(2)
        $("#total").text(newTotal)
    })
}

//Update Table with current price for each share owned
var updateTableAfterSell = function(newUserInformation){
    //Clear the current table
    $("#myStocksTable").empty()
    //Loop through the array of stocks owned and add a new row to the table with corresponding data
    for(var i = 0 ; i < newUserInformation.ownStocks.length; i++){
        const stockSymbol = newUserInformation.ownStocks[i].symbol
        const stockQuantity = parseFloat(newUserInformation.ownStocks[i].quantity).toFixed(0)
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=demo`
        fetch(url)
        .then(response => response.json())
        .then(function(data){
           var stockPrice = parseFloat(data['Global Quote']['05. price']).toFixed(2)
           //Recreate the Table from scratch and append the updated list of stocks available
           $("#myStocksTable").append(
               `<tr>
                    <td>${stockSymbol}</td>
                    <td>${stockQuantity}</td>
                    <td>${stockPrice*stockQuantity}$</td>
                </tr>`)
        })  
    }
}

//update local storage and update table
var mainSellFunction = function(){
    var userInformation = JSON.parse(localStorage.getItem('userInformation'));
    var ownedStocks = userInformation.ownStocks
    const sellStockSymbol = $("option:selected").val()
    const sellStockQuantity = $("#sellQuantity").val()
    //Update the local storage object after selling the product
    for(var i = 0; i < ownedStocks.length ; i++){
       if(ownedStocks[i].symbol == sellStockSymbol && ownedStocks[i].quantity == sellStockQuantity ){
            userInformation.ownStocks.splice(i,1)
            localStorage.setItem('userInformation',JSON.stringify(userInformation)) 
            //Substract the sell worth from the total stock worth and total
            substractSellInStockTotal(sellStockSymbol, sellStockQuantity)
            //Remove the option from the select menu for the symbol that has been totally sold
            $("#"+sellStockSymbol).remove()
            const newUserInformation = JSON.parse(localStorage.getItem('userInformation'))
            updateTableAfterSell(newUserInformation) 
        } else if (ownedStocks[i].symbol == sellStockSymbol && ownedStocks[i].quantity > sellStockQuantity){
            userInformation.ownStocks[i].quantity = userInformation.ownStocks[i].quantity - sellStockQuantity
            localStorage.setItem('userInformation',JSON.stringify(userInformation)) 
            //Substract the sell worth from the total stock worth and total
            substractSellInStockTotal(sellStockSymbol, sellStockQuantity)
            //Call the updated userInformation object
            const newUserInformation = JSON.parse(localStorage.getItem('userInformation'))
            updateTableAfterSell(newUserInformation) 
        } else if (ownedStocks[i].symbol == sellStockSymbol && ownedStocks[i].quantity < sellStockQuantity) {
            $("#sellErrorMessage").css("display","flex")
            $("#sellErrorMessage").css("color","red")
            $("#sellErrorMessage").fadeOut(4000);
        }
    }
    
}

$("#sellBtn").on("click",function(){
    mainSellFunction()
})

/*end of Sell functions*/

$('#symbolSearch').submit(function (e) { 
    e.preventDefault();
    var searchSymbl = $('#symbolToSearch').val();
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchSymbl}&apikey=${apiKey}`)
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
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbolToBuy}&apikey=${apiKey()}`)
    .then(response => response.json())
    .then(function(data){
        if(Object.keys(data['Global Quote']).length == 0){
            alert('We didnt find this symbole, please try again');
        }
        else if((data['Global Quote']['05. price'] * buyQuantity) > userInformation.cash){
            alert('Sorry you dont have the money for this');
        }
        else{
            //reduce the cash from the user account
            userInformation.cash = userInformation.cash - (data['Global Quote']['05. price'] * buyQuantity);

            //record the transaction in transaction arry

            userInformation.transactions.push([symbolToBuy,'buy',buyQuantity,moment().format('YYYY-MM-DD'),parseFloat(data['Global Quote']['05. price'])]);

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
            availableStocksToSell();
        }
    });

});

checkIfUserExist();
availableStocksToSell()
updateDashbord();
