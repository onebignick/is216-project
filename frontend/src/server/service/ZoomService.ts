const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;

export class ZoomService {

    async createZoomMeeting(startDateTime: string, agenda: string, topic: string, duration: number) {

        const bearerToken = await this.getBearerToken();

        const createMeetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + bearerToken,
            },
            body: JSON.stringify({
                "agenda": agenda,
                "default_password": false,
                "duration": duration,
                "settings": {
                    "start_time": startDateTime,
                    "timezone": "Asia/Singapore",
                    "topic": topic
                }
            })
        })

        const createdMeeting = await createMeetingResponse.json();
        return createdMeeting;
    }

    async getBearerToken() {
        const basicEncodedToken = btoa(ZOOM_CLIENT_ID + ":" + ZOOM_CLIENT_SECRET);
        const bearerTokenResponse = await fetch("https://zoom.us/oauth/token?" + new URLSearchParams({
            grant_type: "account_credentials",
            account_id: ZOOM_ACCOUNT_ID
        }), {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + basicEncodedToken,
            }
        })
        const { access_token } = await bearerTokenResponse.json()
        return access_token;
    }
}