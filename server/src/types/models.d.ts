type TypeEntity = {
  id: number;
  name: string;
  brands?: BrandEntity[];
};

type BrandEntity = {
  id: number;
  name: string;
  types?: TypeEntity[];
};

interface TourAttributes {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface TravelAttributes {
  id: string;
  name: string;
  description: string;
  slug: string;
  is_public: boolean;
  number_of_days: number;
  tours: Array<TourAttributes>;
  created_at: Date;
  updated_at: Date;
}
