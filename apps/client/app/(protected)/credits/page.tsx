"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";
import { api } from "../../../lib/api";
import { CreditPackage } from "../../../types/creditPackage.types";
import Button from "../../../components/Button";

export default function Credits() {
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [userCredits, setUserCredits] = useState<number | null>(null);

  const fetchCreditPakages = async () => {
    const res = await api(`${API_BASE_URL}/credit/credit-package/bulk`, {
      method: "GET",
    });

    if (!res.ok) {
      alert(res.statusText);
      return;
    }

    const jsonData = await res.json();
    setCreditPackages(jsonData.creditPackages);
  };

  const fetchUserCredit = async () => {
    const res = await api(`${API_BASE_URL}/credit/user-credits`, {
      method: "GET",
    });

    if (!res.ok) {
      alert(res.statusText);
      return;
    }

    const jsonData = await res.json();
    setUserCredits(jsonData.credits);
  };

  useEffect(() => {
    fetchCreditPakages();
    fetchUserCredit();
  }, []);

  const handleBuyCreditPackage = async (id: string) => {
    if (!id || id === "") {
      alert("Id is missing");
      return;
    }

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
        const verifyRes = await api(`${API_BASE_URL}/payment/verify-payment`, {
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
        });

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
  };

  return (
    <div>
      <p>User credits: {userCredits}</p>

      {/* list credit packages */}
      {creditPackages.length > 0 &&
        creditPackages.map((p, i) => (
          <div key={i}>
            <p>{p.name}</p>
            <p>{p.credits}</p>
            <p>{p.isActive === true ? "true" : "false"}</p>
            <p>{p.priceInPaise}</p>

            <Button
              variant="primary"
              size="md"
              onClick={() => handleBuyCreditPackage(p.id)}
            >
              Buy
            </Button>
          </div>
        ))}

      {/* buy button for each on buy = init payments */}
    </div>
  );
}
