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
    
    //create container of all items where key is item's UID
    this.itemsContainer = {};

    /**
     * push new value into the buffer
     * @param value
     */
    this.push = function (value) {
        //assign value to current item
        this._currentItem.value = value;
        this._currentItem.timestamp = new Date().getTime();

        this.itemsContainer[this._currentItem.UID] = this._currentItem;

        //prepare empty item, that points to the previous
        var emptyItem = new ExpiringLinkedListItem(undefined, null, this._currentItem, this.UID);
        this.UID += 1;

        this._currentItem.next = emptyItem;
        this._currentItem = emptyItem;

        this._len += 1;


    };

    this.pop = function () {

        if (this._len == 0) {
            return false;
        }

        this._currentItem = this._currentItem.back;
        var currentUid = this._currentItem.UID;
        this.deleteItem(currentUid);
        this._currentItem.next = null;


        if (! this.isItemActive(this._currentItem)) {
            for (var uid in this.itemsContainer) {
                //delete all older
                if (this.itemsContainer[uid].UID <= currentUid) {
                    this.deleteItem(uid);
                }
            }
        }

        if (this._len > 0 ) {
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
            if (this._tmpItem !== null && this._tmpItem.next !== null) {
                this._tmpItem.next.back = null;
                return false;
            } else {
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

                for (var uid in this.itemsContainer) {
                    //delete all older
                    if (this.itemsContainer[uid].UID <= uidToDelete) {
                        this.deleteItem(uid);
                    }
                }
                this._tmpItem = null;
            }
        }

        return hasNext;

    };
    /**
     * iterate and get all ACTIVE elements of a buffer
     * @param callback
     */
    this.each = function(callback) {

        //go from the end, since those items are more likely not to be expired
        this._tmpItem = this._currentItem.back;

        while (this.next()) {
            callback(this._read())
        }


    };


    this.deleteItem = function(uid) {

        this.itemsContainer[uid].next.back = null;
        this.itemsContainer[uid].next = null;
        this.itemsContainer[uid] = null;
        delete this.itemsContainer[uid];

        this._len -= 1;

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


        return (time <= endTime);
    };

    this.setExpireTime = function(time) {
        this._defaultTimeout = time;
    };

    this.size = function() {
        return this._len;
    };

    return this;
};