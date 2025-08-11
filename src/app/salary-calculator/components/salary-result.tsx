import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IncomeDetails } from './income-details'
import { PaymentDetails } from './payment-details'
import { TaxDetails } from './tax-details'
import { MonthlyDetails } from './monthly-details'
import type { SalaryResult } from '../lib/salary-calculator'

interface SalaryResultProps {
    result: SalaryResult
}

export function SalaryResult({ result }: SalaryResultProps) {
    return (
        <div className="mt-4 space-y-4">
            <div className="bg-secondary rounded-md p-4">
                <h3 className="text-lg font-semibold mb-2">总览：</h3>
                <p>
                    年实际收入（含公积金、年假和奖金）：¥
                    {result.annualNetIncome}
                </p>
                <p>月平均实际收入：¥{result.monthlyNetIncome}</p>
            </div>
            <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="income">收入</TabsTrigger>
                    <TabsTrigger value="payment">缴纳</TabsTrigger>
                    <TabsTrigger value="taxDetails">缴税明细</TabsTrigger>
                    <TabsTrigger value="monthlyDetails">月度明细</TabsTrigger>
                </TabsList>
                <TabsContent value="income">
                    <IncomeDetails result={result} />
                </TabsContent>
                <TabsContent value="payment">
                    <PaymentDetails result={result} />
                </TabsContent>
                <TabsContent value="taxDetails">
                    <TaxDetails result={result} />
                </TabsContent>
                <TabsContent value="monthlyDetails">
                    <MonthlyDetails result={result} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
