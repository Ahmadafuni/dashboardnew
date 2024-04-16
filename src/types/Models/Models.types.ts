import {OrderType} from "@/types/Orders/Orders.types.ts";
import {ProductCatalogueType} from "@/types/ProductCatalogues/ProductCatalogues.types.ts";
import {ProductCategoryOneType} from "@/types/Entities/ProductCategoryOne.types.ts";
import {TextilesType} from "@/types/Entities/Textiles.types.ts";
import {TemplateType} from "@/types/Templates/Templates.types.ts";
import {SizeType} from "@/types/Entities/Size.types.ts";
import {ColorType} from "@/types/Entities/Color.types.ts";

export type ModelTypes = {
    Id: number;
    OrderID: OrderType;
    ProductCatalogID: ProductCatalogueType;
    CategoryOne: ProductCategoryOneType;
    CategoryTwo: ProductCategoryOneType;
    Textile: TextilesType;
    TemplateID: TemplateType;
    TotalQuantity: number;

    Sizes: SizeType;  // can select many sizes  M L XL
    Colors: ColorType; // can select many colors  Red Black

    ModelNumber: string; // generated from Backend but the user can change it
    ModelNumberTest: string;
    ModelName: string; // generated from Backend =ProductCatalogName + CategoryOneName   but the user can change it
    Quantity: number;

    Characteristics: string;
    Barcode: string;
    LabelType: string;
    PrintName: string;
    PrintLocation: string;
    Images: string; // I want to store many images
    Status: string; // From backend
    Description: string;
};


