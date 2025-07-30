"use client"
import React from 'react';

import { Button } from "../../components/ui/button";
import { CartProductsInfo } from "../(user)/types";

interface setQuantityProps {
    cartCounter?: boolean,
    cartProduct?: Partial<CartProductsInfo>,
    handleIncrease: () => void,
    handleDecrease: () => void
}
export const SetQuantity: React.FC<setQuantityProps> = ({cartCounter, cartProduct, handleIncrease, handleDecrease}) => { 
  return (
        <div className="space-y-2">
          {cartCounter ? null : (
            <div className="flex items-center gap-2">
           
              <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-none border-none transition-all duration-200 active:scale-95"
                  onClick={handleDecrease}
                >
                  <span className="text-lg font-semibold">−</span>
                </Button>
                
                <div className="flex items-center justify-center min-w-[50px] h-10 px-3 bg-gray-50/50 border-x border-gray-200">
                  <span className="text-base font-semibold text-gray-900 font-montserrat">
                    {cartProduct?.quantity || 1}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-none border-none transition-all duration-200 active:scale-95"
                  onClick={handleIncrease}
                >
                  <span className="text-lg font-semibold">+</span>
                </Button>
              </div>
            </div>
          )}
        </div>
 
    )
};