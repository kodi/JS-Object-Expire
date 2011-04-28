
var ExpiringMap = require('../../../src/lib/ExpiringMap.js').ExpiringMap;
var http        = require('http');
var fs          = require('fs');
var urlParser   = require('url');

var port = 8080;
var DEFAULT_TIMEOUT = 15;

//initialize map
var activeUsers = new ExpiringMap();

http.createServer(function (req, res) {

    dispatch(req, res);

}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');


var dispatch = function(request, response){

    //create unique user id from users remote address and remote port
    var uniqueId = request.socket.remoteAddress +":"+ request.socket.remotePort;
    var userIp = request.socket.remoteAddress;

    var urlObject = urlParser.parse(request.url, true);
    var url = urlObject.pathname;

    console.log("Request From: "+uniqueId+"\t\t URL:"+url);

    //serve static page 
    if(url == '/'){
        response.writeHead(200, {'Content-Type': 'text/html'});

        //serve static html file
        fs.readFile('index.html', function (err, data) {
            if (err) throw err;
            response.end(data);
        });

    }else if(url=='/update'){
        var value = urlObject.query.value;

        if(typeof(value) != 'undefined'){
            activeUsers.putOrUpdate(uniqueId, {user:uniqueId, valueClicked:value}, DEFAULT_TIMEOUT);
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(generateOutputHtml());

    }

};


var generateOutputHtml = function(){

    var validKeys = activeUsers.getKeyList();
    var HTML = '<ul>';

    for(var i = 0; i < validKeys.length; i++){
        var user = activeUsers.get(validKeys[i]);
        HTML += '<li>User: '+user.user+' clicked '+user.valueClicked+' button</li>';
    }

    HTML += '</ul>';
    return HTML;
};







