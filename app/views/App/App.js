import React from 'react';
import { Container } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from 'components/Header/Header';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import routes from '../../routes';
import './App.css';

function App() {
    return (
        <main className="App">
            <ErrorBoundary>
                <Header />
                <Container className="Container">
                    <Switch>
                        <Redirect from='/' to='/beers' exact />
                        {routes.map(route => (<Route {...route} key={route.key} />))}
                    </Switch>
                </Container>
            </ErrorBoundary>
        </main>
    );
}

export default App;