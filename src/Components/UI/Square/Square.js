import React, { createRef } from 'react';
import './Square.css';

const Square = props => {
    const audio = createRef();
    const squareDiv = createRef();

    const handleClick = event => {
        squareDiv.current.style.color = (squareDiv.current.style.color === 'yellow' ? 'white' : 'yellow');
        squareDiv.current.style["text-shadow"] = (squareDiv.current.style["text-shadow"] === '' ? '0 0 10px #FF0000, 0 0 3px #0000FF' : null);
        props.handleClick(event, audio.current);
    };

    return (
        <div ref={ squareDiv } id={ props.text } className="square col-4" onClick={ handleClick } >
            <span > { props.text } </span >
            <audio ref={ audio } id={ props.text } src={ props.value } />
        </div >
    );
};

export default Square;
