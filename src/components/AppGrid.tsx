'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import apps from '@/data/apps'

export function AppGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {apps.map((app) => (
                <Card key={app.path} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: app.color }}
                            >
                                <app.icon />
                            </div>
                            <CardTitle>{app.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{app.description}</p>
                    </CardContent>
                    <CardFooter>
                        <Link href={app.path} passHref className="w-full">
                            <Button variant="outline" className="w-full">
                                Go to App
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
