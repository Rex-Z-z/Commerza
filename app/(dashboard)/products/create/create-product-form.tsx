'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// --- Types ---

const productSchema = z.object({
  productName: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryUuid: z.string().min(1, "Category is required"),
})

interface Option {
  id: string
  name: string // e.g., "Color"
  values: string[] // e.g., ["Red", "Blue"]
}

interface VariantRow {
  id: string
  options: Record<string, string> // { "Color": "Red", "Size": "M" }
  price: number
  stock: number
  sku?: string
}

interface ImageMap {
  [key: string]: File[] // Key is usually "OptionName:ValueName" e.g., "Color:Red"
}

export function CreateProductForm({ mainCategories }: { mainCategories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // 1. Basic Info Form
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      categoryUuid: "",
    },
  })

  // 2. Options State (The Alibaba "Product Properties")
  const [options, setOptions] = useState<Option[]>([
    { id: 'opt-1', name: 'Color', values: [] }
  ])
  const [inputValue, setInputValue] = useState<Record<string, string>>({}) // For adding values

  // 3. Variants State (The Table)
  const [variants, setVariants] = useState<VariantRow[]>([])
  
  // 4. Images State
  const [imageFiles, setImageFiles] = useState<ImageMap>({})
  const [uploadingImages, setUploadingImages] = useState(false)

  // --- Helpers for Options ---

  const addOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), name: '', values: [] }])
  }

  const removeOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id))
  }

  const addValueToOption = (optionId: string) => {
    const val = inputValue[optionId]?.trim()
    if (!val) return

    setOptions(prev => prev.map(opt => {
      if (opt.id === optionId && !opt.values.includes(val)) {
        return { ...opt, values: [...opt.values, val] }
      }
      return opt
    }))
    setInputValue(prev => ({ ...prev, [optionId]: '' }))
  }

  const removeValueFromOption = (optionId: string, valToRemove: string) => {
    setOptions(prev => prev.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, values: opt.values.filter(v => v !== valToRemove) }
      }
      return opt
    }))
  }

  // --- Generate Variants (Cartesian Product) ---
  // This runs whenever options change to regenerate the table preview
  React.useEffect(() => {
    const validOptions = options.filter(o => o.name && o.values.length > 0)
    if (validOptions.length === 0) {
      setVariants([])
      return
    }

    // Helper to generate combinations
    const generateCombinations = (index: number, current: Record<string, string>): Record<string, string>[] => {
      if (index === validOptions.length) return [current]
      const opt = validOptions[index]
      let combinations: Record<string, string>[] = []
      for (const val of opt.values) {
        combinations = combinations.concat(generateCombinations(index + 1, { ...current, [opt.name]: val }))
      }
      return combinations
    }

    const combos = generateCombinations(0, {})
    
    // Merge with existing variants to preserve price/stock if they exist
    setVariants(prev => {
        return combos.map(combo => {
            // Create a unique key for this combination
            const key = JSON.stringify(combo)
            const existing = prev.find(p => JSON.stringify(p.options) === key)
            return existing || {
                id: crypto.randomUUID(),
                options: combo,
                price: 0,
                stock: 0
            }
        })
    })

  }, [options]) // Simple dependency, might optimize later

  // --- Image Handling ---
  // We attach images to the VALUES of the FIRST option (usually Color/Style)
  const primaryOption = options[0]

  const handleImageSelect = (optionValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const key = `${primaryOption.name}:${optionValue}`
      
      setImageFiles(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), ...newFiles]
      }))
    }
  }

  const removeImage = (optionValue: string, index: number) => {
    const key = `${primaryOption.name}:${optionValue}`
    setImageFiles(prev => ({
        ...prev,
        [key]: prev[key].filter((_, i) => i !== index)
    }))
  }

  // --- Form Submission ---

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (variants.length === 0) {
      toast.error("Please add options and values to generate product variants.")
      return
    }

    setLoading(true)
    setUploadingImages(true)

    try {
        // 1. Upload Images First
        const uploadedImageMap: Record<string, string[]> = {}
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

        // Iterate over our map keys (e.g. "Color:Red")
        for (const key of Object.keys(imageFiles)) {
            const files = imageFiles[key]
            if (files.length === 0) continue

            const formData = new FormData()
            files.forEach(f => formData.append('files', f))

            const uploadRes = await fetch(`${apiUrl}/storage/uploads`, {
                method: 'POST',
                body: formData
            })

            if (!uploadRes.ok) throw new Error("Failed to upload images")
            const uploadData = await uploadRes.json()
            uploadedImageMap[key] = uploadData.payload // List of URLs
        }
        
        setUploadingImages(false)

        // 2. Construct Payload
        const payloadVariants = variants.map(v => {
            const variantOptions = Object.entries(v.options).map(([optName, optValue]) => {
                // Check if we have images for this specific option value
                // We primarily keyed images by the FIRST option, but check generic key
                const imgKey = `${optName}:${optValue}`
                const imgUrls = uploadedImageMap[imgKey] || []

                return {
                    optionName: optName,
                    valueName: optValue,
                    imgUrls: imgUrls
                }
            })

            return {
                price: v.price,
                stockQuantity: v.stock,
                options: variantOptions
            }
        })

        const finalPayload = {
            productName: data.productName,
            description: data.description,
            categoryUuid: data.categoryUuid,
            variants: payloadVariants
        }

        // 3. Send Create Request
        const res = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header here if using client-side tokens or ensure cookie is sent
            },
            body: JSON.stringify(finalPayload)
        })

        const json = await res.json()

        if (!res.ok) {
            toast.error(json.message || "Failed to create product")
        } else {
            toast.success("Product created successfully!")
            router.push('/dashboard/products')
            router.refresh()
        }

    } catch (error) {
        console.error(error)
        toast.error("Something went wrong.")
    } finally {
        setLoading(false)
        setUploadingImages(false)
    }
  }

  // --- Render ---

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. Basic Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Mens Cotton T-Shirt" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="categoryUuid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mainCategories.map((mainCat: any) => (
                                                <React.Fragment key={mainCat.id}>
                                                    <SelectItem value={mainCat.mainCategoryUuid} disabled className="font-bold bg-muted/50 text-black opacity-100">
                                                        {mainCat.mainCategoryName}
                                                    </SelectItem>
                                                    {mainCat.subCategories?.map((sub: any) => (
                                                        <SelectItem key={sub.id} value={sub.categoryUuid} className="pl-6">
                                                            {sub.categoryName}
                                                        </SelectItem>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe your product..." className="min-h-[120px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* 2. Options Builder */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Options</CardTitle>
                    <CardDescription>Define options like Color, Size, Material. This will generate your variants.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {options.map((option, index) => (
                        <div key={option.id} className="p-4 border rounded-lg bg-slate-50 relative">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                onClick={() => removeOption(option.id)}
                            >
                                <X className="size-4" />
                            </Button>

                            <div className="grid gap-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label>Option Name</Label>
                                    <Input 
                                        placeholder="e.g. Color, Size" 
                                        value={option.name} 
                                        onChange={(e) => {
                                            const newName = e.target.value
                                            setOptions(prev => prev.map(o => o.id === option.id ? { ...o, name: newName } : o))
                                        }}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Option Values</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {option.values.map(val => (
                                            <Badge key={val} variant="secondary" className="px-3 py-1 text-sm flex gap-2 items-center">
                                                {val}
                                                <X 
                                                    className="size-3 cursor-pointer hover:text-red-500" 
                                                    onClick={() => removeValueFromOption(option.id, val)} 
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 max-w-sm">
                                        <Input 
                                            placeholder="Add value (e.g. Red, XL)" 
                                            value={inputValue[option.id] || ''}
                                            onChange={(e) => setInputValue({...inputValue, [option.id]: e.target.value})}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') {
                                                    e.preventDefault()
                                                    addValueToOption(option.id)
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="outline" onClick={() => addValueToOption(option.id)}>Add</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" className="w-full border-dashed" onClick={addOption}>
                        <Plus className="mr-2 size-4" /> Add Another Option
                    </Button>
                </CardContent>
            </Card>

            {/* 3. Variants Table */}
            {variants.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Variants & Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {options.filter(o => o.name).map(o => (
                                        <TableHead key={o.id}>{o.name}</TableHead>
                                    ))}
                                    <TableHead>Price ($)</TableHead>
                                    <TableHead>Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {variants.map((variant, idx) => (
                                    <TableRow key={idx}>
                                        {Object.values(variant.options).map((val, i) => (
                                            <TableCell key={i} className="font-medium">{val}</TableCell>
                                        ))}
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                min="0" 
                                                step="0.01"
                                                className="w-32" 
                                                value={variant.price || ''} 
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value)
                                                    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, price: val } : v))
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" 
                                                min="0"
                                                className="w-32" 
                                                value={variant.stock || ''} 
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value)
                                                    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, stock: val } : v))
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        {/* Bulk Edit Actions Could Go Here */}
                    </CardContent>
                </Card>
            )}

            {/* 4. Image Upload (Grouped by First Option) */}
            {primaryOption && primaryOption.values.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>Upload images for each {primaryOption.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {primaryOption.values.map(val => (
                            <div key={val} className="space-y-3">
                                <Label className="text-base font-semibold">{val}</Label>
                                <div className="flex flex-wrap gap-4">
                                    {/* Existing Preview */}
                                    {imageFiles[`${primaryOption.name}:${val}`]?.map((file, i) => (
                                        <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(val, i)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    <label className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                                        <Upload className="size-6 text-gray-400" />
                                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={(e) => handleImageSelect(val, e)} 
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uploadingImages ? 'Uploading Images...' : 'Create Product'}
                </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}