import { Input } from "@/components/ui/input"

export default function Event() {
    return (
        <div className="p-4 flex gap-4">
            <EventPageSidebar/>
            <MainEventPage/>
        </div>
    )
}

function EventPageSidebar() {
    return (
        <div>
            <Input
                placeholder="Search Events"
            />
            <button>
                Search
            </button>
            This will be the event page sidebar
        </div>
    )
}

function MainEventPage() {
    return (
        <div>
            This will be the main event page
        </div>
    )
}