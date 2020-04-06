import React, {useRef, useState} from 'react';
import {connect} from 'react-redux';
import styles from './photo.scss';
import {uploadImage} from '../../common/requests';
import config from '../../../config/config';

const validTypes = ['jpg', 'jpeg', 'png', 'webp'];

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const Photo = props => {
    const inputRef = useRef(null);
    const max = props.max || 10;
    const [photoList, setPhotoList] = useState(() => {
        return props.value.map(img => ({
            src: `${config.imageDomains[0]}/product${img}`,
            id: `${img}${Date.now()}`
        }));
    });

    const onUpload = async e => {
        const files = e.target.files;
        const promises = [];
        let value = [...props.value];

        for(let i=0;i<files.length;i++) {
            promises.push(uploadFile(files[i]));
        }

        const responses = await Promise.all(promises);
        let error = false;

        responses.forEach(response => {
            if(response.status !== 'success') {
                error = true;
                return;
            }
            value.push(response.imgURL);
        });

        props.onChange(props.attributeId, value, {
            error,
            errorMsg: 'Some problem occured'
        });
    }

    const uploadFile = async (file) => {
        if(!file) {
            return {
                status: 'fail'
            }
        }

        const fileSizeInMB = file.size / (1024 * 1024);
        const fileType = file.name.split(".").pop();
        
        if(fileSizeInMB > props.maxSize) {
            console.error('max size');
            return {
                status: 'fail',
                errorMsg: `Image greater than ${props.maxSize}MB`
            }
        }

        if(!validTypes.includes(fileType)) {
            console.error('not valid file type');
            return {
                status: 'fail',
                errorMsg: 'Image is not of valid type'
            }
        }

        toBase64(file).then(result => {
            setPhotoList(list => list.concat({id: Date.now(), src:result}));
        }).catch(e => console.error(e));

        return uploadImage({
            file,
            supId: props.supId
        });
    }

    const deletePhoto = (index) => {
        const newList = [...photoList];
        newList.splice(index, 1);
        setPhotoList(newList);
        
        const newValList = [...props.value];
        newValList.splice(index, 1);
        props.onChange(props.attributeId, newValList);
    }

    const listHtml = photoList.map((photo, index) => {
        return (
            <div 
                className={styles['single-photo-container']}
                key={photo.id}
            >
                <img 
                    src={photo.src} 
                    className={styles['photo']}
                />
                <span 
                    className={`icon-closeLight ${styles['photo-close']}`} 
                    onClick={() => deletePhoto(index)}
                />
            </div>
        );
    });

    return (
        <div className={styles['photo-container']}>
            <div className={styles['list-container']}>
                {photoList.length < max ? (
                    <div 
                        className={`${styles['add-photo']}`}
                        onClick={() => inputRef.current.click()}
                    >
                        <span className={`icon-plus ${styles['add-photo-icon']}`} />
                    </div>
                ) : null}
                {listHtml}
            </div>
            <div className={styles['count-text']}>
                {photoList.length}/{max}
            </div>
            <input 
                type='file'
                ref={inputRef}
                style={{
                    display: 'none'
                }}
                multiple={true}
                onChange={onUpload}
                accept='image/*'
            />
        </div>
    )
}

Photo.defaultProps = {
    maxSize: 50,
    max: 10
}

const mapStateToProps = (state, props) => ({
    ...props,
    supId: state.userData.supId
})

export default connect(mapStateToProps, null)(Photo);