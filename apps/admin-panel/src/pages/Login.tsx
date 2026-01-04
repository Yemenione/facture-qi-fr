import { Button } from '@/components/ui/button'

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <Button onClick={() => window.location.href = '/'}>Simulate Login</Button>
            </div>
        </div>
    )
}
