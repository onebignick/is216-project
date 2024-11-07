import { eq } from "drizzle-orm";
import { db } from "../db";
import { booking,event } from "../db/schema";
import { MeetgridBookEvent } from "../entity/booking";
import { IBaseRepository } from "./base-repository";

export class BookEventRepository implements IBaseRepository<MeetgridBookEvent> {
    async getById(id: string): Promise<MeetgridBookEvent[]> {
        const result = await db.query.booking.findMany({
            with: {
                id: id
            },
        });
        return result
    }

    async getAll(): Promise<MeetgridBookEvent[]> {
        const result = await db.query.booking.findMany();
        return result;
    }

    // async getAllBookEventsOrganizedByUser(userId: string): Promise<MeetgridBookEvent[]> {
    //     const result = await db.query.booking.findMany({
    //         where: eq(booking.participantId, userId)
    //     });
    //     return result;
    // }

    async getAllBookEventsJoinByUser(userId: string): Promise<MeetgridBookEvent[]> {
        const result = await db
            .select()
            .from(booking)
            .innerJoin(event, eq(booking.eventCode, event.eventCode))  // Join booking and event by eventCode
            .where(eq(booking.participantId, userId));  // Ensure the participant is the user
        
        // Map over the result and transform the data into the correct MeetgridBookEvent format
        const bookedEvents: MeetgridBookEvent[] = result.map(row => {
            const event = row.event;
            const booking = row.booking;
    
            // Return the transformed event and booking data
            return {
                id: booking.id,
                participantName: booking.name,
                name: event.name,                     // Event name
                date: event.startDate,                // Event start date (if that's what's needed)
                startTime: booking.startTime,         // Booking's start time
                description: event.description,
                endTime: booking.endTime,             // Booking's end time
                notes: booking.notes || '',           // Notes from the booking, if available
                status: booking.status || '',         // Status from the booking, if available
                participantId: booking.participantId, // Participant ID
                eventCode: event.eventCode,            // Event code from the event
                backgroundColor: booking.backgroundColor,
                textColor: booking.textColor,
                borderColor: booking.borderColor,
                type: "attendee"
            };
        });
    
        return bookedEvents;
    }


    async getAllBookEventsOrganizedByUser(userId: string): Promise<MeetgridBookEvent[]> {
        const result = await db
            .select()
            .from(booking)
            .innerJoin(event, eq(booking.eventCode, event.eventCode))  // Join booking and event by eventCode
            .where(eq(event.createdBy, userId));  // Ensure the participant is the user
    
        // Map over the result and transform the data into the correct MeetgridBookEvent format
        const bookedEvents: MeetgridBookEvent[] = result.map(row => {
            const event = row.event;
            const booking = row.booking;
    
            // Return the transformed event and booking data
            return {
                id: booking.id,
                participantName: booking.name,
                name: event.name,                     // Event name
                date: event.startDate,                // Event start date (if that's what's needed)
                startTime: booking.startTime,         // Booking's start time
                description: event.description,
                endTime: booking.endTime,             // Booking's end time
                notes: booking.notes || '',           // Notes from the booking, if available
                status: booking.status || '',         // Status from the booking, if available
                participantId: booking.participantId, // Participant ID
                eventCode: event.eventCode,            // Event code from the event
                backgroundColor: booking.backgroundColor,
                textColor: booking.textColor,
                borderColor: booking.borderColor,
                type: "organizer"
            };
        });
    
        return bookedEvents;
    }
    
    async createOne(item: MeetgridBookEvent): Promise<{id: string}[]> {
        // Generate random colors
        const backgroundColor = this.getRandomColor();
        const borderColor = this.getRandomColor();
        const textColor = this.isLightColor(backgroundColor) ? '#000000' : '#ffffff'; // Adjust text color based on luminance
        
        // Prepare the item with the color properties
        const newItem = {
            ...item,
            backgroundColor,
            borderColor,
            textColor
        };
        
        // Insert the new item into the database
        const result: {id: string}[] = await db.insert(booking).values(newItem).returning();
        
        return result;
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


    async createMany(items: MeetgridBookEvent[]): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.insert(booking).values(items).returning();
        return result;
    }

    async updateOne(id: string, item: MeetgridBookEvent): Promise<{id: string}[]> {
        const result: {id: string}[] = await db.update(booking).set(item).where(eq(booking.id, id)).returning();
        return result;
    }
    
    // Method to get an event by its unique code
    async getEventByCode(eventCode: string): Promise<MeetgridBookEvent[]> {
        const results = await db.query.booking.findMany({
            where: eq(booking.eventCode, eventCode) // Assuming 'code' is a field in your event schema
        });
        return results;
    }
    
    // todo delete logic
    async deleteOne(id: string): Promise<MeetgridBookEvent[]> {
        try {
            const result = await db.delete(booking).where(eq(booking.id, id)).returning();
    
            if (result.length === 0) {
                throw new Error(`Booking Event with id ${id} not found`);
            }
    
            console.log(`Booking Event with id: ${id} deleted successfully.`);
            return result;
        } catch (error) {
            console.error(`Error deleting book event with id ${id}:`, error.message);
            throw new Error("An error occurred while deleting the book event");
        }
    }

    async deleteMany(ids: string[]): Promise<MeetgridBookEvent[]> {
        console.log(ids);
        return []
    }
}