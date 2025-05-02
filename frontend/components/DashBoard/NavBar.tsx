"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, ListTodo, LogOut, Menu, User } from "lucide-react"
import { Button } from "@taskShivManager/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@taskShivManager/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@taskShivManager/components/ui/sheet"

interface NavbarProps {
  onFilterChange?: (priority: string) => void
}

export default function Navbar({ onFilterChange }: NavbarProps) {
  const pathname = usePathname()
  const [activeFilter, setActiveFilter] = useState("all")

  const handleFilterChange = (priority: string) => {
    setActiveFilter(priority)
    if (onFilterChange) {
      onFilterChange(priority)
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="mr-4 flex items-center gap-2 font-semibold md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white px-[1vw]">
              <SheetHeader>
                <SheetTitle>TaskFlow</SheetTitle>
                <SheetDescription>Manage your tasks efficiently</SheetDescription>
              </SheetHeader>
              <h3 className="font-bold text-2xl">Pages:</h3>
              <div className="grid gap-4 py-4">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-2 py-1 text-sm ${isActive("/dashboard") ? "font-medium text-primary" : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/createTask"
                  className={`flex items-center gap-2 px-2 py-1 text-sm ${isActive("/createTask") ? "font-medium text-primary" : ""}`}
                >
                  Create Task
                </Link>
                <Link
                  href="/assignedTask"
                  className={`flex items-center gap-2 px-2 py-1 text-sm ${isActive("/assignedTask") ? "font-medium text-primary" : ""}`}
                >
                  Assigned Tasks
                </Link>
              </div>
              <div className="mt-2">
                <div className="text-sm font-medium">Filter by priority:</div>
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    variant={activeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeFilter === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("high")}
                  >
                    High
                  </Button>
                  <Button
                    variant={activeFilter === "medium" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={activeFilter === "low" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("low")}
                  >
                    Low
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <ListTodo className="h-5 w-5" />
          <span>TaskFlow</span>
        </div>

        <div className="hidden items-center gap-2 font-semibold md:flex">
          <ListTodo className="h-5 w-5" />
          <span>TaskFlow</span>
        </div>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:gap-10">
          <nav className="flex items-center ml-[2vw] gap-6 text-sm">
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-foreground/80 ${isActive("/dashboard") ? "font-medium text-foreground" : "text-foreground/60"}`}
            >
              Dashboard
            </Link>
            <Link
              href="/createTask"
              className={`transition-colors whitespace-nowrap hover:text-foreground/80 ${isActive("/createTask") ? "font-medium text-foreground" : "text-foreground/60"}`}
            >
              Create Task
            </Link>
            <Link
              href="/assignedTask"
              className={`transition-colors hover:text-foreground/80 whitespace-nowrap ${isActive("/assignedTask") ? "font-medium text-foreground" : "text-foreground/60"}`}
            >
              Assigned Tasks
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div className="flex items-center gap-2 rounded-lg border p-1" layout>
                <Button
                  variant={activeFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("all")}
                >
                  All
                </Button>
                <Button
                  variant={activeFilter === "high" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("high")}
                >
                  High
                </Button>
                <Button
                  variant={activeFilter === "medium" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={activeFilter === "low" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("low")}
                >
                  Low
                </Button>
              </motion.div>
            </div>

            <Button variant="outline" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <Button variant="outline" size="icon" className="relative h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
