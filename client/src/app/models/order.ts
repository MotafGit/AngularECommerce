import { Product } from "./product"

export type Order = {
    id?: number
    orderPrice: number
    orderDate?: Date
    userId?: string
    userNavigation?: any
    orderProductsNavigation: Product[]

}

