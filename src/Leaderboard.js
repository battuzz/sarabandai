import { useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material'

const Leaderboard = () => {
    var leaderboard = JSON.parse(localStorage.getItem('LEADERBOARD'))
    if (leaderboard === null) {
        leaderboard = [
            {
                name: 'Marco Arena',
                score: 'inf'
            },
            {
                name: 'Mattia Verasani',
                score: 'Over 9000'
            },
            {
                name: 'Andrea Battistello',
                score: '2 banane'
            }
        ]
    }
    const sortedLeaderboard = [...leaderboard].sort(
        (a, b) => a.score < b.score
    )

    return (
        <>
            <h1>Classifica</h1>
            <TableContainer>
                <Table stickyHeader  aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Nome</b></TableCell>
                            <TableCell align="right"><b>Punteggio</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedLeaderboard.map((row) => (
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