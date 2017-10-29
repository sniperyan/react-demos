/**
 * 这种es6的写法不能模拟私有方法，私有属性
 */
export const ActionTypes = {
    INIT: '@@redux/INIT'
}
class Store {
    constructor(reducer, state) {
        this.reducer = reducer;
        this.state = state;
        this.currentListeners = [];
        this.nextListeners = this.currentListeners;
        this.isDispatching = false;
    }
    ensureCanMutateNextListeners() {
        //如果 nextListeners和currentListeners指向同一个引用，就让他们不指向同一个对象
        if (this.nextListeners === this.currentListeners) {
            this.nextListeners = this.currentListeners.slice()
        }
    }
    //返回state
    getState() {
        return this.state;
    }
    //监听
    subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }
        let isSubscribed = true;
        this.ensureCanMutateNextListeners();
        this.nextListeners.push(listener);
        let self = this;
        //卸载这个监听
        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }
            isSubscribed = false
            self.ensureCanMutateNextListeners()
            const index = self.nextListeners.indexOf(listener)
            self.nextListeners.splice(index, 1)
        }
    }
    //触发一个action
    dispatch(action) {
        //源码还检查了 isPlainObject  用了中间件后支持Promise, an Observable, a thunk, or something else 例如 redux-thunk 
        //检查action是否包含type
        if (typeof action.type === 'undefined') {
            throw new Error(
                'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?'
            )
        }

        if (this.isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }

        try {
            this.isDispatching = true
            this.state = this.reducer(this.state, action)
        } finally {
            this.isDispatching = false
        }
        const listeners = this.currentListeners = this.nextListeners
        listeners.forEach(listener => listener());
        //为了方便，返回action
        return action
    }
    //动态加载一些reducers 或者需要reducer的热加载
    replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new Error('Expected the nextReducer to be a function.')
        }

        this.currentReducer = nextReducer
        this.dispatch({ type: ActionTypes.INIT })

    }
}



export default function createStore(reducer, preloadedState, enhancer) {
    //当store被创建的时候，就会dispatch 一个init的action用于初始化state
    //因为reducer要求没有匹配的action就返回default，switch case最后有个default
    let store = new Store(reducer, preloadedState);
    store.dispatch({ type: ActionTypes.INIT })
    return store
}