import Image from "next/image";
import React from "react";


export const BenefitsList = () => {
  return (
    <div className="flex justify-around">
      <div className="flex gap-2">
        <Image src={"/imgs/quality.svg"} alt="Quiality Icon" width={40} height={40}></Image>
        <div className="flex flex-col">
            <h4>High Quality</h4>
            <p className="text-sm">crafted from top materials</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Image src={"/imgs/secure.svg"} alt="Secure Icon"  width={35} height={35}></Image>
        <div>
            <h4>Warranty Protection</h4>
            <p  className="text-sm">Over 1 Month</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Image src={"/imgs/free.svg"} alt="Free ship Icon"  width={40} height={40}></Image>
        <div>
            <h4>Free Ship</h4>
            <p  className="text-sm">Over 100K COP</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Image src={"/imgs/support.svg"} alt="Support Icon"  width={40} height={40}></Image>
        <div>
            <h4>Support 24/7</h4>
            <p  className="text-sm">Dedicated Support</p>
        </div>
      </div>
    </div>
  );
};
