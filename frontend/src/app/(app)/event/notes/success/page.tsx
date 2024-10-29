import { SuccessNotesForm } from "@/components/successforms/success-create-notes-form";

export default function SuccessCreateNotes() {
    return (
		<section className="my-5 grid grid-cols-12">
			<div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
				<SuccessNotesForm/>
			</div>
		</section>
    )
}