export default function cancelInterviewForm({ params } : { params: { interviewId: string }}) {
    return <p>{params.interviewId}</p>
}