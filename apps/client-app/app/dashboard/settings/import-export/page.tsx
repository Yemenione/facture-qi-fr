'use client';

import { useState } from 'react';
import { Download, Upload, FileSpreadsheet, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/providers/toast-provider';
import Papa from 'papaparse';
import { getCookie } from 'cookies-next';

export default function ImportExportPage() {
    const [importing, setImporting] = useState(false);
    const [uploadStat, setUploadStat] = useState<{ success: number, count: number } | null>(null);
    const toast = useToast();

    const handleDownload = (type: string, format: 'xlsx' | 'csv') => {
        const token = getCookie('token');
        // Trigger download via window.open or fetch blob
        // Using window.open for simplicity, but cleaner to use fetch + blob
        const url = `${process.env.NEXT_PUBLIC_API_URL}/data-ops/export/${type}?format=${format}&token=${token}`;

        // We can't pass header easily with window.open, so we might need a temporary query param for token or use fetch
        // Let's use fetch for security if possible, but for file download simple GET with cookie (if httpOnly) or query param is common.
        // Assuming we rely on the header being set in a fetch wrapper or we download via Blob.

        downloadFile(type, format);
    };

    const downloadFile = async (type: string, format: string) => {
        try {
            const token = getCookie('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data-ops/export/${type}?format=${format}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Download failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-${new Date().toISOString().split('T')[0]}.${format}`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Download Started", "File generated successfully.");
        } catch (err) {
            toast.error("Download Failed", "Could not export data.");
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                try {
                    const token = getCookie('token');
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data-ops/import/clients`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ data: results.data })
                    });

                    if (!res.ok) throw new Error('Import API failed');
                    const json = await res.json();

                    setUploadStat({ success: json.count, count: results.data.length });
                    toast.success("Import Complete", `Successfully imported ${json.count} records.`);
                } catch (err) {
                    toast.error("Import Failed", "Server rejected the data.");
                } finally {
                    setImporting(false);
                }
            },
            error: (err) => {
                toast.error("Parse Error", "Invalid CSV file.");
                setImporting(false);
            }
        });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Import / Export</h1>
                <p className="text-gray-500 mt-1">Manage your data portability. Backup your data or migrate from other tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* EXPORT SECTION */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Download className="w-5 h-5 text-indigo-600" /> Export Data
                    </h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg"><FileSpreadsheet className="w-5 h-5" /></div>
                                <div>
                                    <div className="font-medium text-gray-800">Invoices</div>
                                    <div className="text-xs text-gray-500">.xlsx (Excel) format</div>
                                </div>
                            </div>
                            <button onClick={() => handleDownload('invoices', 'xlsx')} className="text-sm font-semibold text-indigo-600 hover:underline">Download</button>
                        </div>

                        <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><FileText className="w-5 h-5" /></div>
                                <div>
                                    <div className="font-medium text-gray-800">Clients</div>
                                    <div className="text-xs text-gray-500">.csv format</div>
                                </div>
                            </div>
                            <button onClick={() => handleDownload('clients', 'csv')} className="text-sm font-semibold text-indigo-600 hover:underline">Download</button>
                        </div>
                    </div>
                </div>

                {/* IMPORT SECTION */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-indigo-600" /> Import Data
                    </h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={importing}
                            />
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-900">
                                {importing ? 'Processing...' : 'Upload Clients CSV'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Drag and drop or click to select</p>
                        </div>

                        {uploadStat && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div className="text-sm text-green-800">
                                    Imported <strong>{uploadStat.success}</strong> records successfully.
                                </div>
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 underline">Download template CSV</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
