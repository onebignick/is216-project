import { NextRequest, NextResponse } from "next/server";
import { ZoomService } from "../service/ZoomService";

export class ZoomController {

    zoomService: ZoomService;

    constructor() {
        this.zoomService = new ZoomService();
    }

    async handleCreateZoomMeeting(request: NextRequest) {
        const body = await request.json();
        const createdMeeting = await this.zoomService.createZoomMeeting(body.startDateTime, body.agenda, body.topic, body.duration);
        return NextResponse.json({ message: "success", createdMeeting: createdMeeting }, { status: 200});
    }
}