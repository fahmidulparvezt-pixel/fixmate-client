import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export const metadata = { title: "Payment Successful | FixMate" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccess />
    </Suspense>
  );
}