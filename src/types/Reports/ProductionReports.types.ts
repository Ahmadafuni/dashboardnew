interface QuantityDelivered {
  [key: string]: string;
}

interface ModelDetails {
  Color: string;
  Sizes: string;
  Quantity: {
    StageName: string;
    QuantityDelivered: QuantityDelivered;
  };
}

interface ModelStats {
  [key: string]: string;
}

interface OrderStats {
  [key: string]: string;
}

interface ModelData {
  Barcode: string | null;
  ModelId: number;
  ModelStats: ModelStats;
  ModelProgress: string;
  OrderId: number;
  OrderStats: OrderStats;
  OrderProgress: number;
  CollectionId: number;
  CollectionName: string;
  OrderName: string;
  ModelStatus: string;
  DemoModelNumber: string;
  ModelName: string;
  ProductCatalog: string;
  CategoryOne: string;
  CategoryTwo: string;
  Textiles: string;
  TotalDurationInDays: number;
  Details: ModelDetails[];
}

export interface ReportsType {
  status: number;
  message: string;
  totalPages: number;
  data: ModelData[];
}
