import { FaFacebookF } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image"
import React from 'react';

export const Footer = () => {
  return (
      <footer className="container z-30 flex flex-col bg-transparent items-center justify-center md:flex-row mx-auto p-10 text-slate-700 ">
        <div className="gap-y-2 flex flex-col">
          <div>
                       <Image
                              src={"/imgs/NomLogo.png"}
                              alt="Pink roses with luxury candle"
                              width={150}
                              height={150}
                             className="rounded-xl "
          
                            />
              </div>
          <p className="text-center text-sm">Copyright © 2025. Todos los derechos Reservados.</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="">
              <FaFacebookF className="inline transition hover:opacity-75" size="1.45em" />
            </button>
            <button className="">
              <RiInstagramFill className="inline transition hover:opacity-75" size="1.45em" />
            </button>
            <button className="">
              <FaPhoneAlt className="inline transition hover:opacity-75" size="1.35em" />
            </button>
          </div>
        </div>
      </footer>
  );
};
