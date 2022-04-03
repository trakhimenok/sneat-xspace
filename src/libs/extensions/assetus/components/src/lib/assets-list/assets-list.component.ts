import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetType } from '@sneat/dto';
import { IAssetContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-assets-list',
	template: `
		<ion-item *ngIf="assets && !assets?.length" disabled>No items created yet</ion-item>
		<ion-item *ngIf="!assets" disabled>
			<ion-spinner slot="start" name="lines-small"></ion-spinner>
			<ion-label>Loading...</ion-label>
		</ion-item>
		<div *ngIf="assets?.length" class="last-child-no-border">
			<ion-item button (click)="goAsset(asset)" *ngFor="let asset of assets; trackBy: id">
				<ion-label>
					<h2>{{asset?.brief?.title}}</h2>
				</ion-label>
				<ion-badge *ngIf="asset?.dto?.yearOfBuild && ! asset?.brief?.regNumber" color="light"
									 style="font-weight: normal">{{asset?.dto?.yearOfBuild}}</ion-badge>
				<ion-badge *ngIf="asset?.brief?.regNumber" color="light"
									 style="font-weight: normal">{{asset?.brief?.regNumber}}</ion-badge>
				<ion-buttons slot="end">
					<!--				<ion-button (click)="add2Asset($event)">-->
					<!--					<ion-icon name="add"></ion-icon>-->
					<!--				</ion-button>-->
					<ion-button (click)="delete($event)">
						<ion-icon name="close-outline"></ion-icon>
					</ion-button>
				</ion-buttons>
			</ion-item>
		</div>
	`,
})
export class AssetsListComponent implements OnChanges {

	assets?: IAssetContext[];

	@Input() allAssets?: IAssetContext[];
	@Input() team?: ITeamContext;
	@Input() assetType?: AssetType;
	@Input() filter = '';

	public id = (_: number, asset: IAssetContext) => asset.id;

	ngOnChanges(changes: SimpleChanges): void {
		const { allAssets, assetType, filter } = this;
		if (!allAssets) {
			this.assets = undefined;
			return;
		}
		if (!allAssets.length) {
			this.assets = [];
			return;
			;
		}
		const f = filter?.toLowerCase();
		if (!allAssets || !filter && !assetType) {
			this.assets = [...allAssets];
		} else {
			this.assets = allAssets
				?.filter(asset => (!assetType || asset?.brief?.type === assetType) &&
					(!filter || (asset?.brief?.title?.toLowerCase().indexOf(f) || -1) >= 0));
		}
		this.assets = this.assets?.sort((a, b) => {
			if (a.brief && b.brief && a.brief.title > b.brief?.title) return 1;
			if (a.brief && b.brief && a.brief.title < b.brief?.title) return -1;
			return 0;
		});
		console.log('AssetsListComponent.ngOnChanges =>', this.assetType, this.team, 'allAssets:', this.allAssets, 'filtered assets:', this.assets);
	}

	public goAsset(asset: IAssetContext): void {
		if (!asset) {
			return;
		}
		let path: string;
		switch (asset?.brief?.type) {
			case 'vehicle':
				path = 'vehicle';
				break;
			case 'real_estate':
				path = this.team?.type === 'realtor' ? 'real-estate' : 'property';
				break;
			default:
				path = 'asset';
				break;
		}
		// this.navCtrl
		// 	.navigateForward(['space', this.team?.type, this.team?.id, 'asset', asset.id], {
		// 		state: { asset, team: this.team },
		// 	})
		// 	.catch(this.errorLogger.logError);
	}

	delete(event: Event): void {
		// this.as
	}

}
