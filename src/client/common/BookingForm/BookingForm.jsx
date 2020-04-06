import React, { useMemo, useState, useReducer, useRef, forwardRef, useImperativeHandle } from 'react';
import commonStyles from "../common.scss";
import styles from './booking-form.scss';
import { connect } from 'react-redux';
import Input from '../Attributes/Input';
import Dropdown from '../Attributes/Dropdown';
import DateInput from '../Attributes/DateInput';
import Attribute from '../Attributes/Attribute';
import { Button } from 'jd-library';
import AddOns from './AddOns';
import Slots from './Slots/Slots';
import SelectDependant from './SelectDependant';
import Booked from './Booked';
import {
    formatFormAttr
} from '../customer/functions';
import {
    updateBookingInfo,
    updatePriceAndAvailablity
} from '../../actions/booking';
import {
    addToCart
} from '../../actions/cart';
import {
    cartServerFormat
} from '../dateFunctions';
import {
    format
} from 'date-fns';
import { addMinutes } from 'date-fns';

const map = {
    DROPDOWN: {
        Component: Dropdown,
        className: styles['form-input']
    },
    INT: {
        Component: Input,
        containerClass: styles['form-input'],
        spinner: true
    },
    DATE: {
        Component: DateInput
    }
}
const attrsToExclude = ['Location'];

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_VALUE': {
            const {
                setIndex,
                index,
                value
            } = action;
            const newState = [...state];
            const newSet = { ...newState[setIndex] }
            const newValues = [...newSet.values];

            newValues[index] = value;
            newSet.values = newValues;
            newState[setIndex] = newSet;

            return newState;
        }
        case 'UPDATE_ADDON': {
            const {
                setIndex,
                index,
                value
            } = action;
            const newState = [...state];
            const newSet = { ...newState[setIndex] }
            const newAddons = [...newSet.addons];

            newAddons[index] = value;
            newSet.addons = newAddons;
            newState[setIndex] = newSet;

            return newState;
        }
        case 'ADD_SET': {
            return state.concat(init({
                query: action.query,
                attrData: action.attrData,
                addons: action.addons,
                dependantIndexes: action.dependantIndexes,
                dependants: action.dependants,
                singleSet: true
            }));
        }
        case 'DELETE_SET': {
            const newState = [...state];
            newState.splice(action.setIndex, 1);
            return newState;
        }
        case 'SET_SLOT': {
            const newState = [...state];
            const newSet = { ...newState[action.setIndex] };
            newSet.selectedSlot = action.slot;
            newSet.slotError = false;
            newState[action.setIndex] = newSet;
            return newState;
        }
        case 'SET_SLOT_ERROR': {
            const newState = [...state];
            const newSet = { ...newState[action.setIndex] };
            newSet.slotError = true;
            newState[action.setIndex] = newSet;
            return newState;
        }
        case 'SET_DEPENDANT': {
            const newState = [...state];
            const newSet = { ...newState[action.setIndex] };
            newSet.dependantId = action.dependantId;
            newState[action.setIndex] = newSet;
            return newState;
        }
        default:
            return state;
    }
}

const init = ({ query, attrData, addons = [], dependants = [], dependantIndexes = [], singleSet = false }) => {
    const singleSetValues = attrData.map(attr => {
        const val = query[attr.name] ? query[attr.name].paramValue : '';
        return [val];
    });

    const obj = {
        values: singleSetValues,
        selectedSlot: null,
        slotError: false
    };

    if (addons) {
        obj.addons = addons.map(addon => [0]);
    }

    if (dependantIndexes.length) {
        const firstDependant = dependants[dependantIndexes[0]]
        obj.dependantId = [firstDependant.id];
    }

    return singleSet ? obj : [obj];
}

const getSingleSetData = (set, attrData, addOnData) => {
    let valObj = {};
    let addonArr = [];
    let isValid = true;

    set.values.forEach((key, index) => {
        const attr = attrData[index];
        valObj[attr.name] = key[0];
        isValid = isValid && key[0] !== '';
    });

    addonArr = set.addons.map((key, index) => {
        isValid = isValid && key[0] !== '';

        return {
            addonId: addOnData[index].id,
            qty: key[0]
        }
    });

    return {
        isValid,
        addons: addonArr,
        values: valObj
    }
}

const shouldShowSlots = (searchForm) => {
    const dateObj = searchForm.find(attr => attr.type === 'DATE');
    return dateObj ? false : true;
}

const BookingForm = forwardRef((props, ref) => {
    const attrData = useMemo(() => {
        return props.searchForm
            .filter(attr => !attrsToExclude.includes(attr.name))
            .map((attr, index) => {
                return {
                    ...formatFormAttr(attr, index),
                    ...map[attr.type]
                };
            });
    }, []);
    const priceList = useRef([props.price]);
    const availableList = useRef([true]);
    const showSlots = shouldShowSlots(props.searchForm);

    useImperativeHandle(ref, () => ({
        onBook
    }));

    const [inputs, dispatch] = useReducer(reducer, {
        query: props.query,
        attrData,
        addons: props.addons,
        dependants: props.dependants,
        dependantIndexes: props.dependantIndexes
    }, init);

    const onChange = (setIndex, index, value) => {
        dispatch({
            type: 'UPDATE_VALUE',
            setIndex,
            index,
            value
        });


        const currentSet = { ...inputs[setIndex] };
        const currentSetValues = [...currentSet.values];
        currentSetValues[index] = value;
        currentSet.values = currentSetValues;

        const singleSetData = getSingleSetData(currentSet, attrData, props.addons);

        if (singleSetData.isValid) {
            props.updateBookingInfo({
                setIndex,
                queryObj: singleSetData.values,
                addons: singleSetData.addons,
                priceList: priceList.current,
                availableList: availableList.current,
                cb: (price, isAvailable) => {
                    priceList.current[setIndex] = price;
                    availableList.current[setIndex] = isAvailable;
                }
            });
        }
    };

    const addSet = () => {
        dispatch({
            type: 'ADD_SET',
            attrData,
            query: props.query,
            addons: props.addons,
            dependants: props.dependants,
            dependantIndexes: props.dependantIndexes
        });
        priceList.current.push([0]);
        availableList.current.push(true);
    }

    const deleteSet = (setIndex) => {
        dispatch({
            type: 'DELETE_SET',
            setIndex
        });
        priceList.current.splice(setIndex, 1);
        availableList.current.splice(setIndex, 1);
        props.updatePriceAndAvailablity(priceList.current, availableList.current);
    }

    const onAddonChange = (setIndex, index, value) => {
        dispatch({
            type: 'UPDATE_ADDON',
            setIndex,
            index,
            value
        });

        const currentSet = { ...inputs[setIndex] };
        const currentSetAddons = [...currentSet.addons];
        currentSetAddons[index] = value;
        currentSet.addons = currentSetAddons;

        const singleSetData = getSingleSetData(currentSet, attrData, props.addons);

        if (singleSetData.isValid) {
            props.updateBookingInfo({
                setIndex,
                queryObj: singleSetData.values,
                addons: singleSetData.addons,
                priceList: priceList.current,
                availableList: availableList.current,
                cb: (price, isAvailable) => {
                    priceList.current[setIndex] = price;
                    availableList.current[setIndex] = isAvailable;
                }
            });
        }
    };

    const onBook = () => {
        const keys = {
            'Start Date': 'startDate',
            'End Date': 'endDate'
        }

        let isValid = true;

        const arr = inputs.map((set, setIndex) => {
            let obj = {
                query: {},
                addons: []
            };

            set.values.forEach((val, index) => {
                const attr = attrData[index];

                if (keys[attr.name]) {
                    obj[keys[attr.name]] = val[0];
                    return;
                }

                obj.query[attr.name] = val[0];
            });

            obj.addons = props.addons.reduce((list, addon, index) => {
                if (!set.addons[index][0]) {
                    return list;
                }
                return list.concat([{
                    addonId: addon.id,
                    qty: set.addons[index][0]
                }]);
            }, []);

            if (showSlots) {
                if (set.selectedSlot) {
                    obj['startDate'] = format(set.selectedSlot, cartServerFormat);
                    if (props.slotTime) {
                        obj['endDate'] = format(addMinutes(set.selectedSlot, Number(props.slotTime)), cartServerFormat);
                    }
                } else {
                    isValid = false;
                    dispatch({
                        type: 'SET_SLOT_ERROR',
                        setIndex
                    });
                }
            } else {
                obj['startDate'] += ' 00:00:00';
                obj['endDate'] += ' 00:00:00';
            }

            if (props.dependantIndexes.length) {
                obj.dependantId = Number(set.dependantId[0]);
            }

            return obj;
        });

        if (isValid) {
            props.addToCart(arr, () => {
                props.onBook && props.onBook();
            });
        }

    }

    const getSingleSet = (valueSet, setIndex) => {
        return attrData.map(({ Component, ...attr }, index) => {
            const value = valueSet.values[index];
            return (
                <Attribute
                    key={attr.attributeId}
                    className={styles['form-input']}
                    attr={{
                        ...attr,
                        value
                    }}
                    onChange={(index, value) => onChange(setIndex, index, value)}
                />
            );
        });
    }

    const onSlotSave = (setIndex, slot) => {
        dispatch({
            type: 'SET_SLOT',
            setIndex,
            slot
        });
    }

    const onDependantChange = (setIndex, val) => {
        dispatch({
            type: 'SET_DEPENDANT',
            setIndex,
            dependantId: val
        })
    }

    return (
        <>
            <Booked />
            <div className={`${styles['booking-form']} ${styles['separator']} ${props.className}`}>
                <Button
                    clickHandler={addSet}
                    className={styles['add-resource']}
                >
                    Add {props.selectedResource.dropDownName}
                </Button>
                {inputs.map((valueSet, index) => {
                    return (
                        <div
                            key={index}
                            className={styles['value-set']}
                        >
                            {index !== 0 && (
                                <div
                                    className={`${commonStyles['close-icon']} ${styles['set-close']}`}
                                    onClick={() => deleteSet(index)}
                                >
                                    <span className={`icon-closeLight`} />
                                </div>
                            )}
                            <div className={styles['set-attrs']}>
                                {getSingleSet(valueSet, index)}

                            </div>
                            {props.addons && props.addons.length > 1 && (
                                <AddOns
                                    addons={props.addons}
                                    onChange={(attrIndex, value) => onAddonChange(index, attrIndex, value)}
                                    addonValues={valueSet.addons}
                                />
                            )}
                            {showSlots && (
                                <div className={styles['add-slots']}>
                                    <Slots
                                        selectedSlot={valueSet.selectedSlot}
                                        onSave={slot => onSlotSave(index, slot)}
                                        dest={props.sliderDest}
                                        error={valueSet.slotError}
                                    />
                                </div>
                            )}
                            {props.dependantIndexes.length > 0 && (
                                <SelectDependant
                                    dependants={props.dependants}
                                    dependantIndexes={props.dependantIndexes}
                                    value={valueSet.dependantId}
                                    onChange={onDependantChange}
                                    setIndex={index}
                                    verticalId={props.verticalId}
                                />
                            )}
                        </div>
                    );
                })}
                {props.renderBtn && (
                    <Button
                        className={styles['book-btn']}
                        disabled={!props.resourceAvailable}
                        size='lg'
                        clickHandler={onBook}
                    >
                        Book Now
                    </Button>
                )}
            </div>
        </>
    );
});

BookingForm.defaultProps = {
    className: '',
    renderBtn: true
}

const mapStateToProps = ({ booking, userData }, props) => ({
    ...props,
    query: booking.query,
    searchForm: booking.searchForm,
    verticalId: userData.verticalId,
    addons: booking.addons,
    price: booking.price,
    resourceAvailable: booking.resourceAvailable,
    dependants: booking.dependants,
    dependantIndexes: booking.dependantIndexes,
    slotTime: booking.settingsData.slotTime,
    selectedResource: booking.selectedResource
});

export default connect(mapStateToProps, {
    updateBookingInfo,
    updatePriceAndAvailablity,
    addToCart
}, null, { forwardRef: true })(BookingForm);