import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import textAbstract from '../../lib/textAbstract';
import srmToRgb from '../../lib/srmToRgb';
import './BeerCard.css';
class BeerCard extends React.PureComponent {
    static defaultProps = {
        abv: '',
        description: '',
        first_brewed: '',
        id: null,
        image_url: '',
        name: '',
        srm: 0
    };

    static propTypes = {
        abv: PropTypes.number,
        description: PropTypes.string,
        first_brewed: PropTypes.string,
        id: PropTypes.number,
        image_url: PropTypes.string,
        name: PropTypes.string,
        srm: PropTypes.number,
    };

    render() {
        const { description, first_brewed: firstBrewed, id, image_url: imageUrl, name, abv, srm } = this.props;
        const rgbSrm = `${srmToRgb(srm)}bb`;
        return (
            <article className={`BeerCard restore-${id}`}>
                <Link className="BeerCard__link" to={`/beers/${id}`}>
                    <Card>
                        <Image style={{backgroundColor:rgbSrm}} className="BeerCard__img" src={imageUrl} ui={false} wrapped />
                        <Card.Content>
                            <Card.Header>{name}</Card.Header>
                            <Card.Meta>
                                <span className='date'>First brewed: {firstBrewed}</span>
                            </Card.Meta>
                            <Card.Description>
                                {textAbstract(description, 280)}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Icon name='percent' />
                            {abv}
                        </Card.Content>
                    </Card>
                </Link>
            </article>
        );
    }
}

export default BeerCard;
