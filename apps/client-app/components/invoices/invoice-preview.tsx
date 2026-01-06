import React from "react"
import { InvoiceTemplateProps } from "./templates/types"
import { ClassicTemplate } from "./templates/classic-template"

interface InvoicePreviewProps extends InvoiceTemplateProps {
    templateType?: 'CLASSIC' | 'MODERN' | 'ELEGANT' | 'COLORFUL'
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
    templateType = 'CLASSIC',
    ...props
}) => {
    // We will add other templates here as we build them
    switch (templateType) {
        case 'CLASSIC':
        default:
            return <ClassicTemplate {...props} />
    }
}
