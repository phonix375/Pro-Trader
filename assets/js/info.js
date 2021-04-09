$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "./resource/nasdaq.csv",
        dataType: "text",
        success: function (data) { processData(data); }
    });
});
var CretaeTable = function(lines){
    for(var i = 0; i < lines.length; i++){
        var tableRow = $("<tr>");
        var td = $('<td>').html(lines[i][0]);
        var td1 = $('<td>').html(lines[i][1]);
        var td2 = $('<td>').html(lines[i][2]);
        var td3 = $('<td>').html(lines[i][3]);
        var td4 = $('<td>').html(lines[i][4]);
        var td5 = $('<td>').html(lines[i][5]);
        var td6 = $('<td>').html(lines[i][6]);
        var td7 = $('<td>').html(lines[i][7]);
        var td8 = $('<td>').html(lines[i][8]);
        var td9 = $('<td>').html(lines[i][9]);
        var td10 = $('<td>').html(lines[i][10]);
        $(tableRow).append(td);
        $(tableRow).append(td1);
        $(tableRow).append(td2);
        $(tableRow).append(td3);
        $(tableRow).append(td4);
        $(tableRow).append(td5);
        $(tableRow).append(td6);
        $(tableRow).append(td7);
        $(tableRow).append(td8);
        $(tableRow).append(td9);
        $(tableRow).append(td10);
        $('#myStocksTable').append(tableRow);
    }
    
}
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
    console.log(lines)
    CretaeTable(lines);
}
