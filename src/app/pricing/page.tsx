import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const features = {
    free: ['Basic Prompt Lab access', '3 AI Artifacts', 'Community support'],
    pro: [
        'Unlimited Prompt Lab usage',
        'Unlimited AI Artifacts',
        'Access to AI Workbench',
        'Advanced models (GPT-4, etc.)',
        'Priority support',
    ],
    team: [
        'All Pro features',
        'Team collaboration tools',
        'Centralized billing',
        'Higher API rate limits',
        'Dedicated account manager',
    ],
}

export default function PricingPage() {
    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold">Find the perfect plan for you</h2>
                <p className="mt-4 text-lg text-muted-foreground">Start for free, then upgrade as you grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Free</CardTitle>
                        <CardDescription>For individuals and hobbyists</CardDescription>
                        <p className="text-4xl font-bold mt-4">
                            $0<span className="text-lg font-normal">/month</span>
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {features.free.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Get Started</Button>
                    </CardFooter>
                </Card>

                <Card className="border-primary flex flex-col">
                    <CardHeader>
                        <CardTitle>Pro</CardTitle>
                        <CardDescription>For professional developers</CardDescription>
                        <p className="text-4xl font-bold mt-4">
                            $29<span className="text-lg font-normal">/month</span>
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {features.pro.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="default">
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Team</CardTitle>
                        <CardDescription>For collaborative projects</CardDescription>
                        <p className="text-4xl font-bold mt-4">
                            $79<span className="text-lg font-normal">/month</span>
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-2">
                            {features.team.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Contact Sales</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
