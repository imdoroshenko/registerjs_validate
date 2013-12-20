var RegisterClass = function(func, injections, globalInjections){
    this.static = RegisterClass;
    this.func = func;
    this.ownInjections = injections||{};
    this.globalInjections = globalInjections||{};
    var source = this.func.toString();
    this.args = this.extractArgs(source);
    this.notations = this.extractNotation(source);
};
RegisterClass.prototype = {
    FN_ARGS : /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT : /\s*,\s*/,
    global : window,
    FN_NOTATIONS_EXTRACT : /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/m,
    extractNotation : function(source){
        var regResult = this.FN_NOTATIONS_EXTRACT.exec(source);
        var notations = regResult? doctrine.parse(regResult[0], {unwrap:true}).tags : [];
        var nameMap = {};
        for(var i = notations.length; i-- > 0;){
            if(notations[i].name){
                nameMap[notations[i].name] = notations[i];
            }
        }
        return nameMap;
    },
    extractArgs : function(source){
        return source.match(this.FN_ARGS)[1].split(this.FN_ARG_SPLIT);
    },
    getInstance : function(){
        return new (this.getConstructor());
    },
    getType : function(){
        return this.func;
    },
    getConstructor : function(){
        return (Function.prototype.bind.apply(this.func, [null].concat(this.extractInjections())))
    },
    extractInjections : function(){
        var extractedInjections = [];
        for(var i = 0, ln = this.args.length, entity; i < ln; i++){
            var name = this.args[i], valueToValidate;
            valueToValidate = entity = this.ownInjections[name]||this.globalInjections[name]||validator.extract(name);
            if(entity instanceof this.static){
                valueToValidate = entity.getType();
                entity = entity.getConstructor();
            }
            validator.validate(valueToValidate, this.notations[name]);
            extractedInjections.push(entity);
        }
        return extractedInjections;
    }
};