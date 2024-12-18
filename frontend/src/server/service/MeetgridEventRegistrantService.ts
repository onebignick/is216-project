import { MeetgridInterview } from "@/types/MeetgridInterview";
import { MeetgridEventRegistrant } from "../entity/MeetgridEventRegistrant";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository";
import { EmailNotificationOptions, EmailService } from "./EmailService";
import { UserRepository } from "../repository/user-repository";
import { MeetgridEventParticipantRepository } from "../repository/MeetgridEventParticipantRepository";
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { createEvent, EventAttributes, EventStatus } from "ics";
import { color } from "framer-motion";
import { string, boolean } from "zod";

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
            curTime.setMinutes(curTime.getMinutes() + (meetgridEventRegistrants[i].timeslotIdx!*30))
            
            const cur = {
                id: meetgridEventRegistrants[i].id!,
                participantName: meetgridEventRegistrants[i].participantName,
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
        curTime.setMinutes(curTime.getMinutes() + (meetgridEventRegistrantToCreate.timeslotIdx!*30))

        const backgroundColor = this.getRandomColor();
        meetgridEventRegistrantToCreate.backgroundColor = backgroundColor;
        meetgridEventRegistrantToCreate.borderColor = this.getRandomColor();
        meetgridEventRegistrantToCreate.textColor = this.isLightColor(backgroundColor) ? '#000000' : '#ffffff'; // Adjust text color based on luminance

        const createdMeetgridEventRegistrant = await this.meetgridEventRegistrantRepository.createOne(meetgridEventRegistrantToCreate);
        // Create .ics event data
        const interviewerEvent: EventAttributes = {
            start: [
                curTime.getFullYear(),
                curTime.getMonth() + 1,
                curTime.getDate(),
                curTime.getHours(),
                curTime.getMinutes(),
            ] as [number, number, number, number, number],
            duration: { hours: 1 }, // Event duration of 1 hour
            title: targetEvent[0].name! + " Interview",
            description: "Your interview has been scheduled.",
            location: "Zoom Meeting",
            url: createdMeetgridEventRegistrant[0].zoomLink || undefined, // Optional: Zoom link or other URL
            status: "CONFIRMED" as EventStatus,
            organizer: {
                name: createdMeetgridEventRegistrant[0].interviewerEmail!,
                email: process.env.GMAIL_EMAIL || '', // Set your Gmail email in environment variables
            },
            attendees: [
                {
                    name: createdMeetgridEventRegistrant[0].participantName!,
                    email: createdMeetgridEventRegistrant[0].participantEmail!,
                },
            ],
        };

        // Generate .ics for interviewer
         const { error: interviewerError, value: interviewerValue } = createEvent(interviewerEvent);

        if (interviewerError) {
            console.error("Error creating event:", interviewerError);
        } else {
            const interviewerMailOption: EmailNotificationOptions = {
                to: createdMeetgridEventRegistrant[0].interviewerEmail!,
                subject: `Interview Scheduled on ${curTime.toLocaleString('en-SG', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Singapore',
                })}`,
                text: "",
                html: `Dear Sir/Madam, <br><br>Your interview has been scheduled. <br> Here is the Zoom link: <a href="${createdMeetgridEventRegistrant[0].zoomLink}" target="_blank">Zoom Interview Link</a><br><br> If you would like to update or cancel the timing, you can use this link: <a href="${URL}/interview/${createdMeetgridEventRegistrant[0].id}/edit" target="_blank">Update/Cancel Interview</a><br><br>Thanks!<br><br>Best Regards,<br>MeetGrid`,
                attachments: [
                    {
                        filename: 'interview-schedule.ics', // Name of the .ics file
                        content: interviewerValue!, // The .ics event content
                        contentType: 'text/calendar',
                    },
                ],
            };
            // Send email to interviewer
            await this.emailService.sendEmailNotification(interviewerMailOption);
        };

        // Create .ics event data for the participant
        const participantEvent: EventAttributes = {
            start: [
                curTime.getFullYear(),
                curTime.getMonth() + 1,
                curTime.getDate(),
                curTime.getHours(),
                curTime.getMinutes(),
            ] as [number, number, number, number, number],
            duration: { hours: 1 }, // Event duration of 1 hour
            title: targetEvent[0].name! + " Interview",
            description: "Your interview has been scheduled.",
            location: "Zoom Meeting",
            url: createdMeetgridEventRegistrant[0].zoomLink || undefined, // Optional: Zoom link or other URL
            status: "CONFIRMED" as EventStatus,
            organizer: {
                name: createdMeetgridEventRegistrant[0].interviewerEmail!,
                email: process.env.GMAIL_EMAIL || '', // Set your Gmail email in environment variables
            },
            attendees: [
                {
                    name: createdMeetgridEventRegistrant[0].participantName!,
                    email: createdMeetgridEventRegistrant[0].participantEmail!,
                },
            ],
        };

        // Generate .ics for participant
        const { error: participantError, value: participantValue } = createEvent(participantEvent);

        if (participantError) {
            console.error("Error creating participant event:", participantError);
        } else {
            const participantMailOption: EmailNotificationOptions = {
                to: createdMeetgridEventRegistrant[0].participantEmail!,
                subject: `Interview Scheduled on ${curTime.toLocaleString('en-SG', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Singapore',
                })}`,
                text: "",
                html: `Dear Sir/Madam, <br><br>Your interview has been scheduled. <br> Here is the Zoom link: <a href="${createdMeetgridEventRegistrant[0].zoomLink}" target="_blank">Zoom Interview Link</a><br><br> If you would like to update or cancel the timing, you can use this link: <a href="${URL}/interview/${createdMeetgridEventRegistrant[0].id}/edit" target="_blank">Update/Cancel Interview</a><br><br>Thanks!<br><br>Best Regards,<br>MeetGrid`,
                attachments: [
                    {
                        filename: 'interview-schedule.ics',
                        content: participantValue!,
                        contentType: 'text/calendar',
                    },
                ],
            };
            await this.emailService.sendEmailNotification(participantMailOption);
        };
        // const mailOption = {
        //     to: createdMeetgridEventRegistrant[0].interviewerEmail,
        //     subject: "Interview Scheduled on " + curTime.toLocaleString('en-SG', {
        //         year: 'numeric',
        //         month: '2-digit',
        //         day: '2-digit',
        //         hour: '2-digit',
        //         minute: '2-digit',
        //         second: '2-digit',
        //         hour12: false,
        //         timeZone: 'Asia/Singapore' // Ensure Singapore timezone
        //     }),
        //     html: `Dear Sir/Madam: <br><br>Your inteview has been scheduled. <br> Below is the zoom link: \n` + `<a href="${createdMeetgridEventRegistrant[0].zoomLink}" target="_blank">Zoom Interview Link</a>` + 
        //     `<br> If you would like to update or cancel the timing, you can use this link: <a href="${URL}/interview/${createdMeetgridEventRegistrant[0].id}/edit" target="_blank">Update/Cancel Interview</a>` +  ` <br> \n \nThanks! \n \n<br>Best Regards, \nMeetGrid`,
        // } as EmailNotificationOptions;

        // this.emailService.sendEmailNotification(mailOption);

        // const participantMailOption = {
        //     to: createdMeetgridEventRegistrant[0].participantEmail,
        //     subject: "Interview Scheduled on " + curTime.toLocaleString('en-SG', {
        //         year: 'numeric',
        //         month: '2-digit',
        //         day: '2-digit',
        //         hour: '2-digit',
        //         minute: '2-digit',
        //         second: '2-digit',
        //         hour12: false,
        //         timeZone: 'Asia/Singapore' // Ensure Singapore timezone
        //     }),
        //     html: `Dear Sir/Madam: <br><br>Your inteview has been scheduled. <br> Below is the zoom link: \n` + `<a href="${createdMeetgridEventRegistrant[0].zoomLink}" target="_blank">Zoom Interview Link</a>` + 
        //     `<br> If you would like to update or cancel the timing, you can use this link: <a href="${URL}/interview/${createdMeetgridEventRegistrant[0].id}/edit" target="_blank">Update/Cancel Interview</a>` +  ` <br> \n \nThanks! \n \n<br>Best Regards, \nMeetGrid`,
        // } as EmailNotificationOptions;

        // this.emailService.sendEmailNotification(participantMailOption);

        return createdMeetgridEventRegistrant;
    }
    
    async deleteOneEventRegistrant(id: string) {
        const deletedEventRegistrant = await this.meetgridEventRegistrantRepository.deleteOne(id);
        
        const targetEvent = await this.meetgridEventRepository.findById(deletedEventRegistrant[0].eventId!);
        const curTime = new Date(targetEvent[0].startDate)
        curTime.setDate(curTime.getDate() + deletedEventRegistrant[0].dayIdx!);
        curTime.setMinutes(curTime.getMinutes() + (deletedEventRegistrant[0].timeslotIdx!*30))

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
                hour12: false,
                timeZone: 'Asia/Singapore' // Ensure Singapore timezone
            }) + " was cancelled",
            text: "Dear Sir/Madam: \n\nThe interview that you have booked on "+ curTime.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Singapore' // Ensure Singapore timezone
            })  + " was cancelled. If you wish to schedule/book another interview. You may do so at " + URL +"/interview/"+ deletedEventRegistrant[0].id+"/edit" +  ". \n \nThanks! \n \nBest Regards, \nMeetGrid"
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
            text: "Dear Sir/Madam: \n\nThe interview that you have scheduled on "+ curTime.toLocaleString('en-SG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })  + " was cancelled.\n \nThanks! \n \nBest Regards, \nMeetGrid"
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