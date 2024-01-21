import { useState, useEffect } from 'react';
import { useStopwatch, TimerRenderer } from "react-use-precision-timer";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import levels from './data/levels.json'

import InputLabel from '@mui/material/InputLabel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination'
import {Link} from 'react-router-dom'



function formatString(totalMs) {
    const seconds = Math.floor(totalMs / 1000);
    const ms = Math.floor((totalMs - seconds * 1000) / 10);
    return (
        `Tempo: ${seconds}:${ms}`
    )
}

function getScore(totalMs) {
    const seconds = (totalMs / 1000) + 1
    return Math.round(100 / seconds)
}
function getCurrentScore(totalMs) {
    return `Punteggio: ${getScore(totalMs)}`;
}

function Option({ optionName, onClick, enabled }) {
    return <Button variant='outlined' size='large' onClick={onClick} disabled={!enabled}> {optionName}</Button>
}

function OptionGroup({ options, setAnswer, enabled }) {
    return (
        <Grid container spacing={2}>
            {options.map((opt, i) => {
                return (
                    <Grid item key={opt} xs={4}>
                        <Option
                            optionName={opt}
                            onClick={(e) => { setAnswer(i) }}
                            enabled = {enabled}
                        />
                    </Grid>
                )
            })}
        </Grid>
    )
}

function Stopwatch({ stopwatch }) {
    return (
        <>
        <Stack direction='column' spacing={2} alignContent='center'>
            <Stack item >
                <TimerRenderer
                    timer={stopwatch}
                    render={(t) => <>{formatString(t.getElapsedRunningTime())}</>}
                    renderRate={10} // In milliseconds
                />
                </Stack>
            <Stack item >
                <TimerRenderer
                    timer={stopwatch}
                    render={(t) => <>{getCurrentScore(t.getElapsedRunningTime())}</>}
                    renderRate={10} // In milliseconds
                />
            </Stack>
        </Stack>
        </>
    )
}


function getInitialGameState() {
    return {
        currentLevel: 0,
        hasStarted: false,
        audioPlaying: false,
        history: [],
        enterPlayerName: true,
        playerName: ""
    }
}

const Game = () => {
    const [gameState, setGameState] = useState(getInitialGameState())
    const {
        currentLevel,
        hasStarted,
        audioPlaying,
        enterPlayerName,
        ...otherGameStateProps
    } = gameState;

    const {
        audioSource,
        question,
        options,
        endLevel,
        showAnswersAtStart,
        ...otherLevelProps
    } = levels.levels[gameState.currentLevel]

    const [audio, setAudio] = useState(new Audio(audioSource))
    const stopwatch = useStopwatch();

    useEffect(() => {
        if (audioPlaying) {
            audio.play()
            if (stopwatch.isStarted()) {
                stopwatch.resume()
            }
            else {
                stopwatch.start()
            }
        }
        else {
            audio.pause()
            stopwatch.pause()
        }
    }, [audioPlaying])

    useEffect(() => {
        if (audioSource != "") {
            let newAudio = new Audio(audioSource)
            newAudio.loop = true
            setAudio(newAudio)
        }
        else
            setAudio(new Audio(""))
    }, [audioSource])
    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    useEffect(() => {
        if (endLevel === true) {
            // Update leaderboard
            const score = computeScore();
            var leaderboard = JSON.parse(localStorage.getItem('LEADERBOARD'))
            if (leaderboard === null) {
                leaderboard = []
            }
            localStorage.setItem('LEADERBOARD', JSON.stringify(
                [...leaderboard,
                {
                    name: gameState.playerName,
                    score: score
                }]
            ))
        }
    }, [endLevel])

    function setAnswer(idx) {
        if (hasStarted) { 
            const history = {
                timeTaken: stopwatch.getElapsedRunningTime(),
                answerIdx: idx
            }
            stopwatch.stop()

            setGameState(prevState => ({
                ...prevState,
                currentLevel: prevState.currentLevel + 1,
                hasStarted: false,
                audioPlaying: false,
                history: [...prevState.history, history]
            }))
        }
    }

    function toggle() {
        setGameState(prevState => ({
            ...prevState,
            audioPlaying: !audioPlaying,
            hasStarted: true
        }))
    }


    const onEnterName = (e) => {
        e.preventDefault();
        const enteredName = e.target.name.value
        if (enteredName !== "") {
            setGameState({
                ...gameState,
                playerName: enteredName,
                enterPlayerName: false,
                hasStarted: false,
                audioPlaying: false,
                currentLevel: 0
            });
        }
    }
    const newGame = () => {
        setGameState(getInitialGameState());
    }

    const computeScore = () => {
        var totalScore = 0;
        for (let i = 0; i < gameState.history.length; i++) {
            let h = gameState.history[i]
            totalScore += h.answerIdx === levels.levels[i].answerIdx ? getScore(h.timeTaken) : 0
        }
        
        return totalScore
    }


    if (enterPlayerName) {
        return (
            <form onSubmit={onEnterName} >
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    height={300}
                >
                    <Stack direction="row" spacing={2} alignItems='stretch' justifyContent="center">
                        <InputLabel sx={{alignSelf : 'center'}}>Nome:</InputLabel>
                        <TextField id='name'/>
                        <Button variant='outlined' size='large' type="submit">
                            Inizia
                        </Button>
                    </Stack>
                </Grid>
            </form>
        )
    }
    else if (endLevel) {
        console.log(gameState)
        const score = computeScore();

        return (
            <>
                <h1>Congratulazioni {gameState.playerName}!</h1>
                <p>Punteggio: {score} </p>

                <Button variant='outlined' onClick={newGame}>Nuova partita</Button>
                <Link to='/leaderboard'> <Button variant='outlined'>Leaderboard</Button> </Link> 
            </>
        )
    }


    return (
        <>
            <Grid container>
                <Grid container>
                    <Grid item xs={12}>
                        <h2>Livello {gameState.currentLevel + 1} </h2>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Premi play per cominciare</p>
                    </Grid>
                </Grid>
                <Grid container justifyContent='center' alignItems='center' direction='row' columnSpacing={2}>
                    <Grid item xs={6}>
                        <Button sx={{borderRadius : '100%', 'width' : '100px', height: '100px', fontSize : '50px'}} variant="outlined" onClick={toggle}>
                            {audioPlaying ? <PauseIcon fontSize='1rem' /> : <PlayArrowIcon fontSize='1rem'/>}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Stopwatch stopwatch={stopwatch} />
                    </Grid>
                </Grid>

                <Grid container >
                    <Grid item xs={12}>
                        <h2> {question} </h2>
                    </Grid>
                </Grid>
                { (showAnswersAtStart || hasStarted) && <OptionGroup options={options} setAnswer={setAnswer} enabled={hasStarted} /> }

                <Grid container marginTop={10}>
                    <Grid item xs={12}>
                        <Pagination page={currentLevel + 1} count={levels.levels.length - 1} variant="outlined" hideNextButton hidePrevButton/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}


export default Game