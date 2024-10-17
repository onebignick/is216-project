export type User = {
    id?: string;
    clerkUserId: string | null;
    username: string | null;
    firstname: string | null;
    lastname: string | null;
    createdAt?: Date;
    updatedAt?: string | null;
}