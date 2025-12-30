"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, Truck, ShieldCheck, Store, ShoppingCart, Heart, 
  MapPin, RotateCcw, MessageCircle, Send, X, Image as ImageIcon, Loader2 
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client' // Required to fix the connection error
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ProductDetailsClient({ product }: { product: any }) {
  // --- EXISTING SELECTION LOGIC ---
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(product.availableOptions || {}).forEach(key => {
      initial[key] = product.availableOptions[key][0];
    });
    return initial;
  });

  const currentVariant = useMemo(() => {
    return product.variants.find((v: any) => 
      v.options.every((opt: any) => selectedOptions[opt.optionName] === opt.valueName)
    ) || product.variants[0];
  }, [selectedOptions, product.variants]);

  const galleryImages = useMemo(() => {
    const variantImages = currentVariant.options.find((o: any) => o.images && o.images.length > 0)?.images;
    return variantImages && variantImages.length > 0 ? variantImages : [product.mainImage];
  }, [currentVariant, product.mainImage]);

  const [mainDisplayImage, setMainDisplayImage] = useState<string | null>(null);
  const displayImg = mainDisplayImage || galleryImages[0];

  const handleOptionSelect = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
    setMainDisplayImage(null); 
  };

  // --- FIXED CHAT LOGIC ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  
  const stompClient = useRef<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      // Connect using SockJS as per your backend WebSocketConfig
      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          setIsConnected(true);
          // Subscribe to private queue
          client.subscribe('/user/queue/messages', (message) => {
            const received = JSON.parse(message.body);
            // Mark received messages to distinguish from 'isMe'
            setMessages((prev) => [...prev, { ...received, isMe: false }]);
          });
        },
        onDisconnect: () => setIsConnected(false),
        onStompError: () => setIsConnected(false),
      });

      client.activate();
      stompClient.current = client;
      return () => client.deactivate();
    }
  }, [isChatOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Uses your StorageController to upload to Pinata
      const res = await fetch('http://localhost:8080/api/v1/storage/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.payload) setPendingImage(data.payload);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = () => {
    if (stompClient.current?.connected && (chatInput.trim() || pendingImage)) {
      const msgPayload = {
        senderId: "currentUser@example.com", // Replace with auth user email
        recipientId: product.seller.email,
        content: chatInput,
        imageUrl: pendingImage, // Pinata URL
        productId: product.productUuid,
        type: "CHAT"
      };

      stompClient.current.publish({
        destination: '/app/chat.sendPrivateMessage',
        body: JSON.stringify(msgPayload),
      });

      // Optimistic UI Update
      setMessages((prev) => [...prev, { ...msgPayload, isMe: true }]);
      setChatInput("");
      setPendingImage(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      
      {/* COLUMN 1: IMAGE GALLERY (col-span 5) */}
      <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 lg:sticky lg:top-24">
        <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto">
          {galleryImages.map((img: string, idx: number) => (
            <button 
              key={idx}
              onMouseEnter={() => setMainDisplayImage(img)}
              onClick={() => setMainDisplayImage(img)}
              className={cn(
                "relative w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden bg-white transition-all",
                displayImg === img ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-primary"
              )}
            >
              <Image src={img} alt="thumbnail" fill className="object-contain p-1" />
            </button>
          ))}
        </div>

        <div className="flex-1 aspect-square relative overflow-hidden rounded-lg border border-gray-100 bg-white order-1 md:order-2">
          <Image 
            src={displayImg || '/placeholder.png'} 
            alt={product.productName} 
            fill 
            className="object-contain p-6 transition-transform duration-300 hover:scale-110" 
            priority 
          />
        </div>
      </div>

      {/* COLUMN 2: PRODUCT INFO (col-span 4) */}
      <div className="lg:col-span-4 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-blue-600 hover:underline cursor-pointer font-medium text-sm">
              Visit the {product.brandName} Store
            </p>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border shadow-sm"><Heart size={16} /></Button>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
            {product.productName}
          </h1>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-orange-400">
            <Star size={18} fill="currentColor" />
            <span className="ml-1 font-bold text-gray-900">{product.averageRating || "0.0"}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
            {product.totalReviews} ratings
          </p>
        </div>

        <Separator />

        {/* Variant Selectors */}
        <div className="space-y-6">
          {Object.entries(product.availableOptions || {}).map(([optionName, values]: any) => (
            <div key={optionName}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                {optionName}: <span className="font-normal text-gray-600">{selectedOptions[optionName]}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.map((val: string) => (
                  <button
                    key={val}
                    onClick={() => handleOptionSelect(optionName, val)}
                    className={cn(
                      "px-4 py-1.5 text-sm border rounded shadow-sm transition-all",
                      selectedOptions[optionName] === val 
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500 text-gray-900" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Features / Short Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold">About this item</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            {product.description.split('.').slice(0, 4).map((sentence: string, i: number) => (
                sentence.length > 5 && <li key={i}>{sentence.trim()}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* COLUMN 3: THE BUY BOX (col-span 3) */}
      <div className="lg:col-span-3">
        <div className="border border-gray-300 rounded-lg p-5 space-y-4 bg-white lg:sticky lg:top-24">
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium self-start mt-1">$</span>
               <span className="text-3xl font-medium">{Math.floor(currentVariant.salePrice)}</span>
               <span className="text-sm font-medium self-start mt-1">{(currentVariant.salePrice % 1).toFixed(2).substring(2)}</span>
            </div>
            {currentVariant.discountPercentage > 0 && (
              <p className="text-sm text-gray-500">
                List Price: <span className="line-through">${currentVariant.price}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm">
                Delivery <span className="font-bold">Wednesday, Jan 1</span>
            </p>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-medium">
               <MapPin size={14} /> 
               <span className="hover:underline cursor-pointer">Deliver to Cambodia</span>
            </div>
          </div>

          <h3 className={cn(
            "text-lg font-bold",
            currentVariant.stockQuantity > 0 ? "text-green-700" : "text-red-600"
          )}>
            {currentVariant.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
          </h3>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button className="w-full h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black border-none shadow-sm font-normal">
              Add to Cart
            </Button>
            <Button className="w-full h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm font-normal">
              Buy Now
            </Button>

            {/* NEW CHAT BUTTON ADDED TO BUY BOX */}
            <Button 
              onClick={() => setIsChatOpen(true)}
              variant="outline" 
              className="w-full h-10 rounded-full border-gray-300 hover:bg-gray-50 font-normal gap-2"
            >
              <MessageCircle size={18} className="text-blue-600" />
              Chat with Seller
            </Button>
          </div>

          {/* Trust Details */}
          <div className="text-xs space-y-2 pt-4 border-t">
            <div className="flex justify-between">
                <span className="text-gray-500">Ships from</span>
                <span className="text-gray-900">{product.brandName} Store</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Sold by</span>
                <span className="text-blue-600 hover:underline cursor-pointer font-medium">{product.seller.storeName}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Returns</span>
                <span className="text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                    Eligible for Return <RotateCcw size={10} />
                </span>
            </div>
          </div>

          {/* Seller Trust Card */}
          <div className="pt-4 mt-2">
             <div className="bg-gray-50 rounded p-3 border border-dashed border-gray-300">
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-500">Trade Assurance</span>
                </div>
                <p className="text-[10px] text-gray-500">Commerza protects your order from payment to delivery.</p>
             </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING CHAT BOX (Absolute position) --- */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-[450px] bg-white border border-gray-300 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-[#232f3e] text-white p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Store size={16} />
                    <span className="text-sm font-bold truncate">{product.seller.storeName}</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-300 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Message Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-100 p-2 rounded text-[11px] text-gray-600">
                        Discussing: <span className="font-bold">{product.productName}</span>
                    </div>
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
                            <div className={cn(
                                "max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-sm",
                                msg.isMe ? "bg-[#f3f3f3] text-black rounded-br-none" : "bg-white border text-black rounded-bl-none"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Input Area */}
           <div className="p-3 border-t bg-white space-y-2">
                {pendingImage && (
                  <div className="relative w-16 h-16 rounded border overflow-hidden group">
                    <Image src={pendingImage} alt="pending" fill className="object-cover" />
                    <button onClick={() => setPendingImage(null)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full"><X size={10}/></button>
                  </div>
                )}
                <div className="flex gap-2">
                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
                    <Button variant="ghost" size="icon" disabled={!isConnected || uploading} onClick={() => fileInputRef.current?.click()} className="h-9 w-9">
                        {uploading ? <Loader2 className="animate-spin" size={18}/> : <ImageIcon size={18} />}
                    </Button>
                    <Input 
                      value={chatInput} 
                      disabled={!isConnected}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isConnected ? "Message..." : "Connecting..."} 
                      className="h-9 text-xs" 
                    />
                    <Button onClick={handleSendMessage} disabled={!isConnected} size="icon" className="h-9 w-9 bg-orange-500 hover:bg-orange-600 shrink-0"><Send size={16} /></Button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}