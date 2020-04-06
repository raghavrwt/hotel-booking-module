import React from 'react';
import {Form} from 'jd-library';
import styles from './attribute.scss';
import Input from './Input';
import Dropdown from './Dropdown';
import CheckBox from './CheckBox';
import DateInput from './DateInput';
import TextAreaHtml from './TextAreaHtml';
import Tooltip from '../Tooltip/Tooltip';
import Photo from './Photo';
import Radio from './Radio';

const Attribute = (props) => {
    const {
        sectionWidthWeb,
        sectionWidthMobile,
        isPartOfQuery,
        resourceType,
        error,
        errorMsg,
        tooltip,
        ...attr
    } = props.attr;
    const variant = error ? 'invalid' : '';

    let Component = null;
    let containerClass = '';

    switch (attr.type) {
        case 'DROPDOWN':
            Component = Dropdown;
            containerClass = styles['dropdown-container'];
            break;
        case 'CHECKBOX':
            Component = CheckBox;
            containerClass = styles['checkbox-container'];
            break;
        case 'TIME':
        case 'DATE':
        case 'DATETIME':
            Component = DateInput;
            containerClass = styles['date-container'];
            break;
        case 'TEXTAREA_HTML':
            Component = TextAreaHtml;
            containerClass = styles['editor-container'];
            break;
        case 'PHOTO':
            Component = Photo;
            containerClass = styles['photo-container'];
        break;
        case 'RADIO':
            Component = Radio;
            containerClass = styles['radio-container'];
        break;
        default:
            Component = Input;
            containerClass = styles['input-container'];
            break;
    }

    return (
        <Form.Group
            className={`${styles['attribute']} ${containerClass} ${props.className}`}
            style={attr.type !== 'CHECKBOX' && sectionWidthWeb ? {
                flexBasis: `calc(${sectionWidthWeb}% - 1rem)`
            } : {}}
        >
            {attr.name ? (
                <Form.Label
                    variant={variant}
                    className={styles['attribute-label']}
                >
                    {attr.name}
                    {tooltip ? (
                        <Tooltip>{tooltip}</Tooltip>
                    ) : null}
                </Form.Label>
            ) : null}
            <Component
                {...attr}
                variant={variant}
                onChange={props.onChange}
            />
            {error ? (
                <Form.FeedBack variant={variant}>{errorMsg}</Form.FeedBack>
            ) : null}
        </Form.Group>
    );
}

export default Attribute;