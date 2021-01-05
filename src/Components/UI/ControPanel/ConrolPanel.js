import React from 'react';
import './ControlPanel.css';
import Button from "../Button/Button";

const ControlPanel = props => {

    return (
        <div >
            <div className="controlPanel" >
                { props.controls.map((control, index) =>
                    <Button
                        key={ index }
                        text={ control.text }
                        icon={ control.icon }
                        handleClick={ control.clickHandler }
                        disable={ control.disable } />
                ) }
            </div >
            <div className="controlPanel controlsRecord" >
                { props.controlsRecord.map((control, index) =>
                    <Button
                        key={ index }
                        text={ control.text }
                        icon={ control.icon }
                        handleClick={ control.clickHandler }
                        disable={ control.disable } />
                ) }
            </div >
        </div >
    );
};

export default ControlPanel;


