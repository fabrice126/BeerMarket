import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from 'views/App/App';
// Global styles
import 'sanitize.css/sanitize.css';
import 'semantic-ui-css/semantic.min.css';

// If not using redux:
render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('app')
);