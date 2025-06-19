"use client"
import React from 'react';

import { Button } from "../../components/ui/button";
import { CartProductsInfo } from "../(cart)/types";

interface setQuantityProps {
    cartCounter?: boolean,
    cartProduct?: Partial<CartProductsInfo>,
    handleIncrease: () => void,
    handleDecrease: () => void
}
export const SetQuantity: React.FC<setQuantityProps> = ({cartCounter, cartProduct, handleIncrease, handleDecrease}) => { 
  return (
        <div className="space-y-2">
           {cartCounter ? null : 
            <div className="flex w-fit items-center rounded-lg ">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none text-md"
                onClick={handleDecrease}
              >
                -
              </Button>
              <div className="w-12 text-center">{cartProduct?.quantity}</div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none text-md"
                onClick={handleIncrease}
              >
                +
              </Button>
            </div>
           } 
        </div>
 
    )
};