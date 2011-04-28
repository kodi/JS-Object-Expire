/*
Copyright (C) 2011 by Dragan Bajcic | http://bajcic.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE
*/


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

/**
 *
 * @param name
 * @param objectToStore
 * @param timeout
 */
ExpiringMap.prototype.put = function(name, objectToStore, timeout, callback) {

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
            callback: callback,
            endTime: endTime
        };

        return true;
    } else {
        return false;
    }
};

ExpiringMap.prototype.putOrUpdate = function(name, objectToStore, timeout, callback){



    
    if(this.isKeyActive(name)){

        var currentTimestamp = new Date().getTime();

        this._objectContainer[name].content  = objectToStore;
        this._objectContainer[name].modifiedTimestamp = currentTimestamp;
        this._objectContainer[name].endTime = currentTimestamp + (this._objectContainer[name].timeout * 1000);

    }else{
        return this.put(name, objectToStore, timeout, callback);
    }
};

/**
 *
 * @param name
 */

ExpiringMap.prototype.get = function(name) {

    if (this.isKeyActive(name, true)) {
        return this._objectContainer[name].content;
    } else {
        return false;
    }
};


ExpiringMap.prototype.getWithMetadata = function(name) {

    if (this.isKeyActive(name, true)) {
        return this._objectContainer[name];
    } else {
        return false;
    }
};

/**
 *
 * @param name
 * @param modify
 */
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

            if (typeof(obj.callback) != 'undefined') {
                obj.callback(name, obj.content);
            }

            delete this._objectContainer[name];
            return false;
        }
    } else {
        return false;
    }
};

/**
 *
 * @param key
 */
ExpiringMap.prototype.getAccessed = function(key) {
    if (this.isKeyActive(key)) {
        return this._objectContainer[key].modifiedTimestamp;
    }
};

/**
 *
 */
ExpiringMap.prototype.getKeyList = function() {

    var list = [];

    for (var key in this._objectContainer) {
        if (this.isKeyActive(key)) {
            list.push(key);
        }
    }
    return list;
};


/**
 *
 * @param key
 */
ExpiringMap.prototype.getInfo = function(key) {
    if (this.isKeyActive(key)) {

        var obj = this._objectContainer[key];

        return {expired:false,
            info:{
                createdTimestamp: obj.createdTimestamp,
                modifiedTimestamp: obj.modifiedTimestamp,
                timeout: obj.timeout,
                endTime: obj.endTime
            }
        }
    } else {
        return {expired:true,info:null};
    }
};

/**
 *
 * @param key
 */
ExpiringMap.prototype.containsKey = function(key) {
    return this.isKeyActive(key);
};

/**
 * @param key
 */
ExpiringMap.prototype.remove = function(key) {
    if (this.isKeyActive(key)) {
        delete this._objectContainer[key];
        return true;
    } else {
        return false;
    }
};

ExpiringMap.prototype.dumpData = function() {
    var out = "";
    for (var key in this._objectContainer) {

        out += "{\"key\":\""+key+"\",\"created\":"+this._objectContainer[key].createdTimestamp+", \"data\":"+JSON.stringify(this._objectContainer[key].content) + "}\n";
    }

    return out;

}


var exports = exports || {};
exports.ExpiringMap = ExpiringMap;