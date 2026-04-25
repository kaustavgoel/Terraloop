"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import QRCode from "react-qr-code"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles, 
  Sun, 
  Snowflake,
  Info,
  CheckCircle2,
  XCircle,
  Star,
  Trophy,
  User,
  Phone,
  MapPin,
  Plus,
  Minus,
  X,
  Wand2,
  Package
} from "lucide-react"
import { fruits, getCategoryInfo, type Fruit } from "@/lib/fruit-data"
import { 
  getAvailableListings, 
  type GrocerListing, 
  addToCart, 
  getCart, 
  removeFromCart, 
  updateCartQuantity, 
  getCartCount,
  getCartTotal,
  initiatePurchase,
  getCurrentUser,
  type CartItem,
  type PurchaseOrder
} from "@/lib/store"

interface MarketplaceContentProps {
  initialCategory: "climacteric" | "non-climacteric" | null
}

// Unified item type for marketplace
interface MarketplaceItem {
  id: string
  type: "fruit" | "listing"
  name: string
  category: "climacteric" | "non-climacteric"
  image: string
  description: string
  price: number
  unit: string
  freshness: number
  inStock: boolean
  quantity: number
  sellerName: string
  sellerPhone: string
  sellerAddress: string
}

function FreshnessBar({ freshness }: { freshness: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div 
          className="xp-bar h-full rounded-full"
          style={{ width: `${freshness * 10}%` }}
        />
      </div>
      <span className="text-xs font-medium text-[#d4af37]">{freshness.toFixed(1)}/10</span>
    </div>
  )
}

function FruitCard({ item, onAddToCart, cartQuantity }: { item: MarketplaceItem; onAddToCart: (item: MarketplaceItem) => void; cartQuantity: number }) {
  const canAddMore = cartQuantity < item.quantity
  
  return (
    <Card className="card-magical group overflow-hidden bg-card transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        {/* Left Tags - Category & Fresh Listed */}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {/* Category Tag with House Elf holding it */}
          <div className="relative">
            <div className="absolute -left-2 -top-1 z-10">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* House Elf holding tag */}
                <ellipse cx="10" cy="6" rx="5" ry="5" fill="#8B7355"/>
                <ellipse cx="7" cy="5" rx="2" ry="1.5" fill="#8B7355"/>
                <ellipse cx="13" cy="5" rx="2" ry="1.5" fill="#8B7355"/>
                <circle cx="8" cy="6" r="1" fill="#2d1f1a"/>
                <circle cx="12" cy="6" r="1" fill="#2d1f1a"/>
                <ellipse cx="10" cy="8" rx="1" ry="0.5" fill="#5c4a3d"/>
                <rect x="8" y="11" width="4" height="6" rx="1" fill="#3d2914"/>
                <rect x="6" y="12" width="3" height="1.5" rx="0.5" fill="#8B7355" transform="rotate(-20 6 12)"/>
                <rect x="11" y="12" width="3" height="1.5" rx="0.5" fill="#8B7355" transform="rotate(20 11 12)"/>
                <rect x="8" y="17" width="1.5" height="4" rx="0.5" fill="#8B7355"/>
                <rect x="10.5" y="17" width="1.5" height="4" rx="0.5" fill="#8B7355"/>
              </svg>
            </div>
            <Badge 
              variant="secondary" 
              className={`ml-3 border-2 shadow-lg ${
                item.category === "climacteric" 
                  ? "border-[#740001] bg-gradient-to-br from-[#2a0a0a] to-[#1a0505] text-[#d4af37]" 
                  : "border-[#0d4f8b] bg-gradient-to-br from-[#0a1a2a] to-[#051020] text-[#a0c4e8]"
              }`}
            >
              {item.category === "climacteric" ? (
                <Sun className="mr-1 h-3 w-3" />
              ) : (
                <Snowflake className="mr-1 h-3 w-3" />
              )}
              {item.category === "climacteric" ? "Climacteric" : "Non-Climacteric"}
            </Badge>
          </div>
          
          {/* Fresh Listed Tag with Owl */}
          {item.type === "listing" && (
            <div className="relative">
              <div className="absolute -left-1 -top-2 z-10">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Small Owl */}
                  <ellipse cx="8" cy="7" rx="5" ry="5" fill="#5c4a3d"/>
                  <ellipse cx="5.5" cy="6" rx="2" ry="2.5" fill="#8B7355"/>
                  <ellipse cx="10.5" cy="6" rx="2" ry="2.5" fill="#8B7355"/>
                  <circle cx="5.5" cy="6" r="1.2" fill="#d4af37"/>
                  <circle cx="10.5" cy="6" r="1.2" fill="#d4af37"/>
                  <circle cx="5.5" cy="6" r="0.6" fill="#1a1a2e"/>
                  <circle cx="10.5" cy="6" r="0.6" fill="#1a1a2e"/>
                  <path d="M7 9 L8 10.5 L9 9" stroke="#d4af37" strokeWidth="1" fill="none"/>
                  <ellipse cx="8" cy="14" rx="3" ry="4" fill="#5c4a3d"/>
                  <rect x="6" y="17" width="1" height="2" rx="0.3" fill="#d4af37"/>
                  <rect x="9" y="17" width="1" height="2" rx="0.3" fill="#d4af37"/>
                </svg>
              </div>
              <Badge className="ml-3 border-2 border-[#d4af37] bg-gradient-to-br from-[#2d1f1a] to-[#1a1208] text-[#d4af37] shadow-lg">
                Fresh Listed
              </Badge>
            </div>
          )}
        </div>
        
        {/* Right Tags - Stock & Quantity */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          {/* Stock Tag with Pixie */}
          <div className="relative">
            <div className="absolute -right-1 -top-1 z-10">
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cornish Pixie */}
                <ellipse cx="9" cy="8" rx="4" ry="4" fill={item.inStock ? "#1e5631" : "#5c1a1a"}/>
                <ellipse cx="5" cy="6" rx="3" ry="1.5" fill={item.inStock ? "#1e5631" : "#5c1a1a"} transform="rotate(-30 5 6)"/>
                <ellipse cx="13" cy="6" rx="3" ry="1.5" fill={item.inStock ? "#1e5631" : "#5c1a1a"} transform="rotate(30 13 6)"/>
                <circle cx="7.5" cy="7.5" r="1" fill="#d4af37"/>
                <circle cx="10.5" cy="7.5" r="1" fill="#d4af37"/>
                <circle cx="7.5" cy="7.5" r="0.4" fill="#1a1a2e"/>
                <circle cx="10.5" cy="7.5" r="0.4" fill="#1a1a2e"/>
                <path d="M8 10 Q9 11 10 10" stroke={item.inStock ? "#2d5a3d" : "#8b3a3a"} strokeWidth="0.8" fill="none"/>
                <ellipse cx="9" cy="15" rx="2.5" ry="4" fill={item.inStock ? "#1e5631" : "#5c1a1a"}/>
                <path d="M4 10 Q2 8 3 5" stroke={item.inStock ? "#3d8b5a" : "#8b5a5a"} strokeWidth="1" fill="none" opacity="0.6"/>
                <path d="M14 10 Q16 8 15 5" stroke={item.inStock ? "#3d8b5a" : "#8b5a5a"} strokeWidth="1" fill="none" opacity="0.6"/>
              </svg>
            </div>
            {item.inStock ? (
              <Badge className="mr-3 border-2 border-[#1e5631] bg-gradient-to-br from-[#0a1f10] to-[#051008] text-[#4ade80] shadow-lg">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                In Stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="mr-3 border-2 border-[#740001] bg-gradient-to-br from-[#2a0a0a] to-[#1a0505] text-[#f87171] shadow-lg">
                <XCircle className="mr-1 h-3 w-3" />
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Quantity Tag with Niffler */}
          <div className="relative">
            <div className="absolute -right-1 -top-0.5 z-10">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Niffler */}
                <ellipse cx="9" cy="9" rx="5" ry="4" fill="#2d1f1a"/>
                <ellipse cx="4" cy="8" rx="3" ry="2" fill="#2d1f1a"/>
                <circle cx="5" cy="7" r="0.8" fill="#d4af37"/>
                <circle cx="5" cy="7" r="0.3" fill="#1a1a2e"/>
                <ellipse cx="2" cy="9" rx="1.5" ry="0.8" fill="#5c4a3d"/>
                <ellipse cx="12" cy="12" rx="2" ry="1.5" fill="#2d1f1a"/>
                <ellipse cx="6" cy="12" rx="2" ry="1.5" fill="#2d1f1a"/>
                <circle cx="14" cy="6" r="1.5" fill="#d4af37" opacity="0.6"/>
              </svg>
            </div>
            <Badge className="mr-3 border-2 border-[#4a1f6b] bg-gradient-to-br from-[#1a0a2a] to-[#100520] text-[#c4a0e8] shadow-lg">
              <Package className="mr-1 h-3 w-3" />
              {item.quantity} {item.unit} left
            </Badge>
          </div>
        </div>
        
        {/* Rating badge on hover */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Star className="h-3 w-3 fill-[#d4af37] text-[#d4af37]" />
          {item.freshness.toFixed(1)}/10 Freshness
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="mb-1 font-semibold text-foreground" style={{ fontFamily: 'Cinzel, serif' }}>
          {item.name}
        </h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2" style={{ fontFamily: 'Lora, serif' }}>
          {item.description}
        </p>
        
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Freshness Rating</p>
          <FreshnessBar freshness={item.freshness} />
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-[#d4af37]">Rs. {item.price.toFixed(0)}</span>
          <span className="text-sm text-muted-foreground">/{item.unit}</span>
        </div>

        {/* Seller Info */}
        <div className="mt-3 space-y-1.5 rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/5 p-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3 text-[#d4af37]" />
            <span>{item.sellerName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3 text-[#d4af37]" />
            <span>+91 {item.sellerPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-[#d4af37]" />
            <span>{item.sellerAddress}</span>
          </div>
        </div>
        
        {item.category === "non-climacteric" && (
          <p className="mt-2 text-xs text-sky-400/80 italic" style={{ fontFamily: 'Lora, serif' }}>
            *Availability on first come first serve basis
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-[#d4af37] text-[#1a1a2e] hover:bg-[#c4a030] disabled:opacity-50" 
          disabled={!item.inStock || !canAddMore}
          onClick={() => onAddToCart(item)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {!item.inStock ? "Unavailable" : !canAddMore ? "Max Qty Added" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function CategoryInfoBanner({ category }: { category: "climacteric" | "non-climacteric" }) {
  const info = getCategoryInfo(category)
  const isClimacteric = category === "climacteric"
  
  return (
    <div className={`rounded-xl border p-6 ${
      isClimacteric 
        ? "border-amber-500/30 bg-amber-500/10" 
        : "border-sky-500/30 bg-sky-500/10"
    }`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
          isClimacteric 
            ? "border-amber-500/50 bg-amber-500/20" 
            : "border-sky-500/50 bg-sky-500/20"
        }`}>
          {isClimacteric ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Snowflake className="h-5 w-5 text-sky-400" />
          )}
        </div>
        <div className="flex-1">
          <h2 className={`mb-1 font-semibold ${isClimacteric ? "text-amber-300" : "text-sky-300"}`} style={{ fontFamily: 'Cinzel, serif' }}>
            {info.title}
          </h2>
          <p className="mb-3 text-sm text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
            {info.description}
          </p>
          <div className="flex items-start gap-2">
            <Info className={`mt-0.5 h-4 w-4 shrink-0 ${isClimacteric ? "text-amber-400" : "text-sky-400"}`} />
            <div className="space-y-1">
              {info.tips.map((tip, index) => (
                <p key={index} className="text-xs text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
                  {tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSheet({ cartItems, onUpdateQuantity, onRemove, onProceedToPayment, cartTotal }: {
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onProceedToPayment: () => void
  cartTotal: number
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto py-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground/70">Add some fruits to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border border-[#d4af37]/20 bg-secondary/30 p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Rs. {item.price}/{item.unit}</p>
                      <p className="text-xs text-purple-400">Max: {item.maxQuantity} {item.unit}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-red-400"
                      onClick={() => onRemove(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-[#d4af37]/30"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-[#d4af37]/30"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-semibold text-[#d4af37]">
                      Rs. {(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className="border-t border-[#d4af37]/20 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-medium text-foreground">Total</span>
            <span className="text-xl font-bold text-[#d4af37]">Rs. {cartTotal.toFixed(0)}</span>
          </div>
          <Button 
            className="w-full bg-[#d4af37] text-[#1a1a2e] hover:bg-[#c4a030]"
            onClick={onProceedToPayment}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Proceed to Payment
          </Button>
        </div>
      )}
    </div>
  )
}

// Harry Potter themed payment page
function PaymentDialog({ isOpen, onClose, order }: { isOpen: boolean; onClose: () => void; order: PurchaseOrder | null }) {
  if (!order) return null
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#1a0a0a] via-[#2d1810] to-[#1a0a0a] text-white">
        {/* Magical background overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPHBhdGggZD0iTTAgMzBMMzAgMEw2MCAzMEwzMCA2MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30" />
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        </div>
        
        <DialogHeader className="relative text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d4af37] bg-gradient-to-br from-[#5d1a1a] to-[#7a2d2d]">
            <Wand2 className="h-10 w-10 text-[#d4af37]" />
          </div>
          <DialogTitle className="text-3xl text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
            Order Enchanted!
          </DialogTitle>
          <DialogDescription className="text-amber-200/80" style={{ fontFamily: 'Lora, serif' }}>
            Your magical purchase has been initiated. Present these enchanted seals to complete the transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative space-y-6 py-4">
          {/* Order Summary */}
          <div className="rounded-xl border border-[#d4af37]/30 bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-semibold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
              Order Scroll
            </h3>
            <div className="space-y-2 text-sm">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-amber-100/80">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div className="mt-3 border-t border-[#d4af37]/30 pt-3 flex justify-between font-bold text-[#d4af37]">
                <span>Total Galleons</span>
                <span>Rs. {order.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="flex justify-center">
            {/* Buyer QR */}
            <div className="rounded-xl border border-[#d4af37]/30 bg-black/30 p-6 text-center max-w-sm w-full">
              <h4 className="mb-4 text-lg font-semibold text-amber-300" style={{ fontFamily: 'Cinzel, serif' }}>
                Your Payment Seal
              </h4>
              <div className="mx-auto mb-4 inline-block rounded-lg bg-white p-4">
                <QRCode value={order.buyerQR} size={180} />
              </div>
              <p className="text-sm text-amber-200/60" style={{ fontFamily: 'Lora, serif' }}>
                Present this seal to the merchant to complete your purchase
              </p>
              <p className="mt-2 text-xs text-[#d4af37] font-mono break-all">
                {order.buyerQR}
              </p>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Sparkles className="h-4 w-4" />
              How the Magic Works
            </h4>
            <ul className="space-y-1 text-xs text-amber-200/70" style={{ fontFamily: 'Lora, serif' }}>
              <li>1. Show your Payment Seal to the merchant when collecting produce</li>
              <li>2. Merchant scans your seal to verify the purchase</li>
              <li>3. Once verified, the transaction is complete</li>
              <li>4. Enjoy your fresh produce!</li>
            </ul>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-[#d4af37] text-[#1a1a2e] hover:bg-[#c4a030]"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Close & Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function MarketplaceContent({ initialCategory }: MarketplaceContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "climacteric" | "non-climacteric">(
    initialCategory || "all"
  )
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [grocerListings, setGrocerListings] = useState<GrocerListing[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  
  // Load grocer listings and cart on mount
  useEffect(() => {
    const loadData = () => {
      setGrocerListings(getAvailableListings())
      setCartItems(getCart())
      setCartCount(getCartCount())
      setCartTotal(getCartTotal())
    }
    
    loadData()
    
    // Listen for cart and marketplace updates
    const handleCartUpdate = () => {
      setCartItems(getCart())
      setCartCount(getCartCount())
      setCartTotal(getCartTotal())
    }
    
    const handleMarketplaceUpdate = () => {
      setGrocerListings(getAvailableListings())
    }
    
    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("marketplaceUpdated", handleMarketplaceUpdate)
    window.addEventListener("storage", loadData)
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("marketplaceUpdated", handleMarketplaceUpdate)
      window.removeEventListener("storage", loadData)
    }
  }, [])
  
  // Convert grocer listings to marketplace items
  const grocerItems: MarketplaceItem[] = grocerListings.map(listing => ({
    id: listing.id,
    type: "listing" as const,
    name: listing.fruitName,
    category: listing.category,
    image: listing.images[0] || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop",
    description: listing.verdict || `Fresh ${listing.fruitName} from local grocer`,
    price: listing.price,
    unit: "kg",
    freshness: listing.freshness,
    inStock: !listing.sold,
    quantity: listing.quantity || 1,
    sellerName: listing.grocerName,
    sellerPhone: listing.grocerPhone,
    sellerAddress: listing.grocerLocation,
  }))
  
  // Convert default fruits to marketplace items
  const fruitItems: MarketplaceItem[] = fruits.map(fruit => ({
    id: fruit.id,
    type: "fruit" as const,
    name: fruit.name,
    category: fruit.category,
    image: fruit.image,
    description: fruit.description,
    price: fruit.price,
    unit: fruit.unit,
    freshness: fruit.freshness,
    inStock: fruit.inStock,
    quantity: 10, // Default fruits have plenty in stock
    sellerName: fruit.sellerName,
    sellerPhone: fruit.sellerPhone,
    sellerAddress: fruit.sellerAddress,
  }))
  
  // Combine all items (grocer listings first as they're freshly listed)
  const allItems = [...grocerItems, ...fruitItems]
  
  const filteredItems = selectedCategory === "all" 
    ? allItems 
    : allItems.filter(item => item.category === selectedCategory)
  
  // Get cart quantity for a specific item
  const getCartQuantityForItem = (itemId: string): number => {
    const cartItem = cartItems.find(i => i.id === itemId)
    return cartItem?.quantity || 0
  }
  
  const handleAddToCart = (item: MarketplaceItem) => {
    const success = addToCart({
      id: item.id,
      type: item.type,
      name: item.name,
      price: item.price,
      unit: item.unit,
      image: item.image,
      category: item.category,
      sellerName: item.sellerName,
      sellerPhone: item.sellerPhone,
      sellerAddress: item.sellerAddress,
      maxQuantity: item.quantity,
    })
    
    if (!success) {
      alert("Cannot add more than available quantity")
    }
  }
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    const success = updateCartQuantity(id, quantity)
    if (!success && quantity > 0) {
      alert("Cannot exceed available quantity")
    }
  }
  
  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id)
  }
  
  const handleProceedToPayment = () => {
    const user = getCurrentUser()
    if (!user) {
      alert("Please login first")
      return
    }
    
    // Initiate purchase - this removes items from marketplace immediately
    const order = initiatePurchase(user.name, user.phone)
    if (order) {
      setPurchaseOrder(order)
      setIsPaymentOpen(true)
      setIsCartOpen(false)
    }
  }
  
  const handleClosePayment = () => {
    setIsPaymentOpen(false)
    setPurchaseOrder(null)
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f1a]">
      {/* Themed background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1a] to-[#1a1a2e]" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#1a1a2e]">
                <Sparkles className="h-6 w-6 text-[#d4af37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                  TerraLoop Marketplace
                </h1>
                <p className="text-muted-foreground" style={{ fontFamily: 'Lora, serif' }}>
                  Fresh produce with guaranteed freshness
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* XP indicator */}
              <div className="hidden items-center gap-2 rounded-full border border-[#d4af37]/30 bg-secondary/50 px-4 py-2 text-sm md:flex">
                <Trophy className="h-4 w-4 text-[#d4af37]" />
                <span className="text-muted-foreground">+5 XP per purchase</span>
              </div>
              
              {/* Cart Button */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="relative border-[#d4af37]/30 bg-[#1a1a2e] hover:bg-[#d4af37]/10"
                  >
                    <ShoppingCart className="h-5 w-5 text-[#d4af37]" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#1a1a2e]">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="border-[#d4af37]/20 bg-[#1a1a2e]">
                  <SheetHeader>
                    <SheetTitle className="text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>
                      Your Cart
                    </SheetTitle>
                  </SheetHeader>
                  <CartSheet 
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveFromCart}
                    onProceedToPayment={handleProceedToPayment}
                    cartTotal={cartTotal}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        {/* Category Filter Tabs */}
        <div className="mb-6">
          <Tabs 
            value={selectedCategory} 
            onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)}
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#1a1a2e]">
                All Fruits
              </TabsTrigger>
              <TabsTrigger value="climacteric" className="gap-1 data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-300">
                <Sun className="h-3 w-3" />
                Climacteric
              </TabsTrigger>
              <TabsTrigger value="non-climacteric" className="gap-1 data-[state=active]:bg-sky-500/30 data-[state=active]:text-sky-300">
                <Snowflake className="h-3 w-3" />
                Non-Climacteric
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Category Info Banner */}
        {selectedCategory !== "all" && (
          <div className="mb-6">
            <CategoryInfoBanner category={selectedCategory} />
          </div>
        )}
        
        {/* Fruit Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <FruitCard 
              key={item.id} 
              item={item} 
              onAddToCart={handleAddToCart}
              cartQuantity={getCartQuantityForItem(item.id)}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No fruits found</p>
            <p className="text-sm text-muted-foreground/70">Try selecting a different category</p>
          </div>
        )}
      </div>
      
      {/* Payment Dialog */}
      <PaymentDialog 
        isOpen={isPaymentOpen} 
        onClose={handleClosePayment} 
        order={purchaseOrder} 
      />
    </div>
  )
}
