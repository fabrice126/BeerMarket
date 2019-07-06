import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Paginate.css';
class Paginate extends React.Component {
    static defaultProps = {
        nextDisabled: false,
        previousDisabled: false

    };

    static propTypes = {
        nextDisabled: PropTypes.bool,
        nextLink: PropTypes.string.isRequired,
        previousDisabled: PropTypes.bool,
        previousLink: PropTypes.string.isRequired,
    };

    render() {
        const { nextDisabled, previousDisabled, nextLink, previousLink } = this.props;
        return (
            <nav className="Paginate">
                {
                    previousDisabled
                        ? <Icon className="Paginate-icon" name="angle left" disabled />
                        : (
                            <Link to={previousLink} >
                                <Icon className="Paginate-icon" name="angle left" />
                            </Link>
                        )
                }
                {
                    nextDisabled
                        ? <Icon className="Paginate-icon" name="angle right" disabled />
                        : (
                            <Link to={nextLink} >
                                <Icon className="Paginate-icon" name="angle right" />
                            </Link>
                        )
                }
            </nav>
        );
    }
}

export default Paginate;
