/**
 * combineReducers() 所做的只是生成一个函数，这个函数来调用你的一系列 reducer，
 * 每个 reducer 根据它们的 key 来筛选出 state 中的一部分数据并处理，
 * 然后这个生成的函数再将所有 reducer 的结果合并成一个大的对象。没有任何魔法。
 * 正如其他 reducers，如果 combineReducers() 中包含的所有 reducers 都没有更改 state，
 * 那么也就不会创建一个新的对象。
 * @param {*} reducers  需要合并reducer的一个对象
 */
export default function combineReducers(reducers){
    //源码里检查了对象的key-value，value不是undefined并且为function
    //assertReducerShape 对reducer的初始state进行检查
    return function combination(state={},action){
        const finalReducerKeys = Object.keys(reducers)
        let hasChanged = false
        const nextState = {}
        finalReducerKeys.forEach(key=>{
            const reducer = reducers[key]
            const previousStateForKey = state[key]
            const nextStateForKey = reducer(previousStateForKey, action)
            nextState[key] = nextStateForKey
            /**
             * nextStateForKey !== previousStateForKey 浅比较
             * 如果reducer直接改变对象的属性而不是返回一个新对象，那么hasChanged将为false，
             * 导致执行完reducer将返回旧的state，页面可能不会刷新
             * 这就是为什么Redux需要reducers是纯函数的原因:
             * 
             * 比较两个Javascript对象所有的属性是否相同的的唯一方法是对它们进行深比较。
             * 但是深比较在真实的应用当中代价昂贵，因为通常js的对象都很大，同时需要比较的次数很多。
             * 因此一个有效的解决方法是作出一个规定：无论何时发生变化时，开发者都要创建一个新的对象，然后将新对象传递出去。
             * 同时，当没有任何变化发生时，开发者发送回旧的对象。也就是说，新的对象代表新的state。
             * 
             */
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        })
        return hasChanged ? nextState : state
    }
}