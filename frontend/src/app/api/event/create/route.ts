import { EventController } from "@/server/controller/EventController";

const eventController: EventController = new EventController()

export async function POST(request: Request) {
    return await eventController.handlePost(request);
}