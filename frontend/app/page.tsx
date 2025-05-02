"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, ListTodo } from "lucide-react";
import { Button } from "@taskShivManager/components/ui/button";
import Navbar from "@taskShivManager/components/Home/NavBar";

export default function Home() {
  return (
    <div className="flex w-full min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container grid  h-fit items-center mx-auto gap-8 pb-8 pt-6 md:py-10">
          <div className="flex w-full flex-col items-start gap-8">
            <motion.h1
              className="text-3xl w-full text-center font-extrabold leading-loose tracking-wide md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Manage your tasks with ease <br className="hidden sm:inline" />
              and collaborate effectively.
            </motion.h1>
            <motion.p
              className="w-full flex justify-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              TaskFlow helps you organize your work, prioritize tasks, and
              collaborate with your team seamlessly.
            </motion.p>
          </div>
          <motion.div
            className="flex gap-4 w-full justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/signup">
              <Button className="bg-[#1a1a1a] text-white font-semibold border border-gray-600">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </motion.div>
          <motion.div
            className="mt-8 grid gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h3>Task Management</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Create, assign, and track tasks with ease. Set priorities and
                deadlines to stay organized.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                <h3>Priority Filtering</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Filter tasks by priority levels to focus on what matters most at
                any given time.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <ListTodo className="h-5 w-5 text-primary" />
                <h3>Team Collaboration</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Assign tasks to team members and track progress together for
                better collaboration.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="border-t py-6 mx-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
