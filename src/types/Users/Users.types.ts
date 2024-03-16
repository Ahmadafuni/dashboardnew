type DepartmentType = {
  Name: string;
  CategoryName: string;
};

type WarehouseType = {
  WarehouseName: string;
  CategoryName: string;
};

export type UserType = {
  Id: number;
  Firstname: string;
  Lastname: string;
  Username: string;
  Email: string;
  Role: string;
  PhoneNumber: string;
  Department: DepartmentType | null;
  Warehouse: WarehouseType | null;
  IsActive: boolean;
  PhotoPath: string;
};
