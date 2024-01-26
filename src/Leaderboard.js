import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material'
import {Button, Grid, Box} from '@mui/material'
import { collection, getDocs } from "firebase/firestore"; 
import {db} from "./Database"

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const querySnapshot = await getDocs(collection(db, "leaderboard"));
            const entries = querySnapshot.docs.map((doc) => doc.data());
            
            entries.sort((a, b) => a.score < b.score ? 1 : -1)
            setLeaderboard(entries)
        }
    
        fetchLeaderboard()
            .catch(console.error)
    }, [])

    return (
        <>
            <Grid container alignItems={'center'}>
                <Grid item xs={8}>
                    <h1>Classifica</h1>
                </Grid>
            </Grid>
            
            <TableContainer>
                <Table stickyHeader  aria-label="simple table">
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
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Leaderboard