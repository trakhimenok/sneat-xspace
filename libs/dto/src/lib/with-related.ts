import { IWithCreatedShort } from './dto-with-modified';

export interface ITeamModuleDocRef {
	readonly teamID: string;
	readonly moduleID: string;
	readonly collection: string;
	readonly itemID: string;
}

export interface IRelationship {
	created: IWithCreatedShort;
}

export type IRelationships = Readonly<Record<string, IRelationship>>;

export interface IRelatedItemKey {
	readonly teamID: string;
	readonly itemID: string;
}

export interface IRelatedItem {
	keys: readonly IRelatedItemKey[];
	readonly relatedAs?: IRelationships; // if related contact is a child of the current contact, then relatedAs = {"child": ...}
	readonly relatesAs?: IRelationships; // if related contact is a child of the current contact, then relatesAs = {"parent": ...}
}

export type IRelatedItemsByCollection = Readonly<
	Record<string, IRelatedItem[]>
>;

export type IRelatedItemsByModule = Readonly<
	Record<string, IRelatedItemsByCollection>
>;

export function getRelatedItems(
	moduleId: string,
	collectionId: string,
	related?: IRelatedItemsByModule,
): readonly IRelatedItem[] {
	return (related && related[moduleId]?.[collectionId]) || [];
}

export interface IWithRelatedOnly {
	readonly related?: IRelatedItemsByModule;
}

export interface IWithRelatedAndRelatedIDs extends IWithRelatedOnly {
	readonly relatedIDs?: readonly string[];
}

export const addRelatedItem = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	teamID: string,
	itemID: string,
) => {
	related = related || {};
	let collectionRelated = related[module] || {};
	let relatedItems = collectionRelated[collection] || {};
	if (!hasRelatedItemID(related, module, collection, teamID, itemID)) {
		relatedItems = [...(relatedItems || []), { keys: [{ teamID, itemID }] }];
		collectionRelated = { ...collectionRelated, [collection]: relatedItems };
		related = { ...related, [module]: collectionRelated };
	}
	return related;
};

export const getRelatedItemByKey = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	teamID: string,
	itemID: string,
): IRelatedItem | undefined => {
	if (!related) {
		return undefined;
	}
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection];
	return relatedItems.find((i) =>
		i.keys.some((k) => k.teamID === teamID && k.itemID === itemID),
	);
};

export const getRelatedItemIDs = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	teamID?: string,
): readonly string[] => {
	if (!related) {
		return [];
	}
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection];
	const itemIDs = relatedItems
		?.map((i) =>
			i.keys.filter((k) => !teamID || k.teamID === teamID).map((k) => k.itemID),
		)
		?.flat();
	return itemIDs || [];
};

export const hasRelatedItemID = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	teamID: string,
	itemID: string,
): boolean => {
	if (!related) {
		return false;
	}
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection] || {};
	return !relatedItems.some((i) =>
		i.keys.some((k) => k.itemID === itemID && k.teamID === teamID),
	);
};
