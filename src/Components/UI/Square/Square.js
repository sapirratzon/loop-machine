import React, { createRef } from 'react';
import './Square.css';

const Square = props => {
    const audio = createRef();
    const squareDiv = createRef();

    const handleClick = event => {
        squareDiv.current.style.backgroundColor = (squareDiv.current.style.backgroundColor === '' ? '#eaab57' : null);
        squareDiv.current.style["box-shadow"] = (squareDiv.current.style["box-shadow"] === '' ? '9px 8px 5px #fffafa52' : null);
        props.handleClick(event, audio.current);
    };

    return (
        <div ref={ squareDiv } id={ props.text } className="square col-4" onClick={ handleClick } >
            {/*<span > { props.text } </span >*/ }
            <img className="iconSVG" src={ props.icon } alt="search" />
            <audio ref={ audio } id={ props.text } src={ props.value } />
        </div >
    );
};

export default Square;
