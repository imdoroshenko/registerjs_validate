var register = new Register();

var A = function(greet, user){
    this.say = function(){
        console.log(greet.concat(' ', user.name, '!'));
    };
};

var B = function (Greeter){
    this.greeter = new Greeter();
    this.say = function(){
        this.greeter.say();
    };
};

register.registerClass('Greeter', A);
register.registerClass('Main', B);
register.registerInjection('greet', 'Hello ');
register.registerInjection('user', {name : 'Ivan'});

var main = register.getInstance('Main');

main.say();