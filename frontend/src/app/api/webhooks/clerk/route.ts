import { validateWebhookRequest } from "@/lib/clerk";
import { UserRepository } from "@/server/repository/user-repository";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log("hello world")
    const userRepository: UserRepository = new UserRepository();

    const headerPayload: ReadonlyHeaders = headers();
    const payload = await request.json();
    const body: string = JSON.stringify(payload);
    
    const event = validateWebhookRequest(body, headerPayload);
    if (!event) {
        return NextResponse.json({status: 500});
    }

    const { id: clerkUserId } = event.data;
    switch (event.type) {
        case "user.created": {
            await userRepository.createOneUser(clerkUserId!);
            break;
        }
    }
    return NextResponse.json({ status: 200 })
}