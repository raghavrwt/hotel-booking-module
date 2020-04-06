import React, {useState} from 'react';
import styles from './image.scss';
import config from '../../../../config/config';

const Image = props => {
    const [selected, setSelected] = useState(0);

    const imageToShow = props.images[selected] ? `${config.imageDomains[0]}/product/${props.images[selected]}` : 'https://image1.jdomni.in/jdomni_email/NoImage_2_1812051829.png';

    return (
        <div className={styles['image-section']}>
            <div className={styles['image-container']}>
                <img 
                    className={styles['image']}
                    src={imageToShow} 
                />
            </div>
            <div className={styles['image-list']}>
                {props.images.map((image, index) => (
                    <div 
                        className={`${styles['list-item']} ${index === selected ? styles['selected'] : ''}`}
                        onClick={() => setSelected(index)}
                        key={index}
                    >
                        <img 
                            className={styles['item-image']}
                            src={`${config.imageDomains[0]}/product/${image}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Image;