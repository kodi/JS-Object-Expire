var ExpiringMap = function(initObject) {

    this._objectContainer = {};
    
    this._defaultTimeout = 60;

    this.init(initObject);
};


ExpiringMap.prototype.init = function (initObject) {

    //set default timeout
    if(initObject && typeof(initObject.defaultTimeout) != 'undefined' ){
        this._defaultTimeout = initObject.defaultTimeout;
    }
};


ExpiringMap.prototype.put = function(name, objectToStore, timeout) {

    var objectTimeout = this._defaultTimeout;

    var created = new Date().getTime();

    if(typeof(timeout) != 'undefined'){
        objectTimeout = timeout;
    }

   var endTime = created + (objectTimeout * 1000);


    this._objectContainer[name] = {
        content: objectToStore,
        createdTimeStamp: created,
        timeout : objectTimeout,
        endTime: endTime
    };
    return true;
};


ExpiringMap.prototype.get = function(name) {

    if(typeof(this._objectContainer[name]) != 'undefined'){

        var obj = this._objectContainer[name];

        var time = new Date().getTime();

        if(time <= obj.endTime){
            return obj.content;
        }else{
            delete this._objectContainer[name];
            return false;
        }
    }else{
        return false;
    }


};