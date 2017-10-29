export const ActionTypes = {
    INIT: '@@redux/INIT'
}

export default function createStore(reducer, preloadedState, enhancer) {


    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error('Expected the enhancer to be a function.')
        }

        return enhancer(createStore)(reducer, preloadedState)
    }

    //闭包私有变量
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = [];
    let nextListeners = currentListeners;
    let isDispatching = false;

    function ensureCanMutateNextListeners() {
        //如果 nextListeners和currentListeners指向同一个引用，就让他们不指向同一个对象
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()
        }
    }

    //返回state
    function getState() {
        return currentState;
    }

    //监听
    function subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }
        let isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        //卸载这个监听
        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }
            isSubscribed = false
            ensureCanMutateNextListeners()
            const index = nextListeners.indexOf(listener)
            nextListeners.splice(index, 1)
        }
    }

    //触发一个action
    function dispatch(action) {
        //源码还检查了 isPlainObject  用了中间件后支持Promise, an Observable, a thunk, or something else 例如 redux-thunk 
        //检查action是否包含type
        if (typeof action.type === 'undefined') {
            throw new Error(
                'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?'
            )
        }

        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }

        try {
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        const listeners = currentListeners = nextListeners
        listeners.forEach(listener => listener());
        //为了方便，返回action
        return action
    }
    //动态加载一些reducers 或者需要reducer的热加载
    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new Error('Expected the nextReducer to be a function.')
        }

        currentReducer = nextReducer
        dispatch({ type: ActionTypes.INIT })

    }

    //当store被创建的时候，就会dispatch 一个init的action用于初始化state
    //因为reducer要求没有匹配的action就返回default，switch case最后有个default
    dispatch({ type: ActionTypes.INIT })
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
    }
}