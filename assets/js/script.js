var userInformation = '';
var apiKey = 'MRZGIXHX6J4WPIDJ';

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
            label: 'My Protpholio worth',
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
$('#symbolSearch').submit(function (e) { 
    e.preventDefault();
    var serchSymbl = $('#symbolToSearch').val();
    console.log(serchSymbl);
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${serchSymbl}&apikey=${apiKey}`)
  .then(response => response.json())
  .then(function(data){
      var searchResault = []
      data.bestMatches.forEach(element => {
        searchResault.push(element['1. symbol']);
      });
      console.log(searchResault);
      $('#searchResults').html('');
      var table = $('<table>').attr('class','results')
      searchResault.forEach(function(element){
        var tableRow = $('<tr>');
        var data = $('<td>').text(element);
         $(tableRow).append(data);
         $(table).append(tableRow);
      });
      $('#searchResults').append(table);
  });
});

/*
 <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Worth</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                       <td>APPL</td>
                       <td>1</td>
                       <td>300$</td>
                </tr>
     </tbody>
</table>
*/






checkIfUserExist();