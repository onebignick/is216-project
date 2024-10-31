import { SuccessCreateEventForm } from "@/components/successforms/success-create-event-form";

export default function SuccessCreateEvent() {
    return (
		<section className="my-5 grid grid-cols-12 h-full">
			<div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
				<SuccessCreateEventForm/>
			</div>
		</section>
    )
}