import React, { useMemo, useState } from "react";
import { Building2, ChevronDown, Menu, Wand2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Link } from "react-router-dom";
import { ModeToggle } from "../darkMode/mode-toggle";
import { Button } from "../ui/button";

// ---- Mock helpers
const tenants = [
  { name: "Acme Media", sub: "acme" },
  { name: "BlueWave", sub: "blue" },
  { name: "InstaDev", sub: "insta" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const hostInfo = useMemo(() => {
    if (typeof window === "undefined")
      return { sub: "", root: "http://localhost:5173" };
    const host = window.location.host; // e.g. acme.yourapp.com or yourapp.com
    const parts = host.split(".");
    if (parts.length > 2)
      return { sub: parts[0], root: parts.slice(1).join(".") };
    return { sub: "", root: host };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Tenant</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="-mt-0.5 text-left text-base font-semibold tracking-tight hover:opacity-90">
                  {hostInfo.sub || "Select"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>Switch tenant</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tenants.map((t) => (
                  <DropdownMenuItem
                    key={t.sub}
                    onClick={() =>
                      (window.location.href = `https://${t.sub}.${hostInfo.root}`)
                    }
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {t.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#blog"
          >
            Blog
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#faq"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/signin">
            <Button variant="outline" className="hidden sm:inline-flex cursor-pointer">
              Sign in
            </Button>
          </Link>
          <Link to="/create-tenant">
            <Button className="hidden sm:inline-flex cursor-pointer">Create tenant</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((s) => !s)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden border-t bg-background px-4 py-3">
        <div className="grid gap-3">
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#blog"
          >
            Blog
          </Link>
          <Link
            className="text-sm text-muted-foreground hover:text-foreground"
            to="#faq"
          >
            FAQ
          </Link>
          <div className="flex gap-2 pt-2">
            <Link to="/signin">
            <Button variant="outline" className="w-full cursor-pointer">
              Sign in
            </Button>
            </Link>
            <Link to="/create-tenant">
              <Button className="w-full cursor-pointer">Create tenant</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
