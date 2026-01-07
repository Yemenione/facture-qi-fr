"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function DocumentUploadPage() {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'application/pdf': ['.pdf']
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setProgress(0);
        let successCount = 0;

        try {
            const totalFiles = files.length;

            for (let i = 0; i < totalFiles; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('description', `Dépôt rapide - ${new Date().toLocaleDateString()}`);
                formData.append('amount', '0'); // Default for quick upload
                formData.append('date', new Date().toISOString());
                formData.append('supplier', 'À classer');

                await api.post('/expenses', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                successCount++;
                setProgress(Math.round(((i + 1) / totalFiles) * 100));
            }

            toast.success(`${successCount} document(s) envoyé(s) avec succès !`);
            setFiles([]);
            setTimeout(() => {
                router.push('/dashboard/expenses');
            }, 1000);

        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Erreur lors de l'envoi des documents.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dépôt Rapide</h1>
                <p className="text-slate-500">
                    Déposez vos factures et justificatifs ici pour que votre expert-comptable puisse les traiter.
                </p>
            </div>

            <Card className="border-2 border-dashed border-slate-200 shadow-none">
                <CardContent className="pt-6">
                    <div
                        {...getRootProps()}
                        className={`
                            flex flex-col items-center justify-center py-12 px-4 text-center cursor-pointer rounded-lg transition-colors
                            ${isDragActive ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50"}
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <UploadCloud className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {isDragActive ? "Déposez les fichiers ici" : "Cliquez ou glissez vos fichiers ici"}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-sm">
                            Supporte PDF, JPG, PNG (Max 10MB). Vos documents seront automatiquement transmis à votre comptable.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {files.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Fichiers sélectionnés ({files.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="bg-white p-2 rounded border border-slate-200 shadow-sm">
                                            <File className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    {!uploading && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {uploading && (
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {uploading && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Envoi en cours...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi...
                                    </>
                                ) : (
                                    <>
                                        Envoyer au cabinet <UploadCloud className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Information</p>
                    <p>
                        Ces documents apparaîtront instantanément dans votre espace "Dépenses" avec le statut "En attente".
                        Votre expert-comptable sera notifié et pourra procéder à la validation et la catégorisation.
                    </p>
                </div>
            </div>
        </div>
    );
}
