import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from './Logo/Logo';
import SearchBar from './SearchBar/SearchBar';

function Header() {
	return (
		<header className="Header">
			<Link className="Header__beer-link" to="/">
				<Icon name='beer' />
			</Link>
			<SearchBar />
			<Logo />
		</header>
	);
}

export default Header;
