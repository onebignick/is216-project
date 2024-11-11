export default function InterviewNotesPage({ params } : { params: { interviewId: string }}) {
    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            Hello world {params.interviewId}
        </div>
    );
}