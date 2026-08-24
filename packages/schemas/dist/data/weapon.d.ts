import { z } from 'zod';
export declare const WeaponConfigSchema: z.ZodObject<{
    /** Stable registry key. Used to look the weapon up from inventories,
     *  pickups, and save data. Must be unique across the weapon registry. */
    id: z.ZodString;
    /** Human-readable display name for UI. */
    name: z.ZodString;
    /** Damage dealt per successful hit, in HP. */
    damage: z.ZodNumber;
    /** Shots per second. Fractional values are valid (0.5 == one shot
     *  every two seconds). The weapon system converts this into a
     *  cooldown at runtime. */
    fireRate: z.ZodNumber;
    /** Asset-registry key for the first-person / held model. Resolved by
     *  the renderer, never imported directly. */
    modelId: z.ZodString;
    /** Asset-registry key for the fire sound. The audio system resolves. */
    audioId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    modelId: string;
    id: string;
    name: string;
    damage: number;
    fireRate: number;
    audioId: string;
}, {
    modelId: string;
    id: string;
    name: string;
    damage: number;
    fireRate: number;
    audioId: string;
}>;
export type WeaponConfig = z.infer<typeof WeaponConfigSchema>;
//# sourceMappingURL=weapon.d.ts.map