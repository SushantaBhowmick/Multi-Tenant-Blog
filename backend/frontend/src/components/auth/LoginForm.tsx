import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "./authSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

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

const LoginForm = () => {
  const hostInfo = useTenantFromHost();
  const {login,isLoggingIn} = useAuth()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: LoginInput) => {
    console.log("LOGIN", { ...values, tenant: hostInfo.sub });
    login(values)
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
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="text-normal cursor-pointer">Remember me</FormLabel>
                </div>
                <Link
                  to="forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Sign in"}
          </Button>
          <Button type="button" variant="outline" className="w-full cursor-pointer">
            <FaGoogle className="w-4 h-4 mr-2" />
            Sign in with Google
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            New here?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
