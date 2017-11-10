import compose from './compose'
export default function applyMiddleware(...middlewares) {
    //返回的函数在createStore中被调用
    return (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer)
        let dispatch = store.dispatch //拿到真正的 dispatch
        let chain = []
        // 将最重要的两个方法 getState/dispatch 整合出来,这2个就是中间件需要传的参数
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }
        // 依次传递给 middleware，让它们有控制权,这里的middlewareAPI就是中间件的第一个参数
        chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(store.dispatch) // 再组合出新的 dispatch
        //这里的store.dispatch是中间件返回值接收的参数，即redux-thunk源码里的next


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