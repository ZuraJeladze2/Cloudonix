export interface Product {
    id: number
    name: string
    description: string
    sku: string
    cost: number
    profile: {
        type: profileType,
        available?: boolean,
        backlog?: number
    }
}
type profileType = 'furniture' | 'equipment' | 'stationary' | 'part'