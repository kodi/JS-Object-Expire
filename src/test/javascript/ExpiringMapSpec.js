describe('ExpiringMap', function () {

    var map = new ExpiringMap();

    var KEY = "foo";
    var OBJECT_KEY = "someNumber";
    var VALUE = 25;


    it('can add a object', function () {

        var objectToStore = {};
        objectToStore[OBJECT_KEY] = VALUE;

        var result = map.put(KEY, objectToStore);

        expect(result).toEqual(true);

    });

    it('can retrieve right value', function () {
        var result = map.get(KEY);
        expect(result[OBJECT_KEY]).toEqual(VALUE);
    });



    it('returns contains key', function(){
        var result = map.containsKey(KEY);
        expect(result).toEqual(true);

    });



    it('can return key set', function(){
        var result = map.getKeyList();
        expect(result.pop()).toEqual(KEY);

    });


    it('can expire properly ', function(){

        //put key, expect true for response
        runs(function () {

            if(map.containsKey(KEY)){
                map.remove(KEY);
            }

            var objectToStore = {};
            objectToStore[OBJECT_KEY] = VALUE;
            var result = map.put(KEY, objectToStore, 1);
            expect(result).toEqual(true);
        });


        //test get
        runs(function () {
            var result = map.get(KEY);
            expect(result[OBJECT_KEY]).toEqual(VALUE);
        });

        //wait for 1 seconds
        waits(1001);


        //test get again, now it should return false
        runs(function () {
            var result = map.get(KEY);
            expect(result).toEqual(false);
        });

    });

    it('can remove key', function(){
        //put key, expect true for response
        runs(function () {

            if(map.containsKey(KEY)){
                map.remove(KEY);
            }
            var objectToStore = {};
            objectToStore[OBJECT_KEY] = VALUE;
            var result = map.put(KEY, objectToStore, 2);
            expect(result).toEqual(true);
        });


        runs(function () {
            var result = map.remove(KEY);
            expect(result).toEqual(true);
        });



    });


});