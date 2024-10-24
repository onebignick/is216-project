import { BookingController } from "@/server/controller/BookingController";

const bookingController: BookingController = new BookingController()

export async function POST(request: Request) {
    return await bookingController.handleBookEventCreation(request);
}