import compose from './compose'
export default function applyMiddleware(...middlewares) {
    //返回的函数在createStore中被调用
    return (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer)
        let dispatch = store.dispatch
        let chain = []

        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }
        chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(store.dispatch)

        // 返回新的store dispatch被新的dispatch替代
        return {
            ...store,
            dispatch
        }
    }
}
/**
 * 事实上柯里化是一种“预加载”函数的方法，通过传递较少的参数，
 * 得到一个已经记住了这些参数的新函数，某种意义上讲，这是一种对参数的“缓存”，是一种非常高效的编写函数的方法：
 * https://zhuanlan.zhihu.com/p/21714695
 */