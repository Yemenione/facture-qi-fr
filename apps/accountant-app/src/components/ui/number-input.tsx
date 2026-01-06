"use client"

import * as React from "react"
import { NumericFormat, NumericFormatProps } from "react-number-format"
import { cn } from "@/lib/utils"

interface NumberInputProps extends Omit<NumericFormatProps, "type"> {
    className?: string
}

export function NumberInput({ className, ...props }: NumberInputProps) {
    return (
        <NumericFormat
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            decimalSeparator=","
            thousandSeparator=" "
            fixedDecimalScale={props.fixedDecimalScale ?? true}
            decimalScale={props.decimalScale ?? 2}
            dir="ltr"
            inputMode="decimal"
            {...props}
        />
    )
}
