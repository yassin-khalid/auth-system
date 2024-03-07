"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUser, createUserSchema } from "@/schema/users";
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
import { CrossCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { registerUser } from "@/server/functions/auth";

export default function SignUpForm() {
  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      password: "",
    },
  });
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Welcome, to our website</CardTitle>
        <CardDescription>Sign up to create account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(
              async (data) => await registerUser(data)
            )}
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
                  <FormDescription>
                    <div className="flex items-center">
                      {/[A-Z]/.test(form.getValues("password")) ? (
                        <CheckCircledIcon className="mr-2 text-green-500" />
                      ) : (
                        <CrossCircledIcon className="mr-2 text-red-500" />
                      )}{" "}
                      At least one uppercase character
                    </div>
                    <div className="flex items-center">
                      {/[a-z]/.test(form.getValues("password")) ? (
                        <CheckCircledIcon className="mr-2 text-green-500" />
                      ) : (
                        <CrossCircledIcon className="mr-2 text-red-500" />
                      )}{" "}
                      At least one lowercase character
                    </div>
                    <div className="flex items-center">
                      {/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(
                        form.getValues("password")
                      ) ? (
                        <CheckCircledIcon className="mr-2 text-green-500" />
                      ) : (
                        <CrossCircledIcon className="mr-2 text-red-500" />
                      )}{" "}
                      At least one special character
                    </div>
                    <div className="flex items-center">
                      {form.getValues("password").length >= 5 ? (
                        <CheckCircledIcon className="mr-2 text-green-500" />
                      ) : (
                        <CrossCircledIcon className="mr-2 text-red-500" />
                      )}{" "}
                      At least five characters long
                    </div>
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Confirm your password</FormDescription>
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
