import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DISTANCES } from '../constants'

interface PaceTableProps {
    isDetailedView: boolean
    basePace: number
    paceTable: string[][]
    formatPace: (seconds: number) => string
}

export function PaceTable({ isDetailedView, basePace, paceTable, formatPace }: PaceTableProps) {
    const filteredDistances = isDetailedView
        ? DISTANCES
        : DISTANCES.filter((d) => d.value % 5 === 0 || d.value === 21.1 || d.value === 42.2)

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[150px]">距离</TableHead>
                        {[-10, -5, 0, 5, 10].map((diff) => (
                            <TableHead key={diff}>{formatPace(basePace + diff)}/公里</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDistances.map((distance, i) => (
                        <TableRow
                            key={distance.value}
                            className={`hover:bg-transparent ${
                                distance.value === 21.1 || distance.value === 42.2 ? 'bg-muted' : ''
                            }`}
                        >
                            <TableCell className="font-medium">{distance.label}</TableCell>
                            {paceTable[i]?.map((time, j) => (
                                <TableCell key={j}>{time}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
