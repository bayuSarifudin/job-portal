import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import client from '@/api/client';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, registerSchema } from './validation';

const Signup = () => {
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (data: RegisterSchema) => {
    try {
      const { email, password } = data;
      if (!email || !password) throw new Error("Please enter email and password");

      const { error } = await client.auth.signUp({ email, password });
      if (error) throw error;

      toast.success("Success! Please login now.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Oops, something went wrong!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIGN UP</CardTitle>
        <CardDescription>Enter email and password to sign up</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form} schema={registerSchema}>
          <form onSubmit={form.handleSubmit(handleSignUp)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id='email' type='email' placeholder="example@gmail.com" {...field} />
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
                      <Input id='password' type='password' placeholder="enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button>Login</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Signup;
