import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

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
            <Button type="submit">
                Search
            </Button>

            This will be the event page sidebar
        </div>
    )
}

function MainEventPage() {
    return (
        
        
        <div>
            <h2 style={{ fontWeight: 'bold', fontSize: '2.2rem', marginBottom: '1rem' }}>Calendar (Current Month)
            </h2>
            This will be the main event page
        </div>
        
        
    )
}