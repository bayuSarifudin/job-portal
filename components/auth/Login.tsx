import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import client from '@/api/client';
import { useForm } from 'react-hook-form';
import { registerSchema, RegisterSchema } from './validation';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const Login = () => {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: RegisterSchema) => {
    try {
      const { email, password } = data;
      if (!email || !password) throw ('Please Enter Email and Password');

      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error?.message;
    } catch (error) {
      toast.error(error ? (error) as string : 'Oops something went wrong!');
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>LOG IN</CardTitle>
        <CardDescription>Enter email and password to Login</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form} schema={registerSchema}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
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

export default Login;