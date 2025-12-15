'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, Star, Trash2, Upload, X, ArrowRight, ArrowLeft, Check, Info } from 'lucide-react'
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Import the Server Actions
import { uploadImagesAction, createProductAction } from '@/app/actions/product'

// --- Zod Schema ---
const productSchema = z.object({
  productName: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryUuid: z.string().min(1, "Category is required"),
})

// --- Types ---
interface Attribute {
  id: string
  name: string // e.g. "Style"
  values: string[] // e.g. ["Wooden Red", "Steel Blue"]
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

export function CreateProductForm({ mainCategories }: { mainCategories: any[] }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  // --- Form State ---
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { productName: "", description: "", categoryUuid: "" },
  })

  // 1. Visual Attribute (Drives Images)
  const [visualAttr, setVisualAttr] = useState<Attribute>({ id: 'visual', name: 'Variation', values: [] })
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
  const [bulkDiscount, setBulkDiscount] = useState("")

  // --- Logic: Variant Generation ---
  useEffect(() => {
    const allAttributes = [visualAttr, ...otherAttrs].filter(a => a.values.length > 0)
    
    if (allAttributes.length === 0) {
      if(visualAttr.values.length === 0 && otherAttrs.length === 0) setVariants([])
      return
    }

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

  // --- Logic: Submit to Backend (Optimized for Speed & Redirect) ---
  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    // 1. Validation: Ensure variants exist
    if (variants.length === 0) {
        toast.error("Please add product attributes to generate variants.")
        setStep(2)
        return
    }
    
    // 2. Validation: Ensure Pricing
    if (variants.some(v => v.price <= 0)) {
        toast.error("All variants must have a price greater than 0.")
        setStep(4)
        return
    }

    // 3. Validation: Ensure Visuals (Images) are uploaded
    const missingImages = visualAttr.values.filter(val => !imageFiles[val] || imageFiles[val].length === 0)
    if (missingImages.length > 0) {
        toast.error(`Please upload images for: ${missingImages.join(', ')}`)
        setStep(2)
        return
    }

    // Start Loading
    setLoading(true)
    setUploadingImages(true)

    try {
        // --- A. Upload Images (Parallel Speed Boost) ---
        const uploadPromises = Object.keys(imageFiles).map(async (valName) => {
            const files = imageFiles[valName]
            if (!files || files.length === 0) return null
            
            const fd = new FormData()
            files.forEach(f => fd.append('files', f))
            
            const response = await uploadImagesAction(fd)
            if (response.error) {
                throw new Error(`Failed to upload images for ${valName}: ${response.error}`)
            }
            return { valName, urls: response.payload }
        })

        // Wait for all uploads at once (Fastest method)
        const results = await Promise.all(uploadPromises)
        
        const uploadedMap: Record<string, string[]> = {}
        results.forEach(res => {
            if (res) uploadedMap[res.valName] = res.urls
        })
        
        setUploadingImages(false) // Images done, change button text

        // --- B. Build Payload ---
        const payload = {
            productName: data.productName,
            description: data.description,
            categoryUuid: data.categoryUuid,
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

        // --- C. Post Product ---
        const createRes = await createProductAction(payload)
        
        if (createRes.error) {
            throw new Error(createRes.error)
        }
        
        toast.success("Product published successfully!")
        
        // --- D. Redirect Correctly ---
        // Refresh data to show new product immediately
        router.refresh()
        // Navigate to listing page
        router.push('/products') 
        
        // ⚠️ CRITICAL: Do NOT set loading(false) here. 
        // We want the button to stay disabled/spinning until the page actually changes.

    } catch (e: any) {
        console.error(e)
        toast.error(e.message || "Something went wrong")
        // Only stop loading if there was an error
        setLoading(false)
        setUploadingImages(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                <span className={step >= 1 ? "text-primary" : ""}>1. Details</span>
                <span className={step >= 2 ? "text-primary" : ""}>2. Visuals</span>
                <span className={step >= 3 ? "text-primary" : ""}>3. Variations</span>
                <span className={step >= 4 ? "text-primary" : ""}>4. Pricing</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${step * 25}%` }} />
            </div>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* STEP 1: Basic Info */}
                <div className={step === 1 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Product Details</CardTitle>
                            <CardDescription>Basic information about your item.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="productName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Luxury Office Chair" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
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
                            }}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* STEP 2: Visual Attribute (Images) */}
                <div className={step === 2 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Visuals & Images</CardTitle>
                            <CardDescription>
                                <strong>Tip:</strong> If you want "Wooden Red" and "Steel Blue" to have different images, type "Variation" as the Name, and add "Wooden Red" and "Steel Blue" as values.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border">
                                <div className="grid w-full gap-1.5">
                                    <Label>Attribute Name</Label>
                                    <Input 
                                        value={visualAttr.name} 
                                        onChange={e => setVisualAttr({...visualAttr, name: e.target.value})} 
                                        placeholder="e.g. Variation" 
                                    />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label>Add Value (Press Enter)</Label>
                                    <Input 
                                        value={visualInput} 
                                        onChange={e => setVisualInput(e.target.value)} 
                                        placeholder="e.g. Wooden Red" 
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

                            {/* Alert if empty */}
                            {visualAttr.values.length === 0 && (
                                <Alert className="bg-blue-50 text-blue-900 border-blue-200">
                                    <Info className="h-4 w-4 stroke-blue-900" />
                                    <AlertTitle>No Options Added</AlertTitle>
                                    <AlertDescription>Add values above (like "Wooden Red") to see image upload slots.</AlertDescription>
                                </Alert>
                            )}

                            {/* Image Uploaders */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {visualAttr.values.map(val => (
                                    <div key={val} className="border rounded-lg p-4 bg-white shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-semibold text-lg">{val}</span>
                                            <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => {
                                                setVisualAttr({...visualAttr, values: visualAttr.values.filter(v => v !== val)})
                                            }}><X className="h-4 w-4" /></Button>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {(imageFiles[val] || []).map((file, i) => (
                                                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border bg-gray-100 group">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-contain" />
                                                    {i === 0 && <div className="absolute top-0 left-0 bg-yellow-400 p-1"><Star className="h-3 w-3 text-white fill-white" /></div>}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                        <Star className="h-5 w-5 text-white cursor-pointer hover:scale-110 transition-transform" onClick={() => setMainImage(val, i)} />
                                                        <Trash2 className="h-5 w-5 text-red-400 cursor-pointer hover:scale-110 transition-transform" onClick={() => removeImage(val, i)} />
                                                    </div>
                                                </div>
                                            ))}
                                            {(imageFiles[val] || []).length < 5 && (
                                                <label className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-500 transition-colors">
                                                    <Upload className="h-6 w-6 text-gray-400" />
                                                    <span className="text-[10px] text-gray-500 mt-1 font-medium uppercase">Upload</span>
                                                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageSelect(val, e)} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                            <Button type="button" disabled={visualAttr.values.length === 0} onClick={() => setStep(3)}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* STEP 3: Other Attributes */}
                <div className={step === 3 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Other Variations</CardTitle>
                            <CardDescription>
                                Add attributes that <strong>do not</strong> change the image (e.g. Size, Capacity).
                                <br/> If none, just click Next.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {otherAttrs.map((attr, idx) => (
                                <div key={attr.id} className="p-4 border rounded-lg bg-slate-50 relative">
                                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => setOtherAttrs(otherAttrs.filter(a => a.id !== attr.id))}><X className="h-4 w-4" /></Button>
                                    <div className="grid gap-4">
                                        <div className="grid max-w-sm gap-1.5">
                                            <Label>Attribute Name</Label>
                                            <Input value={attr.name} onChange={e => {
                                                const newAttrs = [...otherAttrs]
                                                newAttrs[idx].name = e.target.value
                                                setOtherAttrs(newAttrs)
                                            }} placeholder="e.g. Size" />
                                        </div>
                                        <div className="flex gap-2 items-center flex-wrap">
                                            {attr.values.map(val => (
                                                <Badge key={val} variant="secondary" className="px-3 py-1 flex gap-2 h-8">{val} <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                                    const newAttrs = [...otherAttrs]
                                                    newAttrs[idx].values = newAttrs[idx].values.filter(v => v !== val)
                                                    setOtherAttrs(newAttrs)
                                                }} /></Badge>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input 
                                                    className="w-32 h-8" 
                                                    placeholder="Value..." 
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
                            <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => setOtherAttrs([...otherAttrs, { id: crypto.randomUUID(), name: '', values: [] }])}>
                                <Plus className="mr-2 h-4 w-4" /> Add Attribute (e.g. Size)
                            </Button>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                            <Button type="button" onClick={() => setStep(4)}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* STEP 4: Pricing & Review */}
                <div className={step === 4 ? "block" : "hidden"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>4. Pricing & Stock</CardTitle>
                            <CardDescription>Review variants. Delete combinations you don't sell.</CardDescription>
                            
                            {/* Bulk Edit Toolbar */}
                            <div className="flex flex-wrap items-end gap-4 bg-muted/40 p-4 rounded-lg mt-4 border">
                                <div className="grid gap-1.5">
                                    <Label className="text-xs">Bulk Price</Label>
                                    <Input placeholder="0.00" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="w-24 bg-white h-9" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label className="text-xs">Bulk Discount (%)</Label>
                                    <Input placeholder="0" value={bulkDiscount} onChange={e => setBulkDiscount(e.target.value)} className="w-24 bg-white h-9" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label className="text-xs">Bulk Stock</Label>
                                    <Input placeholder="0" value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="w-24 bg-white h-9" />
                                </div>
                                <Button type="button" size="sm" onClick={() => {
                                    const p = parseFloat(bulkPrice)
                                    const s = parseInt(bulkStock)
                                    const d = parseFloat(bulkDiscount)
                                    setVariants(prev => prev.map(v => ({
                                        ...v,
                                        price: !isNaN(p) ? p : v.price,
                                        stock: !isNaN(s) ? s : v.stock,
                                        discount: !isNaN(d) ? d : v.discount
                                    })))
                                    toast.success("Applied to all variants")
                                }}>Apply All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>Price ($)</TableHead>
                                        <TableHead>Discount (%)</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variants.map((v, idx) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">
                                                {Object.entries(v.options).map(([k, val]) => (
                                                    <Badge key={k} variant="outline" className="mr-2 text-sm font-normal text-gray-600 bg-slate-50">{val}</Badge>
                                                ))}
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
                                                    type="number" className="w-24 h-9" min="0" max="100"
                                                    value={v.discount || ''} 
                                                    onChange={e => {
                                                        const val = parseFloat(e.target.value)
                                                        setVariants(prev => prev.map((pv, i) => i === idx ? { ...pv, discount: val } : pv))
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
                            {variants.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    No variants generated. Go back and add attributes.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep(3)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                            <Button type="submit" disabled={loading || variants.length === 0} size="lg" className="gap-2">
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Check className="h-4 w-4" />} 
                                {uploadingImages ? 'Uploading Images...' : loading ? 'Publishing...' : 'Publish Product'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

            </form>
        </Form>
    </div>
  )
}