import React from 'react';
import {SliderHeader} from 'jd-library'

const SlotsHeader = props => {
    return (
        <SliderHeader
            heading='Select Slots'
            leftIcons={[]}  
            rightIcons={[{
                className: 'icon-closeLight', 
                onClick: props.onCross
            }]}
        />
    );
}

export default SlotsHeader;