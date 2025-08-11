interface SealStatsProps {
    companyNameLength: number
    registrationLength: number
    isValidCompanyName: boolean
    isValidRegistration: boolean
}

export function SealStats({ companyNameLength, registrationLength, isValidCompanyName, isValidRegistration }: SealStatsProps) {
    return (
        <div className="text-sm text-muted-foreground space-y-1">
            <div>
                公司名称: {companyNameLength}/30 字符 {isValidCompanyName ? '✓' : '⚠️'}
            </div>
            <div>
                注册号: {registrationLength}/20 字符 {isValidRegistration ? '✓' : '⚠️'}
            </div>
        </div>
    )
}
