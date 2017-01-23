var _LazyMan = function(name) {
    this.tasks = [];
    var self = this;
    var fn = function() {
        console.log('hi this is ' + name);
        self.next();
    };
    this.tasks.push(fn);
    setTimeout(function() {
        self.next();
    }, 0);
};
_LazyMan.prototype.next = function() {
    var fn = this.tasks.shift();
    fn && fn();
};
_LazyMan.prototype.eat = function(food) {
    var self = this;
    var fn = function() {
        console.log('eat ' + food + ' ~');
        self.next();
    };
    this.tasks.push(fn);
    return this;
};
_LazyMan.prototype.sleep = function(time) {
    var self = this;
    var fn = function() {
        setTimeout(function() {
            console.log('Wake up after ' + time);
            self.next();
        }, time * 1000);
    }
    this.tasks.push(fn);
    return this;
};
_LazyMan.prototype.sleepFirst = function(time) {
    var self = this;
    var fn = function() {
        setTimeout(function() {
            console.log('Wake up after ' + time);
            self.next();
        }, time * 1000);
    }
    this.tasks.unshift(fn);
    return this;
};
var LazyMan = function(name) {
    return new _LazyMan(name);
};
LazyMan('hank').sleepFirst(2).eat('dinner');
// 实现一个LazyMan，可以按照以下方式调用:
// LazyMan(“Hank”)输出:
// Hi! This is Hank!

// LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
// Hi! This is Hank!
// //等待10秒..
// Wake up after 10
// Eat dinner~

// LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~

// LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
// //等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper

// 以此类推。
