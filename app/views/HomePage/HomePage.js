import React from 'react';
import axios from 'axios';
import { Accordion, Icon } from 'semantic-ui-react';
import './HomePage.css';
import BeerList from 'components/BeerList/BeerList';
import BeerFilter from 'components/BeerFilter/BeerFilter';
import LoadingIcon from 'components/LoadingIcon/LoadingIcon';
import Paginate from 'components/Paginate/Paginate';
import getUrlSearchParams from 'lib/getUrlSearchParams';
import { urlPunkApiBeers } from 'lib/constants';
class HomePage extends React.Component {

    static scrollToBeer() {
        const idBeer = sessionStorage.getItem('idBeer');
        sessionStorage.removeItem('idBeer');
        const item = document.querySelector(`.restore-${idBeer}`);
        if (item) {
            item.scrollIntoView();
        }
    }

    constructor(props) {
        super(props);
        // If we enter an url with a page param
        const qsPage = getUrlSearchParams(props.location, 'page');
        const filters = sessionStorage.getItem('filters');
        this.min = 0;
        this.max = 100;
        this.unlistenHistory = null;
        this.state = {
            beers: [],
            isLoading: true,
            limit: 12,
            currentPage: Number(qsPage) || 1,
            lastPage: null,
            previousDisabled: true,
            nextDisabled: false,
            activeIndex: -1,
            filters: filters ? JSON.parse(filters) : null
        };
    }

    async componentDidMount() {
        this.unlistenHistory = this.props.history.listen(this.listenHistory);
        const { currentPage, limit, filters } = this.state;
        await this.processBeers(currentPage, limit, urlPunkApiBeers, filters);
        HomePage.scrollToBeer();
    }

    componentWillUnmount() {
        if (this.unlistenHistory) {
            this.unlistenHistory();
        }
    }

    /**
     * Retrieve beers 
     * @param {string} url 
     */
    async getBeers(url = urlPunkApiBeers) {
        try {
            return await axios.get(url);
        } catch (error) {
            this.setState({ isLoading: false });
            if (error.response && error.response.data && error.response.data.statusCode) {
                const { message, statusCode } = error.response.data;
                const strError = `${statusCode} - ${message}`;
                return console.error('HomePage -> getBeers -> error', strError);
            }
            return console.error('HomePage -> getBeers -> error', error);
        }
    }

    /**
     * Create a string containing params
     * @param {object} filters      
     */
    createUrlParamWithFilters = (filters) => {
        if (filters && (filters.min > 0 || filters.max < 100)) {
            return `&abv_gt=${filters.min}&abv_lt=${filters.max}`;
        }
        return '';
    };

    /**
     * Retrieve beers and manage the HomePage state
     * @param {number} currentPage 
     * @param {number} limit 
     * @param {string} url 
     * @param {object} filters 
     * @param {bool} fromRangeChange if processBeers is called with new filter 
     */
    async processBeers(currentPage, limit, url = urlPunkApiBeers, filters = null, fromRangeChange = false) {
        try {
            const { beers: beerState } = this.state;
            let { previousDisabled, nextDisabled, lastPage } = this.state;
            const strFilter = this.createUrlParamWithFilters(filters);
            previousDisabled = false;
            nextDisabled = false;
            if (!currentPage || currentPage < 1 || limit < 0 || !url) return;
            // When we know which page is the last, we can disabled the next button
            if (lastPage !== null && lastPage === currentPage) {
                nextDisabled = true;
            }
            let beers = null;
            // If punkapi respond faster than 100 ms we don't display the loading component
            setTimeout(() => !beers && this.setState({ isLoading: true }), 100);
            // https://api.punkapi.com/v2/beers?page=1&per_page=12&abv_gt=50
            beers = await this.getBeers(`${url}?page=${currentPage}&per_page=${limit}${strFilter}`);
            // If beers.data is empty we disable the next button and we set lastPage
            if (beers.data.length === 0) {
                nextDisabled = true;
                currentPage--;
                if (currentPage < 1) currentPage = 1;
                // We save the currentPage as the lastPage
                lastPage = currentPage;
            }
            // The next api page is empty: currentPage is the last page. We stay on the last page
            if (fromRangeChange === false && beers.data.length === 0 && beerState.length > 0) {
                beers.data.push(...beerState);
                this.props.history.replace(`${this.props.location.pathname}?page=${currentPage}`);
            }
            if (currentPage < 2) {
                previousDisabled = true;
            }
            this.setState({
                beers: beers.data,
                isLoading: false,
                currentPage,
                nextDisabled,
                previousDisabled,
                lastPage,
                filters
            });
        } catch (error) {
            this.setState({ isLoading: false });
            console.error('HomePage -> getBeers -> error', error);
        }
    }

    /**
     * We send request to punkapi on pop and on push history
     * @param {window.history.location} currentPage 
     * @param {object} action
     */
    listenHistory = async (locaton, action) => {
        let qsPage = getUrlSearchParams(location, 'page');
        // If we go back to the first page (/beers without param)
        qsPage = qsPage === '' ? 1 : Number(qsPage);
        if (this.state.currentPage === qsPage) return;
        if (action === 'POP' || action === 'PUSH') {
            const { limit, filters } = this.state;
            await this.processBeers(qsPage, limit, urlPunkApiBeers, filters);
            window.scroll({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Open/Close the accordion containing the filter
     * @param {e} event 
     * @param {object} titleProps All Accordion.Title props.
     */
    handleAccordionClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    };

    /**
     * this function is called each time we change the filter
     * @param {object} filters object containing the properties min and max abv 
     */
    handleRangeChangeComplete = (filters) => {
        sessionStorage.setItem('filters', JSON.stringify(filters));
        this.setState({ lastPage: null, filters }, async () => {
            const { location, history } = this.props;
            // We go back to the page 1 each time we modify the filter
            history.replace(`${location.pathname}?page=1`);
            await this.processBeers(1, this.state.limit, urlPunkApiBeers, filters, true);
        });
    };

    render() {
        const { beers, isLoading, previousDisabled, nextDisabled, currentPage, activeIndex, filters } = this.state;
        const { location } = this.props;
        const urlPreviousPage = `${location.pathname}?page=${currentPage - 1}`;
        const urlNextPage = `${location.pathname}?page=${currentPage + 1}`;
        let initMin = null;
        let initMax = null;
        if (filters && filters.min >= this.min && filters.max <= this.max) {
            initMin = filters.min;
            initMax = filters.max;
        }
        return (
            <div className="HomePage">
                {
                    isLoading && <LoadingIcon />
                }
                <Paginate
                    previousDisabled={previousDisabled} nextDisabled={nextDisabled}
                    previousLink={urlPreviousPage} nextLink={urlNextPage}
                />
                <section className="HomePage__accordion">
                    <Accordion styled>
                        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccordionClick}>
                            <Icon name='dropdown' />Filters - ABV: {filters ? `${filters.min}% - ${filters.max}%` : `0% - 100%`}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 0}>
                            <BeerFilter min={this.min} max={this.max} initMin={initMin} initMax={initMax} onChangeComplete={this.handleRangeChangeComplete} />
                        </Accordion.Content>
                    </Accordion>
                </section>
                <BeerList beers={beers} isLoading={isLoading} />
                <Paginate
                    previousDisabled={previousDisabled} nextDisabled={nextDisabled}
                    previousLink={urlPreviousPage} nextLink={urlNextPage}
                />
            </div>
        );
    }
}

export default HomePage;
