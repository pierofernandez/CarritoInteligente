import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Loader2, Home } from 'lucide-react';

export default function Checkout() {
    const { total, clearCart } = useCart();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success

    useEffect(() => {
        // Simulate payment processing
        const timer = setTimeout(() => {
            setStatus('success');
            clearCart();
        }, 3000);

        return () => clearTimeout(timer);
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                {status === 'processing' ? (
                    <>
                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            <Loader2 className="text-green-500 animate-pulse" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Procesando Pago</h2>
                            <p className="text-slate-500 mt-2">Por favor espere un momento...</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                            <p className="text-sm text-slate-500">Monto a cobrar</p>
                            <p className="text-3xl font-bold text-slate-900">S/{total.toFixed(2)}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                            <CheckCircle className="text-green-500 w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">¡Pago Exitoso!</h2>
                            <p className="text-slate-500 mt-2">Gracias por su compra. Su recibo ha sido enviado.</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <Home size={20} />
                            <span>Volver al Inicio</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
