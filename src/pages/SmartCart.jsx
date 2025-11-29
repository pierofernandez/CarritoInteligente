import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ScanLine, CreditCard, Camera, CameraOff, RefreshCw } from 'lucide-react';

export default function SmartCart() {
    const { cartItems, setCartItems, subtotal, tax, total } = useCart();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Camera setup
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    // Detection Loop
    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (!isCameraActive || isProcessing || !videoRef.current || !canvasRef.current) return;

            setIsProcessing(true);
            try {
                // Capture frame
                const context = canvasRef.current.getContext('2d');
                if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    canvasRef.current.toBlob(async (blob) => {
                        if (!blob) {
                            setIsProcessing(false);
                            return;
                        }

                        const formData = new FormData();
                        formData.append('file', blob, 'frame.jpg');

                        try {
                            const response = await fetch('/detect', {
                                method: 'POST',
                                body: formData,
                            });

                            if (response.ok) {
                                const data = await response.json();
                                updateCartFromDetections(data.products);
                            }
                        } catch (error) {
                            console.error("Detection error:", error);
                        } finally {
                            setIsProcessing(false);
                        }
                    }, 'image/jpeg', 0.8);
                } else {
                    setIsProcessing(false);
                }

            } catch (e) {
                console.error("Frame capture error:", e);
                setIsProcessing(false);
            }
        }, 500); // Poll every 500ms

        return () => clearInterval(intervalId);
    }, [isCameraActive, isProcessing]);

    const updateCartFromDetections = (detectedProducts) => {
        // Map detected products to cart items with quantity 1
        const newCartItems = detectedProducts.map(product => ({
            ...product,
            quantity: 1
        }));

        // Simple check to avoid unnecessary re-renders
        const currentIds = cartItems.map(i => i.id).sort().join(',');
        const newIds = newCartItems.map(i => i.id).sort().join(',');

        if (currentIds !== newIds) {
            setCartItems(newCartItems);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left Side: Cart View */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden order-2 md:order-1">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-500 p-2 rounded-lg">
                            <ScanLine className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">Smart Cart <span className="text-xs font-normal text-slate-500 ml-1">En Vivo</span></h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <Camera size={64} className="opacity-20" />
                            <p className="text-lg">Carrito vacío</p>
                            <p className="text-sm">Apunta la cámara a los productos</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="text-4xl bg-slate-50 w-16 h-16 rounded-lg flex items-center justify-center">
                                    {item.image}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">{item.name}</h3>
                                    <p className="text-slate-500">S/{item.price.toFixed(2)}</p>
                                </div>
                                <div className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                                    x{item.quantity}
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

            {/* Right Side: Camera View */}
            <div className="w-full md:w-[400px] bg-black relative flex flex-col order-1 md:order-2 h-[300px] md:h-auto">
                <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm flex items-center gap-2">
                    {isProcessing ? <RefreshCw className="animate-spin" size={12} /> : <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    {isProcessing ? 'Analizando...' : 'Activo'}
                </div>

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-white">
                        <div className="text-center">
                            <CameraOff size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Cámara desactivada</p>
                            <button onClick={startCamera} className="mt-4 px-4 py-2 bg-green-600 rounded-lg text-sm font-medium">
                                Activar Cámara
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}