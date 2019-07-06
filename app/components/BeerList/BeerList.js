
import React from 'react';
import PropTypes from 'prop-types';
import './BeerList.css';
import BeerCard from '../BeerCard/BeerCard';
export default class BeerList extends React.Component {
    static defaultProps = {
        beers: []
    };

    static propTypes = {
        beers: PropTypes.arrayOf(
            PropTypes.shape({
                abv: PropTypes.number,
                description: PropTypes.string,
                first_brewed: PropTypes.string,
                id: PropTypes.number,
                image_url: PropTypes.string,
                name: PropTypes.string,
                srm: PropTypes.number,
            }),
        ),
    };

    render() {
        const { beers, isLoading } = this.props;
        return (
            <section className="BeerList">
                {
                    beers && beers.length > 0
                        ? beers.map(beer => <BeerCard key={beer.id} {...beer} />)
                        : !isLoading && <div>No beer here !</div>
                }
            </section>
        );
    }
}

