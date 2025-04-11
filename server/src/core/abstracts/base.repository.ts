import {
    Document,
    Model,
    FilterQuery,
    UpdateQuery,
    DeleteResult,
    Types,
    UpdateWriteOpResult,
    Query,
    QueryOptions,
  } from 'mongoose';
  import { IBaseRepository } from '../interfaces/repository/IBaseRepository'; 
  
  export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    constructor(protected model: Model<T>) {}
  
    async findById(id: Types.ObjectId): Promise<T | null> {
      return this.model.findById(id)
    }
  
    async findByIdAndUpdate(id: Types.ObjectId, update: UpdateQuery<T>,options: QueryOptions = { upsert: true, new: true }): Promise<T | null> {
      return this.model.findByIdAndUpdate(id, update, { upsert: true, new: true });
    }
  
    async findAll(): Promise<T[]> {
      return this.model.find();
    }
  
    async create(data: Partial<T>): Promise<T> {
      const document = new this.model(data);
      return document.save();
    }
  
    async update(id: Types.ObjectId, data: Partial<T>): Promise<T | null> {
      return this.model.findByIdAndUpdate(id, data, { new: true });
    }
  
    async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
      return this.model.updateOne(filter, update);
    }
  
    async delete(id: Types.ObjectId): Promise<T | null> {
      return this.model.findByIdAndDelete(id);
    }
  
    async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
      return this.model.deleteOne(filter);
    }
  
    find(filter: FilterQuery<T>): Query<T[], T> {
      return this.model.find(filter);
    }
  
    findOne(filter: FilterQuery<T>): Query<T | null, T> {
      return this.model.findOne(filter);
  }
  
    async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>,options: QueryOptions = { upsert: true, new: true }): Promise<T> {
      return this.model.findOneAndUpdate(filter, update, { upsert: true, new: true });
    }
  
    async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
      return this.model.findOneAndDelete(filter);
    }

    async countDocuments(filter: FilterQuery<T>): Promise<number> {
      return this.model.countDocuments(filter);
    }


    async findByIdAndDelete(id: string): Promise<T | null> {
      return this.model.findByIdAndDelete(id);
    }
    
  }