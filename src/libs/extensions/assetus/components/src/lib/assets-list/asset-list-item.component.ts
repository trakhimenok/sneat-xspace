import { Component, Inject, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AssetType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAssetContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-asset-list-item',
	template: `

	`,
})
export class AssetListItemComponent {

	@Input() team?: ITeamContext;
	@Input() assetType?: AssetType;
	@Input() asset?: IAssetContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
		// private readonly assertService: AssertSer
	) {
	}

}
