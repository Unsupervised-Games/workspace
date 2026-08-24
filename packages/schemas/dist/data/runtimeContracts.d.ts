/** The QA wire protocol version. Mirror of @unsupervised/qa-input-ws'
 *  `HANDSHAKE_PROTOCOL_VERSION` — kept as a local constant because
 *  @unsupervised/schemas is the innermost layer and can't import the transport.
 *  Keep the two in sync; a mismatch is a contract bug. */
export declare const QA_WIRE_PROTOCOL_VERSION = 1;
export type RuntimeContractDirection = 
/** The engine emits it; the game's runtime loads it. */
'engine-to-runtime'
/** Exchanged both ways between the game and its QA parent. */
 | 'bidirectional';
export interface RuntimeContract {
    /** Stable id. */
    id: 'asset-manifest' | 'dialogue-script' | 'quest-def' | 'locale-bundle' | 'qa-wire';
    /** Current contract version. */
    version: number;
    /** The @unsupervised/schemas symbol(s) that define the shape. */
    schema: string;
    /** Where the artifact lives / how it's exchanged. */
    artifact: string;
    direction: RuntimeContractDirection;
    /** One-line description of what a runtime does with it. */
    summary: string;
}
export declare const RUNTIME_CONTRACTS: readonly RuntimeContract[];
/** Look up a contract by id. */
export declare function getRuntimeContract(id: RuntimeContract['id']): RuntimeContract | undefined;
//# sourceMappingURL=runtimeContracts.d.ts.map