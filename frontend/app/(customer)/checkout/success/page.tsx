import React from "react"

export default function SuccessPage() {
    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h1>
                <p className="text-gray-700 mb-6">Hemos recibido tu pedido y estamos procesándolo.</p>
                <div className="text-green-500 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4 -4m6 2a9 9 0 11-18 0a9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-gray-600 mb-4">Recibirás un correo electrónico con los detalles de tu pedido.</p>
                <a href="/" className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">Volver al inicio</a>
            </div>
        </div>
    )
}