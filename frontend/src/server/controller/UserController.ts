import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../service/UserService";

export class UserController {

    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async find(request: NextRequest) {
        const targetUserEmail = request.nextUrl.searchParams.get("email");
        if (targetUserEmail) {
            console.log(targetUserEmail);
            const targetUser = await this.userService.findUserByEmail(targetUserEmail);
            return NextResponse.json({ message: "success", targetUser: targetUser[0] });
        }

        const targetUserUsername = request.nextUrl.searchParams.get("username")!;
        const targetUser = await this.userService.findUserByUsername(targetUserUsername)
        if (targetUser.length === 0) {
            return NextResponse.json({ message: "not found"}, {status: 404});
        }
        return NextResponse.json({ message: "success", targetUser: targetUser[0]}, { status: 200 })
    }
}