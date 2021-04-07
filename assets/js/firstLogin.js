var checkIfUserExist = function(){
    userInformation = localStorage.getItem('userInformation');
    if(localStorage.getItem('userInformation') == null){
        var username = $("#userName").val()
        var startCash = $("#amountOfCash").val()
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

var saveToLocalStorage = function(){
    localStorage.setItem('userInformation',JSON.stringify(userInformation));
}

$("#firstLoginBtn").on("click", function(e){
    e.preventDefault()
    checkIfUserExist()
    window.location.replace("./index.html")
})