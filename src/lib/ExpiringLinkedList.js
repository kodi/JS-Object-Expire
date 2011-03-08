var ExpiringLinkedListItem = function (value, next, back, uid) {
    this.next = next;
    this.value = value;
    this.back = back;
    this.UID = uid;
    this.timestamp = new Date().getTime();
    return this;
};


var ExpiringLinkedList = function (timeout, metaData) {

    this._len = 0;
    this._meta = metaData;
    this._tmpItem = undefined;
    this.UID = 1;
    this._defaultTimeout = 60; // seconds

    if (typeof(timeout) != 'undefined') {
        this._defaultTimeout = timeout;
    }

    //create one empty item
    this._currentItem = new ExpiringLinkedListItem(undefined, null, null, this.UID);
    this.UID += 1;
    //nice to have - first item pointer
    this._firstItem = this._currentItem;

    this.documentContainer = {};

    /**
     * push new value into the buffer
     * @param value
     */
    this.push = function (value) {
        //assign value to current item
        this._currentItem.value = value;
        this._currentItem.timestamp = new Date().getTime();

        this.documentContainer[this._currentItem.UID] = this._currentItem;

        //prepare empty item, that points to the previous
        var emptyItem = new ExpiringLinkedListItem(undefined, null, this._currentItem, this.UID);
        this.UID += 1;

        this._currentItem.next = emptyItem;
        this._currentItem = emptyItem;

        this._len += 1;



    };
    /**
     *  we use this function on initial load, to save existing timestamps
     * @param entry
     */
    this.loadPush = function (entry) {
        var value = entry.value || undefined;
        var timestamp = entry.timestamp || undefined;

        this._currentItem.value = {"value":value,"timestamp":timestamp};
        this._currentItem = this._currentItem.next;
    };

    this.pop = function () {

        var allExpired = false;

        if (this._len == 0) {
            return false;
        }

        this._currentItem = this._currentItem.back;
        this._currentItem.next = null;

        this._len -= 1;


        //invalidate expired items
        while (this.isItemActive(this._currentItem) === false && this._len > 0) {

            this._currentItem = this._currentItem.back;
            this._currentItem.next = null;
            this._len -= 1;


            if (this._len == 0) {
                allExpired = true;
            }
        }


        if (this._len >= 0 && !allExpired) {
            return this._currentItem.value;
        } else {
            return false;
        }

    };

    this._read = function() {
        var value = this._tmpItem.value;
        this._tmpItem = this._tmpItem.back;
        return value;
    };
    /**
     *  iterator
     */
    this.next = function() {


        if (this._len == 0) {
            if(this._tmpItem !== null && this._tmpItem.next !== null ){
                this._tmpItem.next.back = null;
                return false;
            }else{
                return false;
            }
        }

        var hasNext = false;


        if (this.isItemActive(this._tmpItem)) {
            hasNext = true;
        } else {
            // if this item is not active, delete all older
            while (this._tmpItem !== null) {
                var uidToDelete = this._tmpItem.UID;
                /**
                if (this._tmpItem.back == null) {
                    this._tmpItem = null;
                    if (this._len > 0) {
                        this._len -= 1;
                    }
                    break;
                } else {
                    this._tmpItem = this._tmpItem.back;
                    this._tmpItem.next.back = null;
                    this._tmpItem.next = null;
                    this._len -= 1;
                }

                 */

                for(var uid in this.documentContainer ){

                    if(this.documentContainer[uid].UID <= uidToDelete){
                        this.documentContainer[uid] = null;
                        delete this.documentContainer[uid];
                    }
                }

                this._tmpItem = null;

            }


        }

        return hasNext;

    };
    /**
     * iterate and get all elements of buffer
     * @param callback
     */
    this.each = function(callback) {

        //go from the end, since those items are more likely not to be expired
        this._tmpItem = this._currentItem.back;

        while (this.next()) {
            callback(this._read())
        }


    };

    this.getMetaData = function() {
        return this._meta;
    };


    this.isItemActive = function(item) {

        if (item === null) {
            return false;
        }

        var time = new Date().getTime();

        var endTime = item.timestamp + (this._defaultTimeout * 1000);


        if (time >= endTime) {
            return false;
        } else {
            return true;
        }

    };

    this.setExpireTime = function(time){
        this._defaultTimeout = time;
    }

    return this;
};