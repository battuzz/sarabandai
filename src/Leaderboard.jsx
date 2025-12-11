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
        // const fetchLeaderboard = async () => {
        //     const querySnapshot = await getDocs(collection(db, "leaderboard"));
        //     const entries = querySnapshot.docs.map((doc) => doc.data());


        //     // Remove duplicates by playerId, keep first occurrence
        //     const seen = new Set()
        //     const filtered_entries = entries.filter(entry => {
        //         if (!entry.player_id) return true // keep entries without playerId
        //         if (seen.has(entry.player_id)) return false
        //         seen.add(entry.player_id)
        //         return true
        //     })
        //     filtered_entries.sort((a, b) => a.score < b.score ? 1 : -1)
        //     setLeaderboard(filtered_entries)
        // }

        // fetchLeaderboard()
        //     .catch(console.error)


        // Local storage version
        console.log('Fetching leaderboard!');
        var entries = JSON.parse(localStorage.getItem('LEADERBOARD2'))
        if (entries === null) {
            entries = []
        }

        // Filter duplicates by entry.playerId, keep highest score
        let all_entries = entries.concat(baselines)
        console.log(all_entries)
        // Remove duplicates by playerId, keep first occurrence
        const seen = new Set()
        const filtered_entries = all_entries.filter(entry => {
            if (!entry.player_id) return true // keep entries without playerId
            if (seen.has(entry.player_id)) return false
            seen.add(entry.player_id)
            return true
        })
        filtered_entries.sort((a, b) => a.score < b.score ? 1 : -1)
        setLeaderboard(filtered_entries)
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
                                        row.baseline ? '#dddddd' : ((username == row.player_id) ? '#ffffc5' : '#ffffff')
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