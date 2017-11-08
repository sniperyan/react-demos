
import React, { Component } from 'react';

function shallowCopy(src) {
    var dst = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            dst[prop] = src[prop];
        }
    }
    return dst;
}

var cloneDeep = function(obj){
    var newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return obj;
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneDeep(obj[i]) : obj[i]; 
        }
    }
    return newobj;
};


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }

    }

    render() {
        /**
         * 因为浅复制只会将对象的各个属性进行依次复制，并不会进行递归复制，
         * 而 JavaScript 存储对象都是存地址的，所以浅复制会导致 copy1.arr 和 copy2.arr 
         * 指向同一块内存地址
         */
        function t (a,arr){
            this.a = a;
            this.arr = arr;

        }
        t.prototype.func = function(){
            console.log('just test')
        }
        var obj = new t(1,[2,3,{'ran':[1,2,3]}]);
        var copy1 = shallowCopy(obj)
        var copy2 = shallowCopy(obj)
        console.log(copy1 ===copy2) //false
        console.log(copy1.arr ===copy2.arr) //true
        //这就是浅拷贝

        var copy3 = {...obj}
        var copy4 = {...obj}
        console.log(copy3 ===copy4) //false
        console.log(copy3.arr ===copy4.arr) //true
        //这也是浅拷贝
        var copy5 = Object.assign({},obj);
        var copy6 = Object.assign({},obj);
        console.log(copy5 ===copy6) //false
        console.log(copy5.arr ===copy6.arr) //true
        //这还是浅拷贝

        //下面json序列化解决
        var copy7 = JSON.parse( JSON.stringify(obj) );
        var copy8 = JSON.parse( JSON.stringify(obj) );
        console.log(copy7 ===copy8) //false
        console.log(copy7.arr ===copy8.arr) //false
        console.log(copy7.arr[2].ran ===copy8.arr[2].ran) //false
        //貌似序列化能解决
        console.log(obj.func)
        console.log(copy1.func) //undefined
        console.log(copy2.func) //undefined
        console.log(copy3.func) //undefined
        console.log(copy4.func) //undefined
        console.log(copy5.func) //undefined
        console.log(copy6.func) //undefined
        console.log(copy7.func) //undefined
        console.log(copy8.func) //undefined

        var copy9 =cloneDeep(obj)
        var copy10 =cloneDeep(obj)
        console.log(copy9 ===copy10) //false
        console.log(copy9.arr ===copy10.arr) //false
        console.log(copy9.arr[2].ran ===copy10.arr[2].ran) //false
        console.log(copy9.func) //f
        console.log(copy10.func) //f
        




        return (
            <div className="App">
                hello world!
      </div>
        );
    }
}

export default App;