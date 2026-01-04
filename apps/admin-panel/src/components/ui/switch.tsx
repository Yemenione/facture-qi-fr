import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
    <input type="checkbox" ref={ref} className={cn("peer h-[25px] w-[45px] cursor-pointer appearance-none rounded-full bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 checked:bg-indigo-600", className)} {...props} />
))
Switch.displayName = "Switch"

export { Switch }
