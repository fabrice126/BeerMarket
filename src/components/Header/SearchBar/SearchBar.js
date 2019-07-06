import React from 'react';
import { Search, Grid } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchBar.css';
class SearchBar extends React.Component {
    /**
     * Create the list of beer
     * @params result {any} The SearchResult props object. https://react.semantic-ui.com/modules/search/#types-standard
     */
    static handleResultRenderer(result) {
        return (
            <Link className="SearchBar_link" to={`/beers/${result.beerid}`}>
                <img width="15" src={result.image} alt={result.title} />
                <span style={{ marginLeft: '15px' }}>{result.title}</span>
            </Link>
        );
    }

    constructor() {
        super();
        this.initialState = {
            isLoading: false,
            results: [],
            value: ''
        };
        this.state = {
            ...this.initialState
        };
    }

    /**
     * When the user clicks on a result in the search list, we display his choice on the search input.
     * @params e {SyntheticEvent}
     * @params search {object} All props, includes current value of search input. https://react.semantic-ui.com/modules/search/#types-standard
     */
    handleResultSelect = (e, search) => this.setState({ value: search.result.title });

    /**
     * Autocomplete the search input.
     * @params e {SyntheticEvent}
     * @params search {object} All props, includes current value of search input. https://react.semantic-ui.com/modules/search/#types-standard
     */
    handleSearchChange = async (e, search) => {
        try {
            const { value } = search;
            this.setState({ isLoading: true, value });
            if (!value) return this.setState(this.initialState);
            const foundBeers = await axios.get(`https://api.punkapi.com/v2/beers?beer_name=${value}`);
            if (this.state.value && this.state.value.length < 1) return this.setState(this.initialState);
            const foundSubBeers = foundBeers.data.slice(0, 6);
            const foundBeersAttr = foundSubBeers.map((beer) => {
                const { id, name, image_url: image } = beer;
                return { beerid: id, key: beer.id, title: name, image };
            });
            return this.setState({ isLoading: false, results: foundBeersAttr });
        } catch (error) {
            return this.setState(this.initialState);
        }
    };



    render() {
        const { isLoading, value, results } = this.state;
        return (
            <Grid className="SearchBar">
                <Grid.Column>
                    <Search
                        className="SearchBar__input"
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={this.handleSearchChange}
                        resultRenderer={SearchBar.handleResultRenderer}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                </Grid.Column>
            </Grid>
        );
    }
}

export default SearchBar;