import * as React from "react"
import {
    Select as SelectPrimitive,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { Label } from "../ui/label"

interface SelectOption {
    value: string
    label: string
}

export interface SelectProps {
    label?: string
    placeholder?: string
    options: SelectOption[]
    value?: string
    onValueChange?: (value: string) => void
    error?: string
    className?: string
}

export function Select({ label, placeholder, options, value, onValueChange, error, className }: SelectProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <Label className={error ? "text-destructive" : ""}>{label}</Label>}
            <SelectPrimitive value={value} onValueChange={onValueChange}>
                <SelectTrigger className={error ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectPrimitive>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    )
}
