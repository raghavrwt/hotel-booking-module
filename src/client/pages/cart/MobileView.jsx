import React from 'react';
import {connect} from 'react-redux';
import ItemList from './ItemList';
import styles from './cart.scss';
import {FullWidthButton} from 'jd-library';

const MobileView = props => {
    return (
        <>
            <ItemList />
            <FullWidthButton className={styles['proceed-btn']}>
                <FullWidthButton.Section
                    variant='left'
                    text={`$${props.totalPrice}`}
                    subText={`${props.items.length} ITEM${props.items.length > 1 ? 'S' : ''}`}
                />
                <FullWidthButton.Section variant='right' text='Continue' />
            </FullWidthButton>
        </>
    );
}

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

export default connect(mapStateToProps)(MobileView);