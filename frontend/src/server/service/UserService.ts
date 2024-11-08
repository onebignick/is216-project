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
}