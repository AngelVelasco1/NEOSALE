"use client"

import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

interface PriceFilterProps {
    priceRange: { min: number; max: number }
    selectedMinPrice: number
    selectedMaxPrice: number
    onPriceChange: (min: number, max: number) => void
    getProductCountInRange: (min: number, max: number) => number
}

export const PriceFilter = ({
    priceRange,
    selectedMinPrice,
    selectedMaxPrice,
    onPriceChange,
    getProductCountInRange
}: PriceFilterProps) => {
    const [minValue, setMinValue] = useState(selectedMinPrice)
    const [maxValue, setMaxValue] = useState(selectedMaxPrice)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        setMinValue(selectedMinPrice)
        setMaxValue(selectedMaxPrice)
    }, [selectedMinPrice, selectedMaxPrice])

    const handleMinChange = useCallback((value: number) => {
        const newMin = Math.min(value, maxValue - 10000)
        setMinValue(newMin)
    }, [maxValue])

    const handleMaxChange = useCallback((value: number) => {
        const newMax = Math.max(value, minValue + 10000)
        setMaxValue(newMax)
    }, [minValue])

    const applyPriceFilter = useCallback(() => {
        setIsDragging(false)
        onPriceChange(minValue, maxValue)
    }, [minValue, maxValue, onPriceChange])

    const minPercent = ((minValue - priceRange.min) / (priceRange.max - priceRange.min)) * 100
    const maxPercent = ((maxValue - priceRange.min) / (priceRange.max - priceRange.min)) * 100

    const count = getProductCountInRange(minValue, maxValue)

    // Rangos predefinidos
    const quickRanges = [
        { label: "Económico", min: priceRange.min, max: 50000 },
        { label: "Medio", min: 50000, max: 100000 },
        { label: "Premium", min: 100000, max: priceRange.max },
    ]

    const handleQuickRange = useCallback((min: number, max: number) => {
        setMinValue(min)
        setMaxValue(max)
        onPriceChange(min, max)
    }, [onPriceChange])

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-2 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg ring-1 ring-slate-700 shadow-md"
                    >
                        <DollarSign className="h-4 w-4 text-slate-300" />
                    </motion.div>
                    <div>
                        <h4 className="font-bold text-slate-100 text-sm">Rango de Precio</h4>
                        <p className="text-xs text-slate-500">Ajusta tu presupuesto</p>
                    </div>
                </div>
                {count > 0 && (
                    <Badge className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 font-semibold">
                        {count}
                    </Badge>
                )}
            </div>

            {/* Quick Range Buttons */}
            <div className="grid grid-cols-3 gap-2">
                {quickRanges.map((range, idx) => {
                    const isActive = minValue >= range.min && maxValue <= range.max
                    return (
                        <motion.button
                            key={idx}
                            onClick={() => handleQuickRange(range.min, range.max)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                                ? "bg-slate-700 text-slate-100 ring-1 ring-slate-600"
                                : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"
                                }`}
                        >
                            {range.label}
                        </motion.button>
                    )
                })}
            </div>

            {/* Price Display */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Mínimo</p>
                    <p className="text-lg font-bold text-slate-100">
                        ${minValue.toLocaleString('es-CO')}
                    </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Máximo</p>
                    <p className="text-lg font-bold text-slate-100">
                        ${maxValue.toLocaleString('es-CO')}
                    </p>
                </div>
            </div>

            {/* Dual Range Slider */}
            <div className="px-2 py-4">
                <div className="relative h-2">
                    {/* Track */}
                    <div className="absolute w-full h-2 bg-slate-800 rounded-full" />

                    {/* Active Range */}
                    <motion.div
                        className="absolute h-2 bg-linear-to-r from-slate-600 to-slate-500 rounded-full"
                        style={{
                            left: `${minPercent}%`,
                            right: `${100 - maxPercent}%`,
                        }}
                        animate={{
                            boxShadow: isDragging
                                ? "0 0 12px rgba(148, 163, 184, 0.4)"
                                : "0 0 0px rgba(148, 163, 184, 0)"
                        }}
                    />

                    {/* Min Thumb */}
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={5000}
                        value={minValue}
                        onChange={(e) => handleMinChange(Number(e.target.value))}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={applyPriceFilter}
                        onTouchEnd={applyPriceFilter}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-100 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-slate-800 [&::-webkit-slider-thumb]:hover:ring-slate-700 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-slate-100 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-slate-800 [&::-moz-range-thumb]:hover:border-slate-700 [&::-moz-range-thumb]:transition-all"
                    />

                    {/* Max Thumb */}
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={5000}
                        value={maxValue}
                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={applyPriceFilter}
                        onTouchEnd={applyPriceFilter}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-100 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-slate-800 [&::-webkit-slider-thumb]:hover:ring-slate-700 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-slate-100 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-slate-800 [&::-moz-range-thumb]:hover:border-slate-700 [&::-moz-range-thumb]:transition-all"
                    />
                </div>

                {/* Range Labels */}
                <div className="flex justify-between mt-3">
                    <span className="text-xs text-slate-500 font-medium">
                        ${priceRange.min.toLocaleString('es-CO')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                        ${priceRange.max.toLocaleString('es-CO')}
                    </span>
                </div>
            </div>
        </div>
    )
}
