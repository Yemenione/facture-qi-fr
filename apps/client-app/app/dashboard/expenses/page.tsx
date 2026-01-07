"use client"

import { useState, useEffect } from "react"
import { Plus, Search, FileText, Upload, MoreVertical, Trash2, CheckCircle, XCircle, Filter } from "lucide-react"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import expensesService, { Expense } from "@/services/expenses.service"
import { toast } from "sonner"
import { format } from "date-fns"

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [stats, setStats] = useState({ total: 0, count: 0, byCategory: {} })
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // Form State
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        currency: "EUR",
        date: new Date().toISOString().split('T')[0],
        supplier: "",
        category: "General",
        vatAmount: ""
    })

    const fetchExpenses = async () => {
        try {
            setLoading(true)
            const [data, statsData] = await Promise.all([
                expensesService.getAll(),
                expensesService.getStats()
            ])
            setExpenses(data)
            setStats(statsData)
        } catch (error) {
            toast.error("Failed to load expenses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const [file, setFile] = useState<File | null>(null)
    const [scanning, setScanning] = useState(false)

    const handleScan = async () => {
        if (!file) return;
        try {
            setScanning(true);
            const data = new FormData();
            data.append('file', file);
            const result = await expensesService.scan(data);

            if (result.detected) {
                setFormData(prev => ({
                    ...prev,
                    amount: result.detected.amount ? result.detected.amount.toString() : prev.amount,
                    date: result.detected.date ? new Date(result.detected.date).toISOString().split('T')[0] : prev.date,
                    supplier: result.detected.supplier || prev.supplier,
                    description: prev.description || 'Expense from Receipt'
                }));
                toast.success("Receipt scanned & fields updated!");
            }
        } catch (e) {
            console.error(e);
            toast.error("Scan failed. Please fill manually.");
        } finally {
            setScanning(false);
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const data = new FormData();
            data.append('description', formData.description);
            data.append('amount', formData.amount);
            data.append('currency', formData.currency);
            data.append('date', new Date(formData.date).toISOString());
            data.append('supplier', formData.supplier);
            // Fix: ensure category is always a string, fallback to 'General' if undefined
            data.append('category', formData.category || 'General');
            if (formData.vatAmount) data.append('vatAmount', formData.vatAmount);
            if (file) data.append('file', file);

            await expensesService.create(data)
            toast.success("Expense added successfully")
            setIsCreateOpen(false)
            fetchExpenses()
            setFormData({
                description: "",
                amount: "",
                currency: "EUR",
                date: new Date().toISOString().split('T')[0],
                supplier: "",
                category: "General",
                vatAmount: ""
            })
            setFile(null)
        } catch (error) {
            toast.error("Failed to create expense")
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await expensesService.delete(id)
                toast.success("Expense deleted")
                fetchExpenses()
            } catch (error) {
                toast.error("Failed to delete expense")
            }
        }
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await expensesService.updateStatus(id, status)
            toast.success("Status updated")
            fetchExpenses()
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const filteredExpenses = expenses.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Expenses</h1>
                    <p className="text-gray-500 mt-2">Track your company spending and manage receipts.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                <Plus className="h-4 w-4" /> Add Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Expense</DialogTitle>
                                <DialogDescription>
                                    Enter the details of your expense. You can upload a receipt later.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <div className="relative">
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                required
                                                placeholder="0.00"
                                                className="pl-8"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                            <span className="absolute left-3 top-2.5 text-gray-500">€</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <Input
                                        id="supplier"
                                        placeholder="e.g. Amazon, Uber, Adobe"
                                        required
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="e.g. Office Supplies"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(val: string) => setFormData({ ...formData, category: val })}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Travel">Travel</SelectItem>
                                                <SelectItem value="Meals">Meals</SelectItem>
                                                <SelectItem value="Software">Software</SelectItem>
                                                <SelectItem value="Office">Office</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vat">VAT Amount (Optional)</Label>
                                        <div className="relative">
                                            <Input
                                                id="vat"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="pl-8"
                                                value={formData.vatAmount}
                                                onChange={(e) => setFormData({ ...formData, vatAmount: e.target.value })}
                                            />
                                            <span className="absolute left-3 top-2.5 text-gray-500">€</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="receipt">Receipt (Optional)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="receipt"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                        />
                                        {file && (
                                            <Button
                                                type="button"
                                                onClick={handleScan}
                                                variant="secondary"
                                                className="shrink-0 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                                disabled={scanning}
                                            >
                                                {scanning ? "Scanning..." : "Magic Scan ✨"}
                                            </Button>
                                        )}
                                    </div>
                                    {file && <p className="text-xs text-green-600">Selected: {file.name}</p>}
                                </div>

                                <DialogFooter>
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full">Save Expense</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.total.toFixed(2)}€</div>
                        <p className="text-xs text-gray-500 mt-1">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {expenses.filter(e => e.status === 'PENDING').length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Receipts to review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Largest Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Simple logic to find max category */}
                        <div className="text-2xl font-bold text-indigo-600">
                            {Object.entries(stats.byCategory).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || '-'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Most expenses type</p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Transactions</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search supplier or description..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Proof</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : filteredExpenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">No expenses found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell className="font-medium">{expense.supplier}</TableCell>
                                        <TableCell className="text-gray-500">{expense.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-50">{expense.category}</Badge>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            -{expense.amount.toFixed(2)}€
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                expense.status === 'APPROVED' || expense.status === 'PAID' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                    expense.status === 'REJECTED' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                                        'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                            }>
                                                {expense.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {expense.proofUrl ? (
                                                <a href={`${process.env.NEXT_PUBLIC_API_URL}${expense.proofUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
                                                    <FileText className="w-3 h-3" /> Receipt
                                                </a>
                                            ) : <span className="text-gray-400 text-xs">No receipt</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(expense.id, 'APPROVED')}>
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(expense.id, 'REJECTED')}>
                                                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Reject
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(expense.id)} className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
