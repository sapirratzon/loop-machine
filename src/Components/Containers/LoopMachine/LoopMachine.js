import React, { useState, useEffect, useCallback } from 'react';
import './LoopMachine.css';
import Grid from "../../UI/Grid/Grid";
import ControlPanel from "../../UI/ControPanel/ConrolPanel";
import { Pads } from '../../../Pads/Pads'

const LoopMachine = props => {
        const [padsToPlay, setPadsToPlay] = useState([]);
        const [toPlay, setToPlay] = useState(false);
        const [mainPad, setMainPad] = useState(null);
        const [isRecording, setIsRecording] = useState(false);
        const [userEvents, setUserEvents] = useState([]);
        const [nextSession, setNextSession] = useState([]);
        const [isPlayingRecord, setIsPlayingRecord] = useState(false);
        const [userRecords, setUserRecords] = useState([]);


        const onPlayClick = () => {
            if (padsToPlay.length > 0 && !toPlay)
                setToPlay(true);
            if (isRecording)
                updateSessionNumber();
        };

        const onStopClick = () => {
            setToPlay(false);
            stopAllPads();
            if (isRecording)
                updateSessionNumber();
        };

        const onRecordClick = () => {
            setIsRecording(true);
        };

        /**
         * Set end time to all of the current playing audios.
         */
        const onStopRecordClick = () => {
            setIsRecording(false);
            let updatedSession = [];
            const lastSession = [...userEvents[userEvents.length - 1]];
            const stopTime = lastSession[0].audio.currentTime;
            lastSession.map(pad => updatedSession.push(pad.pause ? pad : {audio: pad.audio, time: stopTime, pause: true}));
            setUserEvents([...userEvents.slice(0, userEvents.length - 1), updatedSession]);
        };

        const setNextSessionPlay = (event, index) => {
            playSession(index);
        };

        /**
         * Used for the record option - play
         * @param index - The index of the current session in userEvents.
         */
        const playSession = (index) => {
            if (index + 1 < userEvents.length) {
                let loop = userEvents[index];
                const longest = getLongestAudio(loop);
                loop.filter(pad => pad.audio.id !== longest.audio.id);
                longest.audio.onended = ((event) => setNextSessionPlay(event, index + 1));
                loop = [...loop, longest];
                setUserEvents(userEvents.splice(index, 1, loop));
            }
            userEvents[index].map(pad => handlePlayPad(pad));
        };

        const onPlayRecordClick = () => {
            setUserRecords(userEvents);
            playSession(0);
            setIsPlayingRecord(true);
        };

        const stopPad = pad => {
            pad.pause();
            pad.currentTime = 0;
            return pad;
        };

        const stopAllPads = useCallback(() => {
                const allPads = padsToPlay;
                padsToPlay.map(pad => stopPad(pad));
                setPadsToPlay(allPads);
            }, [padsToPlay]
        );

        const playAllPads = useCallback(() => {
                stopAllPads();
                padsToPlay.map(pad => pad.play());
            }, [padsToPlay, stopAllPads]
        );

        const updateMainPad = pad => {
            if (mainPad) mainPad.onended = null;
            setMainPad(pad);
        };

        const handleAddPad = audio => {
            setPadsToPlay([...padsToPlay, audio]);
            updateMainPad(padsToPlay.length > 0 ? padsToPlay[0] : audio);
        };


        /**
         * Stop the audio, remove it from the array that holds the pads that are playing
         * and update the pad which leads the loop.
         * @param audio - audio to stop
         */
        const handleRemovePad = audio => {
            audio.pause();
            audio.currentTime = 0;
            const newPadsToPlay = padsToPlay.filter(pad => pad.id !== audio.id);
            setPadsToPlay(newPadsToPlay);
            updateMainPad(newPadsToPlay[0]);
        };

        const handleClickOnPad = (event, audio) => {
            if (isRecording)
                handleClickOnPadRecord(audio);
            if (padsToPlay.includes(audio))
                handleRemovePad(audio);
            else
                handleAddPad(audio);
        };

        const updateSessionNumber = useCallback(() => {
            setUserEvents([...userEvents, nextSession]);
            setNextSession(nextSession.filter(pad => !pad.pause));
        }, [nextSession, setUserEvents, userEvents]);


        const playAllPadsRecord = useCallback(() => {
                if (toPlay) {
                    updateSessionNumber();
                    playAllPads();
                }
            }, [playAllPads, updateSessionNumber, toPlay]
        );


        useEffect(() => {
            if (!isPlayingRecord && toPlay && padsToPlay.length > 0) {
                mainPad.onended = isRecording ? playAllPadsRecord : playAllPads;
                if (toPlay && !padsToPlay.find(pad => pad.currentTime !== 0))
                    playAllPads();
            } else if (padsToPlay.length === 0)
                setToPlay(false);
        }, [padsToPlay, playAllPads, toPlay, mainPad, isRecording, playAllPadsRecord, isPlayingRecord]);


        const handleAddPadRecord = (audio, userEvent) => {
            setNextSession(nextSession.filter(pad => pad.audio.id !== audio.id));
            setNextSession([...nextSession, userEvent]);
        };

        const handleRemovePadRecord = (audio, userEvent) => {
            let sessionToUpdate = [...userEvents[userEvents.length - 1]];
            sessionToUpdate = sessionToUpdate.filter(pad => pad.audio.id !== audio.id);
            sessionToUpdate.push(userEvent);
            setUserEvents([...userEvents.slice(0, userEvents.length - 1), sessionToUpdate]);
            setNextSession(nextSession.filter(pad => pad.audio.id !== audio.id));
        };


        const handleClickOnPadRecord = audio => {
            const userEvent = {audio: audio, time: audio.currentTime, pause: (!audio.paused)};
            if (!audio.paused)
                handleRemovePadRecord(audio, userEvent);
            else
                handleAddPadRecord(audio, userEvent);
        };

        const handlePlayPad = pad => {
            pad.audio.play();
            if (pad.pause) {
                setTimeout(() => {
                    pad.audio.pause();
                }, pad.time * 1000);
            }
        };

        const getLongestAudio = padsList => {
            return padsList.reduce((prev, current) => (prev.y > current.y) ? prev : current);
        };

        const controls = [
            {
                text: 'Play',
                icon: 'fas fa-play-circle',
                clickHandler: onPlayClick,
                disable: padsToPlay.length === 0 || toPlay
            },
            {text: 'Stop', icon: 'fas fa-stop-circle', clickHandler: onStopClick, disable: !toPlay},
        ];

        const controlsRecord = [{
            text: 'Record',
            icon: 'fas fa-record-vinyl',
            clickHandler: onRecordClick,
            disable: isRecording || padsToPlay.length > 0 || toPlay
        },
            {
                text: 'Stop Record',
                icon: 'fas fa-record-vinyl',
                clickHandler: onStopRecordClick,
                disable: !(isRecording)
            },
            {
                text: 'Play Record',
                icon: 'fas fa-record-vinyl',
                clickHandler: onPlayRecordClick,
                disable: false
            }];

        return (
            <div className="loopMachine" >
                <ControlPanel
                    controls={ controls }
                    controlsRecord={ controlsRecord } />
                    <h3> Tap on pad(s) and press play, enjoy! </h3>
                <Grid
                    cells={ Pads }
                    handleCellClick={ handleClickOnPad }
                    allowPlay={ padsToPlay.length > 0 } />
            </div >
        );
    }
;

export default LoopMachine;
