import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { SalaryResult } from '../lib/salary-calculator'

interface PaymentDetailsProps {
    result: SalaryResult
}

export function PaymentDetails({ result }: PaymentDetailsProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>项目</TableHead>
                    <TableHead>个人部分（年）</TableHead>
                    <TableHead>公司部分（年）</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>养老保险</TableCell>
                    <TableCell>¥{(Number(result.pensionInsurance) * 12).toFixed(2)}</TableCell>
                    <TableCell>¥{(Number(result.companyPensionInsurance) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>医疗保险</TableCell>
                    <TableCell>¥{(Number(result.medicalInsurance) * 12).toFixed(2)}</TableCell>
                    <TableCell>¥{(Number(result.companyMedicalInsurance) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>失业保险</TableCell>
                    <TableCell>¥{(Number(result.unemploymentInsurance) * 12).toFixed(2)}</TableCell>
                    <TableCell>¥{(Number(result.companyUnemploymentInsurance) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>工伤保险</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>¥{(Number(result.companyWorkInjuryInsurance) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>生育保险</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>¥{(Number(result.companyMaternityInsurance) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>住房公积金</TableCell>
                    <TableCell>¥{(Number(result.personalHousingFund) * 12).toFixed(2)}</TableCell>
                    <TableCell>¥{(Number(result.companyHousingFund) * 12).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>个人所得税</TableCell>
                    <TableCell>¥{result.annualTax}</TableCell>
                    <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>专项附加扣除</TableCell>
                    <TableCell>-¥{result.specialDeduction}</TableCell>
                    <TableCell>-</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                    <TableCell>合计</TableCell>
                    <TableCell>¥{result.personalTotal}</TableCell>
                    <TableCell>¥{result.companyTotal}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
