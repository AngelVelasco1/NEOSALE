import { GrVisa as Visa } from "react-icons/gr";
import { SiMastercard as Mastercard } from "react-icons/si";
import { SiAmericanexpress as Amex } from "react-icons/si";
import { FaCreditCard as Card } from "react-icons/fa";
import React from 'react';

export const PaymentIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="flex flex-col items-center">
    <Icon className="h-6 w-10" />
  </div>
);

export const paymentMethods = [
    { icon: Visa },
    { icon: Mastercard },
    { icon: Amex },
    { icon: Card },
  ];