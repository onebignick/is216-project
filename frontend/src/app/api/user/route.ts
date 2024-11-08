import { UserController } from "@/server/controller/UserController";
import { NextRequest } from "next/server";

const userController: UserController = new UserController();

export async function GET(request: NextRequest) {
    return await userController.find(request);
}