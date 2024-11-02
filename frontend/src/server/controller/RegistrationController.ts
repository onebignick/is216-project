import { RegistrationService } from "../service/RegistrationService";

export class RegistrationController {
    registrationService: RegistrationService = new RegistrationService();

    constructor() {
        this.registrationService = new RegistrationService();
    }
    
    async handleEvent(request: Request) {
        return await this.registrationService.handleEvent(request);
    }
}