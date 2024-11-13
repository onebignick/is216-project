export interface BaseRepository<TData, TId> {
    findAll() : Promise<TData[]>;
    findById(id: TId) : Promise<TData[]>;
    createOne(itemToCreate: TData): Promise<TData[]>;
    updateOne(itemToUpdate: TData) : Promise<TData[]>;
    deleteOne(itemIdToDelete: TId) : Promise<TData[]>;
}