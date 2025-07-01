"use client"
import React from 'react';
import { useState, useCallback } from "react"
import { Slider } from "../../../components/ui/slider"

interface PriceSelectorProps {
  minLimit: number
  maxLimit: number
  initialMin: number
  initialMax: number
  onChangePrice: (min: number, max: number) => void
}

export const PriceSelector = ({ minLimit, maxLimit, initialMin, initialMax, onChangePrice }: PriceSelectorProps) => {
  const [priceRange, setPriceRange] = useState([initialMin, initialMax])

  const handlePriceChange = useCallback(
    (newRange: number[]) => {
      setPriceRange(newRange)
      onChangePrice(newRange[0], newRange[1])
    },
    [onChangePrice],
  )

  return (
    <Slider
      value={priceRange}
      onValueChange={handlePriceChange}
      min={minLimit}
      max={maxLimit}
      step={(maxLimit - minLimit) / 100}
      className="w-full"
    />
  )
}
