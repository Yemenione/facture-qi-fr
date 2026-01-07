"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, Trash2, Building, CreditCard, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import bankingService, { BankAccount, BankTransaction } from "@/services/banking.service"
import { toast } from "sonner"
import { format } from "date-fns"

export default function BankingPage() {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
    const [transactions, setTransactions] = useState<BankTransaction[]>([])
    const [loadingTrans, setLoadingTrans] = useState(false)

    // Create Form
    const [formData, setFormData] = useState({
        name: "",
        bankName: "",
        iban: "",
        currency: "EUR"
    })

    const loadAccounts = async () => {
        try {
            setLoading(true)
            const data = await bankingService.getAccounts()
            setAccounts(data)
            if (data.length > 0 && !selectedAccount) {
                setSelectedAccount(data[0].id)
            }
        } catch (e) {
            toast.error("Failed to load bank accounts")
        } finally {
            setLoading(false)
        }
    }

    const loadTransactions = async (accountId: string) => {
        try {
            setLoadingTrans(true)
            const data = await bankingService.getTransactions(accountId)
            setTransactions(data)
        } catch (e) {
            console.error(e)
            toast.error("Failed to load transactions")
        } finally {
            setLoadingTrans(false)
        }
    }

    useEffect(() => {
        loadAccounts()
    }, [])

    useEffect(() => {
        if (selectedAccount) {
            loadTransactions(selectedAccount)
        }
    }, [selectedAccount])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await bankingService.createAccount(formData)
            toast.success("Bank account added")
            setIsCreateOpen(false)
            setFormData({ name: "", bankName: "", iban: "", currency: "EUR" })
            loadAccounts()
        } catch (e) {
            toast.error("Failed to create account")
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Delete this bank account and all its transactions?")) {
            try {
                await bankingService.deleteAccount(id)
                toast.success("Account deleted")
                loadAccounts()
                if (selectedAccount === id) setSelectedAccount(null)
            } catch (e) {
                toast.error("Failed to delete account")
            }
        }
    }

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedAccount) return

        try {
            const result = await bankingService.importStatement(selectedAccount, file)
            toast.success(`Imported ${result.imported} transactions successfully!`)
            loadTransactions(selectedAccount)
            loadAccounts() // Update counts
        } catch (e) {
            toast.error("Import failed. Check CSV format.")
        }
        // Reset input
        e.target.value = ''
    }

    return (
        <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Banking</h1>
                    <p className="text-gray-500 mt-2">Manage bank accounts and reconcile transactions.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Plus className="h-4 w-4" /> Add Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Bank Account</DialogTitle>
                            <DialogDescription>Connect a new bank account to track transactions.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Account Name</Label>
                                <Input placeholder="e.g. Main Business Account" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Bank Name</Label>
                                <Input placeholder="e.g. Qonto, BNP, Shine" required
                                    value={formData.bankName} onChange={e => setFormData({ ...formData, bankName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>IBAN</Label>
                                <Input placeholder="FR76..." required
                                    value={formData.iban} onChange={e => setFormData({ ...formData, iban: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600">Create Account</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? <div>Loading...</div> : accounts.length === 0 ? (
                <Card className="text-center p-12">
                    <div className="flex justify-center mb-4">
                        <Building className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No bank accounts linked</h3>
                    <p className="text-gray-500 mb-6">Add your first bank account to start tracking cash flow.</p>
                    <Button onClick={() => setIsCreateOpen(true)}>Add Account</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar: Accounts List */}
                    <div className="space-y-4">
                        {accounts.map(account => (
                            <Card
                                key={account.id}
                                className={`cursor-pointer transition-all hover:border-indigo-300 ${selectedAccount === account.id ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : ''}`}
                                onClick={() => setSelectedAccount(account.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-white rounded-full border">
                                                <Building className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{account.name}</p>
                                                <p className="text-xs text-gray-500">{account.bankName}</p>
                                            </div>
                                        </div>
                                        {selectedAccount === account.id && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(account.id); }}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-between items-end">
                                        <p className="text-xs text-gray-400 font-mono truncate w-24">{account.iban}</p>
                                        <Badge variant="secondary" className="bg-white text-xs">
                                            {account._count?.transactions || 0} Txns
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Area: Transactions */}
                    <div className="md:col-span-3 space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>Transactions</CardTitle>
                                    <CardDescription>
                                        History for {accounts.find(a => a.id === selectedAccount)?.name}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="gap-2" onClick={() => selectedAccount && loadTransactions(selectedAccount)}>
                                        <RefreshCw className={`h-4 w-4 ${loadingTrans ? 'animate-spin' : ''}`} /> Sync
                                    </Button>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleImport}
                                            disabled={!selectedAccount}
                                        />
                                        <Button variant="default" className="gap-2" disabled={!selectedAccount}>
                                            <Upload className="h-4 w-4" /> Import CSV
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Label</TableHead>
                                            <TableHead>Reference</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingTrans ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8">Loading transactions...</TableCell>
                                            </TableRow>
                                        ) : transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                                    No transactions found. Import a CSV statement to get started.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map(txn => (
                                                <TableRow key={txn.id}>
                                                    <TableCell>{format(new Date(txn.date), 'dd/MM/yyyy')}</TableCell>
                                                    <TableCell className="font-medium">{txn.label}</TableCell>
                                                    <TableCell className="text-gray-500 text-sm">{txn.reference || '-'}</TableCell>
                                                    <TableCell className={`text-right font-mono font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)} €
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant={txn.status === 'MATCHED' ? 'default' : 'secondary'}>
                                                            {txn.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
