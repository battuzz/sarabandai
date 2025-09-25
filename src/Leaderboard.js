import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material'
import { Button, Grid, Box } from '@mui/material'
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Database"

const Leaderboard = ({ username = null }) => {
    const [leaderboard, setLeaderboard] = useState([])
    const baselines = [
        {
            name: 'Random agent 😎',
            baseline: true,
            score: 400
        },
        {
            name: 'Giorgia Franchini',
            baseline: true,
            score: 999,
            label: 'Miaooow! 🐱'
        },
    ]


    useEffect(() => {
        console.log('Fetching leaderboard!');
        var entries = JSON.parse(localStorage.getItem('LEADERBOARD2'))
        if (entries === null) {
            entries = []
        }
        let all_entries = entries.concat(baselines)
        all_entries.sort((a, b) => a.score < b.score ? 1 : -1)
        setLeaderboard(all_entries)
    }, [])

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
                        {leaderboard.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 }, 'backgroundColor':
                                        row.baseline ? '#dddddd' : ((username == row.name) ? '#ffffc5' : '#ffffff')
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
            </TableContainer >
        </>
    )
}

export default Leaderboard