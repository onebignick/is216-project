import { WebhookEvent } from "@clerk/nextjs/server";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { Webhook } from "svix";

const WEBHOOK_SECRET = "whsec_1EajRWukiOM52V0Qq7ZxMkjzG1x7vsCU";

export function validateWebhookRequest(body: string, headers: ReadonlyHeaders) : WebhookEvent | null {
    try {
        const svix_id = headers.get("svix-id");
        if (!svix_id) {
            throw new Error("Svix-id not found in header");
        }

        const svix_timestamp = headers.get("svix-timestamp");
        if (!svix_timestamp) {
            throw new Error("Svix-timestamp not found in header");
        }

        const svix_signature = headers.get("svix-id");
        if (!svix_signature) {
            throw new Error("Svix-signature not found in header");
        }

        const wh = new Webhook(WEBHOOK_SECRET);
        return wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent
        
    } catch {
        return null;
    }
}