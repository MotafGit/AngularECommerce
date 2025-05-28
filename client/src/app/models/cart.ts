export type CartType = {
    id: string ;
    items: CartItem[];
    deliveryMethodID?: number
    clientSecret?: string
    paymentIntentId?: string
    // public List<Payment> Payments { get; set; } = [];

}


export type CartItem = {
    productId?: number
    productName: string
    price: number
    quantity: number
    pictureUrl: string
    brandId: number
    typeId: number
    brand: string
    type: string
    // typeNavigation: any; 
    // brandNavigation: any; 
}

export class Cart implements CartType{
    id = "0"
    items: CartItem[] = []
}

