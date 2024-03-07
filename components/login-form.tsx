"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoginUser, loginUserSchema } from "@/schema/users";
import { loginUser } from "@/server/functions/auth";

export default function LoginForm() {
  const form = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
  });
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Welcome, to our website</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(async (data) => await loginUser(data))}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      //   type="email"
                      placeholder="test@user.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Enter a valid email</FormDescription>
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Enter your password</FormDescription>
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
