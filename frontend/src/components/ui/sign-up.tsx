'use client'

import * as Clerk from "@clerk/elements/common"
import * as SignUp from "@clerk/elements/sign-up";

export default function SignUpForm() {
    return (
        <SignUp.Root>
            <SignUp.Step name="start">
                <h1>Register an account</h1>

                <Clerk.Field name="username">
                    <Clerk.Label>Username</Clerk.Label>
                    <Clerk.Input />
                    <Clerk.FieldError />
                </Clerk.Field>

                <Clerk.Field name="emailAddress">
                    <Clerk.Label>Email</Clerk.Label>
                    <Clerk.Input />
                    <Clerk.FieldError />
                </Clerk.Field>

                <Clerk.Field name="password">
                    <Clerk.Label>Password</Clerk.Label>
                    <Clerk.Input />
                    <Clerk.FieldError />
                </Clerk.Field>

                <SignUp.Captcha/>

                <SignUp.Action submit>Sign up</SignUp.Action>
            </SignUp.Step>

            <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                    <h1>Check your email</h1>
                    <Clerk.Field name="code">
                        <Clerk.Label>Email Code</Clerk.Label>
                        <Clerk.Input />
                        <Clerk.FieldError />
                    </Clerk.Field>
                    <SignUp.Action submit>Verify</SignUp.Action>
                </SignUp.Strategy>
            </SignUp.Step>
        </SignUp.Root>
    )
}