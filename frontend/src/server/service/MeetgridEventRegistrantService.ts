import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";
import { EmailNotificationOptions, EmailService } from "./EmailService";

export class MeetgridEventRegistrantService {

    meetgridEventRegistrantRepository: MeetgridEventRegistrantRepository;
    emailService: EmailService

    constructor() {
        this.meetgridEventRegistrantRepository = new MeetgridEventRegistrantRepository();
        this.emailService = new EmailService();
    }

    async findByEvent(eventId: string) {
        const meetgridEventRegistrants = await this.meetgridEventRegistrantRepository.findByEventId(eventId);
        return meetgridEventRegistrants;
    }

    async createOneEventRegistrant(meetgridEventRegistrantToCreate: MeetgridEventRegistrant) {
        const createdMeetgridEventRegistrant = await this.meetgridEventRegistrantRepository.createOne(meetgridEventRegistrantToCreate);
        
        const mailOption = {
            to: createdMeetgridEventRegistrant[0].interviewerEmail,
            subject: "Interview Scheduled for [time]",
            text: createdMeetgridEventRegistrant[0].zoomLink,
        } as EmailNotificationOptions;

        this.emailService.sendEmailNotification(mailOption);

        const participantMailOption = {
            to: createdMeetgridEventRegistrant[0].participantEmail,
            subject: "Interview Scheduled for [time todo]",
            text: createdMeetgridEventRegistrant[0].zoomLink,
        } as EmailNotificationOptions;

        this.emailService.sendEmailNotification(participantMailOption);

        return createdMeetgridEventRegistrant;
    }

}