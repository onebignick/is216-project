import { User } from "../entity/user";
import { UserRepository } from "../repository/user-repository";

export class ClerkService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async handleUserCreated(event: any) {
        console.log("ClerkService : user created")
        const clerkUserObject = event.data;
        const newUser: User = {
            clerkUserId: clerkUserObject.id,
            username: clerkUserObject.username,
            firstname: clerkUserObject.first_name,
            lastname: clerkUserObject.last_name,
        }
        const newUserId = await this.userRepository.createOneUser(newUser);
        console.log("newUserId: " + newUserId);
        console.log("ClerkService : user created finished")
    }
}