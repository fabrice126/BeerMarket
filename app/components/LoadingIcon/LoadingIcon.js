import React from 'react';
import loadingGif from 'assets/loading.svg';
import './LoadingIcon.css';
function LoadingIcon() {
    return (
        <div className="LoadingIcon">
            <img src={loadingGif} alt="Loading..." />
        </div>
    );
}
export default LoadingIcon;
