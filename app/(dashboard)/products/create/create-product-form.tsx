'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, Star, Trash2, Upload, X, ArrowRight, ArrowLeft, Check, Info, Undo2 } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Import Server Actions
import { uploadImagesAction, createProductAction } from '@/app/actions/product'

// --- Zod Schema Updated ---
// We allow either brandUuid OR newBrandName
const productSchema = z.object({
  productName: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryUuid: z.string().min(1, "Category is required"),
  brandUuid: z.string().optional(),
  newBrandName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.brandUuid && (!data.newBrandName || data.newBrandName.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a brand or create a new one",
      path: ["brandUuid"] // Attach error to brandUuid field for UI display
    })
  }
})

// --- Types ---
interface Attribute {
  id: string
  name: string
  values: string[]
}

interface VariantRow {
  id: string
  options: Record<string, string> 
  price: number
  stock: number
  discount: number
}

interface ImageMap {
  [key: string]: File[] 
}

// Preset Options for Amazon Style
const PRESET_OPTIONS = ["Color", "Size", "Material", "Style", "Capacity"]

// CreateProductProps
interface CreateProductProps {
    mainCategories: any[]
    brands: any[] 
}

export function CreateProductForm({ mainCategories, brands }: CreateProductProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  // Toggle for Brand Creation Mode
  const [isCreatingBrand, setIsCreatingBrand] = useState(false)

  // --- Form State ---
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { productName: "", description: "", categoryUuid: "", brandUuid: "", newBrandName: "" },
  })

  // 1. Visual Attribute (Drives Images)
  const [visualAttr, setVisualAttr] = useState<Attribute>({ id: 'visual', name: 'Color', values: [] })
  const [visualInput, setVisualInput] = useState("")
  
  // 2. Other Attributes (e.g. Size)
  const [otherAttrs, setOtherAttrs] = useState<Attribute[]>([])
  const [otherInput, setOtherInput] = useState<Record<string, string>>({})

  // 3. Images & Variants
  const [imageFiles, setImageFiles] = useState<ImageMap>({})
  const [variants, setVariants] = useState<VariantRow[]>([])

  // 4. Bulk Edit State
  const [bulkPrice, setBulkPrice] = useState("")
  const [bulkStock, setBulkStock] = useState("")

  // --- Logic: Variant Matrix Generation ---
  useEffect(() => {
    // Combine Visual + Other Attributes
    const allAttributes = [visualAttr, ...otherAttrs].filter(a => a.values.length > 0)
    
    // If no attributes, reset variants
    if (allAttributes.length === 0) {
      if(visualAttr.values.length === 0 && otherAttrs.length === 0) setVariants([])
      return
    }

    // Cartesian Product Helper
    const generateCombinations = (index: number, current: Record<string, string>): Record<string, string>[] => {
      if (index === allAttributes.length) return [current]
      const attr = allAttributes[index]
      let res: Record<string, string>[] = []
      for (const val of attr.values) {
        res = res.concat(generateCombinations(index + 1, { ...current, [attr.name]: val }))
      }
      return res
    }

    const combos = generateCombinations(0, {})
    
    // Merge with existing variants to preserve price/stock input
    setVariants(prev => {
        const newVariants = combos.map(c => {
            const key = JSON.stringify(c) 
            const existing = prev.find(p => JSON.stringify(p.options) === key)
            return existing || { 
                id: crypto.randomUUID(), 
                options: c, 
                price: 0, 
                stock: 0,
                discount: 0 
            }
        })
        return newVariants
    })
  }, [visualAttr, otherAttrs])

  // --- Logic: Image Handling ---
  const handleImageSelect = (valName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files)
      setImageFiles(prev => {
        const current = prev[valName] || []
        if (current.length + newFiles.length > 5) {
            toast.error("Max 5 images per option.")
            return prev
        }
        return { ...prev, [valName]: [...current, ...newFiles] }
      })
      e.target.value = ''
    }
  }

  const removeImage = (valName: string, idx: number) => {
    setImageFiles(prev => ({ ...prev, [valName]: prev[valName].filter((_, i) => i !== idx) }))
  }

  const setMainImage = (valName: string, idx: number) => {
    setImageFiles(prev => {
        const list = [...(prev[valName] || [])]
        const [item] = list.splice(idx, 1)
        list.unshift(item)
        return { ...prev, [valName]: list }
    })
  }

  const removeVariant = (idx: number) => {
    setVariants(prev => prev.filter((_, i) => i !== idx))
  }

  // --- Logic: Submit ---
  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (variants.length === 0) {
        toast.error("Please add product attributes to generate variants.")
        setStep(2)
        return
    }
    if (variants.some(v => v.price <= 0)) {
        toast.error("All variants must have a price greater than 0.")
        setStep(4)
        return
    }
    const missingImages = visualAttr.values.filter(val => !imageFiles[val] || imageFiles[val].length === 0)
    if (missingImages.length > 0) {
        toast.error(`Please upload images for: ${missingImages.join(', ')}`)
        setStep(2)
        return
    }

    setLoading(true)
    setUploadingImages(true)

    try {
        // A. Upload Images Parallel
        const uploadPromises = Object.keys(imageFiles).map(async (valName) => {
            const files = imageFiles[valName]
            if (!files || files.length === 0) return null
            const fd = new FormData()
            files.forEach(f => fd.append('files', f))
            const response = await uploadImagesAction(fd)
            if (response.error) throw new Error(`Upload failed for ${valName}: ${response.error}`)
            return { valName, urls: response.payload }
        })

        const results = await Promise.all(uploadPromises)
        const uploadedMap: Record<string, string[]> = {}
        results.forEach(res => { if (res) uploadedMap[res.valName] = res.urls })
        
        setUploadingImages(false)

        // B. Build Payload
        const payload = {
            productName: data.productName,
            description: data.description,
            categoryUuid: data.categoryUuid,
            brandUuid: isCreatingBrand ? null : data.brandUuid, 
            newBrandName: isCreatingBrand ? data.newBrandName : null, // Send new brand name if mode is active
            variants: variants.map(v => ({
                price: v.price,
                stockQuantity: v.stock,
                discountPercentage: v.discount,
                options: Object.entries(v.options).map(([optName, optVal]) => {
                    const isVisual = optName === visualAttr.name
                    const images = isVisual ? (uploadedMap[optVal] || []) : []
                    return {
                        optionName: optName,
                        valueName: optVal,
                        imgUrls: images
                    }
                })
            }))
        }

        // C. Create
        const createRes = await createProductAction(payload)
        if (createRes.error) throw new Error(createRes.error)
        
        toast.success("Product published!")
        router.refresh()
        router.push('/products') 

    } catch (e: any) {
        console.error(e)
        toast.error(e.message || "Error creating product")
        setLoading(false)
        setUploadingImages(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Details & Brand</span>
                <span className={step >= 2 ? "text-primary font-bold" : ""}>2. Visuals ({visualAttr.name})</span>
                <span className={step >= 3 ? "text-primary font-bold" : ""}>3. Options</span>
                <span className={step >= 4 ? "text-primary font-bold" : ""}>4. Pricing</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${step * 25}%` }} />
            </div>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* STEP 1: Basic Info */}
                <div className={step === 1 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Product Definition</CardTitle>
                            <CardDescription>Categorize and brand your product for better search results.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="productName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Men's Cotton T-Shirt" {...field} /></FormControl>
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
                                                        <SelectItem value={m.mainCategoryUuid} disabled className="font-bold bg-muted">{m.mainCategoryName}</SelectItem>
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

                                {/* BRAND SELECTION LOGIC */}
                                {isCreatingBrand ? (
                                    <FormField control={form.control} name="newBrandName" render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel>New Brand Name</FormLabel>
                                                <Button type="button" variant="ghost" size="sm" className="h-6 text-xs text-blue-600" onClick={() => {
                                                    setIsCreatingBrand(false)
                                                    form.setValue('newBrandName', '')
                                                }}>
                                                    <Undo2 className="h-3 w-3 mr-1" /> Select Existing
                                                </Button>
                                            </div>
                                            <FormControl>
                                                <Input placeholder="Enter your brand name..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ) : (
                                    <FormField control={form.control} name="brandUuid" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <Select onValueChange={(val) => {
                                                if (val === 'create_new') {
                                                    setIsCreatingBrand(true)
                                                    form.setValue('brandUuid', '')
                                                } else {
                                                    field.onChange(val)
                                                }
                                            }} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {/* Option to create new */}
                                                    <SelectItem value="create_new" className="font-semibold text-blue-600 focus:text-blue-700">
                                                        <div className="flex items-center gap-2">
                                                            <Plus className="h-4 w-4" /> Create New Brand
                                                        </div>
                                                    </SelectItem>
                                                    <div className="h-px bg-gray-100 my-1" />
                                                    
                                                    {brands && brands.length > 0 ? brands.map((b: any) => (
                                                        <SelectItem key={b.brandUuid} value={b.brandUuid}>{b.brandName}</SelectItem>
                                                    )) : <SelectItem value="generic">Generic (No Brand)</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                )}
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea placeholder="Product details..." className="min-h-[120px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button type="button" onClick={async () => {
                                const valid = await form.trigger()
                                if(valid) setStep(2)
                            }}>Next: Visuals <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* STEP 2: Visual Attribute */}
                <div className={step === 2 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Visual Variations</CardTitle>
                            <CardDescription>Select the main variation type that changes how the product looks (usually Color).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border">
                                <div className="grid w-full md:w-1/3 gap-1.5">
                                    <Label>Variation Type</Label>
                                    {/* Amazon Style Selector */}
                                    <Select value={visualAttr.name} onValueChange={(val) => setVisualAttr({...visualAttr, name: val})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {PRESET_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                            <SelectItem value="Other">Custom...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label>Add {visualAttr.name} Options</Label>
                                    <Input 
                                        value={visualInput} 
                                        onChange={e => setVisualInput(e.target.value)} 
                                        placeholder={`e.g. Red, Blue, Green`} 
                                        onKeyDown={e => {
                                            if(e.key === 'Enter') {
                                                e.preventDefault()
                                                const val = visualInput.trim()
                                                if(val && !visualAttr.values.includes(val)) {
                                                    setVisualAttr({...visualAttr, values: [...visualAttr.values, val]})
                                                    setVisualInput("")
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <Button type="button" onClick={() => {
                                    const val = visualInput.trim()
                                    if(val && !visualAttr.values.includes(val)) {
                                        setVisualAttr({...visualAttr, values: [...visualAttr.values, val]})
                                        setVisualInput("")
                                    }
                                }}>Add</Button>
                            </div>

                            {/* Image Uploaders */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {visualAttr.values.map(val => (
                                    <div key={val} className="border rounded-lg p-4 bg-white shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-semibold text-lg flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border bg-gray-200" /> {/* Placeholder for color swatch */}
                                                {val}
                                            </span>
                                            <Button size="icon" variant="ghost" type="button" className="text-red-500 h-8 w-8" onClick={() => {
                                                setVisualAttr({...visualAttr, values: visualAttr.values.filter(v => v !== val)})
                                            }}><X className="h-4 w-4" /></Button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {(imageFiles[val] || []).map((file, i) => (
                                                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border bg-gray-100 group">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-contain" />
                                                    {i === 0 && <div className="absolute top-0 left-0 bg-yellow-400 p-1 rounded-br"><Star className="h-3 w-3 text-white fill-white" /></div>}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                        <Star className="h-5 w-5 text-white cursor-pointer hover:scale-110" onClick={() => setMainImage(val, i)} />
                                                        <Trash2 className="h-5 w-5 text-red-400 cursor-pointer hover:scale-110" onClick={() => removeImage(val, i)} />
                                                    </div>
                                                </div>
                                            ))}
                                            <label className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                                <Upload className="h-6 w-6 text-gray-400" />
                                                <span className="text-[10px] text-gray-500 mt-1">UPLOAD</span>
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageSelect(val, e)} />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button type="button" disabled={visualAttr.values.length === 0} onClick={() => setStep(3)}>Next: Options <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* STEP 3: Other Attributes */}
                <div className={step === 3 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Other Options</CardTitle>
                            <CardDescription>Add secondary options like Size, Material, etc.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {otherAttrs.map((attr, idx) => (
                                <div key={attr.id} className="p-4 border rounded-lg bg-slate-50 relative">
                                    <Button size="icon" type="button" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => setOtherAttrs(otherAttrs.filter(a => a.id !== attr.id))}><X className="h-4 w-4" /></Button>
                                    <div className="grid gap-4">
                                        <div className="grid w-full md:w-1/3 gap-1.5">
                                            <Label>Option Name</Label>
                                            <Select 
                                                value={PRESET_OPTIONS.includes(attr.name) ? attr.name : "Custom"} 
                                                onValueChange={(val) => {
                                                    const newAttrs = [...otherAttrs]
                                                    newAttrs[idx].name = val === "Custom" ? "" : val
                                                    setOtherAttrs(newAttrs)
                                                }}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                                                <SelectContent>
                                                    {PRESET_OPTIONS.filter(o => o !== visualAttr.name).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                    <SelectItem value="Custom">Custom...</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {(!PRESET_OPTIONS.includes(attr.name) && attr.name !== "") && (
                                                 <Input className="mt-2" value={attr.name} onChange={e => {
                                                    const newAttrs = [...otherAttrs]
                                                    newAttrs[idx].name = e.target.value
                                                    setOtherAttrs(newAttrs)
                                                 }} placeholder="Type custom name..." />
                                            )}
                                        </div>

                                        <div className="flex gap-2 items-center flex-wrap">
                                            {attr.values.map(val => (
                                                <Badge key={val} variant="secondary" className="px-3 py-1 flex gap-2 h-8 text-sm">{val} <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                                    const newAttrs = [...otherAttrs]
                                                    newAttrs[idx].values = newAttrs[idx].values.filter(v => v !== val)
                                                    setOtherAttrs(newAttrs)
                                                }} /></Badge>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input 
                                                    className="w-32 h-8" 
                                                    placeholder="Add value..." 
                                                    value={otherInput[attr.id] || ''} 
                                                    onChange={e => setOtherInput({...otherInput, [attr.id]: e.target.value})}
                                                    onKeyDown={e => {
                                                        if(e.key === 'Enter') {
                                                            e.preventDefault()
                                                            const val = otherInput[attr.id]?.trim()
                                                            if(val && !attr.values.includes(val)) {
                                                                const newAttrs = [...otherAttrs]
                                                                newAttrs[idx].values.push(val)
                                                                setOtherAttrs(newAttrs)
                                                                setOtherInput({...otherInput, [attr.id]: ''})
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button size="sm" type="button" variant="secondary" onClick={() => {
                                                    const val = otherInput[attr.id]?.trim()
                                                    if(val && !attr.values.includes(val)) {
                                                        const newAttrs = [...otherAttrs]
                                                        newAttrs[idx].values.push(val)
                                                        setOtherAttrs(newAttrs)
                                                        setOtherInput({...otherInput, [attr.id]: ''})
                                                    }
                                                }}>Add</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" variant="outline" className="w-full border-dashed py-6" onClick={() => setOtherAttrs([...otherAttrs, { id: crypto.randomUUID(), name: 'Size', values: [] }])}>
                                <Plus className="mr-2 h-4 w-4" /> Add Another Option
                            </Button>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                            <Button type="button" onClick={() => setStep(4)}>Generate Matrix <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* STEP 4: Pricing Matrix */}
                <div className={step === 4 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>4. Pricing & Inventory</CardTitle>
                            <CardDescription>We generated {variants.length} variants based on your options.</CardDescription>
                            
                            <div className="flex flex-wrap items-end gap-4 bg-muted/40 p-4 rounded-lg mt-4 border">
                                <div className="grid gap-1.5">
                                    <Label className="text-xs">Bulk Price</Label>
                                    <Input placeholder="0.00" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="w-24 bg-white h-9" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label className="text-xs">Bulk Stock</Label>
                                    <Input placeholder="0" value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="w-24 bg-white h-9" />
                                </div>
                                <Button type="button" size="sm" onClick={() => {
                                    const p = parseFloat(bulkPrice)
                                    const s = parseInt(bulkStock)
                                    setVariants(prev => prev.map(v => ({
                                        ...v,
                                        price: !isNaN(p) ? p : v.price,
                                        stock: !isNaN(s) ? s : v.stock
                                    })))
                                    toast.success("Applied to all variants")
                                }}>Apply to All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>Price ($)</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variants.map((v, idx) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-wrap gap-1">
                                                {Object.entries(v.options).map(([k, val]) => (
                                                    <Badge key={k} variant="outline" className="text-xs font-normal text-gray-600 bg-slate-50">
                                                        <span className="font-bold mr-1">{k}:</span> {val}
                                                    </Badge>
                                                ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" className="w-28 h-9" step="0.01" min="0" 
                                                    value={v.price || ''} 
                                                    onChange={e => {
                                                        const val = parseFloat(e.target.value)
                                                        setVariants(prev => prev.map((pv, i) => i === idx ? { ...pv, price: val } : pv))
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" className="w-28 h-9" min="0" 
                                                    value={v.stock || ''} 
                                                    onChange={e => {
                                                        const val = parseInt(e.target.value)
                                                        setVariants(prev => prev.map((pv, i) => i === idx ? { ...pv, stock: val } : pv))
                                                    }} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => removeVariant(idx)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(3)}>Back</Button>
                            <Button type="submit" disabled={loading || variants.length === 0} size="lg" className="gap-2 w-40">
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />} 
                                {uploadingImages ? 'Uploading...' : 'Publish'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </Form>
    </div>
  )
}