var ExpiringList = require('../../src/lib/ExpiringLinkedList.js').ExpiringLinkedList;


var expiringList = new ExpiringList(5);

var i = 0;

setInterval(function() {

    // get random number
    var number = getRandomInt(0, 100);

    // push it to the list, and forget about it
    // it will expire after 5 seconds
    expiringList.push(number);


    i++;
    if (i % 497 == 0) {
        expiringList.pop();

        // after 5 seconds this number should remain more or less constant
        //slight variations are possible on machines that have their CPU utilized

        console.log("List length: " + expiringList.size());

    }

}, 10);


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*

 here is output on my MBP Laptop

 List length: 496
 List length: 498
 List length: 497
 List length: 489
 List length: 498
 List length: 498
 List length: 499
 List length: 499
 List length: 498
 List length: 498
 List length: 498
 List length: 499
 List length: 499
 List length: 499

 */