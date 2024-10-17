export default function EventPage({params}: {params: {eventId:string}}) {
    return (
        <div>{params.eventId}</div>
    )
}