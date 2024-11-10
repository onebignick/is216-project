import { MeetgridInterview } from "@/types/MeetgridInterview";
import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository";
import { EmailNotificationOptions, EmailService } from "./EmailService";

export class MeetgridEventRegistrantService {

    meetgridEventRegistrantRepository: MeetgridEventRegistrantRepository;
    meetgridEventRepository: MeetgridEventRepository;
    emailService: EmailService

    constructor() {
        this.meetgridEventRegistrantRepository = new MeetgridEventRegistrantRepository();
        this.meetgridEventRepository = new MeetgridEventRepository;
        this.emailService = new EmailService();
    }

    async findByEvent(eventId: string) {
        const targetEvent = await this.meetgridEventRepository.findById(eventId);
        const meetgridEventRegistrants = await this.meetgridEventRegistrantRepository.findByEventId(eventId);

        const result = [];
        for (let i=0;i<meetgridEventRegistrants.length; i++ ) {
            const curTime = new Date(targetEvent[0].startDate)
            curTime.setDate(curTime.getDate() + meetgridEventRegistrants[i].dayIdx!);
            curTime.setMinutes(curTime.getMinutes() + (meetgridEventRegistrants[i].timeslotIdx!*15))
            
            const cur = {
                id: meetgridEventRegistrants[i].id!,
                interviewerEmail: meetgridEventRegistrants[i].interviewerEmail,
                participantEmail: meetgridEventRegistrants[i].participantEmail,
                time: curTime,
                zoomLink: meetgridEventRegistrants[i].zoomLink,
            } as MeetgridInterview;

            result.push(cur);
        }

        return result;
    }

    async createOneEventRegistrant(meetgridEventRegistrantToCreate: MeetgridEventRegistrant) {
        const backgroundColor = this.getRandomColor();
        meetgridEventRegistrantToCreate.backgroundColor = backgroundColor;
        meetgridEventRegistrantToCreate.borderColor = this.getRandomColor();
        meetgridEventRegistrantToCreate.textColor = this.isLightColor(backgroundColor) ? '#000000' : '#ffffff'; // Adjust text color based on luminance

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

    // Helper functions for generating random color and checking luminance
    getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    // Method to check if a color is light or dark
    isLightColor(color: string): boolean {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance > 0.5;  // Return true if light color
    }

}