import { NotesForm } from "@/components/forms/create-notes-form";

export default function CreateNotesForm() {
    return (
		<section className="my-5 grid grid-cols-12">
			<div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
				<NotesForm/>
			</div>
		</section>
    )
}