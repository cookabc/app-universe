"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface SalaryResult {
	annualNetIncome: string;
	monthlyNetIncome: string;
	monthlyDeduction: string;
	annualDeduction: string;
	annualTax: string;
	pensionInsurance: string;
	medicalInsurance: string;
	unemploymentInsurance: string;
	personalHousingFund: string;
	companyPensionInsurance: string;
	companyMedicalInsurance: string;
	companyUnemploymentInsurance: string;
	companyWorkInjuryInsurance: string;
	companyMaternityInsurance: string;
	companyHousingFund: string;
	annualLeaveIncome: string;
	bonusIncome: string;
	specialDeduction: string;
	personalTotal: string;
	companyTotal: string;
	annualSalary: string;
	monthlyTaxDetails: {
		month: number;
		income: string;
		tax: string;
		cumulativeTax: string;
		netIncome: string;
	}[];
}

export default function BeijingSalaryCalculator() {
	const [baseSalary, setBaseSalary] = useState(10000);
	const [socialInsuranceBase, setSocialInsuranceBase] = useState(6821);
	const [housingFundBase, setHousingFundBase] = useState(2420);
	const [annualLeave, setAnnualLeave] = useState(10);
	const [bonusMonths, setBonusMonths] = useState(1);
	const [hasSpecialDeduction, setHasSpecialDeduction] = useState(false);
	const [specialDeductionAmount, setSpecialDeductionAmount] = useState(1000);

	const [result, setResult] = useState<SalaryResult | null>(null);
	const [errorMessage, setErrorMessage] = useState("");

	const calculateSalary = () => {
		setErrorMessage("");

		if (
			baseSalary < 0 ||
			socialInsuranceBase < 0 ||
			housingFundBase < 0 ||
			annualLeave < 0 ||
			bonusMonths < 0
		) {
			setErrorMessage("请输入有效的正数值");
			return;
		}

		const minSocialInsuranceBase = 5360;
		const maxSocialInsuranceBase = 28017;
		const actualSocialInsuranceBase = Math.min(
			Math.max(socialInsuranceBase, minSocialInsuranceBase),
			maxSocialInsuranceBase,
		);

		const minHousingFundBase = 2320;
		const maxHousingFundBase = 28017;
		const actualHousingFundBase = Math.min(
			Math.max(housingFundBase, minHousingFundBase),
			maxHousingFundBase,
		);

		const pensionInsurance = actualSocialInsuranceBase * 0.08;
		const medicalInsurance = actualSocialInsuranceBase * 0.02 + 3;
		const unemploymentInsurance = actualSocialInsuranceBase * 0.002;
		const personalHousingFund = actualHousingFundBase * 0.12;
		const monthlyDeduction =
			pensionInsurance +
			medicalInsurance +
			unemploymentInsurance +
			personalHousingFund;

		const companyPensionInsurance = actualSocialInsuranceBase * 0.2;
		const companyMedicalInsurance = actualSocialInsuranceBase * 0.1;
		const companyUnemploymentInsurance = actualSocialInsuranceBase * 0.01;
		const companyWorkInjuryInsurance = actualSocialInsuranceBase * 0.005;
		const companyMaternityInsurance = actualSocialInsuranceBase * 0.008;
		const companyHousingFund = actualHousingFundBase * 0.12;

		const annualIncome = baseSalary * 12;
		const annualLeaveIncome = (baseSalary / 21.75) * annualLeave;
		const bonusIncome = baseSalary * bonusMonths;

		const specialDeduction = hasSpecialDeduction
			? specialDeductionAmount * 12
			: 0;

		const calculateTax = (taxableIncome: number) => {
			if (taxableIncome <= 36000) return taxableIncome * 0.03;
			if (taxableIncome <= 144000) return taxableIncome * 0.1 - 2520;
			if (taxableIncome <= 300000) return taxableIncome * 0.2 - 16920;
			if (taxableIncome <= 420000) return taxableIncome * 0.25 - 31920;
			if (taxableIncome <= 660000) return taxableIncome * 0.3 - 52920;
			if (taxableIncome <= 960000) return taxableIncome * 0.35 - 85920;
			return taxableIncome * 0.45 - 181920;
		};

		const monthlyTaxDetails = [];
		let cumulativeTaxableIncome = 0;
		let cumulativeTax = 0;

		for (let month = 1; month <= 12; month++) {
			const monthIncome =
				baseSalary + (month === 12 ? bonusIncome + annualLeaveIncome : 0);
			cumulativeTaxableIncome +=
				monthIncome - monthlyDeduction - 5000 - specialDeduction / 12;
			const shouldPayTax = calculateTax(cumulativeTaxableIncome);
			const monthlyTax = shouldPayTax - cumulativeTax;
			cumulativeTax = shouldPayTax;
			monthlyTaxDetails.push({
				month,
				income: monthIncome.toFixed(2),
				tax: monthlyTax.toFixed(2),
				cumulativeTax: cumulativeTax.toFixed(2),
				netIncome: (monthIncome - monthlyDeduction - monthlyTax).toFixed(2),
			});
		}

		const annualTax = cumulativeTax;
		const annualNetIncome =
			annualIncome +
			annualLeaveIncome +
			bonusIncome -
			monthlyDeduction * 12 -
			annualTax +
			(personalHousingFund + companyHousingFund) * 12;

		const personalTotal = monthlyDeduction * 12 + annualTax;
		const companyTotal =
			(companyPensionInsurance +
				companyMedicalInsurance +
				companyUnemploymentInsurance +
				companyWorkInjuryInsurance +
				companyMaternityInsurance +
				companyHousingFund) *
			12;

		setResult({
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
		});
	};

	return (
		<div className="h-screen flex items-center justify-center px-10">
			<Card className="w-full max-w-6xl mx-auto">
				<CardHeader>
					<CardTitle>北京工资计算器（增强版）</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid grid-cols-3 gap-4">
							<div>
								<Label htmlFor="baseSalary">基础工资（月）</Label>
								<Input
									id="baseSalary"
									type="number"
									value={baseSalary}
									onChange={(e) => setBaseSalary(Number(e.target.value))}
								/>
							</div>
							<div>
								<Label htmlFor="socialInsuranceBase">社保缴纳基数</Label>
								<Input
									id="socialInsuranceBase"
									type="number"
									value={socialInsuranceBase}
									onChange={(e) =>
										setSocialInsuranceBase(Number(e.target.value))
									}
								/>
							</div>
							<div>
								<Label htmlFor="housingFundBase">公积金缴纳基数</Label>
								<Input
									id="housingFundBase"
									type="number"
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
									onValueChange={(value) => setBonusMonths(value[0])}
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
								<Label htmlFor="specialDeductionAmount">
									专项附加扣除金额（月）
								</Label>
								<Select
									onValueChange={(value) =>
										setSpecialDeductionAmount(Number(value))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="选择金额" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1000">1000元（子女教育）</SelectItem>
										<SelectItem value="1500">1500元（赡养老人）</SelectItem>
										<SelectItem value="2000">2000元（住房贷款利息）</SelectItem>
										<SelectItem value="1200">1200元（住房租金）</SelectItem>
										<SelectItem value="400">400元（继续教育）</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
						<Button onClick={calculateSalary}>计算</Button>
						{errorMessage && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>错误</AlertTitle>
								<AlertDescription>{errorMessage}</AlertDescription>
							</Alert>
						)}
						{result && (
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
													<TableCell>
														¥
														{(Number(result.personalHousingFund) * 12).toFixed(
															2,
														)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>公司缴纳公积金</TableCell>
													<TableCell>
														¥
														{(Number(result.companyHousingFund) * 12).toFixed(
															2,
														)}
													</TableCell>
												</TableRow>
												<TableRow className="font-bold">
													<TableCell>总收入</TableCell>
													<TableCell>
														¥
														{(
															Number(result.annualSalary) +
															Number(result.annualLeaveIncome) +
															Number(result.bonusIncome) +
															(Number(result.personalHousingFund) +
																Number(result.companyHousingFund)) *
																12
														).toFixed(2)}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TabsContent>
									<TabsContent value="payment">
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
													<TableCell>
														¥{(Number(result.pensionInsurance) * 12).toFixed(2)}
													</TableCell>
													<TableCell>
														¥
														{(
															Number(result.companyPensionInsurance) * 12
														).toFixed(2)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>医疗保险</TableCell>
													<TableCell>
														¥{(Number(result.medicalInsurance) * 12).toFixed(2)}
													</TableCell>
													<TableCell>
														¥
														{(
															Number(result.companyMedicalInsurance) * 12
														).toFixed(2)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>失业保险</TableCell>
													<TableCell>
														¥
														{(
															Number(result.unemploymentInsurance) * 12
														).toFixed(2)}
													</TableCell>
													<TableCell>
														¥
														{(
															Number(result.companyUnemploymentInsurance) * 12
														).toFixed(2)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>工伤保险</TableCell>
													<TableCell>-</TableCell>
													<TableCell>
														¥
														{(
															Number(result.companyWorkInjuryInsurance) * 12
														).toFixed(2)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>生育保险</TableCell>
													<TableCell>-</TableCell>
													<TableCell>
														¥
														{(
															Number(result.companyMaternityInsurance) * 12
														).toFixed(2)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>住房公积金</TableCell>
													<TableCell>
														¥
														{(Number(result.personalHousingFund) * 12).toFixed(
															2,
														)}
													</TableCell>
													<TableCell>
														¥
														{(Number(result.companyHousingFund) * 12).toFixed(
															2,
														)}
													</TableCell>
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
									</TabsContent>
									<TabsContent value="taxDetails">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>月份</TableHead>
													<TableHead>当月个人所得税</TableHead>
													<TableHead>累计个人所得税</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{result.monthlyTaxDetails.map(
													(detail: SalaryResult["monthlyTaxDetails"][0]) => (
														<TableRow key={detail.month}>
															<TableCell>{detail.month}月</TableCell>
															<TableCell>¥{detail.tax}</TableCell>
															<TableCell>¥{detail.cumulativeTax}</TableCell>
														</TableRow>
													),
												)}
											</TableBody>
										</Table>
									</TabsContent>
									<TabsContent value="monthlyDetails">
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
												{result.monthlyTaxDetails.map(
													(detail: SalaryResult["monthlyTaxDetails"][0]) => (
														<TableRow key={detail.month}>
															<TableCell>{detail.month}月</TableCell>
															<TableCell>¥{detail.income}</TableCell>
															<TableCell>¥{result.monthlyDeduction}</TableCell>
															<TableCell>¥{detail.tax}</TableCell>
															<TableCell>¥{detail.netIncome}</TableCell>
														</TableRow>
													),
												)}
											</TableBody>
										</Table>
									</TabsContent>
								</Tabs>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
