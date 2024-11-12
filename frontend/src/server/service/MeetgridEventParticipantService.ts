import { MeetgridEventAdmin } from "@/types/MeetgridEventAdmin";
import { MeetgridEventParticipant } from "../entity/MeetgridEventParticipant";
import { MeetgridEventParticipantRepository } from "../repository/MeetgridEventParticipantRepository";
import { MeetgridEventRepository } from "../repository/MeetgridEventRepository";
import { UserRepository } from "../repository/user-repository";
import { EmailNotificationOptions, EmailService } from "./EmailService";

const URL = "https://meetgrid.vercel.app";
export class MeetgridEventParticipantService {

    meetgridEventParticipantRepository: MeetgridEventParticipantRepository;
    meetgridEventRepository: MeetgridEventRepository
    userRepository: UserRepository;
    emailService: EmailService;

    constructor() {
        this.meetgridEventParticipantRepository = new MeetgridEventParticipantRepository();
        this.meetgridEventRepository = new MeetgridEventRepository();
        this.userRepository = new UserRepository();
        this.emailService = new EmailService();
    }

    async findAll() {
        const allEventParticipants = await this.meetgridEventParticipantRepository.findAll();
        return allEventParticipants;
    }

    async findById(id: string) {
        const targetEventParticipant = await this.meetgridEventParticipantRepository.findById(id);
        return targetEventParticipant;
    }

    async findByEventId(eventId: string) {
        const targetEventParticipants = await this.meetgridEventParticipantRepository.findByEventId(eventId);
        return targetEventParticipants;
    }

    async findByEventIdAndRole(eventId: string, role: string) {
        const targetEventParticipants = await this.meetgridEventParticipantRepository.findByEventIdAndRole(eventId, role);

        const result = [];
        for (let i=0;i<targetEventParticipants.length;i++) {
            const targetUser = await this.userRepository.getUserByClerkUserId(targetEventParticipants[i].userId);
            
            const currentAdmin = {
                id: targetEventParticipants[i].id,
                userId: targetEventParticipants[i].userId,
                username: targetUser[0].username,
                email: targetUser[0].email,
                role: targetEventParticipants[i].role,
                eventId: targetEventParticipants[i].eventId,
            } as MeetgridEventAdmin;

            result.push(currentAdmin);
        }
        return result;
    }

    async findByUserId(userId: string) {
        const targetEvents = await this.meetgridEventParticipantRepository.findByUserId(userId);
        return targetEvents;
    }

    async findByEventIdAndUserId(eventId: string, userId: string) {
        const targetEventParticipant = await this.meetgridEventParticipantRepository.findByEventIdAndUserId(eventId, userId);
        return targetEventParticipant;
    }

    async createOneEventParticipant(eventParticipantToCreate: MeetgridEventParticipant) {
        console.log("MeetgridEventParticipantService.createOneEventPartcipant: creating event participant")
        let targetEvent;
        if (eventParticipantToCreate.availabilityString === "" && eventParticipantToCreate.eventId) {
            const targetEventArray = await this.meetgridEventRepository.findById(eventParticipantToCreate.eventId);
            if (targetEventArray.length == 0) throw new Error("Event does not exist");
            
            targetEvent = targetEventArray[0];
            eventParticipantToCreate.availabilityString = this.generateAvailabilityString(new Date(targetEvent.startDate), new Date(targetEvent.endDate))
        }
        const createdEventParticipant = await this.meetgridEventParticipantRepository.createOne(eventParticipantToCreate);
        console.log("MeetgridEventParticipantService.createOneEventPartcipant: created event participant")

        const userId = eventParticipantToCreate.userId;
        const targetUsers = await this.userRepository.findUserByClerkId(userId);
        const targetUser = targetUsers[0];
        

        const mailOptions = {
            to: targetUser.email,
            subject: "New Activity: " + targetEvent!.name,
            text: "Dear Sir/Madam: \n\nYou have just added to " + targetEvent!.name + ". You can make changes and adjust the timing according to your availability through this link " + URL + "/event/" + eventParticipantToCreate.eventId + ". \n \nThanks! \n \nBest Regards, \nMeetGrid"
        } as EmailNotificationOptions;

        await this.emailService.sendEmailNotification(mailOptions);

        return createdEventParticipant;
    }

    async updateOneEventParticipant(eventParticipantToUpdate: MeetgridEventParticipant) {
        const updatedEventParticipant = await this.meetgridEventParticipantRepository.updateOne(eventParticipantToUpdate);
        return updatedEventParticipant;
    }

    async deleteOneEventParticipant(eventParticipantIdToDelete: string) {
        const deletedEventParticipant = await this.meetgridEventParticipantRepository.deleteOne(eventParticipantIdToDelete);
        return deletedEventParticipant;
    }

    generateAvailabilityString(startDate: Date, endDate: Date) {
        const lengthOfEvent = (+endDate - +startDate) / (1000 * 60 * 60 * 24) + 1;

        const availabilityArray = new Array(96);
        for (let timeInterval=0; timeInterval<96; timeInterval++) {
            availabilityArray[timeInterval] = new Array(lengthOfEvent);
            for (let days=0; days<lengthOfEvent; days++) {
                availabilityArray[timeInterval][days] = {};
            }
        }
        console.log("MeetgridEventParticipantService.generateAvailabilityString generated the following availability", availabilityArray);

        return JSON.stringify(availabilityArray);
    }
}