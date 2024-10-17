import { NextResponse } from "next/server";
import { WebhookService } from "../service/WebhookService";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export class WebhookController {
    webhookService: WebhookService;

    constructor() {
        this.webhookService = new WebhookService();
    }

    async handleClerkRequest(request: Request, headers: ReadonlyHeaders) {
        try {
            await this.webhookService.handleClerkWebhookEvent(request, headers);
            return NextResponse.json({message: "success"}, {status: 200})
        } catch (e) {
            return NextResponse.json({message: e.message}, {status: 500})
        }
    }
}