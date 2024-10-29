
export function SuccessNotesForm() {

    return (
        <div className="flex justify-center min-h-screen">
            <div className="flex flex-col items-center p-2">
                <div className="flex flex-col items-center text-3xl text-green-500 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <br />
                    <h1>You have Successfully Added Notes for an event</h1>
                    
                </div>
                <div className="absolute bottom-0 right-4 bg-[#99DDCD] p-3 rounded-full">
                    <p>See More at Your Events</p>
                </div>
            </div>
        </div>
    );
}
