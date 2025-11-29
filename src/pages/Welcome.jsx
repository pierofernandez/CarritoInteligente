import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative inline-block">
                    <div className="absolute -inset-1 bg-green-500 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative bg-slate-900 p-6 rounded-full border border-slate-700">
                        <ShoppingCart size={64} className="text-green-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Bienvenido a <span className="text-green-400">SJL Cart</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        La experiencia de compra del futuro. Escanea, paga y listo.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/cart')}
                    className="group w-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                >
                    <span>Iniciar Compra</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}