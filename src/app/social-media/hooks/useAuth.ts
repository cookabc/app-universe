import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export function useAuth(activeTab: 'x' | 'weibo') {
    const [isXAuthenticated, setIsXAuthenticated] = useState(false)
    const [isWeiboAuthenticated, setIsWeiboAuthenticated] = useState(false)
    const { toast } = useToast()

    const handleLogin = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const username = formData.get('username') as string
            const password = formData.get('password') as string

            if (username && password) {
                if (activeTab === 'x') {
                    setIsXAuthenticated(true)
                } else {
                    setIsWeiboAuthenticated(true)
                }
                toast({
                    title: 'Login Success',
                    description: `Welcome back, ${username} to ${activeTab === 'x' ? 'X' : 'Weibo'}.`,
                })
            } else {
                toast({
                    title: 'Login Failed',
                    description: 'Please enter your username and password.',
                    variant: 'destructive',
                })
            }
        },
        [activeTab, toast],
    )

    return {
        isXAuthenticated,
        isWeiboAuthenticated,
        setIsXAuthenticated,
        setIsWeiboAuthenticated,
        handleLogin,
    }
}
