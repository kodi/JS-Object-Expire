var ExpiringMap = function(initObject) {

    this._objectContainer = {};

    this._defaultTimeout = 60;

    this.init(initObject);
};


ExpiringMap.prototype.init = function (initObject) {

    //set default timeout
    if (initObject && typeof(initObject.defaultTimeout) != 'undefined') {
        this._defaultTimeout = initObject.defaultTimeout;
    }
};


ExpiringMap.prototype.put = function(name, objectToStore, timeout) {

    if (this.isKeyActive(name) === false) {

        var objectTimeout = this._defaultTimeout;

        var created = new Date().getTime();

        if (typeof(timeout) != 'undefined') {
            objectTimeout = timeout;
        }

        var endTime = created + (objectTimeout * 1000);


        this._objectContainer[name] = {
            content: objectToStore,
            createdTimestamp: created,
            modifiedTimestamp : created,
            timeout : objectTimeout,
            endTime: endTime
        };
        return true;
    } else {
        return false;
    }
};


ExpiringMap.prototype.get = function(name) {

    if (this.isKeyActive(name, true)) {
        return this._objectContainer[name];
    }
};

ExpiringMap.prototype.isKeyActive = function(name, modify) {

    if (typeof(this._objectContainer[name]) != 'undefined') {

        var obj = this._objectContainer[name];

        var time = new Date().getTime();

        if (time <= obj.endTime) {
            if (typeof(modify) != 'undefined' && modify === true) {
                obj.modifiedTimestamp = time;
            }
            return true;
        } else {
            delete this._objectContainer[name];
            return false;
        }
    } else {
        return false;
    }
};

ExpiringMap.prototype.getAccessed = function(key) {
    if (this.isKeyActive(key)) {
        return this._objectContainer[key].modifiedTimestamp;
    }
};

ExpiringMap.prototype.getKeyList = function() {

    var list = [];

    for (var key in this._objectContainer) {
        console.log(key);
        if (this.isKeyActive(key)) {
            list.push(key);
        }
    }
    return list;
};

ExpiringMap.prototype.getInfo = function(key) {
    if (this.isKeyActive(key)) {

        var obj = this._objectContainer[key];

        return {expired:false,
            info:{createdTimestamp: obj.createdTimestamp,
                modifiedTimestamp: obj.modifiedTimestamp,
                timeout: obj.timeout,
                endTime: obj.endTime}}
    } else {
        return {expired:true,info:null};
    }
};

ExpiringMap.prototype.containsKey = function(key) {
    return this.isKeyActive(key);
};

ExpiringMap.prototype.remove = function(key) {
    if (this.isKeyActive(key)) {
        delete this._objectContainer[key];
        return true;
    } else {
        return false;
    }
}