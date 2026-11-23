import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";
export const metadata = {
  title: "Sign In | FixMate",
};
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
