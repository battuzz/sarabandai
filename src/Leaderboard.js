import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material'
import { Button, Grid, Box } from '@mui/material'
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Database"

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([])
    const baselines = [
        {
            name: 'Random agent 😎',
            baseline: true,
            score: 650
        },
        {
            name: 'Baseline #1',
            baseline: true,
            score: 800
        }, 
        {
            name: 'Baseline #2',
            baseline: true,
            score: 1200
        }, 
        {
            name: 'Marco Arena',
            baseline: true,
            label: 'Over 9000',
            score: 10000
        },
        // {
        //     name: 'Giorgia Franchini',
        //     baseline: true,
        //     score: 999,
        //     label: 'NaN'
        // }, 
    ]

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const querySnapshot = await getDocs(collection(db, "leaderboard"));
            const entries = querySnapshot.docs.map((doc) => doc.data());

            let all_entries = entries.concat(baselines)
            all_entries.sort((a, b) => a.score < b.score ? 1 : -1)
            setLeaderboard(all_entries)
        }

        fetchLeaderboard()
            .catch(console.error)
    }, [])

    // useEffect(() => {
    //     var entries = JSON.parse(localStorage.getItem('LEADERBOARD'))
    //     if (entries === null) {
    //         entries = []
    //     }
    //     let all_entries = entries.concat(baselines)
    //     all_entries.sort((a, b) => a.score < b.score ? 1 : -1)
    //     setLeaderboard(all_entries)
    // }, [])

    return (
        <>
            <Grid container alignItems={'center'}>
                <Grid item xs={8}>
                    <h1>Classifica</h1>
                </Grid>
            </Grid>

            <TableContainer>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Nome</b></TableCell>
                            <TableCell align="right"><b>Punteggio</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 }, 'backgroundColor':
                                        row.baseline ? '#dddddd' : '#ffffff'
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.baseline ? <b> {row.name}</b> : row.name}
                                </TableCell>
                                <TableCell align="right">
                                    {row.baseline ? (row.label ? <b>{row.label}</b> : <b>{row.score}</b>) : row.score}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Leaderboard