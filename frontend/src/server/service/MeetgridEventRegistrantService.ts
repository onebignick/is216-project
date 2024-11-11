import { MeetgridInterview } from "@/types/MeetgridInterview";
import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository";
import { EmailNotificationOptions, EmailService } from "./EmailService";
import { UserRepository } from "../repository/user-repository";
import { MeetgridEventParticipantRepository } from "../repository/MeetgridEventParticipantRepository";
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";

const URL = "https://meetgrid.vercel.app";

export class MeetgridEventRegistrantService {

    meetgridEventRegistrantRepository: MeetgridEventRegistrantRepository;
    meetgridEventRepository: MeetgridEventRepository;
    emailService: EmailService;
    userRepository: UserRepository;
    meetgridEventParticipantRepository: MeetgridEventParticipantRepository;

    constructor() {
        this.meetgridEventRegistrantRepository = new MeetgridEventRegistrantRepository();
        this.meetgridEventRepository = new MeetgridEventRepository();
        this.emailService = new EmailService();
        this.meetgridEventParticipantRepository = new MeetgridEventParticipantRepository();
        this.userRepository = new UserRepository();
    }

    async findById(id: string) {
        const targetEventRegistrant = await this.meetgridEventRegistrantRepository.findById(id);
        return targetEventRegistrant;
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

    async findEventWithParticipantsByUserId(userId: string) {
        const targetEvents = await this.meetgridEventRegistrantRepository.findEventWithParticipantsByUserId(userId);
        return targetEvents;
    }
    
    async createOneEventRegistrant(meetgridEventRegistrantToCreate: MeetgridEventRegistrant) {
        const targetEvent = await this.meetgridEventRepository.findById(meetgridEventRegistrantToCreate.eventId);
        const curTime = new Date(targetEvent[0].startDate)
        curTime.setDate(curTime.getDate() + meetgridEventRegistrantToCreate.dayIdx!);
        curTime.setMinutes(curTime.getMinutes() + (meetgridEventRegistrantToCreate.timeslotIdx!*15))

        const backgroundColor = this.getRandomColor();
        meetgridEventRegistrantToCreate.backgroundColor = backgroundColor;
        meetgridEventRegistrantToCreate.borderColor = this.getRandomColor();
        meetgridEventRegistrantToCreate.textColor = this.isLightColor(backgroundColor) ? '#000000' : '#ffffff'; // Adjust text color based on luminance

        const createdMeetgridEventRegistrant = await this.meetgridEventRegistrantRepository.createOne(meetgridEventRegistrantToCreate);
        
        const mailOption = {
            to: createdMeetgridEventRegistrant[0].interviewerEmail,
            subject: "Interview Scheduled on " + curTime.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            text: "Dear Sir/Madam: \n\nYour inteview has been scheduled. Below is the zoom link: \n" + createdMeetgridEventRegistrant[0].zoomLink + 
            "\n \nIf you would like to update/cancel the timing you can use this link: \n" + URL + "/interview/"+createdMeetgridEventRegistrant[0].id+"/edit" +  ". \n \nThanks! \n \nBest Regards, \nMeetGrid",
        } as EmailNotificationOptions;

        this.emailService.sendEmailNotification(mailOption);

        const participantMailOption = {
            to: createdMeetgridEventRegistrant[0].participantEmail,
            subject: "Interview Scheduled on " + curTime.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            text: "Dear Sir/Madam: \n\nYour inteview has been scheduled. Below is the zoom link: \n" + createdMeetgridEventRegistrant[0].zoomLink + 
            "\n \nIf you would like to update/cancel the timing you can use this link: \n" + URL +"/interview/"+createdMeetgridEventRegistrant[0].id+"/edit" +  ". \n \nThanks! \n \nBest Regards, \nMeetGrid",
        } as EmailNotificationOptions;

        this.emailService.sendEmailNotification(participantMailOption);

        return createdMeetgridEventRegistrant;
    }

    async deleteOneEventRegistrant(id: string) {
        const deletedEventRegistrant = await this.meetgridEventRegistrantRepository.deleteOne(id);
        
        const targetEvent = await this.meetgridEventRepository.findById(deletedEventRegistrant[0].eventId!);
        const curTime = new Date(targetEvent[0].startDate)
        curTime.setDate(curTime.getDate() + deletedEventRegistrant[0].dayIdx!);
        curTime.setMinutes(curTime.getMinutes() + (deletedEventRegistrant[0].timeslotIdx!*15))

        const targetUser = await this.userRepository.findUserByEmail(deletedEventRegistrant[0].interviewerEmail!);
        
        // update the guys availability;
        const targetEventParticipant = await this.meetgridEventParticipantRepository.findByEventIdAndUserId(deletedEventRegistrant[0].eventId!, targetUser[0].clerkUserId!);
        
        const updatedAvailability = JSON.parse(targetEventParticipant[0].availabilityString!);
        updatedAvailability[deletedEventRegistrant[0].timeslotIdx!][deletedEventRegistrant[0].dayIdx!][deletedEventRegistrant[0].interviewerEmail!] = "";
        targetEventParticipant[0].availabilityString = JSON.stringify(updatedAvailability);
        await this.meetgridEventParticipantRepository.updateOne(targetEventParticipant[0] as MeetgridEventParticipant);

        const participantMailOption = {
            to: deletedEventRegistrant[0].participantEmail,
            subject: "Interview at " + curTime.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }) + " was cancelled",
            text: "The interview was cancelled"
        } as EmailNotificationOptions;

        const participantMailOption2 = {
            to: deletedEventRegistrant[0].interviewerEmail,
            subject: "Interview at " + curTime.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }) + " was cancelled",
            text: "The interview was cancelled"
        } as EmailNotificationOptions;
        this.emailService.sendEmailNotification(participantMailOption);
        this.emailService.sendEmailNotification(participantMailOption2);
        return deletedEventRegistrant;
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