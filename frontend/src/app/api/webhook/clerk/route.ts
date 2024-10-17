import { WebhookController } from "@/server/controller/WebhookController";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const webhookController: WebhookController = new WebhookController();

export async function POST(request: Request) {
    try {
        const header: ReadonlyHeaders = headers();
        webhookController.handleClerkRequest(request, header);
        return NextResponse.json({ message: "success" },{ status: 200 })
    } catch {
        return NextResponse.json({message: "An error occured"}, { status: 500 })
    }
}