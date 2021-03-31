
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./resource/nasdaq.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

var createDropDown = function(lines){
    console.log(lines);
    lines.forEach(element => {
        $('#selector').append(`<option value="${element[0]}">${element[0]}</option>`)
    });
}

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



selector