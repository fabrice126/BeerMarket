import React from 'react';
import axios from 'axios';
import './DetailPage.css';
import LoadingIcon from '../../components/LoadingIcon/LoadingIcon';
import BeerList from '../../components/BeerList/BeerList';
import srmToRgb from '../../lib/srmToRgb';
class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            beer: null,
            rgbSrm: null,
            isLoading: true,
            otherBeers: []
        };
    }

    async componentDidMount() {
        try {
            window.scrollTo(0, 0);
            const { idBeer } = this.props.match.params;
            sessionStorage.setItem('idBeer', idBeer);
            await this.processBeer(idBeer);
        } catch (error) {
            console.error('DetailPage -> componentDidMount -> error', error);
        }
    }

    /**
     * Get x random beers
     * @param {number} nbRandom number of random beer
     */
    getRandomBeer = async (nbRandom) => {
        const randomBeers = [];
        for (let i = 0; i < nbRandom; i++) {
            randomBeers.push(axios.get('https://api.punkapi.com/v2/beers/random'));
        }
        const resultsRandomBeers = await Promise.all(randomBeers);
        const otherBeers = resultsRandomBeers.map((beersReq) => beersReq && beersReq.data ? beersReq.data[0] : null);
        return otherBeers;
    };

    /**
     * Get beer and update state
     * @param {number} idBeer
     */
    async processBeer(idBeer) {
        try {
            const beer = await this.getBeer(idBeer);
            if (!beer || !beer.data || !beer.data.length) return;
            const rgbSrm = `${srmToRgb(beer.data[0].srm)}bb`;

            this.setState({ beer: beer.data[0], isLoading: false, rgbSrm }, async () => {
                const otherBeers = await this.getRandomBeer(3);
                this.setState({ otherBeers });
            });
        } catch (error) {
            this.setState({ isLoading: false });
            console.error('HomePage -> getBeers -> error', error);
        }
    }

    /**
     * Get a beer from punkapi according to his id
     * @param {number} id
     * @param {string} url 
     */
    async getBeer(id, url = 'https://api.punkapi.com/v2/beers') {
        try {
            return await axios.get(`${url}/${id}`);
        } catch (error) {
            this.setState({ isLoading: false });
            if (error.response && error.response.data && error.response.data.statusCode) {
                const { message, statusCode } = error.response.data;
                const strError = `${statusCode} - ${message}`;
                console.error('DetailPage -> getBeer -> error', strError);
            }
            console.error('DetailPage -> getBeer -> error', error);
            return null;
        }
    }

    render() {
        const { beer, isLoading, rgbSrm, otherBeers } = this.state;
        return (
            <section key={this.props.match.url} className="DetailPage">
                {isLoading && <LoadingIcon />}
                {
                    beer ? (
                        <div>
                            <h1>{beer.name}</h1>
                            <p className="DetailPage__tagline">&quot;{beer.tagline}&quot;</p>

                            <div className="DetailPage__wrapper">
                                <div className="DetailPage__wrapper-img" data-abv={`ABV: ${beer.abv}%`}>
                                    <img className="DetailPage__img" src={beer.image_url} alt={beer.name} />
                                    <div className="DetailPage__srm-color" style={{ backgroundColor: rgbSrm }} />
                                </div>
                                <div className="DetailPage__details">
                                    {beer.brewers_tips}
                                </div>
                                <div className="DetailPage__ingredients">
                                    Malt
                                    <ul>
                                        {
                                            beer.ingredients.malt.map((malt) => (
                                                <li key={`${malt.name}_${malt.amount.value}`}>
                                                    {malt.name} - {malt.amount.value} {malt.amount.unit === 'kilograms' ? 'kg' : malt.amount.unit}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    Hops
                                    <ul>
                                        {
                                            beer.ingredients.hops.map((hop) => (
                                                <li key={`${hop.name}_${hop.amount.value}_${hop.add}`}>
                                                    {hop.name} - {hop.amount.value} {hop.amount.unit === 'grams' ? 'g' : hop.amount.unit}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    yeast: {beer.ingredients.yeast}
                                </div>
                            </div>
                            <article className="DetailPage__description">
                                {beer.description}
                            </article>
                            <article className="DetailPage__food-pairing">
                                <i aria-hidden="true" className="like icon" /> We recommand you this beer with: {beer.food_pairing.map((food, i) => i === 0 ? food : `, ${food}`)}
                            </article>
                            {
                                otherBeers && otherBeers.length > 0
                                    ? (
                                        <section className="DetailPage__see-also">
                                            <h2>See also: </h2>
                                            <BeerList beers={otherBeers} isLoading={false} />
                                        </section>
                                    )
                                    : ''
                            }
                        </div>
                    )
                        : "This beer doesn't exists"
                }
            </section>
        );
    }
}

export default DetailPage;