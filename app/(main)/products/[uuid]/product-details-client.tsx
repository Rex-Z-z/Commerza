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
import SockJS from 'sockjs-client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ProductDetailsClient({ product, currentUser }: { product: any, currentUser?: any }) {
  // --- SELECTION LOGIC ---
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && currentUser?.token) {
      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${currentUser.token}` 
        },
        reconnectDelay: 5000,
        onConnect: () => {
          setIsConnected(true);
          client.subscribe('/user/queue/messages', (payload) => {
            const received = JSON.parse(payload.body);
            setMessages((prev) => {
              const isDuplicate = prev.some(m => 
                m.content === received.content && m.timestamp === received.timestamp
              );
              if (isDuplicate) return prev;
              return [...prev, { 
                ...received, 
                // Always compare in lowercase
                isMe: received.senderId.toLowerCase() === currentUser.email.toLowerCase() 
              }];
            });
          });
        },
        onDisconnect: () => setIsConnected(false),
      });

      client.activate();
      stompClient.current = client;
      return () => client.deactivate();
    }
  }, [isChatOpen, currentUser]);

  const handleSendMessage = () => {
    if (stompClient.current?.connected && (chatInput.trim() || pendingImage)) {
      const msgPayload = {
        senderId: currentUser.email.toLowerCase().trim(),
        recipientId: product.seller.email.toLowerCase().trim(),
        content: chatInput,
        imageUrl: pendingImage, 
        productId: product.productUuid,
        type: "CHAT"
      };

      stompClient.current.publish({
        destination: '/app/chat.sendPrivateMessage',
        body: JSON.stringify(msgPayload),
      });

      setChatInput("");
      setPendingImage(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 lg:sticky lg:top-24">
        <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto">
          {galleryImages.map((img: string, idx: number) => (
            <button key={idx} onMouseEnter={() => setMainDisplayImage(img)} className={cn("relative w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden bg-white transition-all", displayImg === img ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-primary")}>
              <Image src={img} alt="thumbnail" fill className="object-contain p-1" />
            </button>
          ))}
        </div>
        <div className="flex-1 aspect-square relative overflow-hidden rounded-lg border border-gray-100 bg-white order-1 md:order-2">
          <Image src={displayImg || '/placeholder.png'} alt={product.productName} fill className="object-contain p-6 transition-transform duration-300 hover:scale-110" priority />
        </div>
      </div>

      <div className="lg:col-span-4 space-y-5">
        <div className="space-y-1">
          <p className="text-blue-600 hover:underline cursor-pointer font-medium text-sm">Visit the Store</p>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">{product.productName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-orange-400"><Star size={18} fill="currentColor" /><span className="ml-1 font-bold text-gray-900">{product.averageRating || "0.0"}</span></div>
          <p className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">{product.totalReviews} ratings</p>
        </div>
        <Separator />
        <div className="space-y-6">
          {Object.entries(product.availableOptions || {}).map(([optionName, values]: any) => (
            <div key={optionName}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">{optionName}: <span className="font-normal text-gray-600">{selectedOptions[optionName]}</span></h3>
              <div className="flex flex-wrap gap-2">
                {values.map((val: string) => (
                  <button key={val} onClick={() => handleOptionSelect(optionName, val)} className={cn("px-4 py-1.5 text-sm border rounded shadow-sm transition-all", selectedOptions[optionName] === val ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500 text-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50")}>{val}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="border border-gray-300 rounded-lg p-5 space-y-4 bg-white lg:sticky lg:top-24">
          <div className="text-3xl font-medium">${Math.floor(currentVariant.salePrice)}<span className="text-sm">{(currentVariant.salePrice % 1).toFixed(2).substring(2)}</span></div>
          <div className="space-y-3 pt-2">
            <Button className="w-full h-10 rounded-full bg-yellow-400 text-black">Add to Cart</Button>
            <Button className="w-full h-10 rounded-full bg-orange-500 text-white font-normal">Buy Now</Button>
            <Button onClick={() => { if(!currentUser) return toast.error("Please login to chat"); setIsChatOpen(true); }} variant="outline" className="w-full h-10 rounded-full border-gray-300 hover:bg-gray-50 font-normal gap-2">
              <MessageCircle size={18} className="text-blue-600" />Chat with Seller
            </Button>
          </div>
          <div className="text-xs space-y-2 pt-4 border-t">
            <div className="flex justify-between"><span className="text-gray-500">Sold by</span><span className="text-blue-600 font-medium">{product.seller.storeName}</span></div>
          </div>

          {/* Trust Details */}
          <div className="text-xs space-y-2 pt-4 border-t">
            <div className="flex justify-between">
                <span className="text-gray-500">Ships from</span>
                <span className="text-gray-900">{product.brandName} Store</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Sold by</span>
                <span className="text-gray-900">{product.seller.storeName}</span>
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

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-[450px] bg-white border border-gray-300 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-[#232f3e] text-white p-3 flex justify-between items-center">
                <div className="flex items-center gap-2"><Store size={16} /><span className="text-sm font-bold truncate">{product.seller.storeName}</span></div>
                <button onClick={() => setIsChatOpen(false)}><X size={20} /></button>
            </div>
            <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-100 p-2 rounded text-[11px] text-gray-600">Discussing: <span className="font-bold">{product.productName}</span></div>
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
                            {msg.content && (
                                <div className={cn("max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-sm mb-1", msg.isMe ? "bg-orange-500 text-white rounded-br-none" : "bg-white border text-black rounded-bl-none")}>
                                    {msg.content}
                                </div>
                            )}
                            {msg.imageUrl && (
                                <div className="relative w-32 h-32 rounded mb-2 overflow-hidden border">
                                    <Image src={msg.imageUrl} alt="chat-img" fill className="object-cover" unoptimized />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
           <div className="p-3 border-t bg-white space-y-2">
                {pendingImage && (
                  <div className="relative w-16 h-16 rounded border overflow-hidden group">
                    <Image src={pendingImage} alt="pending" fill className="object-cover" unoptimized />
                    <button onClick={() => setPendingImage(null)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full"><X size={10}/></button>
                  </div>
                )}
                <div className="flex gap-2">
                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
                    <Button variant="ghost" size="icon" disabled={!isConnected || uploading} onClick={() => fileInputRef.current?.click()} className="h-9 w-9">
                        {uploading ? <Loader2 className="animate-spin" size={18}/> : <ImageIcon size={18} />}
                    </Button>
                    <Input value={chatInput} disabled={!isConnected} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={isConnected ? "Message..." : "Connecting..."} className="h-9 text-xs" />
                    <Button onClick={handleSendMessage} disabled={!isConnected} size="icon" className="h-9 w-9 bg-orange-500 hover:bg-orange-600 shrink-0"><Send size={16} /></Button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}