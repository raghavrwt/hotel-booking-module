import React from 'react';
import {connect} from 'react-redux';
import styles from './cart.scss';
import ResourceItem from '../../common/ResourceItem/ResourceItem';
import {deleteFromCart} from '../../actions/cart';
import {formatCartDate} from '../../common/dateFunctions'

const ItemList = props => {
    const listHtml = props.items.map((item, index) => {
        const attrs = [{
            title: 'Start Date',
            value: formatCartDate(item.startDate),
        }, {
            title: 'End Date',
            value: formatCartDate(item.endDate),
        }];

        Object.keys(item.query).forEach(key => {
            attrs.push({
                title: key,
                value: item.query[key]
            });
        });

        const obj = {
            name: 'Cart Item',  //to be changed
            // image: item.image[0],
            attrs,
            button: {
                children: 'Remove',
            },
            buttonType: 'button',
            onBtnClick: () => props.deleteFromCart({cartId: item.id}),
            price: item.price
        };

        return (
            <ResourceItem 
                key={index}
                {...obj}
                isMobile={props.isMobile}
            />
        )
    });

    return (
        <div className={styles['item-list']}>
            {listHtml}
        </div>
    );
};

const mapStateToProps = ({cart, deviceData}, props) => ({
    ...props,
    ...cart,
    isMobile: deviceData.isMobile
});

export default connect(mapStateToProps, {deleteFromCart})(ItemList);