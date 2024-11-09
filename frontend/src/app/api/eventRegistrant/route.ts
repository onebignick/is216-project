import { MeetgridEventRegistrantController } from "@/server/controller/MeetgridEventRegistrantController";
import { NextRequest } from "next/server";

const meetgridEventRegistrantController: MeetgridEventRegistrantController = new MeetgridEventRegistrantController()

export async function POST(request: NextRequest) {
    return await meetgridEventRegistrantController.save(request);
}