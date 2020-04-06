import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { isSameDay, format } from 'date-fns';
import styles from './slots.scss';
import Slider from 'react-slick';
import { setSlotData } from '../../../actions/slots';

const DateList = props => {
    const [leftArrow, toggleLeftArrow] = useState(false);
    const [rightArrow, toggleRightArrow] = useState(props.dateList.length > 7);
    const slider = useRef(null);
    const datesInARow = 7;
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: datesInARow,
        slidesToScroll: datesInARow,
        autoplay: false,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => {
            console.log(oldIndex, newIndex);
            const dateList = props.dateList;
            const totalDates = dateList.length;
            let startIndex = newIndex;
            if (totalDates - newIndex < datesInARow) {
                startIndex = totalDates - datesInARow;
            }

            let leftArrow = true;
            let rightArrow = true;

            if (startIndex + datesInARow >= totalDates) {
                rightArrow = false;
            } else if (startIndex === 0) {
                leftArrow = false;
            }

            console.log(dateList[startIndex]);
            props.setSlotData({
                startDateObj: dateList[startIndex],
                interval: 7,
                setDateList: false,
                cb: () => console.log('data set')
            });

            toggleLeftArrow(leftArrow);
            toggleRightArrow(rightArrow);
        }
    }

    return (
        <div
            className={styles['date-list']}
        >
            <div className={styles['arrows-container']}>
                <div
                    className={`${styles['slider-arrow']} ${styles['left-arrow']} icon-pagination-left ${!leftArrow ? styles['disabled-arrow'] : ''}`}
                    onClick={() => slider.current.slickPrev()}
                />
                <div
                    className={`${styles['slider-arrow']} ${styles['right-arrow']} icon-pagination-right ${!rightArrow ? styles['disabled-arrow'] : ''}`}
                    onClick={() => slider.current.slickNext()}
                />
            </div>
            <Slider
                {...settings}
                ref={slider}
            >
                {props.dateList.map(date => {
                    const month = format(date, 'MMM');
                    const day = format(date, 'dd');
                    const isSelected = isSameDay(date, props.selected);

                    return (
                        <div
                            className={`${styles['single-date']} ${isSelected ? styles['selected-date'] : ''}`}
                            key={`${day}-${month}`}
                            onClick={() => props.onClick(date)}
                        >
                            <div className={styles['date-day']}>
                                {day}
                            </div>
                            <div className={styles['date-month']}>
                                {month}
                            </div>
                        </div>
                    )
                })}
            </Slider>
        </div>
    );
}

export default connect(null, { setSlotData })(DateList);