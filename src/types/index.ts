export interface JsonResponse {
  [key: string]: any;
}

export interface IGenericRepository<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, updateData: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void | null>;
}