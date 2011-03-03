Javascript Object Expire
========================

Time aware data structures.

For now Expiring Map is supported.


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
    var map = new ExpiringMap({defaultTimeout:20}); //in seconds

Or you can specify timeout for each key individually:
    map.put("foo",{someNumber:321}, 600); //expire key foo after 600 seconds


##### On Expire Callbacks

Also you can define callback for each key

    map.put("foo",{someNumber:321}, 30, function(key, data){
        console.log("key "+key+" has expired, data was:");
        console.log(data);    
    });

Callback will be executed when we call get method for this key again after expiration time
    map.get("foo");

    //this will trigger callback on key foo

Or when we call getKeyList after expiration time
    map.getKeyList();

    //this will trigger callbacks on all expired keys


### [ExpiringMap Documentation](https://github.com/kodi/JS-Object-Expire/wiki/ExpiringMap)