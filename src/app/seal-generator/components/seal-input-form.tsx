import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SealInputFormProps {
    companyName: string
    setCompanyName: (value: string) => void
    registrationNumber: string
    setRegistrationNumber: (value: string) => void
}

export function SealInputForm({
    companyName,
    setCompanyName,
    registrationNumber,
    setRegistrationNumber,
}: SealInputFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="companyName">公司名称</Label>
                <Input
                    id="companyName"
                    value={companyName}
                    maxLength={30}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="registrationNumber">注册号</Label>
                <Input
                    id="registrationNumber"
                    value={registrationNumber}
                    maxLength={20}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                />
            </div>
        </div>
    )
}
