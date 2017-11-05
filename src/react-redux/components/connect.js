import { Component, createElement } from 'react'
import storeShape from '../utils/storeShape'
import shallowEqual from '../utils/shallowEqual'
import wrapActionCreators from '../utils/wrapActionCreators'
const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({ dispatch })
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
    ...parentProps,
    ...stateProps,
    ...dispatchProps
})
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

let errorObject = { value: null }
function tryCatch(fn, ctx) {
    try {
        return fn.apply(ctx)
    } catch (e) {
        errorObject.value = e
        return errorObject
    }
}

// Helps track hot reloading.
let nextVersion = 0

export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
    const shouldSubscribe = Boolean(mapStateToProps)
    const mapState = mapStateToProps || defaultMapStateToProps
    let mapDispatch
    if (typeof mapDispatchToProps === 'function') {
        mapDispatch = mapDispatchToProps
    } else if (!mapDispatchToProps) {
        mapDispatch = defaultMapDispatchToProps
    } else {
        mapDispatch = wrapActionCreators(mapDispatchToProps)
    }
    const finalMergeProps = mergeProps || defaultMergeProps
    /**
     * 如果为 true，connector 将执行 shouldComponentUpdate 并且浅对比 mergeProps 的结果，
     * 避免不必要的更新，前提是当前组件是一个“纯”组件，它不依赖于任何的输入或 state 而只依赖于 props 
     * 和 Redux store 的 state。默认值为 true
     */
    const { pure = true, withRef = false } = options
    const checkMergedEquals = pure && finalMergeProps !== defaultMergeProps
    // Helps track hot reloading.
    const version = nextVersion++

    return function wrapWithConnect(WrappedComponent) {
        const connectDisplayName = `Connect(${getDisplayName(WrappedComponent)})`
        function computeMergedProps(stateProps, dispatchProps, parentProps) {
            const mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps)
            return mergedProps
        }

        class Connect extends Component {
            shouldComponentUpdate() {
                return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged
            }
            constructor(props, context) {
                super(props, context)
                this.version = version
                this.store = props.store || context.store

                const storeState = this.store.getState()
                this.state = { storeState }
                this.clearCache()
            }

            computeStateProps(store, props) {
                if (!this.finalMapStateToProps) {
                    return this.configureFinalMapState(store, props)
                }

                const state = store.getState()
                const stateProps = this.doStatePropsDependOnOwnProps ?
                    this.finalMapStateToProps(state, props) :
                    this.finalMapStateToProps(state)

                return stateProps
            }
            configureFinalMapState(store, props) {
                const mappedState = mapState(store.getState(), props)
                const isFactory = typeof mappedState === 'function'

                this.finalMapStateToProps = isFactory ? mappedState : mapState
                this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1

                if (isFactory) {
                    return this.computeStateProps(store, props)
                }

                if (process.env.NODE_ENV !== 'production') {
                    checkStateShape(mappedState, 'mapStateToProps')
                }
                return mappedState
            }
        }
    }

}