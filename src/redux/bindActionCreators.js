function bindActionCreator(actionCreator, dispatch) {
    return (...args) => dispatch(actionCreator(...args))

}
/**
 * 使用 dispatch 把每个 action creator 包围起来，这样可以直接调用它们
 * 可以import * as 传入一组functions 或者传入一个function
 * @param {*} actionCreator 
 * @param {*} dispatch 
 */
export default function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }
    const boundActionCreators = { }
    Object.keys(actionCreators).forEach(key => {
        boundActionCreators[key] = bindActionCreator(actionCreators[key], dispatch)
    })
    return boundActionCreators
}