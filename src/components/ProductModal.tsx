import { X, ShoppingCart } from 'lucide-react';
import { Button } from './Button';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category?: Category;
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (productId: string) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
    if (!isOpen || !product) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-5xl max-h-[95vh] overflow-hidden">
                <div className="bg-background rounded-xl shadow-2xl border m-4 overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Header with Close Button */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
                        <h2 className="text-xl font-bold truncate pr-8">{product.name}</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-4 p-2 rounded-full hover:bg-accent transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(95vh-8rem)] p-6">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Left Column - Image */}
                            <div className="space-y-4">
                                <div className="aspect-square overflow-hidden rounded-lg bg-muted border">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Product Meta Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-muted-foreground mb-1">Category</p>
                                        <p className="font-semibold">{product.category?.name || 'Uncategorized'}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-muted-foreground mb-1">Availability</p>
                                        <p className="font-semibold">
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="space-y-6">
                                {/* Price Section */}
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-bold text-primary">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Stock Status Badge */}
                                    <div className="flex items-center gap-2">
                                        {product.stock === 0 ? (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-800">
                                                ⚠ Out of Stock
                                            </span>
                                        ) : product.stock <= 5 ? (
                                            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-800">
                                                🔥 Only {product.stock} left - Order soon!
                                            </span>
                                        ) : product.stock <= 10 ? (
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-semibold text-yellow-800">
                                                ⚡ Low Stock: {product.stock} available
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
                                                ✓ In Stock
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    className="w-full h-12 text-base"
                                    size="lg"
                                    onClick={() => {
                                        onAddToCart(product.id);
                                        onClose();
                                    }}
                                    disabled={product.stock === 0}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {product.stock === 0 ? 'Currently Unavailable' : 'Add to Cart'}
                                </Button>

                                {/* Divider */}
                                <div className="border-t pt-6"></div>

                                {/* Product Description */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">About this item</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Product Details</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Product ID</span>
                                            <span className="font-mono text-xs">{product.id.slice(0, 8)}...</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Category</span>
                                            <span className="font-medium">{product.category?.name || 'General'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Price</span>
                                            <span className="font-medium">${product.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-muted-foreground">Stock Status</span>
                                            <span className="font-medium">
                                                {product.stock > 0 ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Fast shipping available</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Secure checkout</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span>Customer support ready to help</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
