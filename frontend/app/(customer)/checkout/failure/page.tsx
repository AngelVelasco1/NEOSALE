import React from "react";

export default function FailurePage() {
    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Pago Fallido</h1>
                <p className="text-gray-700 mb-6">Lamentablemente, no pudimos procesar tu pago.</p>
                <div className="text-red-500 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <p className="text-gray-600 mb-4">Por favor, intenta nuevamente o utiliza otro método de pago.</p>
                <a href="/cart" className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Volver al carrito</a>
            </div>
        </div>
    )
}
