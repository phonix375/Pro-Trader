var userInformation = '';
var stockWorth = 0;
var lines = [];
var apiKeys = ['UJHV29RYWP9HTNBV',
'NC4BY431YHDBJM58',
'7PIET1UKFPMGXXJE',
'K9WISYL9VS5AX67W',
'AZJHCWSW5OOMWZRE',
'D11M39FYNNUNIWGS',
'ZCER87CRU4VD7SK1',
'P30XA70BFKGQFKN1',
'MRZGIXHX6J4WPIDJ', 
'SRKIT2G4W4EWBWB5',
 'CAQK57WJYT0W3JUP',
 '2U6QJE5A5XJ5LK70',
 'QCW2Q4BHZDJ7D93M',
 'U535L3Z7T1IMQPQA',
 'TSK0D4EDNO4QXNKY',
 'JPPM5CVPIBKTNMNP',
 'QRNW5OHRMF3D9RGR',
'FYFV33LG9TKD9O46'];
//var apiKeys = ['demo'];
var apiKeyIndex = Math.floor(Math.random() * apiKeys.length);

var conversionModel = {
    rates : {USD : 1},
    selectedCurrency : "USD",
};
var apiResultCache = {};
var urlInProgress = [];


function toKey(url) {
    // var str     = "/pages/new?name=J&return_url=/page/new";
    // var matches = str.match(/name=([^&]*)/);
    // url = url.replace(regex, '');
    // alert(matches[1]);
    return url.split('apikey=')[0]
}


function fetchData(url, callback) {
    var cacheKey = toKey(url);

    if(apiResultCache[cacheKey] && apiResultCache[cacheKey].status == "completed" ) {
        console.log("found cache entry");
        callback(apiResultCache[cacheKey].data);
        return;
    }

    if(apiResultCache[cacheKey] && apiResultCache[cacheKey].status == "fetching" ) { 
        console.log("skipping request since it's in fetching state");
        return;
    }

    apiResultCache[cacheKey] = { status: "fetching", data: null };

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            if(data["Note"]) {
                console.log('BAD RESPONSE DETECTED:', data);
                delete apiResultCache[cacheKey];
                fetchData(toKey(url) + 'apikey=' + apiKey(),callback);
                return;
            }

            apiResultCache[cacheKey].status = "completed";
            apiResultCache[cacheKey].data = data;
            // setTimeout(function(){ delete apiResultCache[cacheKey]; }, 5000); // set cache TTL 
            callback(apiResultCache[cacheKey].data);      
        })
        .catch((error) => {            
            console.error('Error:', error);
            delete apiResultCache[cacheKey];
        });
};

// rotates the api keys 
function apiKey() {
    apiKeyIndex++
    if (apiKeyIndex > apiKeys.length - 1) {
        apiKeyIndex = 0;
        return apiKeys[apiKeyIndex];
    }
    else {
        return apiKeys[apiKeyIndex];
    }
}
//load the CSV file to the application
$(document).ready(function () {
    fetchConversionRates();
    $.ajax({
        type: "GET",
        url: "./resource/nasdaq.csv",
        dataType: "text",
        success: function (data) { processData(data); }
    });
});
//gets the conversion rate to USD
function fetchConversionRates() {  
    fetch ('https://currencyapi.net/api/v1/rates?key=0jDY0YoYl8170GvF1NbLAmPOqJimi4mjTo5o&base=USD')//some amount of time 
    .then(function(response) {//promise === callback same idea
        return response.json();//returns in thus call back response
    }).then(function(data){// only execute once the request is completed
        conversionModel.rates = data.rates;
        console.log(conversionModel.rates);
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
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                tarr.push(headers[j] + ":" + data[j]);
            }
            lines.push(tarr);
        }
    }
    createDropDown(lines);
}
//add the emelemnts to a drop down in the left side panel
var createDropDown = function (lines) {
    lines.forEach(element => {
        $('#selector').append(`<option value="${element[0]}">${element[0]}</option>`)
    });
}
var checkIfUserExist = function () {
    userInformation = localStorage.getItem('userInformation');
    if (localStorage.getItem('userInformation') == null) {
        location.replace("./firstLogin.html")
    }
    else {

        userInformation = JSON.parse(localStorage.getItem('userInformation'));
    }
}
var getWeekPrice = function(DayStocks, day){
    console.log(DayStocks);
    console.log(day);
}
var  calculateStockWorth = function(listOfDays,listForChartDays){
    console.log(listOfDays);
    console.log(listForChartDays);
    worth = [];
    listForChartDays.forEach(function(day){
        var index = listOfDays.findIndex(x => x.Date === day);
        if(index > 0){
            worth.push(getWeekPrice(listOfDays[index].Stocks,day))
        }
        else{
           worth.push(0); 
        }
    })
}
var updateChartVisual = function (worth){
    var dates = [];
    var amount = [];
    for(var i = 0; i < worth.length; i++){
        dates.push(worth[i].date);
        amount.push(worth[i].worth);
    }
    var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [{
            label: 'My Portfolio worth',
            data: amount,
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

}

var updateChart1 = function(){
    var stocks = [];
    var quantity = [];
    var colors = [];
    for(var i = 0 ; i< userInformation.ownStocks.length;i++){
        stocks.push(userInformation.ownStocks[i].symbol);
        quantity.push(userInformation.ownStocks[i].quantity);
        colors.push('#' + Math.floor(Math.random()*16777215).toString(16));
    }
    new Chart(document.getElementById("myChart1"), {
        type: 'pie',
        data: {
          labels: stocks,
          datasets: [{
            label: "Portfolio Diversity",
            backgroundColor: colors,
            data: quantity
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Portfolio Diversity'
          }
        }
    });
    
    }
    



var updateChart = async function () {
    listOfDays = [];
    var cashNow = parseFloat(userInformation.startInformation[1]);

    for (var i = 0; i < moment().diff(moment(userInformation.startInformation[0]), 'days') + 1; i++) {
        for(var b = 0; b < userInformation.transactions.length ; b++){
            if(userInformation.transactions[b][3] == moment(userInformation.startInformation[0]).add(i, 'days').format('YYYY-MM-DD')){
                if(userInformation.transactions[b][1] === 'buy'){
                    cashNow -=  parseFloat(userInformation.transactions[b][2]) * parseFloat(userInformation.transactions[b][4]);
                }
                else{
                    cashNow +=  parseFloat(userInformation.transactions[b][2]) * parseFloat(userInformation.transactions[b][4]);
                }
            }
        }
        listOfDays.push({ 'Date': moment(userInformation.startInformation[0]).add(i, 'days').format('YYYY-MM-DD'), 'Stocks': [], 'cash': cashNow });
    }
    for (var i = 0; i < userInformation.transactions.length; i++) {
        var index = listOfDays.findIndex(x => x.Date === userInformation.transactions[i][3]);
        if (userInformation.transactions[i][1] === 'buy') {
            var index2 = listOfDays[index].Stocks.findIndex(x => x.symbol === userInformation.transactions[i][0])
            if (index2 > -1) {
                listOfDays[index].Stocks[index2].amount = parseInt(listOfDays[index].Stocks[index2].amount) + parseInt(userInformation.transactions[i][2]);
            }
            else {
                listOfDays[index].Stocks.push({ 'symbol': userInformation.transactions[i][0], 'amount': userInformation.transactions[i][2] });
            }
        }
        else {
            var index2 = listOfDays[index].Stocks.findIndex(x => x.symbol === userInformation.transactions[i][0])
            if (parseInt(listOfDays[index].Stocks[index2].amount) === parseInt(userInformation.transactions[i][2])) {
                listOfDays[index].Stocks.splice(index2, 1);
            }
            else {
                listOfDays[index].Stocks[index2].amount = parseInt(listOfDays[index].Stocks[index2].amount) - parseInt(userInformation.transactions[i][2]);
            }
        }
    }
    var listForChartDays = [];
    //get the last 7 days
    for (var i = 7; i > 0; i--) {
        try{
            listForChartDays.push(listOfDays[listOfDays.length - i].Date);
        }catch(error){
            listForChartDays.push(moment().add(i * -1, 'days').format('YYYY-MM-DD'));
        }
    }
    console.log(listForChartDays);
    //calculate the worth of the days
    worth = []
    
    for(const item of listForChartDays) {
        var temp = 0;
        var index3 = listOfDays.findIndex(x => x.Date === item);
        console.log(index3);
        if(index3 !== -1){
            if (listOfDays[index3].Stocks.length > 0) {
                console.log('this is the if');
                for(const stock of listOfDays[index3].Stocks) {
                    fetchData(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.symbol}&apikey=${apiKey()}`, function(data){
                        try{
                    
                            if (data['Time Series (Daily)'][item] != undefined) {
                                console.log('in the if statement:');
                                temp += parseFloat(data['Time Series (Daily)'][item]['4. close']);
                            }
                        }
                            catch {
                                console.log('in the else statement:');
                                console.log(data)
                                var date = data['Meta Data']['3. Last Refreshed'];
                                console.log(data['Time Series (Daily)'][date]['4. close']);
                                temp += parseFloat(data['Time Series (Daily)'][date]['4. close']);
                                console.log('the same as the day before', temp);
                            }
                    });

                    }
                    console.log('this is the temp before push 1',temp);
                    worth.push({'date': item, 'worth':temp + parseFloat(listOfDays[index3].cash)});
            }else{
                console.log('this is the else');
                console.log('this is the temp before push 2',temp)
                worth.push({'date': item, 'worth': 0 + parseFloat(listOfDays[index3].cash)});
            }
        }else{
            console.log('this is the temp before push 3',temp)
            var cashTemp = 0
            try{
                cashTemp = parseFloat(listOfDays[index3].cash);
            }
            catch(error){
                cashTemp = 0;
            };
            worth.push({'date': item, 'worth':0 + cashTemp});
        }
    };
    updateChartVisual(worth);
}

var updateStockTotal = function () {
    $('#stockWorth').text(convertToSelectedCurrency(stockWorth).toFixed(2));
    var total = userInformation.cash + stockWorth;
    $('#total').text(convertToSelectedCurrency(total).toFixed(2));
}
var updateDashbord = function () {
    $('#myStocksTable').html('');
    $('#myTransactionTable').html('');
    document.querySelector('.currentCash').innerHTML = convertToSelectedCurrency(parseFloat(userInformation['cash'])).toFixed(2);
    $('#userName').html(userInformation.username);
    stockWorth = 0;
    userInformation.ownStocks.forEach(function (element) {
            fetchData(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${element.symbol}&apikey=${apiKey()}`,function(json){
            console.log('look here',json);
            stockWorth += json['Global Quote']['05. price'] * element.quantity;
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
       
    });
    userInformation.transactions.forEach(function (transaction) {
        var tableRow = $("<tr>");
        var td = $('<td>').html(`${transaction[3]}`);
        var td1 = $('<td>').html(`${transaction[0]}`);
        var td2 = $('<td>').html(`${transaction[1]}`);
        var td3 = $('<td>').html(`${transaction[2]}`);
        var td4 = $('<td>').html(`${convertToSelectedCurrency(transaction[4])+ " " + conversionModel.selectedCurrency}`);
        $(tableRow).append(td);
        $(tableRow).append(td1);
        $(tableRow).append(td2);
        $(tableRow).append(td3);
        $(tableRow).append(td4);
        $('#myTransactionTable').append(tableRow);
    });
    updateChart();
    updateChart1();

};


var saveToLocalStorage = function () {
    localStorage.setItem('userInformation', JSON.stringify(userInformation));
}


/*Sell functions*/

//get the array of the Stocks owned by the user from Local Storage and display in Sell Modal
var availableStocksToSell = function () {
    var ownedStocks = userInformation.ownStocks
    $("#inlineFormCustomSelect").empty()
    for (var i = 0; i < ownedStocks.length; i++) {
        $("#inlineFormCustomSelect").append(`<option id="${ownedStocks[i].symbol}" value="${ownedStocks[i].symbol}">${ownedStocks[i].symbol}</option>`)
    }
}

//Main sele function 
var mainSellFunction = function () {

    var ownedStocks = userInformation.ownStocks
    const sellStockSymbol = $(".sellOptionSelect").val()
    const sellStockQuantity = $("#sellQuantity").val()
    console.log('before the for loop' ,ownedStocks,sellStockSymbol,sellStockQuantity);
    //Update the local storage object after selling the product
    
    for (var i = 0; i < userInformation.ownStocks.length; i++) {
        console.log('loop',i);
        if (ownedStocks[i].symbol == sellStockSymbol && userInformation.ownStocks[i].quantity === sellStockQuantity) {
            userInformation.ownStocks.splice(i, 1);
            fetchData(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sellStockSymbol}&apikey=${apiKey()}`,function(data){
                console.log('this is data in the sell function 1' ,data);
                userInformation.cash = userInformation.cash + parseFloat(data['Global Quote']['05. price']);
                userInformation.transactions.push([sellStockSymbol, 'sell', sellStockQuantity, moment().format('YYYY-MM-DD'), parseFloat(data['Global Quote']['05. price'])]);
                stockWorth -= data['Global Quote']['05. price'] * sellStockQuantity;

                saveToLocalStorage();
                updateDashbord();
            })
            //save to local storage
            saveToLocalStorage();

            //update the list on the sell modal
            availableStocksToSell();
            updateDashbord();

        } else if (userInformation.ownStocks[i].symbol == sellStockSymbol && userInformation.ownStocks[i].quantity > sellStockQuantity) {
            userInformation.ownStocks[i].quantity = userInformation.ownStocks[i].quantity - sellStockQuantity;
            fetchData(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sellStockSymbol}&apikey=${apiKey()}`,function(data){
                console.log('this is the sell data in the sell function 2',data)
                userInformation.cash = userInformation.cash + parseFloat(data['Global Quote']['05. price']);
                userInformation.transactions.push([sellStockSymbol, 'sell', sellStockQuantity, moment().format('YYYY-MM-DD'), parseFloat(data['Global Quote']['05. price'])]);
                stockWorth -= data['Global Quote']['05. price'] * sellStockQuantity;

                saveToLocalStorage();

                updateDashbord();
            })
            //save to local storage
            saveToLocalStorage();

            //update the list on the sell modal
            availableStocksToSell()

            //update the dashbord
            updateDashbord();
        } else if (ownedStocks[i].symbol == sellStockSymbol && ownedStocks[i].quantity < sellStockQuantity) {
            $("#sellErrorMessage").css("display", "flex")
            $("#sellErrorMessage").css("color", "red")
            $("#sellErrorMessage").fadeOut(4000);
        }
    }

}

$("#sellBtn").on("click", function () {
    mainSellFunction()
})

/*end of Sell functions*/

$('#symbolSearch').submit(function (e) {
    e.preventDefault();
    var searchSymbl = $('#symbolToSearch').val();
    fetchData(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchSymbl}&apikey=${apiKey()}`,function(data){
        var searchResault = []
        data.bestMatches.forEach(element => {
            searchResault.push([element['1. symbol'], element['2. name']]);
        });
        $('#searchResults').html('');
        var table = $('<table>').attr('class', 'results')
        searchResault.forEach(function (element) {
            var tableRow = $('<tr>');
            var data = $('<td>').text(element[0]);
            var data1 = $('<td>').text(element[1]);
            $(tableRow).append(data);
            $(tableRow).append(data1);
            $(table).append(tableRow);
        });
        $('#searchResults').append(table);
    })
});

$('#buyForm').submit(function (e) {
    e.preventDefault();
    var symbolToBuy = $('#symbolToBuy').val();
    var buyQuantity = $('#buyQuantity').val();
    fetchData(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbolToBuy}&apikey=${apiKey()}`,function(data){
        if (Object.keys(data['Global Quote']).length == 0) {
            alert('We didnt find this symbole, please try again');
        }
        else if ((data['Global Quote']['05. price'] * buyQuantity) > userInformation.cash) {
            alert('Sorry you dont have the money for this');
        }
        else {
            //reduce the cash from the user account
            userInformation.cash = userInformation.cash - (data['Global Quote']['05. price'] * buyQuantity);

            //record the transaction in transaction arry

            userInformation.transactions.push([symbolToBuy, 'buy', buyQuantity, moment().format('YYYY-MM-DD'), parseFloat(data['Global Quote']['05. price'])]);

            //checking to make sure if the user have this stock
            var checkIfOwn = userInformation.ownStocks.find(a => a.symbol === symbolToBuy);
            //add to the array if the user dont have this stock
            if (checkIfOwn == null) {
                userInformation.ownStocks.push({ "symbol": symbolToBuy, "quantity": buyQuantity });

            }
            //if the user have this stock, loop over the array and increment the quantity
            else {
                for (var i = 0; i < userInformation.ownStocks.length; i++) {
                    if (userInformation.ownStocks[i]['symbol'] == symbolToBuy) {
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
    updateDashbord();
    availableStocksToSell();


