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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@taskShivManager/components/ui/select";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [passMatch, setPassMatch] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setPassMatch(false);
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/auth/register`,
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

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassMatch(true);
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassMatch(true);
    setIsError(false);
    setFormData((prev) => ({
      ...prev,
      confirmPassword: e.target.value,
    }));
  };

  return (
    <div className="container flex h-fit w-screen flex-col items-center min-h-screen my-[10vh] justify-center">
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
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="userName">UserName</Label>
                  <Input
                    onChange={handleUserNameChange}
                    value={formData.username}
                    id="userName"
                    type="text"
                    placeholder="JohnDoe123"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={handleEmailChange}
                    value={formData.email}
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    value={formData.password}
                    onChange={handlePasswordChange}
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    id="confirm-password"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2 grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="manager">manager</SelectItem>
                      <SelectItem value="user">user</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!passMatch && (
                  <div className="w-full text-center text-red-600 font-semibold opacity-80 text-sm">
                    Passwords Don&apos;t Match
                  </div>
                )}
                {isError && (
                  <div className="w-full text-center text-red-600 font-semibold opacity-80 text-sm">
                    Email/UserName or Password is incorrect
                  </div>
                )}
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col text-[#78787c]">
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
