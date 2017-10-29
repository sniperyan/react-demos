import { createStore } from '../redux';
import React, { Component } from 'react';

/**
 * enhancer 方法接受一个方法originF， 返回一个增强的方法EF。 
 * 对EF我们可以再次 增强，所以这里是可以链式调用的
 * @param {*} originF 
 */
var aEnhancer = function (originF) {
    return function EF(...args) {
        console.log('this is aEnhancer before')
        var r = originF(...args)
        console.log('this is aEnhancer after')
        return r
    }
}

var bEnhancer = function (originF) {
    return function (...args) {
        console.log('this is bEnhancer before')
        var r = originF(...args)
        console.log('this is bEnhancer after')
        return r
    }
}

var cEnhancer = function (originF) {
    return function (...args) {
        console.log('this is cEnhancer before')
        var r = originF(...args)
        console.log('this is cEnhancer after')
        return r
    }
}

function print(a) {
    console.log(`print...${a}`)
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }

    }

    render() {

        //写法1
        //aEnhancer(bEnhancer(cEnhancer(print)))('Hello World!!')
        //写法2
        var enhancerArray = [cEnhancer, bEnhancer, aEnhancer]
        function enhancerFun(originF) {
            let of = originF
            enhancerArray.forEach(enhancer => {
                of = enhancer(of)
            })
            return of
        }
        //enhancerFun(print)('Hello World!!')
        //写法3 巧妙的使用了数组的reduce方法 从右到左把接收到的函数合成后的最终函数。
        var enhancerArray2 = [aEnhancer, bEnhancer, cEnhancer]
        function enhancerFun2(originF) {
            return enhancerArray2.reduce((a, b) => (...args) => a(b(...args)))(originF)
        }
        enhancerFun2(print)('Hello World!!')


        return (
            <div className="App">
                hello world!
      </div>
        );
    }
}

export default App;