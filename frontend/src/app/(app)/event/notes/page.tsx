import { NotesDisplay } from "@/components/notes/view-notes";

export default function CreateNotesForm() {
    return (
		<section className="my-5 grid grid-cols-12">
			<div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8">
				<NotesDisplay/>
			</div>
		</section>
    )
}