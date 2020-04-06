import React, {useMemo} from 'react';
import {
    getIntervalStr
} from '../../dateFunctions';
import {isSameMinute} from 'date-fns';
import styles from './slots.scss';

const SlotList = props => {
    return (
        <div className={styles['slot-list']}>
            {props.slotsList.map(slot => {
                const slotStr = getIntervalStr(slot.date);
                const isSelected = isSameMinute(slot.date, props.selected);

                return (
                    <div
                        className={`${styles['single-slot']} ${isSelected ? styles['selected-slot'] : ''} ${slot.blocked ? styles['blocked-slot'] : ''}`}
                        key={slotStr}
                        onClick={() => props.onClick(slot.date)}
                    >
                        {slotStr}
                    </div>
                )
            })}
        </div>
    );
}

export default SlotList;