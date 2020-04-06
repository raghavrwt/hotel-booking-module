import React, {useMemo} from 'react';
import styles from './booked.scss';
import {connect} from 'react-redux';
import {deleteFromCart} from '../../actions/cart';
import verticalJson from '../verticalData.json';
import {formatCartDate, displayDateTime} from '../dateFunctions';

const getCartItems = ({cart=[], query, resourceId, dependants, verticalId}) => {
    const locationId = query['Location'].paramId;
    const dependantName = verticalJson.dependantNames[verticalId];

    return cart.reduce((list, item) => {
        const [itemLocation, itemResourceId, dependantId] = item.resourceGroup;
    
        if(itemLocation !== locationId || itemResourceId !== resourceId) {
            return list;
        }

        let obj = {
            ...item,
            attrs: {
                ...item.query
            }
        };

        if(typeof dependantId !== 'undefined') {
            const dependant = dependants.find(d => d.id === dependantId);

            obj.attrs[dependant.dropDownName] = dependant.name;
        }
    
        return list.concat(obj);
    }, []);
}

const Booked = props => {

    const itemsInCart = getCartItems(props);

    if(!itemsInCart.length) {
        return null;
    }

    const itemHtml = itemsInCart.map(item => {
        const {
            startDate,
            endDate
        } = item;

        return (
            <div 
                className={styles['booked-item']}
                key={item.id}
            >
                <div className={styles['date-section']}>
                    {formatCartDate(startDate)} to {formatCartDate(endDate)}
                </div>
                <div className={styles['attrs-section']}>
                    {Object.keys(item.attrs).map(key => (
                        <div 
                            key={key}
                            className={styles['single-attr']}
                        >
                            {key}: {item.attrs[key]}
                        </div>
                    ))}
                </div>
                <span 
                    className={`icon-trash ${styles['delete-booking']}`} 
                    onClick={() => props.deleteFromCart({cartId: item.id})}
                />
            </div>
        )
    });

    return (
        <div className={styles['booked-section']}>
            <div className={styles['booked-title']}>
                Seems you already have bookings for this date:
            </div>
            <div className={styles['booked-items']}>
                {itemHtml}
            </div>
        </div>
    );
}

const mapStateToProps = ({cart, booking, userData}, props) => ({
    ...props,
    cart: cart.items,
    query: booking.query,
    resourceId: booking.resourceId,
    dependants: booking.dependants,
    dependantIndexes: booking.dependantIndexes,
    verticalId: userData.verticalId
});

export default connect(mapStateToProps, {deleteFromCart})(Booked);