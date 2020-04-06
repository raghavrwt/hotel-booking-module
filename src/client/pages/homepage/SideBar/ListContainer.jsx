import React from 'react';
import MenuItem from './MenuItem';
import styles from './side-bar.scss';

const ListContainer = (props) => {

    const onItemClick = (e, item) => {
        const path = props.path;

        if(path.indexOf(item.id) === -1) {
            const parentIndex = path.indexOf(props.parentId);

            if(parentIndex === path.length - 1) {
                props.setPath(path.concat(item.id));
            } else {
                props.setPath(path.slice(0, parentIndex+1).concat(item.id));
            }
        }
        
        props.onItemClick && props.onItemClick(e, item);
    }

    return (
        <div className={`${styles['list-container']} ${props.className}`}>
            {props.list.map(item => (
                <MenuItem 
                    key={item.id}
                    item={item}
                    onClick={onItemClick}
                    path={props.path}
                    verticalId={props.verticalList ? item.id * -1 : props.verticalId}
                    setPath={props.setPath}
                />
            ))}
        </div>
    );
}

ListContainer.defaultProps = {
    className: ''
}

export default ListContainer;