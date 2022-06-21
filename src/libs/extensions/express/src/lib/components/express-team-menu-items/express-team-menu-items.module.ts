import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule } from '@sneat/auth';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { ExpressTeamMenuItemsComponent } from './express-team-menu-items.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemModule,
		TeamsMenuComponentModule,
	],
	declarations: [
		ExpressTeamMenuItemsComponent,
	],
	exports: [
		ExpressTeamMenuItemsComponent,
	],
})
export class ExpressTeamMenuItemsModule {

}
