'use client'

import * as Clerk from "@clerk/elements/common"
import * as SignUp from "@clerk/elements/sign-up";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import Link from "next/link";

export default function SignUpForm() {
    return (
        <SignUp.Root>
            <SignUp.Step name="start">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Register an account
                        </CardTitle>
                    </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Clerk.Field name="username">
                        <Clerk.Input asChild>
                            <Input placeholder="Username"/>
                        </Clerk.Input>
                        <Clerk.FieldError />
                    </Clerk.Field>

                    <Clerk.Field name="emailAddress">
                        <Clerk.Input asChild>
                            <Input placeholder="Email"/>
                        </Clerk.Input>
                        <Clerk.FieldError />
                    </Clerk.Field>

                    <Clerk.Field name="password">
                        <Clerk.Input asChild>
                            <Input type="password" placeholder="Password"/>
                        </Clerk.Input>
                        <Clerk.FieldError />
                    </Clerk.Field>

                    <Clerk.Field name="confirmPassword">
                        <Clerk.Input asChild>
                            <Input type="password" placeholder="Confirm Password"/>
                        </Clerk.Input>
                        <Clerk.FieldError />
                    </Clerk.Field>
                    <SignUp.Captcha/>

                    <SignUp.Action submit asChild>
                        <Button>Register</Button>
                    </SignUp.Action>
                    </CardContent>

                    <CardFooter>
                        <CardDescription>
                            Have an account?
                            <Button variant="link">
                                <Link href="/sign-in">Login here</Link>
                            </Button>
                        </CardDescription>
                    </CardFooter>
                </Card>
            </SignUp.Step>

            <SignUp.Step name="verifications">
                <Card>
                    <SignUp.Strategy name="email_code">
                        <CardHeader className="">
                            <CardTitle>Thanks for registering with us</CardTitle>
                            <CardDescription>Check your email for an OTP and enter it here</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Clerk.Field name="code">
                                <Clerk.Input asChild>
                                    <Input type="number"/>
                                </Clerk.Input>
                                <Clerk.FieldError />
                            </Clerk.Field>
                            <SignUp.Action submit asChild>
                                <Button>Verify</Button>
                            </SignUp.Action>
                        </CardContent>
                    </SignUp.Strategy>
                </Card>
            </SignUp.Step>
        </SignUp.Root>
    )
}