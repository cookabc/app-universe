import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { SalaryResult } from '../lib/salary-calculator'

interface IncomeDetailsProps {
    result: SalaryResult
}

export function IncomeDetails({ result }: IncomeDetailsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>项目</TableHead>
                    <TableHead>金额（年）</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>基本工资</TableCell>
                    <TableCell>¥{result.annualSalary}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>年假工资</TableCell>
                    <TableCell>¥{result.annualLeaveIncome}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>年终奖</TableCell>
                    <TableCell>¥{result.bonusIncome}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>个人缴纳公积金</TableCell>
                    <TableCell>¥{(Number(result.personalHousingFund) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>公司缴纳公积金</TableCell>
                    <TableCell>¥{(Number(result.companyHousingFund) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                    <TableCell>总收入</TableCell>
                    <TableCell>
                        ¥
                        {(
                            Number(result.annualSalary) +
                            Number(result.annualLeaveIncome) +
                            Number(result.bonusIncome) +
                            (Number(result.personalHousingFund) + Number(result.companyHousingFund)) * 12
                        ).toFixed(2)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
