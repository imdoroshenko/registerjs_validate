var Register = function(){
    this.classes = {};
    this.injections = {};
};
Register.prototype = {
    registerClass : function(name, func, injections){
        this.classes[name] = this.injections[name] = new RegisterClass(func, injections, this.injections);
        return this;
    },
    registerInjection : function(name, value){
        this.injections[name] = value;
        return this;
    },
    clearInjections : function(){
        for(var name in this.injections){
            delete this.injections[name];
        }
        return this;
    },
    getInstance : function(name){
        return this.classes[name].getInstance();
    }
};

var RegisterClass = function(func, injections, globalInjections){
    this.static = RegisterClass;
    this.func = func;
    this.ownInjections = injections||{};
    this.globalInjections = globalInjections||{};
    this.args = this.extractArgs();
};
RegisterClass.prototype = {
    FN_ARGS : /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT : /\s*,\s*/,
    global : window,
    extractArgs : function(){
        return this.func.toString().match(this.FN_ARGS)[1].split(this.FN_ARG_SPLIT);
    },
    getInstance : function(){
        return new (this.getConstructor());
    },
    getConstructor : function(){
        return (Function.prototype.bind.apply(this.func, [null].concat(this.extractInjections())))
    },
    extractInjections : function(){
        var extractedInjections = [];
        for(var i = 0, ln = this.args.length, entity; i < ln; i++){
            var name = this.args[i];
            entity = this.ownInjections[name]||this.globalInjections[name];
            if(entity instanceof this.static){
                entity = entity.getConstructor();
            }
            extractedInjections.push(entity);
        }
        return extractedInjections;
    }
};