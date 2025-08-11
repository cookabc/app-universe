import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { SalaryResult } from '../lib/salary-calculator'

interface MonthlyDetailsProps {
    result: SalaryResult
}

export function MonthlyDetails({ result }: MonthlyDetailsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>月份</TableHead>
                    <TableHead>收入</TableHead>
                    <TableHead>五险一金</TableHead>
                    <TableHead>个人所得税</TableHead>
                    <TableHead>实发工资</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {result.monthlyTaxDetails.map((detail) => (
                    <TableRow key={detail.month}>
                        <TableCell>{detail.month}月</TableCell>
                        <TableCell>¥{detail.income}</TableCell>
                        <TableCell>¥{result.monthlyDeduction}</TableCell>
                        <TableCell>¥{detail.tax}</TableCell>
                        <TableCell>¥{detail.netIncome}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
