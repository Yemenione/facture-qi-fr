"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import TemplateEditor from "@/components/templates/template-editor"
import templateService from "@/services/template.service"

export default function EditTemplatePage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()
    const [template, setTemplate] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) loadTemplate()
    }, [id])

    const loadTemplate = async () => {
        try {
            const data = await templateService.findOne(id)
            setTemplate(data)
        } catch (error) {
            console.error(error)
            alert("Erreur: Template introuvable")
            router.push('/dashboard/settings/templates')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8">Chargement...</div>

    return <TemplateEditor initialData={template} isEditing={true} />
}
