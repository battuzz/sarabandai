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
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';

import { collection, addDoc } from "firebase/firestore";
import { db } from "./Database";

import parse from 'html-react-parser'


function formatString(totalMs) {
    const seconds = Math.floor(totalMs / 1000);
    const ms = Math.floor((totalMs - seconds * 1000) / 10);
    return (
        `Tempo: ${seconds}:${ms}`
    )
}

function getScore(totalMs) {
    const seconds = (totalMs / 1000)
    return Math.round(Math.max(0, 100 - 8 * Math.max(seconds - 1, 0)))
}
function getCurrentScore(totalMs) {
    return `Punteggio: ${getScore(totalMs)}`;
}

function Option({ optionName, onClick, enabled, borderColor }) {
    return <Button
        variant='outlined'
        size='large'
        onClick={onClick}
        disabled={!enabled}
        color={borderColor}
    >
        {optionName}
    </Button>
}

function OptionGroup({ options, setAnswer, enabled, showCorrectAnswer, correctAnswerIdx }) {
    const width = options.length > 3 ? 6 : null;
    return (
        <>
            <Grid container spacing={2} justifyContent="space-evenly" alignItems="stretch">
                {options.map((opt, i) => {
                    return (
                        <Grid item key={opt} xs={width} justifyContent="center" sx={{ display: 'flex' }}>
                            <Option
                                optionName={opt}
                                onClick={(e) => { setAnswer(i) }}
                                enabled={enabled}
                                borderColor={showCorrectAnswer ? (i == correctAnswerIdx ? 'success' : 'error') : undefined}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}

function Stopwatch({ stopwatch }) {
    return (
        <>
            <Stack direction='column' spacing={2} alignContent='center'>
                <Stack >
                    <TimerRenderer
                        timer={stopwatch}
                        render={(t) => <>{formatString(t.getElapsedRunningTime())}</>}
                        renderRate={10} // In milliseconds
                    />
                </Stack>
                <Stack  >
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
        playerName: "",
        currentAnswer: -1,
        timeTaken: undefined
    }
}

const Game = () => {
    const [gameState, setGameState] = useState(getInitialGameState())
    const {
        currentLevel,
        hasStarted,
        audioPlaying,
        enterPlayerName,
        currentAnswer,
        ...otherGameStateProps
    } = gameState;

    const {
        audioSource,
        question,
        options,
        endLevel,
        showAnswersAtStart,
        answerIdx,
        showCorrectAnswer,
        ...otherLevelProps
    } = levels.levels[gameState.currentLevel]

    const audioCorrect = new Audio(process.env.PUBLIC_URL + '/data/risposta corretta.m4a')
    const audioWrong = new Audio(process.env.PUBLIC_URL + '/data/risposta sbagliata.m4a')

    const [audio, setAudio] = useState(new Audio(process.env.PUBLIC_URL + audioSource))
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
            let newAudio = new Audio(process.env.PUBLIC_URL + audioSource)
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

            const updateLeaderboard = async (name, score) => {
                const docRef = await addDoc(collection(db, "leaderboard"), {
                    name: name,
                    score: score
                });
            }

            updateLeaderboard(gameState.playerName, score)
                .catch(console.error)

        }
    }, [endLevel])

    function setAnswer(idx) {
        if (hasStarted && currentAnswer == -1) {
            const responseAudio = idx === answerIdx
                ? audioCorrect
                : audioWrong
            // responseAudio.play()

            const timeTaken = stopwatch.getElapsedRunningTime()
            const history = {
                timeTaken: timeTaken,
                answerIdx: idx
            }

            setGameState(prevState => ({
                ...prevState,
                audioPlaying: false,
                currentAnswer: idx,
                timeTaken: timeTaken,
                history: [...prevState.history, history]
            }))
        }
    }

    function nextLevel() {
        if (currentAnswer != -1) {
            // const history = {
            //     timeTaken: gameState.timeTaken,
            //     answerIdx: currentAnswer
            // }
            stopwatch.stop()
            setGameState(prevState => ({
                ...prevState,
                hasStarted: false,
                audioPlaying: false,
                currentLevel: prevState.currentLevel + 1,
                currentAnswer: -1,
                // history: [...prevState.history, history]
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
            <Stack direction="column">
                <form onSubmit={onEnterName} >
                    <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        height={100}
                    >
                        <Stack direction="row" spacing={2} alignItems='stretch' justifyContent="center">
                            <InputLabel sx={{ alignSelf: 'center' }}>Username:</InputLabel>
                            <TextField id='name' />
                            <Button variant='outlined' size='large' type="submit">
                                Inizia
                            </Button>
                        </Stack>
                    </Grid>
                </form>

                <div>
                    <h1>Istruzioni per giocare a SarabandAI</h1>
                    <p>
                        Per questo gioco abbiamo usato <b>MusicGen Large</b> per generare alcune tracce musicali, specificandone  <b>genere</b>, <b>anno</b>, <b>emozioni</b> oppure chiedendogli di modificare alcune tracce già esistenti,
                        ad esempio trasformando pezzi di musica classica in trap.
                    </p>
                    <p>
                        Il gioco è molto semplice: ascolterai alcune di queste tracce autogenerate e dovrai rispondere ad alcune domande,
                        tra cui: che genere è stato imposto per generare questa canzone?
                    </p>
                    <p>
                        <b>Nota</b>: come nel vero Sarabanda, il fattore <b>TEMPO</b> è fondamentale!
                    </p>
                    <h2>
                        Rispondi correttamente a tutte le domande prima degli altri!
                    </h2>
                </div>
            </Stack>
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
        <Stack direction="column">
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Livello {gameState.currentLevel + 1} </h2>
                <h2> Punteggio: {computeScore()} </h2>
            </Box>
            <p>Premi play per cominciare</p>
            <Grid container justifyContent='center' alignItems='center' direction='row' columnSpacing={2}>
                <Grid item xs={6} justifyContent="right" sx={{ display: 'flex', paddingRight: '30px' }}>
                    <Button sx={{ borderRadius: '100%', 'width': '100px', height: '100px', fontSize: '50px' }} variant="outlined" onClick={toggle}>
                        {audioPlaying ? <PauseIcon fontSize='1rem' /> : <PlayArrowIcon fontSize='1rem' />}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Stopwatch stopwatch={stopwatch} />
                </Grid>
            </Grid>

            <Box textAlign={'center'}>
                <h2> {parse(question)} </h2>
            </Box>

            {(showAnswersAtStart || hasStarted)
                ? <OptionGroup 
                    options={options} 
                    setAnswer={setAnswer} 
                    enabled={hasStarted} 
                    showCorrectAnswer={currentAnswer != -1 && showCorrectAnswer}
                    correctAnswerIdx = {answerIdx}
                />
                : <p>Premi play per vedere le opzioni</p>
            }

            {
                currentAnswer == -1
                    ? <span style={{ height: '160px' }}></span>
                    : <Button
                        sx={{ width: 0.25, marginLeft: 'auto', height: '60px', marginTop: '100px' }}
                        variant='contained'
                        size='large'
                        onClick={nextLevel}
                        disabled={currentAnswer == -1}
                    > Prossimo livello
                    </Button>
            }


            <Grid container marginTop={10}>
                <Grid item xs={12} justifyContent="center" display='flex'>
                    <Pagination
                        page={currentLevel + 1}
                        count={levels.levels.length - 1}
                        variant="outlined"
                        hideNextButton
                        hidePrevButton
                        boundaryCount={11}
                        color='primary'
                    />
                </Grid>
            </Grid>
        </Stack>
    );
}


export default Game