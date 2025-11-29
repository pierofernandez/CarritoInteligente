import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ScanLine, CreditCard } from 'lucide-react';

const MOCK_PRODUCTS = [
    { id: 1, name: 'Manzana Orgánica', price: 1.20, image: '🍎' },
    { id: 2, name: 'Pan Artesanal', price: 3.50, image: '🥖' },
    { id: 3, name: 'Leche Entera', price: 2.80, image: '🥛' },
    { id: 4, name: 'Cereal Crujiente', price: 4.99, image: '🥣' },
    { id: 5, name: 'Jugo de Naranja', price: 3.25, image: '🍊' },
];

export default function SmartCart() {
    const { cartItems, addToCart, updateQuantity, subtotal, tax, total } = useCart();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left Side: Cart View */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-500 p-2 rounded-lg">
                            <ScanLine className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">SJL Cart <span className="text-xs font-normal text-slate-500 ml-1">v2.0</span></h1>
                    </div>
                </header>

                {/* Cart Items List */}
                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <ScanLine size={64} className="opacity-20" />
                            <p className="text-lg">Tu carrito está vacío</p>
                            <p className="text-sm">Escanea productos para comenzar</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="text-4xl bg-slate-50 w-16 h-16 rounded-lg flex items-center justify-center">
                                    {item.image}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                                    <p className="text-slate-500">S/{item.price.toFixed(2)} PEN</p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="p-2 hover:bg-white rounded-md shadow-sm transition-colors text-slate-600 hover:text-red-500"
                                    >
                                        {item.quantity === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
                                    </button>
                                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="p-2 hover:bg-white rounded-md shadow-sm transition-colors text-slate-600 hover:text-green-500"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="font-bold text-slate-800">S/{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </main>

                {/* Bottom Totals */}
                <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal</span>
                            <span>S/{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Impuestos (8%)</span>
                            <span>S/{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-slate-800 pt-2 border-t border-slate-100">
                            <span>Total</span>
                            <span>S/{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        disabled={cartItems.length === 0}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        <CreditCard size={20} />
                        <span>Pagar Ahora</span>
                    </button>
                </div>
            </div>

            {/* Right Side: Simulation Panel (Only visible on desktop/large screens usually, but here we show it to simulate scanning) */}
            <div className="w-full md:w-80 bg-slate-100 border-l border-slate-200 p-6 overflow-y-auto">
                <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <ScanLine size={20} />
                    Simulador de Escáner
                </h2>
                <p className="text-sm text-slate-500 mb-6">Haz clic en un producto para "escanearlo" y agregarlo al carrito.</p>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    {MOCK_PRODUCTS.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-md transition-all text-left flex items-center gap-3 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">{product.image}</span>
                            <div>
                                <p className="font-medium text-slate-800">{product.name}</p>
                                <p className="text-sm text-green-600 font-bold">S/{product.price.toFixed(2)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
