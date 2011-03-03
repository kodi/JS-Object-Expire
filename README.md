Javascript Object Expire
========================

ExpiringMap
-----------

ExpiringMap is used when we want to store self-expiring objects.

### Example

First we initialize object holder
    var map = new ExpiringMap();

Then we put two objects in it:

    map.put("foo",{someNumber:321});
    map.put("bar",{someString:"test string"});

and if within next 60 seconds we try to get key foo:
    map.get("foo");

    //returns {someNumber:321}

if we wait longer than 60 seconds (default expire time)

    map.get("foo");
    
    //returns false

You can also specify default object timeout on init:
    var map = new ExpiringMap(30); //in seconds

Or you can specify timeout for each key individually:
    map.put("foo",{someNumber:321}, 600); //expire key foo after 600 seconds


### Map Methods

#### put(key, object, timeout)

* key - name under this object will be stored
* object - object to store
* timeout - [optional] expiration timeout (in seconds), if not provided default timeout will be used

returns true on successful input or false if key already exists


#### get(key)

* key - name under object is stored

returns stored object or false if key doesn't exists

#### remove(key)

* key - key to be removed

returns true if successfully removed or false if object has already expired or it didn't existed in the map

#### getAccessed(key)

* key - name under object is stored

returns last accessed timestamp for this key

#### getKeyList()

returns array of currently active keys, or empty array if there is no active keys left

#### getInfo(key)

* key - name of object

returns object with information about stored object


for expired object it will return:
    {
        expired: true,
        info: null
    }

for active object if will return:
    {
        expired: false,
        info: {
            createdTimestamp: 1299118422871,
            endTime: 1299118482871,
            modifiedTimestamp: 1299118422871,
            timeout: 60
        }
    }

where:

* createdTimestamp - timestamp when this key is created
* endTime - timestamp after which object under this key will expire
* modifiedTimestamp - last accessed timestamp
* timeout - key timeout in seconds
