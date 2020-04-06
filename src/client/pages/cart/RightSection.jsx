import React from 'react';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import styles from './right-section.scss';
import {Button} from 'jd-library';

const RightSection = props => {
    const history = useHistory();

    const onProceed = () => {
        history.push('/order-confirmation');
    }

    return (
        <div className={styles['cart-right']}>
            <div className={styles['price-container']}>
                {props.totalPrice}
            </div>
            <Button
                className={styles['proceed-btn']}
                clickHandler={onProceed}
                block
            >
                Proceed
            </Button>
        </div>
    );
};

const mapStateToProps = ({cart}, props) => {
    const items = cart.items;
    const totalPrice = items.reduce((sum, item) => {
        return sum + Number(item.price);
    }, 0);

    return {
        ...props,
        items: cart.items,
        totalPrice
    }
}

export default connect(mapStateToProps)(RightSection);