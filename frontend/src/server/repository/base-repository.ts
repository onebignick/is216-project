export interface IBaseRepository<T> {
    getById(id: string): Promise<T[]>;
    getAll(): Promise<T[]>;
    createOne(item: T): Promise<{id: string}[]>;
    createMany(items: T[]): Promise<{id: string}[]>;
    updateOne(id: string, item: T): Promise<{id: string}[]>;
    deleteOne(id: string): Promise<T[]>;
    deleteMany(ids: string[]): Promise<T[]>;
}