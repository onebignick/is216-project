'use client'

import * as React from 'react'
import { useForm } from "react-hook-form";
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from './form';
import { Input } from './input';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import Link from 'next/link';

// Define a zod schema for form validation
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export default function SignUpForm() {
    const { isLoaded, signUp, setActive } = useSignUp();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const router = useRouter();

    // Handle the submission of the sign-up form
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!isLoaded) return;

        try {
            const { email, password } = values;
            
            // Start the sign-up process using the email and password
            const signUpAttempt = await signUp.create({
                emailAddress: email,
                password,
            });

            // If sign-up process is complete, set the session as active and redirect
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.push('/'); // Redirect user to home or dashboard after successful sign-up
            } else {
                // If additional steps are required (like email verification), log the response
                console.log('Additional steps required:', signUpAttempt);
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error("Sign up failed:", JSON.stringify(err, null, 2));
        }
    }

  // Display a form to capture the user's name, email, password and confirm password
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader className="bg-[#FFC5C2]">
                        <CardTitle className="text-center">Register An Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center p-5 gap-4 bg-[#F1EEEE]">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            className="text-black bg-white border-black"
                                            placeholder="Full Name" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            className="text-black bg-white border-black"
                                            placeholder="Email address" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            className="text-black bg-white border-black"
                                            placeholder="Password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            className="text-black bg-white border-black"
                                            placeholder="Confirm Password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Submit Button */}
                        <Button type="submit" variant="secondary" className="bg-[#EDC7B7]">Sign Up</Button>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start bg-[#F1EEEE]">
                        <p className="text-start">Already have an account?</p>
                        <div> 
                            <Button variant="link" asChild>
                                <Link href="/sign-in">Sign in here</Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
