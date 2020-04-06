import React from 'react';
import Slider from 'react-slick';
import styles from './image.scss';
import config from '../../../../config/config';

const Image = props => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        arrows: false
    }

    return (
        <div className={styles['image-slider-container']}>
            <Slider 
                className={styles['image-list']}
                {...settings}
            >
                {props.images.map((image, index) => (
                    <div 
                        className={`${styles['list-item']}`}
                        key={index}
                    >
                        <img 
                            className={styles['item-image']}
                            src={`${config.imageDomains[0]}/product/${image}`}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Image;