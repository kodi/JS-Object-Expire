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


### Methods

#### Put(key, object, timeout)
*key - name under this object will be stored
*object - object to store
*timeout - [optional] expiration timeout (in seconds), if not provided default timeout will be used

returns true on successful input or false if key already exists

 