import { createStore } from '../redux';
import React, { Component } from 'react';
function reducer(state={count: 0}, action) {
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


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }

    }

    render() {
        const store = createStore(reducer)

        var unsubscribe = store.subscribe(() => {
            console.log('subscribe test:', store.getState())
        })

        store.dispatch({ type: 'addOne' })
        store.dispatch({ type: 'addOne' })

        unsubscribe();
        store.dispatch({ type: 'addOne' })
        store.dispatch({ type: 'addOne' })

        return (
            <div className="App">
                hello world!
      </div>
        );
    }
}

export default App;