import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { SalaryResult } from '../lib/salary-calculator'

interface TaxDetailsProps {
    result: SalaryResult
}

export function TaxDetails({ result }: TaxDetailsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>月份</TableHead>
                    <TableHead>当月个人所得税</TableHead>
                    <TableHead>累计个人所得税</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {result.monthlyTaxDetails.map((detail) => (
                    <TableRow key={detail.month}>
                        <TableCell>{detail.month}月</TableCell>
                        <TableCell>¥{detail.tax}</TableCell>
                        <TableCell>¥{detail.cumulativeTax}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
