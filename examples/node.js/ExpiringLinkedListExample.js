
    var ExpiringList = require('../../src/lib/ExpiringLinkedList.js').ExpiringLinkedList;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var list3 = new ExpiringList(10);

    var i = 0

    setInterval(function(){

        // get random number
        var number = getRandomInt(0,100);

        // push it to the list, and forget about it
        // it will expire after 6 seconds
        
        //console.log("PUSHING NUMBER "+number);
        list3.push(number);


        i++;
        if(i % 679 == 0){
            //console.log("moduoooo");
            list3.pop();
            console.log("len:: "+list3.size());

        }


    }, 1);