"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ListTodo } from "lucide-react";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="border-b bg-background/95 backdrop-blur px-[3vw] supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 font-semibold">
          <ListTodo className="h-5 w-5" />
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            TaskFlow
          </motion.span>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-[#1a1a1a] text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
