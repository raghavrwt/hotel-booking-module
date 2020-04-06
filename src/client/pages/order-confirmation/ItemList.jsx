import React from 'react';
import {connect} from 'react-redux';
import ResourceItem from '../../common/ResourceItem/ResourceItem';
import {deleteFromCart} from '../../actions/cart';

const ItemList = props => {
    const listHtml = props.items.map((item, index) => {
        const attrs = [{
            title: 'Start Date',
            value: item.startDate,
        }, {
            title: 'End Date',
            value: item.endDate,
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
            // button: {
            //     children: 'Remove',
            // },
            // onBtnClick: () => props.deleteFromCart({cartId: item.id}),
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
        <div>
            {listHtml}
        </div>
    );
};

const mapStateToProps = ({cart, deviceData}, props) => {
    const items = cart.items;
    const totalPrice = items.reduce((sum, item) => {
        return sum + Number(item.price);
    }, 0);

    return {
        ...props,
        ...cart,
        totalPrice,
        isMobile: deviceData.isMobile
    }
};

export default connect(mapStateToProps, {deleteFromCart})(ItemList);