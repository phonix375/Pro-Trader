var userInformation = '';

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
    console.log(lines);
}

var lines = [];

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
var getArrayStocks = function(){
    var userInformation = JSON.parse(localStorage.getItem('userInformation'));
    var ownedStocks = userInformation.ownStocks
    for(var i = 0; i < ownedStocks.length ; i++){
        $("#inlineFormCustomSelect").append(`<option id="${ownedStocks[i].symbol}" value="${ownedStocks[i].symbol}">${ownedStocks[i].symbol}</option>`)
    }
}

var updateMainTableSell = function(){
    var userInformation = JSON.parse(localStorage.getItem('userInformation'));
    var ownedStocks = userInformation.ownStocks
    for(var i = 0; i < ownedStocks.length ; i++){
       if(ownedStocks[i].symbol == $("option:selected").val() && ownedStocks[i].quantity == $("#sellQuantity").val() ){
            userInformation.ownStocks.splice(i,1)
        } else if (ownedStocks[i].symbol == $("option:selected").val() && ownedStocks[i].quantity > $("#sellQuantity").val()){
            userInformation.ownStocks[i].quantity = userInformation.ownStocks[i].quantity - $("#sellQuantity").val()
        } else if (ownedStocks[i].symbol == $("option:selected").val() && ownedStocks[i].quantity < $   ("#sellQuantity").val()) {
            $("#sellErrorMessage").css("display","flex")
            $("#sellErrorMessage").css("color","red")
            $("#sellErrorMessage").fadeOut(4000);
        }
    }
    localStorage.setItem('userInformation',JSON.stringify(userInformation)) 
   
}

checkIfUserExist();
getArrayStocks()

$("#sellBtn").on("click",function(){
    updateMainTableSell()
})