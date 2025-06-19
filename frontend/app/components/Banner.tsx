import Image from "next/image"
import { Button } from "../../components/ui/button";
import React from 'react';

export const Banner = () => {
  return (
    <div className="container relative w-full h-screen max-w-7xl mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-lg">
          <Image
              src={"/imgs/bannerImg1.svg"}
              alt="Warm candles in dark setting"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-5 px-4">
          <div className="relative h-[320px] overflow-hidden rounded-lg">
            <Image
              src={"/imgs/bannerImg1.svg"}
              alt="Pink roses with luxury candle"
              width={300}
              height={200}
              className="rounded-lg mb-8"
            />
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-medium">PARA CADA OCASION</h2>
            <div className="text-8xl font-bold tracking-wider" style={{
              WebkitTextStroke: '2px currentColor',
              WebkitTextFillColor: 'transparent'
            }}>
              VELAS
            </div>
            <Button 
              className="bg-[#B19B7D] hover:bg-[#9A866C] text-white px-8 py-6 rounded-md text-lg font-medium"
            >
              COMPRAR AHORA
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
              src={"/imgs/bannerImg1.svg"}
              alt="Purple candle with lavender"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

