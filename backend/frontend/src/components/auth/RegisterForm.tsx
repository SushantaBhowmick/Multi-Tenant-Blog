import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { signupSchema, type SignupInput } from "./authSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";

function useTenantFromHost() {
  return useMemo(() => {
    if (typeof window === "undefined") return { sub: "", root: "yourapp.com" };
    const host = window.location.host; // e.g. acme.yourapp.com
    const parts = host.split(".");
    if (parts.length > 2)
      return { sub: parts[0], root: parts.slice(1).join(".") };
    return { sub: "", root: host };
  }, []);
}

const RegisterForm = () => {
  const hostInfo = useTenantFromHost();
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: SignupInput) => {
    console.log("SIGNUP", { ...values, tenant: hostInfo.sub });
  };

  return (
    <div className="w-full max-w-md  p-6 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@doe.com" {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <Button type="button" variant="outline" className="w-full cursor-pointer">
            <FaGoogle className="w-4 h-4 mr-2" />
            Sign Up with Google
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              SignIn
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
