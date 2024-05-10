export interface Dict {
  [key: string]: any;
}

export interface BrandAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  types?: TypeAttributes[];
}
export interface TypeAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  brands?: BrandAttributes[];
}
