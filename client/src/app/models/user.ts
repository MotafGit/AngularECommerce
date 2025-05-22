export type User = {
    firstName: string
    lastName: string
    email: string
    address: Address
    cartID: string
}

export type Address = {
    line1: string
    line2: string
    city: string
    district: string
    country: string
    postalCode: string

}