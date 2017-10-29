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
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
        })
        return hasChanged ? nextState : state
    }
}