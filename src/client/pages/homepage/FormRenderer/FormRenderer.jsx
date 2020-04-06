import React, {useState, useEffect, useMemo, useContext} from 'react';
import { connect } from 'react-redux';
import AppContext from '../../../context/AppContext';
import Segment from './Segment';
import PageHeader from '../PageHeader';
import AddOn from './AddOn';
import styles from './form-renderer.scss';
import {
    validateField,
    getDefaultValue,
    getDependantSegment,
    getAddOnSegment,
    getGroupSegment
} from '../../../common/formFunctions';
import {
    setResourceList,
    saveFormData
} from '../../../actions/page';

const FormRenderer = ({
    menu, 
    data: values, 
    selectedMenu, 
    setResourceList, 
    menuData, 
    selectedVertical,
    saveFormData,
    addon,
    partOf,
    dependantOn,
    partOfGroup,
    resourceId
}) => {
    const [attrObj, setAttrObj] = useState(null);
    const [formArr, setFormArr] = useState([]);
    const [addOns, setAddOn] = useState(null);
    const [saveLoader, toggleSaveLoader] = useState(false);
    const isEdit = resourceId !== null;
    const context = useContext(AppContext);
    const resourceName = useMemo(() => {
        if(!isEdit || !attrObj) {
            return null;
        }

        let arr = Object.keys(attrObj);

        for(let i=0;i<arr.length;i++) {
            if(attrObj[arr[i]].resourceType == 'NAME') {
                return attrObj[arr[i]].value[0].toLowerCase();
            }
        }
    }, [attrObj]);

    useEffect(() => {
        let obj = {};
        let arr = [];
        
        if(selectedMenu.dependantOn === null && selectedMenu.partOf !== null) {
            const [group, groupVal] = getGroupSegment({
                menuObj: selectedMenu,
                data: menuData, 
                selectedVertical,
                partOfGroup
            });

            if(group) {
                arr = arr.concat(group);
                values = values.concat(groupVal);
            }
        }
        
        if(selectedMenu.dependantOn !== null || selectedMenu.partOf !== null) {
            const [attrs, vals] = getDependantSegment({
                menuObj: selectedMenu, 
                data: menuData, 
                selectedVertical,
                values: {
                    partOf,
                    dependantOn
                }
            });

            arr = arr.concat(attrs);

            values = values.concat(vals);
        }

        arr = arr.concat(menu);

        arr.forEach(seg => {
            seg.attributes.forEach(attr => {
                let value = getDefaultValue(attr, seg.repeat == 1);
                
                switch(attr.type) {
                    case 'CHECKBOX':
                        if(!attr.values || !attr.values.length || typeof attr.values[0] !== 'string') {
                            break;
                        }
                        attr.values = attr.values.map(val => ({
                            name: val,
                            id: val
                        })); 
                    break;
                    case 'DROPDOWN':
                        attr.values = attr.values.map(val => ({
                            name: val,
                            id: val
                        })); 
                        if(!seg.repeat) {
                            break;
                        }
                        attr.defaultTag = 'Select';
                    break;
                }

                obj[attr.attributeId] = {
                    ...attr,
                    value,
                    error: [],
                    errorMsg: []
                };
            });
        });

        values.forEach(val => {
            const attr = obj[val.attributeId];

            obj[val.attributeId] = {
                ...attr,
                value: val.values || attr.value,
                error: []
            };
        });

        const addOnData = addon.map(a => {
            let result = {};

            Object.keys(a).forEach(attr => {
                if(attr == 'addonId') {
                    return result[attr] = a[attr];
                }

                result[attr] = {
                    value: [a[attr]]
                };
            });

            return result;
        });

        setFormArr(arr);
        setAttrObj(obj);
        setAddOn(addOnData);
    }, [menu, values]);

    const handleChange = (attrId, value, otherAttrs) => {
        setAttrObj(values => {
            return ({
                ...values,
                [attrId]: {
                    ...values[attrId],
                    value,
                    error: [],
                    errorMsg: [],
                    ...otherAttrs
                }
            })
        });
    }

    const handleSubmit = e => {
        let shouldProceed = true;
        let obj = {};

        //form validation
        Object.keys(attrObj).forEach(attrId => {
            const attr = attrObj[attrId];
            const {
                isValid,
                error,
                errorMsg
            } = validateField(attr);

            obj[attrId] = {
                ...attr,
                error,
                errorMsg
            };

            shouldProceed = shouldProceed && isValid;
        });
        setAttrObj(obj);

        //addon validation
        if(addOns.length) {
            const attrs = getAddOnSegment().attributes;
            const keysToExclude = ['addonId'];
            addOns.forEach(addOn => {
                attrs.forEach(attr => {
                    if(keysToExclude.includes(attr.attributeId)) {
                        return;
                    }
                    const {
                        isValid,
                        error,
                        errorMsg
                    } = validateField({...attr, ...addOn[attr.attributeId]});

                    shouldProceed = shouldProceed && isValid;

                    addOn[attr.attributeId] = {
                        ...addOn[attr.attributeId], 
                        error,
                        errorMsg
                    };
                });
            });
        }

        if(!shouldProceed) {
            return;
        }

        toggleSaveLoader(true);

        saveFormData(attrObj, addOns, (pageChanged) => {
            if(!pageChanged) {
                toggleSaveLoader(false);
            }
            context.toast.showToast({message: 'Saved Successfully', type: 'success'})
        });
    }

    const listHtml = attrObj ? formArr.map(segment => {
        return (
            <Segment 
                key={segment.title}
                segment={segment}
                values={attrObj}
                onChange={handleChange}
            />
        )
    }) : null;

    const isMultiple = selectedMenu.allowMultiple === 1;
    let title = '';

    if(!isMultiple) {
        title = selectedMenu.name;
    } else if(isEdit) {
        title = resourceName;
    } else {
        title = `Add ${selectedMenu.name}`;
    }

    return (
        <div className={styles['form-renderer']}>
            <PageHeader 
                textClass={styles['header-text']}
                showBackBtn={isMultiple}
                onBackBtnClick={setResourceList}
                title={title}
                buttons={isMultiple ? [{
                    children: 'Cancel',
                    variant: 'default',
                    clickHandler: setResourceList,
                    className: styles['cancel-btn']
                }, {
                    children: 'Save',
                    clickHandler: handleSubmit,
                    className: styles['save-btn'],
                    showLoader: saveLoader
                }] : [{
                    children: 'Save',
                    clickHandler: handleSubmit,
                    className: styles['save-btn'],
                    showLoader: saveLoader
                }]}
            />
            {listHtml}
            {addOns && selectedMenu.allowAddon ? (
                <AddOn 
                    addOns={addOns}
                    setAddOn={setAddOn}
                />
            ) : null}
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    ...props,
    menuData: state.menu.data,
    selectedMenu: state.menu.selectedMenu,
    selectedVertical: state.menu.selectedVertical,
    ...state.page.data,
});

export default connect(mapStateToProps, {
    setResourceList,
    saveFormData
})(FormRenderer);