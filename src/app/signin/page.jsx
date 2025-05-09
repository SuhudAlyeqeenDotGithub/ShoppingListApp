"use client";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/authContextConfig";

const SignInPage = () => {
  const [error, setError] = useState("");
  const { user } = useAuthContext();
  const router = useRouter();

  // Redirect to home page if user is already signed in
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  // this function handles the sign-in process using Google authentication in a popup window
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        router.push("/");
      }
    } catch (error) {
      setError(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-lightGreen1 min-h-screen flex flex-col justify-center items-center gap-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-center text-[40px] font-extrabold text-teal4 hover:cursor-pointer">
          Shopping List App - Google Interview Project
        </h1>
        <h1 className="text-center text-[25px] font-bold text-teal4">Sign In</h1>
      </div>
      <div className="w-full items-center justify-center flex flex-col gap-5 mt-10">
        {error && <div className="bg-red-100 border border-red-500 p-2 rounded-lg text-red-600 w-1/4">{error}</div>}
        <button
          className="bg-white text-teal4 font-semibold border border-gray-300 p-3 rounded-md w-1/4 flex justify-center items-center gap-5 hover:cursor-pointer hover:bg-gray-50"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="size-6" /> Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
