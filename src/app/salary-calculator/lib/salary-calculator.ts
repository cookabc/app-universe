export interface SalaryResult {
    annualNetIncome: string
    monthlyNetIncome: string
    monthlyDeduction: string
    annualDeduction: string
    annualTax: string
    pensionInsurance: string
    medicalInsurance: string
    unemploymentInsurance: string
    personalHousingFund: string
    companyPensionInsurance: string
    companyMedicalInsurance: string
    companyUnemploymentInsurance: string
    companyWorkInjuryInsurance: string
    companyMaternityInsurance: string
    companyHousingFund: string
    annualLeaveIncome: string
    bonusIncome: string
    specialDeduction: string
    personalTotal: string
    companyTotal: string
    annualSalary: string
    monthlyTaxDetails: {
        month: number
        income: string
        tax: string
        cumulativeTax: string
        netIncome: string
    }[]
}

export function calculateSalaryLogic(inputs: {
    baseSalary: number
    socialInsuranceBase: number
    housingFundBase: number
    annualLeave: number
    bonusMonths: number
    hasSpecialDeduction: boolean
    specialDeductionAmount: number
}): SalaryResult {
    const {
        baseSalary,
        socialInsuranceBase,
        housingFundBase,
        annualLeave,
        bonusMonths,
        hasSpecialDeduction,
        specialDeductionAmount,
    } = inputs

    const minSocialInsuranceBase = 5360
    const maxSocialInsuranceBase = 28017
    const actualSocialInsuranceBase = Math.min(
        Math.max(socialInsuranceBase, minSocialInsuranceBase),
        maxSocialInsuranceBase,
    )

    const minHousingFundBase = 2320
    const maxHousingFundBase = 28017
    const actualHousingFundBase = Math.min(Math.max(housingFundBase, minHousingFundBase), maxHousingFundBase)

    const pensionInsurance = actualSocialInsuranceBase * 0.08
    const medicalInsurance = actualSocialInsuranceBase * 0.02 + 3
    const unemploymentInsurance = actualSocialInsuranceBase * 0.002
    const personalHousingFund = actualHousingFundBase * 0.12
    const monthlyDeduction = pensionInsurance + medicalInsurance + unemploymentInsurance + personalHousingFund

    const companyPensionInsurance = actualSocialInsuranceBase * 0.2
    const companyMedicalInsurance = actualSocialInsuranceBase * 0.1
    const companyUnemploymentInsurance = actualSocialInsuranceBase * 0.01
    const companyWorkInjuryInsurance = actualSocialInsuranceBase * 0.005
    const companyMaternityInsurance = actualSocialInsuranceBase * 0.008
    const companyHousingFund = actualHousingFundBase * 0.12

    const annualIncome = baseSalary * 12
    const annualLeaveIncome = (baseSalary / 21.75) * annualLeave
    const bonusIncome = baseSalary * bonusMonths

    const specialDeduction = hasSpecialDeduction ? specialDeductionAmount * 12 : 0

    const calculateTax = (taxableIncome: number) => {
        if (taxableIncome <= 36000) return taxableIncome * 0.03
        if (taxableIncome <= 144000) return taxableIncome * 0.1 - 2520
        if (taxableIncome <= 300000) return taxableIncome * 0.2 - 16920
        if (taxableIncome <= 420000) return taxableIncome * 0.25 - 31920
        if (taxableIncome <= 660000) return taxableIncome * 0.3 - 52920
        if (taxableIncome <= 960000) return taxableIncome * 0.35 - 85920
        return taxableIncome * 0.45 - 181920
    }

    const monthlyTaxDetails = []
    let cumulativeTaxableIncome = 0
    let cumulativeTax = 0

    for (let month = 1; month <= 12; month++) {
        const monthIncome = baseSalary + (month === 12 ? bonusIncome + annualLeaveIncome : 0)
        cumulativeTaxableIncome += monthIncome - monthlyDeduction - 5000 - specialDeduction / 12
        const shouldPayTax = calculateTax(cumulativeTaxableIncome)
        const monthlyTax = shouldPayTax - cumulativeTax
        cumulativeTax = shouldPayTax
        monthlyTaxDetails.push({
            month,
            income: monthIncome.toFixed(2),
            tax: monthlyTax.toFixed(2),
            cumulativeTax: cumulativeTax.toFixed(2),
            netIncome: (monthIncome - monthlyDeduction - monthlyTax).toFixed(2),
        })
    }

    const annualTax = cumulativeTax
    const annualNetIncome =
        annualIncome +
        annualLeaveIncome +
        bonusIncome -
        monthlyDeduction * 12 -
        annualTax +
        (personalHousingFund + companyHousingFund) * 12

    const personalTotal = monthlyDeduction * 12 + annualTax
    const companyTotal =
        (companyPensionInsurance +
            companyMedicalInsurance +
            companyUnemploymentInsurance +
            companyWorkInjuryInsurance +
            companyMaternityInsurance +
            companyHousingFund) *
        12

    return {
        annualNetIncome: annualNetIncome.toFixed(2),
        monthlyNetIncome: (annualNetIncome / 12).toFixed(2),
        monthlyDeduction: monthlyDeduction.toFixed(2),
        annualDeduction: (monthlyDeduction * 12).toFixed(2),
        annualTax: annualTax.toFixed(2),
        pensionInsurance: pensionInsurance.toFixed(2),
        medicalInsurance: medicalInsurance.toFixed(2),
        unemploymentInsurance: unemploymentInsurance.toFixed(2),
        personalHousingFund: personalHousingFund.toFixed(2),
        companyPensionInsurance: companyPensionInsurance.toFixed(2),
        companyMedicalInsurance: companyMedicalInsurance.toFixed(2),
        companyUnemploymentInsurance: companyUnemploymentInsurance.toFixed(2),
        companyWorkInjuryInsurance: companyWorkInjuryInsurance.toFixed(2),
        companyMaternityInsurance: companyMaternityInsurance.toFixed(2),
        companyHousingFund: companyHousingFund.toFixed(2),
        annualLeaveIncome: annualLeaveIncome.toFixed(2),
        bonusIncome: bonusIncome.toFixed(2),
        specialDeduction: specialDeduction.toFixed(2),
        personalTotal: personalTotal.toFixed(2),
        companyTotal: companyTotal.toFixed(2),
        annualSalary: annualIncome.toFixed(2),
        monthlyTaxDetails: monthlyTaxDetails,
    }
}
