import { UserRepository } from "../repository/user-repository";

export class UserService {

    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async findUserByUsername(username: string) {
        const targetUser = await this.userRepository.getUserByUsername(username);
        return targetUser;
    }

    async findUserByEmail(email: string) {
        const targetUser = await this.userRepository.findUserByEmail(email);
        return targetUser;
    }

    async findUserByClerkId(clerkId: string) {
        const targetUser = await this.userRepository.findUserByClerkId(clerkId);
        return targetUser;
    }
}