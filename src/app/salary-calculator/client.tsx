'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SalaryInputForm } from './components/salary-input-form'
import { SalaryResult } from './components/salary-result'
import { calculateSalaryLogic, type SalaryResult as SalaryResultType } from './lib/salary-calculator'
import { AlertCircle } from 'lucide-react'

export default function SalaryCalculatorClient() {
    const [baseSalary, setBaseSalary] = useState(10000)
    const [socialInsuranceBase, setSocialInsuranceBase] = useState(6821)
    const [housingFundBase, setHousingFundBase] = useState(2420)
    const [annualLeave, setAnnualLeave] = useState(10)
    const [bonusMonths, setBonusMonths] = useState(1)
    const [hasSpecialDeduction, setHasSpecialDeduction] = useState(false)
    const [specialDeductionAmount, setSpecialDeductionAmount] = useState(1000)

    const [result, setResult] = useState<SalaryResultType | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    const [isPending, startTransition] = useTransition()

    const calculationPreview = useMemo(() => {
        const annualIncome = baseSalary * 12
        const estimatedTax = Math.max(0, (annualIncome - 60000) * 0.1) // Rough estimate
        const estimatedNetIncome = annualIncome - estimatedTax

        return {
            annualIncome: annualIncome.toLocaleString(),
            estimatedTax: estimatedTax.toLocaleString(),
            estimatedNetIncome: estimatedNetIncome.toLocaleString(),
            monthlyEstimate: (estimatedNetIncome / 12).toLocaleString(),
        }
    }, [baseSalary])

    const calculateSalary = useCallback(() => {
        startTransition(() => {
            setErrorMessage('')

            if (
                baseSalary < 0 ||
                socialInsuranceBase < 0 ||
                housingFundBase < 0 ||
                annualLeave < 0 ||
                bonusMonths < 0
            ) {
                setErrorMessage('请输入有效的正数值')
                return
            }

            const salaryResult = calculateSalaryLogic({
                baseSalary,
                socialInsuranceBase,
                housingFundBase,
                annualLeave,
                bonusMonths,
                hasSpecialDeduction,
                specialDeductionAmount,
            })
            setResult(salaryResult)
        })
    }, [
        baseSalary,
        socialInsuranceBase,
        housingFundBase,
        annualLeave,
        bonusMonths,
        hasSpecialDeduction,
        specialDeductionAmount,
    ])

    return (
        <AppErrorBoundary>
            <div className="h-screen flex items-center justify-center px-10">
                <Card className="w-full max-w-6xl mx-auto">
                    <CardHeader>
                        <CardTitle>北京工资计算器（增强版）</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SalaryInputForm
                            baseSalary={baseSalary}
                            setBaseSalary={setBaseSalary}
                            socialInsuranceBase={socialInsuranceBase}
                            setSocialInsuranceBase={setSocialInsuranceBase}
                            housingFundBase={housingFundBase}
                            setHousingFundBase={setHousingFundBase}
                            annualLeave={annualLeave}
                            setAnnualLeave={setAnnualLeave}
                            bonusMonths={bonusMonths}
                            setBonusMonths={setBonusMonths}
                            hasSpecialDeduction={hasSpecialDeduction}
                            setHasSpecialDeduction={setHasSpecialDeduction}
                            specialDeductionAmount={specialDeductionAmount}
                            setSpecialDeductionAmount={setSpecialDeductionAmount}
                            calculateSalary={calculateSalary}
                            isPending={isPending}
                        />

                        <div className="bg-blue-50 rounded-md p-4 mt-4">
                            <h4 className="font-medium mb-2">快速预览（基于基础工资）:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>年收入: ¥{calculationPreview.annualIncome}</div>
                                <div>预估税费: ¥{calculationPreview.estimatedTax}</div>
                                <div>预估净收入: ¥{calculationPreview.estimatedNetIncome}</div>
                                <div>月均收入: ¥{calculationPreview.monthlyEstimate}</div>
                            </div>
                        </div>
                        {errorMessage && (
                            <Alert variant="destructive" role="alert" aria-live="assertive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>错误</AlertTitle>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                        {result && <SalaryResult result={result} />}
                    </CardContent>
                </Card>
            </div>
        </AppErrorBoundary>
    )
}
