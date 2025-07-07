import { RiFacebookCircleFill } from "react-icons/ri";
import { RiInstagramFill } from "react-icons/ri";
import { RiYoutubeFill } from "react-icons/ri";
import { RiTwitterXFill } from "react-icons/ri";
import { RiWhatsappFill } from "react-icons/ri";

import { FaPhoneAlt } from "react-icons/fa";
import Image from "next/image"
import React from 'react';

export const Footer = () => {
  return (
      <footer className="container z-30 flex flex-col bg-transparent items-center justify-center md:flex-row mx-auto p-6  text-slate-700 ">
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
                       <Image
                              src={"/imgs/NomLogo2.png"}
                              alt="Pink roses with luxury candle"
                              width={180}
                              height={180}
                            />
              </div>
          <p className="text-center text-md">Copyright © 2025. Todos los derechos Reservados.</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="">
              <RiFacebookCircleFill className="inline transition hover:opacity-75 text-black"  size="1.5em" />
            </button>
              <button className="">
              <RiWhatsappFill className="inline transition hover:opacity-75 text-black" size="1.45em" />
            </button>
            <button className="">
              <RiInstagramFill className="inline transition hover:opacity-75 text-black" size="1.45em" />
            </button>
            <button className="">
              <RiYoutubeFill className="inline transition hover:opacity-75 text-black" size="1.5em" />
            </button>
            <button className="">
              <RiTwitterXFill className="inline transition hover:opacity-75 text-black" size="1.4em" />
            </button>
          </div>
        </div>
      </footer>
  );
};
