"use client";
import { useAuthContext } from "@/app/context/authContextConfig";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectRoute({ children, page }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (page === "main" && user === null) {
        router.replace("/signin");
      }
      if (page === "signin" && user) {
        router.replace("/");
      }
    }
  }, [user, loading]);

  if (loading) return null;

  if (page === "main" && !user) return null;
  if (page === "signin" && user) return null;

  return children;
}
