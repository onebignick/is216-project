import { WebhookEvent } from "@clerk/nextjs/server";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { Webhook } from "svix";
import { ClerkService } from "./ClerkService";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export class WebhookService {
    clerkService: ClerkService;

    constructor() {
        this.clerkService = new ClerkService();
    }

    async handleClerkWebhookEvent(request: Request, headers: ReadonlyHeaders) {
        const event = await request.json();
        const body: string = JSON.stringify(event);
        if (!this.validateRequest(body, headers)) {
            throw new Error("invalid request")
        }

        switch (event.type) {
            case "user.created":
                this.clerkService.handleUserCreated(event);
                break;
        }
    }

    validateRequest(body: string, headers: ReadonlyHeaders): boolean {
        try {
            const svix_id = headers.get("svix-id");
            const svix_timestamp = headers.get("svix-timestamp");
            const svix_signature = headers.get("svix-signature");
            if (!svix_id || !svix_timestamp || !svix_signature) {
                throw new Error("invalid headers");
            } 

            const wh = new Webhook(CLERK_WEBHOOK_SECRET);
            wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            }) as WebhookEvent;
            return true;
        } catch {
            return false;
        }
    }
}