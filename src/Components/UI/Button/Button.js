import React from 'react';
import './Button.css';

const Button = props => {
    return (
        <button id={props.text} className="loopButton" onClick={ props.handleClick } disabled={ props.disable } >
            <i className={ props.icon } />
            <span >{ props.text }</span >
        </button >
    );
};
export default Button;


