"use client"

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export default function SignInForm() {
    return (
        <SignIn.Root>
            <SignIn.Step name="start" className="w-xl">
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="text-5xl">
                            <h1>Hey there! 👋</h1>
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center gap-4">
                    {/* <Clerk.Connection name="google" asChild>
                        <Button>Sign in with Google</Button>
                    </Clerk.Connection> */}

                    <Clerk.Field name="identifier">
                        <Clerk.Input asChild>
                            <Input type="email" placeholder="Enter your email here"/>
                        </Clerk.Input>
                        <Clerk.FieldError/>
                    </Clerk.Field>

                    <Clerk.Field name="password">
                        <Clerk.Input asChild>
                            <Input type="password" placeholder="Enter your password here"/>
                        </Clerk.Input>
                        <Clerk.FieldError/>
                    </Clerk.Field>
                    <SignIn.Action navigate="forgot-password" className="text-left">Forgot Password?</SignIn.Action>

                    <SignIn.Action submit asChild>
                        <Button>Continue</Button>
                    </SignIn.Action>
                    </CardContent>

                    <CardFooter>
                        Dont have an account? 
                        <Button variant="link" asChild>
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </SignIn.Step>
        </SignIn.Root>
    )
}


// 'use client'

// import * as React from 'react'
// import { useForm } from "react-hook-form";
// import { useSignIn } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
// import Link from 'next/link';

// const formSchema = z.object({
//     email: z.string(),
//     password: z.string()
// })

// export default function SignInForm() {
//     const { isLoaded, signIn, setActive } = useSignIn();
//     const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//     })

//     const router = useRouter()

//     // Handle the submission of the sign-in form
//     async function onSubmit (values: z.infer<typeof formSchema>) {
//         if (!isLoaded) return;

//         // Start the sign-in process using the email and password provided
//         try {
//             const password = values.password;
//             const signInAttempt = await signIn.create({
//                 identifier: values.email, 
//                 password,
//             })

//             // If sign-in process is complete, set the created session as active
//             // and redirect the user
//             if (signInAttempt.status === 'complete') {
//                 await setActive({ session: signInAttempt.createdSessionId })
//                 router.push('/')
//             } else {
//                 // If the status is not complete, check why. User may need to
//                 // complete further steps.
//                 console.error(JSON.stringify(signInAttempt, null, 2))
//             }
//         } catch (err) {
//             // See https://clerk.com/docs/custom-flows/error-handling
//             // for more info on error handling
//             setErrorMessage('Invalid email or password. Please try again.');
//             console.error(JSON.stringify(err, null, 2))
//         }
//     }

//   // Display a form to capture the user's email and password
//   return (
//     <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <Card className="bg-transparent border-none">
//                 <CardHeader>
//                     <CardTitle className="text-5xl">
//                         Hey there! 👋
//                     </CardTitle>
//                     <CardDescription className="text-xl text-black">
//                         Sign in to your account
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="flex flex-col justify-center px-5 gap-4">
//                     {errorMessage && (
//                         <p className="bg-red-400 text-white p-4 rounded-lg">{errorMessage}</p>
//                     )}
//                     <FormField
//                         control={form.control}
//                         name="email"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormControl>
//                                     <Input 
//                                         className="text-black bg-white border-black"
//                                         placeholder="Email address" {...field}
//                                     />
//                                 </FormControl>
//                                 <FormMessage/>
//                             </FormItem>
//                         )}
//                     />
//                     <FormField
//                         control={form.control}
//                         name="password"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormControl>
//                                     <Input 
//                                         type= "password"
//                                         className="text-black bg-white border-black"
//                                         placeholder="Password" {...field}
//                                     />
//                                 </FormControl>
//                                 <FormMessage/>
//                             </FormItem>
//                         )}
//                     />
//                     <Button type="submit" variant="secondary" className="bg-[#EDC7B7]">Login</Button>
//                 </CardContent>
//                 <CardFooter className="flex flex-col items-start">
//                     <p className="text-start">Forgot Password?</p>
//                     <div>Dont have an account? <Button variant="link" asChild><Link href="/sign-up">Register here</Link></Button></div>
//                 </CardFooter>
//             </Card>
//         </form>
//     </Form>
//   )
// }