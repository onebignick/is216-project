export interface IUser {
    id: string;
    clerkUserId: string | null;
    username: string | null;
    firstname: string | null;
    lastname: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}