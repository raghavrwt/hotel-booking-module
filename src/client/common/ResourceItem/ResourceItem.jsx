import React from 'react';
import styles from './resource-item.scss';
import {Link} from 'react-router-dom';
import { Button } from 'jd-library';
import config from '../../../config/config';
import WebView from './WebView';
import MobileView from './MobileView';

const ResourceItem = props => {
    const attrHtml = props.attrs.map((attr, index) => {
        return (
            <div 
                key={index}
                className={styles['single-attr']}
            >
                {attr.title}: {attr.value}
            </div>
        );
    });

    const image = props.image ? `${config.imageDomains[0]}/product${props.image}` : 'https://image1.jdomni.in/jdomni_email/NoImage_2_1812051829.png';
    const Component = props.isMobile ? MobileView : WebView;

    return (
        <Component 
            {...props}
            image={image}
            attrs={attrHtml}
        />
    );
}

ResourceItem.defaultProps = {
    attrs: [],
    // buttonType: 'button'
}

export default React.memo(ResourceItem);