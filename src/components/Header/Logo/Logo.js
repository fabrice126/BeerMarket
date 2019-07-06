import React from 'react';
import './Logo.css';
import osedeaWhite from '../../../assets/osedea-white.svg';

function Logo() {
	return (
		<a className="Logo__link" rel="noopener noreferrer" target="_blank" href="https://osedea.com/">
			<div className="Logo">
				<img className="Logo__img" src={osedeaWhite} alt="Osedea-logo" />
			</div>
		</a>
	);
}

export default Logo;
