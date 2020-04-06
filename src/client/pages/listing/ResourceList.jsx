import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import ResourceItem from '../../common/ResourceItem/ResourceItem';
import {
    showBookingModal
} from '../../actions/booking';
import {
    getDetailURL
} from '../../common/urlFunctions';
import {
    deleteFromCart
} from '../../actions/cart';

const getItemsInCart = (items, query) => {
    const locationId = query['Location'].paramId;
    const cartMap = new Map();

    items.forEach(item => {
        const [itemLocation, resourceId] = item.resourceGroup;

        if (itemLocation !== locationId) {
            return;
        }

        if (cartMap.has(resourceId)) {
            cartMap.set(resourceId, cartMap.get(resourceId) + 1);
        } else {
            cartMap.set(resourceId, 1);
        }
    });

    return cartMap;
}

const ResourceList = props => {
    const cartMap = useMemo(() => getItemsInCart(props.cartItems, props.query), [props.cartItems, props.query]);

    const onBtnClick = (selectedResource, type) => {
        if (type === 'minus') {
            return props.deleteFromCart({
                resourceId: selectedResource.id
            });
        }

        props.showBookingModal(selectedResource);
    }

    return (
        <div>
            {props.resourceList.map((item, index) => {
                const cartQty = cartMap.get(item.id);

                const obj = {
                    name: item.name,
                    link: getDetailURL({
                        query: props.query,
                        id: item.id,
                        verticalId: props.verticalId,
                        name: item.name
                    }),
                    image: item.image[0],
                    price: item.price,
                    buttonType: cartQty > 0 ? 'quantity' : 'button',
                    onBtnClick: type => onBtnClick(item, type)
                };

                if (cartQty > 0) {
                    obj.buttonType = 'quantity';
                    obj.button = {
                        qty: cartQty
                    };
                } else {
                    obj.buttonType = 'button';
                    obj.button = {
                        children: 'Book Now'
                    };
                }

                return (
                    <ResourceItem
                        key={item.id}
                        index={index}
                        isMobile={props.isMobile}
                        {...obj}
                    />
                )
            })}
        </div>
    );
}

const mapStateToProps = ({ listing, booking, userData, cart, deviceData }, props) => {
    return {
        ...props,
        resourceList: listing.resourceList,
        query: booking.query,
        verticalId: userData.verticalId,
        cartItems: cart.items,
        isMobile: deviceData.isMobile
    }
};

export default connect(mapStateToProps, {
    showBookingModal,
    deleteFromCart
})(ResourceList);