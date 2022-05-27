export type TeamItem = 'happening' | 'contact' | 'document' | 'asset' | 'list';

export interface INavContext<Brief, Dto> {
	readonly id: string;
	readonly brief?: Brief | null;
	readonly dto?: Dto | null;
}
