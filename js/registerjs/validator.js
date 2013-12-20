var validator = {
    global : window,
    acceptedTypes : { //Alias for better performance (no need to use .toLowerCase)
        Undefined :	'undefined',
        undefined :	'undefined',
        Null : 'object',
        null : 'object',
        Boolean	: 'boolean',
        boolean	: 'boolean',
        Number : 'number',
        number : 'number',
        String : 'string',
        string : 'string',
        Function : 'function',
        function : 'function'
    },
    validate : function(value, rule){
        if(!(rule && rule.type)){
            return;
        }else if(this.acceptedTypes[rule.type.name] && typeof value === this.acceptedTypes[rule.type.name]){
            return;
        }else{
            var type = this.extract(rule.type.name);
            if(!type){
                throw new Error(rule.name + ' unknown type: ' + rule.type.name);
            }else if(typeof value === 'function' && value === type){
                return;
            }else if(value instanceof type){
                return;
            }
        }
        throw new Error(rule.name + ' expected type: ' + rule.type.name);
    },
    extract : function(str){
        try{
            var target = this.global;
            str.split('.').forEach(function(scope){
                target = target[scope];
            });
            return target;
        }catch(e){
            return undefined;
        }
    }
};