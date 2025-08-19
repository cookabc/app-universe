import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { modules } from '../constants'

export function ModuleList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
                <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <module.icon className="h-6 w-6" />
                                {module.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{module.description}</CardDescription>
                            <Button variant="outline" className="w-full mt-4">
                                进入学习
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
