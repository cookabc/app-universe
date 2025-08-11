import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { SPECIAL_DEDUCTION_OPTIONS } from '../constants'

interface SalaryInputFormProps {
    baseSalary: number
    setBaseSalary: (value: number) => void
    socialInsuranceBase: number
    setSocialInsuranceBase: (value: number) => void
    housingFundBase: number
    setHousingFundBase: (value: number) => void
    annualLeave: number
    setAnnualLeave: (value: number) => void
    bonusMonths: number
    setBonusMonths: (value: number) => void
    hasSpecialDeduction: boolean
    setHasSpecialDeduction: (value: boolean) => void
    specialDeductionAmount: number
    setSpecialDeductionAmount: (value: number) => void
    calculateSalary: () => void
    isPending: boolean
}

export function SalaryInputForm({
    baseSalary,
    setBaseSalary,
    socialInsuranceBase,
    setSocialInsuranceBase,
    housingFundBase,
    setHousingFundBase,
    annualLeave,
    setAnnualLeave,
    bonusMonths,
    setBonusMonths,
    hasSpecialDeduction,
    setHasSpecialDeduction,
    specialDeductionAmount,
    setSpecialDeductionAmount,
    calculateSalary,
    isPending,
}: SalaryInputFormProps) {
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="baseSalary">基础工资（月）</Label>
                    <Input
                        id="baseSalary"
                        type="number"
                        min={0}
                        value={baseSalary}
                        onChange={(e) => setBaseSalary(Number(e.target.value))}
                    />
                </div>
                <div>
                    <Label htmlFor="socialInsuranceBase">社保缴纳基数</Label>
                    <Input
                        id="socialInsuranceBase"
                        type="number"
                        min={0}
                        value={socialInsuranceBase}
                        onChange={(e) => setSocialInsuranceBase(Number(e.target.value))}
                    />
                </div>
                <div>
                    <Label htmlFor="housingFundBase">公积金缴纳基数</Label>
                    <Input
                        id="housingFundBase"
                        type="number"
                        min={0}
                        value={housingFundBase}
                        onChange={(e) => setHousingFundBase(Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="annualLeave">年假天数</Label>
                    <Input
                        id="annualLeave"
                        type="number"
                        min={0}
                        value={annualLeave}
                        onChange={(e) => setAnnualLeave(Number(e.target.value))}
                    />
                </div>
                <div>
                    <Label htmlFor="bonusMonths">年终奖（月数）</Label>
                    <Slider
                        id="bonusMonths"
                        min={0}
                        max={12}
                        step={0.5}
                        value={[bonusMonths]}
                        onValueChange={(value) => setBonusMonths(value[0] ?? 0)}
                        aria-label="bonus months"
                    />
                    <div className="text-center mt-2">{bonusMonths} 个月</div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="specialDeduction"
                        checked={hasSpecialDeduction}
                        onCheckedChange={setHasSpecialDeduction}
                    />
                    <Label htmlFor="specialDeduction">启用专项附加扣除</Label>
                </div>
            </div>
            {hasSpecialDeduction && (
                <div>
                    <Label htmlFor="specialDeductionAmount">专项附加扣除金额（月）</Label>
                    <Select
                        onValueChange={(value) => setSpecialDeductionAmount(Number(value))}
                        defaultValue={specialDeductionAmount.toString()}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="选择金额" />
                        </SelectTrigger>
                        <SelectContent>
                            {SPECIAL_DEDUCTION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            <Button onClick={calculateSalary} disabled={isPending} aria-busy={isPending}>
                {isPending ? '计算中...' : '计算'}
            </Button>
        </div>
    )
}
