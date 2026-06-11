"use client";

import { useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";
import { api } from "../../../lib/api";
import { CreditPackage } from "../../../types/creditPackage.type";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import CreditPackageCard from "./_components/CreditPackageCard";
import { UserContext } from "../../../context/userContext";

export default function Credits() {
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);

  const context = useContext(UserContext);
  if (!context || !context.user) {
    return <>Loading...</>;
  }

  // Fetch credit packages
  const fetchCreditPakages = async () => {
    try {
      setPackageLoading(true);

      const res = await api(`${API_BASE_URL}/credit/credit-package/bulk`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      setCreditPackages(jsonData.creditPackages);
    } catch (error) {
      alert("Internal server error");
    } finally {
      setPackageLoading(false);
    }
  };

  // Fetch user credits
  const fetchUserCredit = async () => {
    try {
      const res = await api(`${API_BASE_URL}/credit/user-credits`, {
        method: "GET",
      });

      if (!res.ok) {
        alert(res.statusText);
        return;
      }

      const jsonData = await res.json();
      context.setUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          creditBalance: jsonData.credits,
        };
      });

      localStorage.setItem("credits", jsonData.credits);
    } catch (error) {
      alert("Internal server error.");
    }
  };

  useEffect(() => {
    fetchCreditPakages();
  }, []);

  // Purchase credit package handler
  const handleBuyCreditPackage = async (id: string) => {
    if (!id || id === "") {
      alert("Id is missing");
      return;
    }

    try {
      setPurchaseLoading(true);

      const res = await api(`${API_BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creditPackageId: id,
        }),
      });

      if (!res.ok) {
        alert("Payment failed!");
        return;
      }

      const jsonData = await res.json();
      const order = jsonData.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ujjwal",
        description: `Credits purchase of ${order.orderedCredits}`,
        order_id: order.orderId,

        handler: async function (response: any) {
          const verifyRes = await api(
            `${API_BASE_URL}/payment/verify-payment`,
            {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderedCredits: order.orderedCredits,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (verifyRes.ok) {
            await fetchUserCredit();
            alert("Payment verification successful");
          } else {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "ujjwal",
          email: "kumarujjwaldos@gmail.com",
          contact: "7061845104",
        },
        theme: {
          color: "#fff000",
        },
      };

      // @ts-ignore
      const rzp = new Razorpay(options);
      await rzp.open();
    } catch (error) {
      alert("Internal server error");
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (packageLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex text-md tracking-tight">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col">
        {/* Nav */}
        <Navbar pageTitle="Credits" />

        {/* Content */}
        <div className="min-h-screen flex justify-center">
          <div className="min-w-4xl max-w-4xl ">
            {/* header */}
            <div className="w-full flex items-center justify-between mt-8">
              <h2 className="font-medium text-lg">Credit packages</h2>
            </div>

            {/* Credits list */}
            <div className="flex gap-4 mt-5">
              {creditPackages.length > 0 &&
                creditPackages.map((p, i) => (
                  <CreditPackageCard
                    key={i}
                    id={p.id}
                    name={p.name}
                    credits={p.credits}
                    priceInPaise={p.priceInPaise}
                    isActive={p.isActive}
                    onClick={() => handleBuyCreditPackage(p.id)}
                    loading={purchaseLoading}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
