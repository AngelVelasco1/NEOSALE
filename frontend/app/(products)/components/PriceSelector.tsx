import * as Slider from "@radix-ui/react-slider";
import React, { useState, useCallback } from "react";

interface PriceSelectorProps {
  minLimit: number;
  maxLimit: number;
  initialMin: number;
  initialMax: number;
  onChangePrice?: (min: number, max: number) => void;
}

export const PriceSelector = ({
  minLimit,
  maxLimit,
  initialMin,
  initialMax,
  onChangePrice,
}: PriceSelectorProps) => {
  const [values, setValues] = useState([initialMin, initialMax]);

  const handlePriceRange = useCallback(
    (newValues: number[]) => {
        setValues(newValues);
        if (onChangePrice) {
          onChangePrice(newValues[0], newValues[1]);
        }
    },
    [onChangePrice]
  );
  /* 
  const handleMinChange = useCallback(
    (values: number[]) => {
      const newMin = Math.min(values[0], maxValue - 1);
      handlePriceRange(newMin, maxValue);
    },
    [maxValue, handlePriceRange]
  );

  const handleMaxChange = useCallback(
    (values: number[]) => {
      const newMax = Math.max(values[0], minValue + 1);
      handlePriceRange(minValue, newMax);
    },
    [minValue, handlePriceRange]
  ); */

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <Slider.Root
      className="relative flex items-center w-full h-4"
        min={minLimit}
        max={maxLimit}
        value={values}
        step={1}
        onValueChange={handlePriceRange}
      >
        <Slider.Track className="relative w-full h-2 bg-gray-300 rounded-full">
          <Slider.Range className="absolute h-full bg-black rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white rounded-full cursor-pointer focus:outline-none focus:ring-2 border-2 border-black focus:ring-gray-500"
          aria-label="Minimum price"
        />

        <Slider.Thumb
          className="block w-5 h-5 bg-white rounded-full cursor-pointer focus:outline-none border-2 border-black focus:ring-2 focus:ring-gray-500"
          aria-label="Maximum price"
        />
      </Slider.Root>
      <p className="text-gray-600 font-medium">
        ${values[0].toLocaleString()} - ${values[1].toLocaleString()}
      </p>
    </div>
  );
};
