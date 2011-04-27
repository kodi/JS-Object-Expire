var map = new ExpiringMap();


var EXPIRE_TIME = 5;
var COUNT = 0;
var PLACEMENT = 'random';


setInterval(function() {

    COUNT += 0.1;

    //generate key and object to store in map
    var key = "key_" + Math.round(COUNT * 10);
    var objectToStore = generateObject(COUNT);

    //store new object
    map.put(key, objectToStore, EXPIRE_TIME);


    //get valid keys from the map, and redraw the chart
    redrawDots();

}, 100);


var redrawDots = function() {

    data = [];
    var keys = map.getKeyList();
    var timestamp = new Date().getTime();

    for (key in keys) {
        var keyName = keys[key];
        var tmpData = map.getWithMetadata(keyName);
        tmpData.content.z = (tmpData.endTime - timestamp) / (EXPIRE_TIME * 1000) * 100;
        data.push(tmpData.content);
    }

    var dumpData = map.dumpData();
    $("#dump").html(dumpData);
    vis.render();
};

var generateObject = function(counter) {

    if (PLACEMENT == 'circle') {

        return {x:(Math.sin(counter)) / 2.5 + 0.5,  y:(Math.cos(counter)) / 2.5 + 0.5, z: null };

    } else if (PLACEMENT == 'random') {

        return {x:Math.random(),  y:Math.random(), z: null };

    }

};


$(document).ready(function() {

    $('#expire').html(EXPIRE_TIME);

    $('#slider').slider({
        value: EXPIRE_TIME * 10,
        orientation: "horizontal",
        range: "min",
        animate: true,
        change:function(event, ui) {
            EXPIRE_TIME = (ui.value / 10);
            $('#expire').html(ui.value / 10);
        }
    });

    
    $('.placement_type').click(function() {
        PLACEMENT = this.value;
    });

});