export interface Product {
    id: number
    name: string
    description: string
    sku: string
    cost: number
    profile: {
        type: profileType,
        available: boolean,
        backlog: number | undefined
        customProperties?: Array<{ key: string; value: string }>;
    }
}
export const PROFILE_TYPES = ['furniture', 'equipment', 'stationary', 'part'] as const
export type profileType = typeof PROFILE_TYPES[number]