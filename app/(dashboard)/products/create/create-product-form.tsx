'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, Star, Trash2, Upload, X, AlertCircle, Sparkles } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

// --- Zod Schema ---
const productSchema = z.object({
  productName: z.string().min(3, "Name is too short"),
  description: z.string().min(10, "Description is too short"),
  categoryUuid: z.string().min(1, "Category is required"),
})

// --- Types ---
interface Option {
  id: string
  name: string // e.g., "Color"
  values: string[] // e.g., ["Red", "Blue"]
  isVisual: boolean // New: Helps user know which one creates images
}

interface VariantRow {
  id: string
  options: Record<string, string> 
  price: number
  stock: number
}

interface ImageMap {
  [key: string]: File[] 
}

export function CreateProductForm({ mainCategories }: { mainCategories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { productName: "", description: "", categoryUuid: "" },
  })

  // --- 1. Simplified State ---
  // We initialize with one "Visual" option (like Color)
  const [options, setOptions] = useState<Option[]>([
    { id: 'opt-visual', name: 'Color', values: [], isVisual: true }
  ])
  const [inputValue, setInputValue] = useState<Record<string, string>>({})
  const [variants, setVariants] = useState<VariantRow[]>([])
  const [imageFiles, setImageFiles] = useState<ImageMap>({})

  // Bulk Edit State
  const [bulkPrice, setBulkPrice] = useState<string>("")
  const [bulkStock, setBulkStock] = useState<string>("")

  // --- 2. Option Helpers ---
  const addOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), name: '', values: [], isVisual: false }])
  }

  const removeOption = (id: string) => {
    if(options.length <= 1) {
        toast.error("You must have at least one attribute (e.g. Color).")
        return
    }
    setOptions(options.filter(o => o.id !== id))
  }

  const addValue = (optId: string) => {
    const val = inputValue[optId]?.trim()
    if (!val) return
    setOptions(prev => prev.map(o => o.id === optId && !o.values.includes(val) ? { ...o, values: [...o.values, val] } : o))
    setInputValue(prev => ({ ...prev, [optId]: '' }))
  }

  const removeValue = (optId: string, val: string) => {
    setOptions(prev => prev.map(o => o.id === optId ? { ...o, values: o.values.filter(v => v !== val) } : o))
    // Clear images for that value
    setImageFiles(prev => {
        const copy = { ...prev }
        delete copy[`${optId}:${val}`]
        return copy
    })
  }

  // --- 3. Auto-Generate Variants (The "Math" Part) ---
  useEffect(() => {
    const validOptions = options.filter(o => o.name && o.values.length > 0)
    if (validOptions.length === 0) {
      setVariants([])
      return
    }

    // Recursive function to mix options (Red+S, Red+M, Blue+S...)
    const combine = (idx: number, current: Record<string, string>): Record<string, string>[] => {
      if (idx === validOptions.length) return [current]
      const opt = validOptions[idx]
      let res: Record<string, string>[] = []
      for (const val of opt.values) {
        res = res.concat(combine(idx + 1, { ...current, [opt.name]: val }))
      }
      return res
    }

    const combos = combine(0, {})
    
    setVariants(prev => combos.map(c => {
        const key = JSON.stringify(c)
        const existing = prev.find(p => JSON.stringify(p.options) === key)
        return existing || { id: crypto.randomUUID(), options: c, price: 0, stock: 0 }
    }))
  }, [options])

  // --- 4. Bulk Edit Logic ---
  const applyBulkEdit = () => {
    const p = parseFloat(bulkPrice)
    const s = parseInt(bulkStock)
    if (isNaN(p) && isNaN(s)) return

    setVariants(prev => prev.map(v => ({
        ...v,
        price: !isNaN(p) ? p : v.price,
        stock: !isNaN(s) ? s : v.stock
    })))
    toast.success("Applied to all variants")
  }

  // --- 5. Image Logic ---
  const visualOption = options.find(o => o.isVisual) || options[0]

  const handleImageUpload = (valName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files)
      const key = `${visualOption.id}:${valName}`
      setImageFiles(prev => {
        const current = prev[key] || []
        if (current.length + newFiles.length > 5) {
            toast.error("Max 5 images allowed")
            return prev
        }
        return { ...prev, [key]: [...current, ...newFiles] }
      })
      e.target.value = ''
    }
  }

  const setMainImage = (valName: string, idx: number) => {
    const key = `${visualOption.id}:${valName}`
    setImageFiles(prev => {
        const list = [...(prev[key] || [])]
        if (idx === 0) return prev
        const item = list.splice(idx, 1)[0]
        list.unshift(item)
        return { ...prev, [key]: list }
    })
  }

  // --- 6. Submit Logic (Matches Your Backend) ---
  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (variants.length === 0) {
        toast.error("Please add at least one option value (e.g. 'Red').")
        return
    }
    setLoading(true)
    setUploadingImages(true)

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        
        // A. Upload Images
        const uploadedMap: Record<string, string[]> = {}
        for (const key of Object.keys(imageFiles)) {
            const files = imageFiles[key]
            if (!files.length) continue
            
            const fd = new FormData()
            files.forEach(f => fd.append('files', f))
            const res = await fetch(`${apiUrl}/storage/uploads`, { method: 'POST', body: fd })
            if(!res.ok) throw new Error("Image upload failed")
            const json = await res.json()
            uploadedMap[key] = json.payload
        }
        setUploadingImages(false)

        // B. Build Payload
        const payload = {
            productName: data.productName,
            description: data.description,
            categoryUuid: data.categoryUuid,
            variants: variants.map(v => ({
                price: v.price,
                stockQuantity: v.stock,
                options: Object.entries(v.options).map(([optName, optVal]) => {
                    // Check if this option is the visual one
                    const isVisual = optName === visualOption.name
                    const imgKey = `${visualOption.id}:${optVal}`
                    return {
                        optionName: optName,
                        valueName: optVal,
                        imgUrls: isVisual ? (uploadedMap[imgKey] || []) : []
                    }
                })
            }))
        }

        // C. Send
        const res = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Failed")
        
        toast.success("Product Created!")
        router.push('/dashboard/products')
        router.refresh()

    } catch (e: any) {
        toast.error(e.message || "Something went wrong")
    } finally {
        setLoading(false)
        setUploadingImages(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* --- STEP 1: Basic Info --- */}
            <Card>
                <CardHeader><CardTitle>1. Product Details</CardTitle></CardHeader>
                <CardContent className="grid gap-4">
                    <FormField control={form.control} name="productName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl><Input placeholder="e.g. Luxury Silk Shirt" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="categoryUuid" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {mainCategories.map((m: any) => (
                                            <React.Fragment key={m.id}>
                                                <SelectItem value={m.mainCategoryUuid} disabled className="font-bold opacity-100 bg-muted">{m.mainCategoryName}</SelectItem>
                                                {m.subCategories?.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.categoryUuid} className="pl-6">{s.categoryName}</SelectItem>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea placeholder="Product details..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent>
            </Card>

            {/* --- STEP 2: Attributes --- */}
            <Card>
                <CardHeader>
                    <CardTitle>2. Attributes & Images</CardTitle>
                    <CardDescription>First, define the main attribute (like Color or Material) that changes how the product looks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {options.map((opt, idx) => (
                        <div key={opt.id} className="p-4 bg-slate-50 border rounded-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base">
                                    {idx === 0 ? "Main Attribute (Visual)" : "Other Attribute"}
                                </Label>
                                {idx > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(opt.id)}><Trash2 className="size-4 text-red-500" /></Button>}
                            </div>
                            
                            <div className="flex gap-2">
                                <Input 
                                    value={opt.name} 
                                    onChange={(e) => setOptions(prev => prev.map(o => o.id === opt.id ? { ...o, name: e.target.value } : o))}
                                    placeholder={idx === 0 ? "e.g. Color" : "e.g. Size"} 
                                    className="max-w-[200px]"
                                />
                                <div className="flex-1 flex gap-2">
                                    <Input 
                                        placeholder="Add value (Enter to add)" 
                                        value={inputValue[opt.id] || ''}
                                        onChange={(e) => setInputValue({ ...inputValue, [opt.id]: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValue(opt.id))}
                                    />
                                    <Button type="button" variant="secondary" onClick={() => addValue(opt.id)}>Add</Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {opt.values.map(val => (
                                    <Badge key={val} variant="outline" className="px-3 py-1 bg-white">
                                        {val} <X className="ml-2 size-3 cursor-pointer" onClick={() => removeValue(opt.id, val)} />
                                    </Badge>
                                ))}
                            </div>

                            {/* Image Uploader - Only for the Visual Option */}
                            {opt.isVisual && opt.values.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
                                    {opt.values.map(val => {
                                        const key = `${opt.id}:${val}`
                                        const files = imageFiles[key] || []
                                        return (
                                            <div key={val} className="space-y-2">
                                                <span className="text-sm font-medium">Images for {val}</span>
                                                <div className="flex gap-2 overflow-x-auto pb-2">
                                                    {files.length === 0 && (
                                                        <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-slate-100">
                                                            <Upload className="size-5 text-gray-400" />
                                                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleImageUpload(val, e)} />
                                                        </label>
                                                    )}
                                                    {files.map((f, i) => (
                                                        <div key={i} className="relative w-20 h-20 flex-shrink-0 group">
                                                            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover rounded-md border" />
                                                            {i === 0 && <div className="absolute top-0 right-0 bg-yellow-400 p-0.5 rounded-bl-md"><Star className="size-3 text-white fill-white" /></div>}
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity rounded-md">
                                                                <Trash2 className="size-4 text-white cursor-pointer" onClick={() => setImageFiles(prev => ({...prev, [key]: prev[key].filter((_, x) => x!==i)}))} />
                                                                {i!==0 && <Star className="size-4 text-white cursor-pointer" onClick={() => setMainImage(val, i)} />}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {files.length > 0 && files.length < 5 && (
                                                        <label className="flex items-center justify-center w-20 h-20 border border-dashed rounded-md cursor-pointer hover:bg-slate-100 flex-shrink-0">
                                                            <Plus className="size-5 text-gray-400" />
                                                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleImageUpload(val, e)} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addOption}><Plus className="mr-2 size-4" /> Add Another Attribute (e.g. Size)</Button>
                </CardContent>
            </Card>

            {/* --- STEP 3: Pricing --- */}
            {variants.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>3. Pricing & Stock</CardTitle>
                        <div className="flex gap-4 items-end pt-2">
                            <div className="grid gap-1.5">
                                <Label className="text-xs">Bulk Price</Label>
                                <Input placeholder="0.00" className="h-8 w-24" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs">Bulk Stock</Label>
                                <Input placeholder="0" className="h-8 w-24" value={bulkStock} onChange={e => setBulkStock(e.target.value)} />
                            </div>
                            <Button type="button" size="sm" variant="secondary" onClick={applyBulkEdit}>Apply All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Variant</TableHead>
                                    <TableHead>Price ($)</TableHead>
                                    <TableHead>Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {variants.map((v, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">
                                            {Object.values(v.options).join(" / ")}
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" className="w-32" min="0" step="0.01" 
                                                value={v.price || ''} 
                                                onChange={e => setVariants(prev => prev.map((pv, i) => i === idx ? { ...pv, price: parseFloat(e.target.value) } : pv))} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                type="number" className="w-32" min="0" 
                                                value={v.stock || ''} 
                                                onChange={e => setVariants(prev => prev.map((pv, i) => i === idx ? { ...pv, stock: parseInt(e.target.value) } : pv))} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end gap-4 sticky bottom-4 p-4 bg-white/80 backdrop-blur-sm border rounded-lg shadow-lg">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} size="lg">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {uploadingImages ? 'Uploading Images...' : 'Publish Product'}
                </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}