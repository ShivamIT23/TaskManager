"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@taskShivManager/components/ui/button";
import { Input } from "@taskShivManager/components/ui/input";
import { Label } from "@taskShivManager/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@taskShivManager/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const answer = await response.json();

    if (response.ok) {
      localStorage.setItem("token", answer.token);
      router.push("/dashboard");
      setIsLoading(false);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      identifier: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email/userName and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email/UserName</Label>
                  <Input
                    id="email"
                    value={formData.identifier}
                    onChange={handleIdentifierChange}
                    type="text"
                    placeholder="name@example.com or johnCena"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    type="password"
                    required
                  />
                </div>
                {isError && (
                  <div className="w-full text-center text-red-600 font-semibold opacity-80 text-sm">
                    Email/UserName or Password is incorrect
                  </div>
                )}
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isLoading || isError}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col text-[#78787c]">
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
