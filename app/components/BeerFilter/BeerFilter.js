import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './BeerFilter.css';
class BeerFilter extends React.Component {

    static defaultProps = {
        initMax: 100,
        initMin: 0
    };

    static propTypes = {
        initMax: PropTypes.number,
        initMin: PropTypes.number,
        max: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        onChangeComplete: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            rangeValueABV: {
                min: props.initMin || props.min,
                max: props.initMax || props.max
            }
        };
    }
    
    handleRangeChange = (rangeValueABV) => {
        this.setState({ rangeValueABV });
    };

    handleFiltersReset = () => {
        const { min, max, onChangeComplete } = this.props;
        const rangeValueABV = { max, min };
        this.setState({ rangeValueABV }, () => {
            onChangeComplete({ min, max });
        });
    };

    formatLabel = (value) => `${value}%`;

    render() {
        const { rangeValueABV } = this.state;
        const { onChangeComplete, max, min } = this.props;
        return (
            <div className="BeerFilter">
                <p className="BeerFilter__label">Alcohol by volume:</p><br />
                <InputRange
                    maxValue={max}
                    minValue={min}
                    formatLabel={this.formatLabel}
                    value={rangeValueABV}
                    onChange={this.handleRangeChange}
                    onChangeComplete={onChangeComplete}
                />
                <button className="BeerFilter___btn ui primary button" type="button" onClick={this.handleFiltersReset}> Reset filters</button>
            </div >
        );
    }
}

export default BeerFilter;
