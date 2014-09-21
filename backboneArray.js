(function(Backbone){
    Backbone.Object = function(obj)
    {
        this.obj;

        _.extend(this,Backbone.Events);

        this.length = function()
        {
            return _.size(this.obj);
        }

        this.init  = function(obj)
        {
            var e;
            this.obj = (obj) ? obj: {};
            e = setEvent(this,obj,obj);
            fireEvent(this,e,"reset");
            return this.obj;
        }


        this.set = function (json)
        {
            var e;
            addJson(this.obj,json);
            e = setEvent(this,this.obj,json);
            fireEvent(this,e,"add");
            return this.obj;
        };
        function addJson(obj,json)
        {
            var keys= [],
                i = 0,
                jsonLength,
                key;
            try {
                keys = getKeyFromJson(json);
                jsonLength = keys.length;

                for (i;i<jsonLength;i++)
                {
                    key = keys[i];
                    obj[key] = json[key];
                }
                return obj;
            }catch (e)
            {
                console.log("e",e);
                return false;
            }
        }
        function getKeyFromJson(json)
        {
            var key,keys=[];
            try {
                for (key in json)
                {
                    keys.push(key);
                }
            }catch (e){
                console.log("e",e);
                return false;
            }
            return keys;
        };

//        this.pop = function(){
//            this.array.pop();
//        }
//
//        this.swap = function(indexA,indexB)
//        {
//            var indexA = this.array[indexA];
//            var indexB = this.array[indexB];
//
//            if (indexA && indexB)
//            {
//                this.array[indexA] = indexB;
//                this.array[indexB] = indexA;
//            }
//            this.trigger("change",this);
//            return this;
//        }

        this.init(obj);

    };

    Backbone.Array = function(Array)
    {
        var self = this;
        this.array;
        _.extend(this,Backbone.Events);

        this.init  = function(Array)
        {
            this.array = (Array) ? Array: [];
            return this.array;
        }


        this.push = function (data)
        {
            var e ;
            this.array.push(data);
            e = setEvent(this,this.array,data);
            fireEvent(this,e,"add");

            return this.array;
        };

        this.pop = function(){
            var e;
            this.array.pop();
            e = setEvent(this,this.array);
            fireEvent(this,e,"delete");
            return this.array;
        }

        this.swap = function(indexA,indexB)
        {
            var e;
            var indexA = this.array[indexA];
            var indexB = this.array[indexB];

            if (indexA && indexB)
            {
                this.array[indexA] = indexB;
                this.array[indexB] = indexA;
            }

            e = setEvent(this,this.array,[indexA,indexB]);
            fireEvent(this,e,"swap");
            return this.array;
        }

        this.init(Array);
    };

    //private method
    function fireEvent(self,e,changeEvents){
        _.each(changeEvents,function(i,item){
            (item)||self.trigger(item,e);
        });
        self.trigger("change",e);

    }

    function setEvent(self,data,changeData){
        var e;
        (self)|| (e.self = self);
        (data)||(e.data = data);
        (changeData)||(e.changeData = changeData);
        return e;
    }
}(Backbone));