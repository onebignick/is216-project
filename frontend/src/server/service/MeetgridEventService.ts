import { auth } from "@clerk/nextjs/server";
import { MeetgridEvent } from "../entity/MeetgridEvent";
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository"
import { MeetgridEventParticipantService } from "./MeetgridEventParticipantService";
import { MeetgridEventRegistrantRepository } from "../repository/MeetgridEventRegistrantRepository";
import { MeetgridAssociatedEvent } from "@/types/MeetgridAssociatedEvents";
import { EmailNotificationOptions, EmailService } from "./EmailService";
import { UserRepository } from "../repository/user-repository";

export class MeetgridEventService {

    meetgridEventRepository: MeetgridEventRepository;
    meetgridEventParticipantService: MeetgridEventParticipantService;
    meetgridEventRegistrantRepository: MeetgridEventRegistrantRepository;
    emailService: EmailService;
    userRepository: UserRepository;

    constructor() {
        this.meetgridEventRepository = new MeetgridEventRepository();
        this.meetgridEventParticipantService = new MeetgridEventParticipantService();
        this.meetgridEventRegistrantRepository = new MeetgridEventRegistrantRepository();
        this.emailService = new EmailService();
        this.userRepository = new UserRepository();
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

    async findEventByCode(code: string) {
        const targetEvent = await this.meetgridEventRepository.findByCode(code);
        return targetEvent;
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
        const targetUsers = await this.userRepository.findUserByClerkId(user.userId!);
        const targetUser = targetUsers[0];


        const mailOptions = {
            to: targetUser.email,
            subject: "Successfully create new Interview Schedule: " + createdEvent.name,
            text: "Dear Sir/Madam: \n \nYou have successfully create an interview schedule called " + createdEvent.name +". You can start inviting people to collaborate and join your meeting through this code: " + createdEvent.code + "\n \nThanks! \n \nBest Regards, \nMeetGrid",
        } as EmailNotificationOptions;

        await this.emailService.sendEmailNotification(mailOptions);

        return createdEventArray;
    }

    async updateOneEvent(eventToUpdate: MeetgridEvent) {
        const updatedEvent = await this.meetgridEventRepository.updateOne(eventToUpdate);

        const relatedEventParticipants = await this.meetgridEventParticipantService.findByEventId(eventToUpdate.id!);
        for (let i=0; i<relatedEventParticipants.length;i++) {
            relatedEventParticipants[i].availabilityString = this.meetgridEventParticipantService.generateAvailabilityString(new Date(eventToUpdate.startDate), new Date(eventToUpdate.endDate));
            await this.meetgridEventParticipantService.updateOneEventParticipant(relatedEventParticipants[i] as MeetgridEventParticipant);
        }

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