import React from 'react';
import './Grid.css';
import Square from "../../UI/Square/Square";

const Grid = props => {
    return (
        <div className="grid-container" >
            { props.cells.map((cell, index) =>
                <Square
                    key={ index }
                    text={ cell.name }
                    value={ cell.value }
                    handleClick={ props.handleCellClick }
                />
            ) }
        </div >
    );
};

export default Grid;
