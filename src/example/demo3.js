import { createStore, applyMiddleware } from '../redux';
import React, { Component } from 'react';

function reducer(state = { count: 0 }, action) {
    switch (action.type) {
        case 'addOne':
            return {
                ...state,
                count: state.count + 1
            }
        default:
            return state
    }
}

var fEnhancer = function ({ getState, dispatch }) {
    return function (originF) {
        return function (...args) {
            console.log('this is fEnhancer before', getState())
            var r = originF(...args)
            console.log('this is fEnhancer after', getState())
            return r
        }
    }
}

var fEnhancer2 = function ({ getState, dispatch }) {
    return function (originF) {
        return function (...args) {
            console.log('this is fEnhancer2 before', getState())
            var r = originF(...args)
            console.log('this is fEnhancer2 after', getState())
            return r
        }
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }

    }

    render() {
        const store = createStore(
            reducer,
            undefined,
            applyMiddleware(fEnhancer,fEnhancer2)
        )

        var unsubscribe = store.subscribe(() => {
            console.log('subscribe test:', store.getState())
        })

        store.dispatch({ type: 'addOne' })
        // store.dispatch({ type: 'addOne' })

        // unsubscribe();
        // store.dispatch({ type: 'addOne' })
        // store.dispatch({ type: 'addOne' })


        return (
            <div className="App">
                hello world!
      </div>
        );
    }
}

export default App;