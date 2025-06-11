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
    avgScore?: number
    typeNavigation: any;
    brandNavigation: any;
    reviews?: any
}