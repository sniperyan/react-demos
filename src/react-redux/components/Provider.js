import React, { Component } from 'react';
import PropTypes from 'prop-types'
import storeShape from '../utils/storeShape'

export default class Provider extends Component {
    getChildContext() {
        return { store: this.store }
    }

    constructor(props, context) {
        super(props, context)
        this.store = props.store
    }
    render() {
        //只允许一个children
        return React.Children.only(this.props.children)
    }
}

//process.env.NODE_ENV !== 'production'  检查了store是否被改变了
Provider.propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired
}
Provider.childContextTypes = {
    store: storeShape.isRequired
}