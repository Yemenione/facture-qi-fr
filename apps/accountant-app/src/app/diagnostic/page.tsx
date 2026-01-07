"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiagnosticPage() {
    const [token, setToken] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<string>("");

    useEffect(() => {
        const storedToken = localStorage.getItem('accountant_token');
        setToken(storedToken);
    }, []);

    const clearAndReload = () => {
        localStorage.removeItem('accountant_token');
        window.location.href = '/login';
    };

    const testImpersonate = async () => {
        try {
            const response = await fetch('http://localhost:3001/accountant/companies/695deae1f889d7353ae47c6a/impersonate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTestResult(`✅ SUCCESS! RedirectUrl: ${data.redirectUrl}`);

                // Auto-redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = data.redirectUrl;
                }, 2000);
            } else {
                setTestResult(`❌ FAILED: ${response.status} ${response.statusText}`);
            }
        } catch (error: any) {
            setTestResult(`❌ ERROR: ${error.message}`);
        }
    };

    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>🔍 Diagnostic Impersonation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <strong>Token Status:</strong>
                        <pre className="bg-slate-100 p-2 rounded mt-2 text-xs overflow-auto">
                            {token ? token.substring(0, 50) + '...' : 'NO TOKEN FOUND'}
                        </pre>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={testImpersonate} disabled={!token}>
                            Test Impersonate
                        </Button>
                        <Button onClick={clearAndReload} variant="destructive">
                            Clear Token & Re-login
                        </Button>
                    </div>

                    {testResult && (
                        <div className="bg-slate-100 p-4 rounded">
                            <strong>Test Result:</strong>
                            <pre className="mt-2 text-sm">{testResult}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
