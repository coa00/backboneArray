/**
 * Created by aoki on 9/22/14.
 */

(function (Backbone) {
    "use strict";

    //private method
    function fireEvent(self, e, changeEvent) {
        self.trigger(changeEvent, e);
        self.trigger("change", e);

    }

    function setEvent(self, data, changeData) {
        var e = {
            self: null,
            data: null
        };
        if (self) e.self = self;
        if (data) e.data = data;
        if (changeData) e.changeData = changeData;

        return e;
    }

    /**
     * @class add,remove時にイベントを発火するモデル
     * @param obj
     * @constructor
     */
    Backbone.EventObject = function (obj) {
        var _that = this;
        this.attr;


        //private method
        var _init = function (obj) {
            var e;
            _that.attr = _.clone(obj) ? obj : {};
            e = setEvent(_that, obj, obj);
            fireEvent(_that, e, "reset");
            return _that.attr;
        };

        function addJson(obj, json) {
            var keys = [],
                i = 0,
                jsonLength,
                key;
            try {
                keys = getKeyFromJson(json);
                jsonLength = keys.length;

                for (i; i < jsonLength; i++) {
                    key = keys[i];
                    obj[key] = json[key];
                }
                return obj;
            } catch (e) {
                console.log("e", e);
                return false;
            }
        }

        function getKeyFromJson(json) {
            var key, keys = [];
            try {
                for (key in json) {
                    keys.push(key);
                }
            } catch (e) {
                console.log("e", e);
                return false;
            }
            return keys;
        };


        _init(obj);

    };

    var bbEventsObject = {};

    _.extend(bbEventsObject, Backbone.Events);

    //public
    bbEventsObject.length = function () {
        return _.size(this.attr);
    };


    bbEventsObject.get = function (key) {
        return this.attr[key];

    };

    bbEventsObject.unset = function (key) {
        var e;

        if (!key) return false;

        delete this.attr[key];



        e = setEvent(this, this.attr, null);
        fireEvent(this, e, "remove");
        return this.attr;
    };

    bbEventsObject.set = function (key, value) {
        var e;

        if (!key||!value) return false;

        this.attr[key] = value;
        e = setEvent(this, this.attr, value);
        fireEvent(this, e, "add");
        return this.attr;
    };

    bbEventsObject.setObj = function (value) {
        var e;

        if (!value) return false;

        _.extend(this.attr,value);
        e = setEvent(this, this.attr, value);
        fireEvent(this, e, "add");
        return this.attr;
    };


    bbEventsObject.reset = function (json) {
        var e;
        this.attr = json ? _.clone(json) : {};
        e = setEvent(this, this.attr, json);
        fireEvent(this, e, "reset");
        return this.attr;
    };

    bbEventsObject.each = function (iter) {
        _.each(this.attr, iter);
    };


    bbEventsObject.toJSON = function () {
        var json = {};
        for (var key in this.attr) {
            if (this.attr[key]) {
                if (this.attr[key]["toJSON"] !== undefined) {
                    json[key] = this.attr[key].toJSON();
                } else {
                    json[key] = this.attr[key];

                }
            }
        }

        return json;
    };

    bbEventsObject.clear = function () {
        this.attr = {};
        return this.attr;
    };

    Backbone.EventObject.prototype = bbEventsObject;



    var _bbArrayInit = function (array) {

        if (array && array instanceof Array){
            return cloneArray(array);
        }else if (array && !(array instanceof Array)){
            if (window.console){
                console.log("Invalid param");
            }
            return [];
        }else{
            return [];
        }
    }

    /**
     * @param Array
     * @constructor
     */
    Backbone.Array = function (Array) {
        var _that = this;
        this.array;


        this.array = _bbArrayInit(Array);
    };

    var bbArray = {};
    _.extend(bbArray, Backbone.Events);

    /**
     * @returns {number}
     */
    bbArray.length = function () {
        return _.size(this.array);
    };

    bbArray.reset = function (array) {
        var e;

        this.array = _bbArrayInit(array);

        e = setEvent(this, this.array, array);
        fireEvent(this, e, "reset");
        return this.array;
    };

    bbArray.set = function (index, data) {
        var e;
        if (!this.array[index]) {
            return false;
        }
        this.array[index] = data;
        e = setEvent(this, this.array, data);
        fireEvent(this, e, "update");
        return this.array;
    };

    bbArray.splice = function (begin, end) {
        var e;
        var data;
        var begin = begin, end = end;

        (end) || (end = begin);

        data = this.array.splice(begin, end);
        e = setEvent(this, this.array, data);
        fireEvent(this, e, "delete");
        return this.array;
    };

    bbArray.push = function (data) {
        var e;
        this.array.push(data);
        e = setEvent(this, this.array, data);
        fireEvent(this, e, "add");

        return this.array;
    };

    bbArray.get = function (index) {
        return this.array[index] || undefined;
    };

    bbArray.pop = function () {
        var e;
        this.array.pop();
        e = setEvent(this, this.array);
        fireEvent(this, e, "delete");
        return this.array;
    };

    bbArray.each = function (iter) {

        if (!iter) return false;

        _.each(this.array, iter);
    };

    bbArray.swap = function (indexA, indexB) {
        var e;
        var itemA = this.array[indexA];
        var itemB = this.array[indexB];

        if (!itemA || !itemB) return false;

        this.array[indexA] = itemB;
        this.array[indexB] = itemA;

        e = setEvent(this, this.array, [indexA, indexB]);
        fireEvent(this, e, "swap");
        return this.array;
    };

    bbArray.toJSON = function () {
        var json = [];
        var i = 0;

        for (i; i < this.array.length; i++) {

            if (this.array[i]["toJSON"] !== undefined) {
                json.push(this.array[i].toJSON());
            } else {
                json.push(this.array[i]);
            }
        }
        return json;
    };

    bbArray.getRowArray = function () {
        return this.array;
    };

    //private method
    function fireEvent(self, e, changeEvent) {
        self.trigger(changeEvent, e);
        self.trigger("change", e);

    }

    Backbone.Array.prototype = bbArray;


    function cloneArray(arr) {
        var newarr = [];
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                newarr[i] = cloneArray(arr[i]);
            } else {
                newarr[i] = _.clone(arr[i]);
            }
        }
        return newarr;
    }

    function setEvent(self, data, changeData) {
        var e = {};
        if (self) e.self = self;
        if (data) e.data = data;
        if (changeData) e.changeData = changeData;

        return e;
    }
}(Backbone));
