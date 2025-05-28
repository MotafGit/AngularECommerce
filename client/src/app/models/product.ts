export type Product = {
    id?: number 
    name: string
    description: string
    price: number
    pictureUrl: string
    typeId: number
    brandId: number
    quantity: number
    quantityInStock: number
    isProduct: boolean
    typeNavigation: any;
    brandNavigation: any;
}