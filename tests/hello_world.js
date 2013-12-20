var register = new Register();

var A = function(greet, user){
    /**
     * @param {String} greet
     * @param {Object} user
     */
    this.greet = greet;
    this.user = user;
};
A.prototype.say = function(){
    console.log(this.greet.concat(' ', this.user.name, '!'));
};
var B = function (Greeter){
    /**
     * @param {A} Greeter
     */
    this.greeter = new Greeter();
};
B.prototype.greet = function(){
    this.greeter.say();
};

register.registerClasses(
    ['Greeter', A],
    ['Main', B]
);
register.registerInjections({
    greet : 'Hello ',
    user : {name : 'Ivan'}
});
var main = register.getInstance('Main');
main.greet();