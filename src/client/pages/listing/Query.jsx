import React, { useReducer, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './query.scss';
import Input from '../../common/Attributes/Input';
import Dropdown from '../../common/Attributes/Dropdown';
import DateInput from '../../common/Attributes/DateInput';
import Attribute from '../../common/Attributes/Attribute';
import { Button } from 'jd-library';
import { postQuery } from '../../actions/listing';
import {
    formatFormAttr
} from '../../common/customer/functions';
import {
    serverDateFormat
} from '../../common/dateFunctions';
import {
    parse
} from 'date-fns';

const map = {
    DROPDOWN: {
        Component: Dropdown,
        className: styles['query-input']
    },
    INT: {
        Component: Input,
        containerClass: styles['query-input'],
        spinner: true
    },
    DATE: {
        Component: DateInput
    }
}

const init = ({ attrData, query }) => {
    return attrData.map(attr => {
        return query[attr.name] ? [query[attr.name].paramValue] : attr.value
    });
}

const reducer = (state, action) => {

    console.log(state);
    console.log(action);
    switch (action.type) {
        case 'UPDATE_VALUE': {
            const newState = [...state];
            newState[action.index] = action.value;

            action.attrData.forEach((attr, index) => {
                if (attr.startReference === action.index) {
                    newState[index] = action.value;
                }
            });

            return newState;
        }
        default:
            return state;
    }
}

const Query = props => {
    let firstDateIndex = -1;
    let dateSet = false;

    const attrData = useMemo(() => {
        return props.searchForm.map((attr, index) => {
            let obj = {
                ...formatFormAttr(attr, index),
                ...map[attr.type]
            };

            //second date should start from val of first date
            if (attr.type === 'DATE') {
                if (firstDateIndex === -1) {
                    firstDateIndex = index;
                } else if (!dateSet) {
                    dateSet = true;
                    obj.startReference = firstDateIndex;
                }
            }

            return obj;
        });
    }, []);

    console.log(attrData);
    console.log(props.query);
    const [values, dispatch] = useReducer(reducer, { attrData, query: props.query }, init);
    console.log(values);
    const history = useHistory();
    const location = useLocation();

    const onChange = (attributeId, value) => {
        dispatch({
            type: 'UPDATE_VALUE',
            index: attributeId,
            value,
            attrData
        });
    }

    const onSearch = () => {
        props.postQuery(values.map(val => val[0]), (query) => {
            history.replace(`${location.pathname}?${query}`)
        });
    }

    return (
        <div className={styles['query']}>
            <div className={styles['query-attrs']}>
                {attrData.map(({ Component, startReference, ...attr }, index) => {
                    const value = values[index];
                    let min = null;

                    if (typeof startReference !== 'undefined') {
                        min = parse(values[startReference][0], serverDateFormat, new Date());
                    }

                    return (
                        <Attribute
                            key={attr.attributeId}
                            className={styles['query-attribute']}
                            attr={{
                                ...attr,
                                value,
                                min
                            }}
                            // {...attr}
                            min={min}
                            value={value}
                            onChange={onChange}
                        />
                    );
                })}
            </div>
            <Button
                className={styles['search-btn']}
                clickHandler={onSearch}
            >
                Search
            </Button>
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    ...props,
    searchForm: state.booking.searchForm,
    query: state.booking.query
});

export default connect(mapStateToProps, {
    postQuery
})(Query);