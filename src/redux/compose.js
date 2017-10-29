/**
 * compose 做的只是让你在写深度嵌套的函数时，避免了代码的向右偏移
 * 巧妙的使用了数组的reduce方法
 * compose可以理解为倒叙一层层打包的过程
 * @param {*} funcs 
 */
export default function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}