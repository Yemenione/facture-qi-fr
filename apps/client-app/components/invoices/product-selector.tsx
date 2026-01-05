"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Package } from "lucide-react"

import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import productService, { Product } from "@/services/product.service"

interface ProductSelectorProps {
    onSelect: (product: Product) => void
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [products, setProducts] = React.useState<Product[]>([])

    React.useEffect(() => {
        productService.getAll().then(setProducts).catch(console.error)
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between text-muted-foreground font-normal"
                >
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Sélectionner un produit...
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => {
                                        onSelect(product)
                                        setOpen(false)
                                    }}
                                    className="flex flex-col items-start p-2 gap-1 cursor-pointer"
                                >
                                    <div className="flex w-full justify-between items-center">
                                        <span className="font-medium">{product.name}</span>
                                        <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">{formatCurrency(product.price)}</span>
                                    </div>
                                    {product.description && <span className="text-xs text-muted-foreground line-clamp-1">{product.description}</span>}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
