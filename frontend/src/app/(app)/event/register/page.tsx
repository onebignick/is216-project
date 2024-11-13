import { RegisterEventForm } from "@/components/forms/register-event-form";
import { PopUpEffect } from "@/components/ui/pop-up";

export default function Event() {
    return (
        <section className="my-5 grid grid-cols-12">
            <div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-10">
				<PopUpEffect words={[{ text: "Looking for an interview?" }]} />
                </h1>

                <RegisterEventForm />
            </div>
        </section>
    );
}
