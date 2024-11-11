import { InterviewAnswerForm } from "@/components/forms/IntervewAnswerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetgridEventRegistrantService } from "@/server/service/MeetgridEventRegistrantService";
import { MeetgridQuestionService } from "@/server/service/MeetgridQuestionService";


export default async function InterviewNotesPage({ params } : { params: { interviewId: string }}) {
    const meetgridEventRegistrantService: MeetgridEventRegistrantService = new MeetgridEventRegistrantService()
    const meetgridQuestionService: MeetgridQuestionService = new MeetgridQuestionService();

    const currentInterview = await meetgridEventRegistrantService.findById(params.interviewId);
    const eventQuestions = await meetgridQuestionService.findByEvent(currentInterview[0].eventId!)
    console.log(eventQuestions)

    return (
        <div className="grid grid-cols-12 gap-4 p-4">
            <Card className="col-span-12">
                <CardHeader>
                    <CardTitle>Responses for {currentInterview[0].participantEmail}</CardTitle>
                </CardHeader>

                <CardContent>
                    <InterviewAnswerForm questions={eventQuestions} interviewId={currentInterview[0].id}/>
                </CardContent>
            </Card>
        </div>
    );
}