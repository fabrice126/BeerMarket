import React from 'react';
import HomePage from './views/HomePage/HomePage';
import DetailPage from './views/DetailPage/DetailPage';
import FallBack from './views/FallBack/FallBack';

const routes = [
    {
        path: '/beers',
        component: HomePage,
        exact: true,
        key: '1',
    },
    {
        path: '/beers/:idBeer',
        component: (props) => <DetailPage key={props.match.url} {...props} />,
        exact: true,
        key: '2',
    },
    {
        component: FallBack,
        key: '0',
    }
];
export default routes;
