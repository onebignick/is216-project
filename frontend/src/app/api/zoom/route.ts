import { ZoomController } from "@/server/controller/ZoomController";
import { NextRequest } from "next/server";

const zoomController: ZoomController = new ZoomController

export async function POST(request: NextRequest) {
    return await zoomController.handleCreateZoomMeeting(request);
}