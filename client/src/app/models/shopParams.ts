import { BaseParams } from "./baseParams"



export class ShopParams extends BaseParams {
    brands: string[] = []
    types: string[] = []
    override sort = 'name'
    includes = "TypeNavigation,BrandNavigation"
}