// It is not at all a requirement to use redux nor is it expected.
// However, if you want to use redux, here is a working setup:

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware, connectRouter } from 'connected-react-router';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    // Insert reducers here
});

const configureStore = (initialState = {}, history) => {
    // List middleware here
    const middlewares = [
        routerMiddleware(history),
        thunk,
    ];

    // Add support for Redux dev tools
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducer(history),
        initialState,
        composeEnhancers(
            applyMiddleware(...middlewares)
        )
    );

    return store;
};

export default configureStore;
