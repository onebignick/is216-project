import { auth } from "@clerk/nextjs/server";
import { MeetgridEvent } from "../entity/MeetgridEvent";
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository"
import { MeetgridEventParticipantService } from "./MeetgridEventParticipantService";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";
import { MeetgridAssociatedEvent } from "@/types/MeetgridAssociatedEvents";
import nodemailer from 'nodemailer';

export class MeetgridEventService {

    meetgridEventRepository: MeetgridEventRepository;
    meetgridEventParticipantService: MeetgridEventParticipantService;
    meetgridEventRegistrantRepository: MeetgridEventRegistrantRepository;

    constructor() {
        this.meetgridEventRepository = new MeetgridEventRepository();
        this.meetgridEventParticipantService = new MeetgridEventParticipantService();
        this.meetgridEventRegistrantRepository = new MeetgridEventRegistrantRepository();
    }

    async findAll() {
        const allEvents = await this.meetgridEventRepository.findAll();
        return allEvents;
    }

    async findById(id: string) {
        const targetEvent = await this.meetgridEventRepository.findById(id);
        return targetEvent;
    }

    async findRelatedEventsByUserId(targetUserId: string) {
        const results: MeetgridAssociatedEvent[] = [];

        const eventsWhereAdminPlus = await this.meetgridEventParticipantService.findByUserId(targetUserId);
        for (let i=0; i<eventsWhereAdminPlus.length; i++) {
            const currentEvent: MeetgridEventParticipant = eventsWhereAdminPlus[i];
            const targetEvents: MeetgridEvent[] = await this.meetgridEventRepository.findById(currentEvent.eventId); 
            const targetEvent: MeetgridEvent = targetEvents[0]

            const newMeetgridAssociatedEvent = {
                id: targetEvent.id,
                name: targetEvent.name,
                description: targetEvent.description,
                startDate: new Date(targetEvent.startDate),
                endDate: new Date(targetEvent.endDate),
                role: currentEvent.role,
                dateCreated: new Date(targetEvent.dateCreated)
            } as MeetgridAssociatedEvent
            results.push(newMeetgridAssociatedEvent);
        }

        results.sort((a, b) => +b.dateCreated - +a.dateCreated)
        return results;
    }

    async createOneEvent(eventToCreate: MeetgridEvent) {
        
        const user = auth();

        eventToCreate.code = this.generateRandomCode();
        const createdEventArray = await this.meetgridEventRepository.createOne(eventToCreate);

        if (createdEventArray.length == 0) return createdEventArray;

        const createdEvent = createdEventArray[0]

        if (createdEvent.id) {
            const eventParticipantToCreate = {
                eventId: createdEvent.id,
                userId: user.userId,
                role: "owner",
                availabilityString: "",
            } as MeetgridEventParticipant
            await this.meetgridEventParticipantService.createOneEventParticipant(eventParticipantToCreate);
        }

         // Send email notification after event creation
         await this.sendEmailNotification(user.userId, createdEvent);

        return createdEventArray;
    }

    async sendEmailNotification(userId, event) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Using Gmail service directly
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    
        const mailOptions = {
            from: process.env.GMAIL_EMAIL, // Sender address
            to: 'xl.cheng.2023@scis.smu.edu.sg', // Recipient's email
            subject: `Event Created: ${event.name}`, // Email subject
            text: `Your event "${event.name}" has been created successfully.`,
            html: `
                <p>Your event <strong>${event.name}</strong> has been created successfully.</p>
                <p>Event Code: ${event.code}</p>
                <p>Description: ${event.description}</p>
                <p>Start Date: ${event.startDate}</p>
                <p>End Date: ${event.endDate}</p>
            `,
        };
    
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async updateOneEvent(eventToUpdate: MeetgridEvent) {
        const updatedEvent = await this.meetgridEventRepository.updateOne(eventToUpdate);
        return updatedEvent;
    }

    async deleteOneEvent(eventToDelete: MeetgridEvent) {
        console.log(eventToDelete)
        const deletedEvent = await this.meetgridEventRepository.deleteOne(eventToDelete);
        return deletedEvent;
    }

    // helper function to generate random 6-character code
    generateRandomCode(): string {
        console.log("MeetgridEventService.generateRandomCode: generating random code")
        const chr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        const min = 0;
        const max = chr.length;

        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * (max - min) + min); // generates random index
            code += chr[index]; // adds character to the code
        }
        
        console.log("MeetgridEventService.generateRandomCode: generated random code with value " + code)
        return code;
    }

}