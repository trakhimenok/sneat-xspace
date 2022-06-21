import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule } from '@sneat/auth';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { ExpressTeamMenuItemsModule } from '../express-team-menu-items/express-team-menu-items.module';
import { ExpressTeamMenuComponent } from './express-team-menu.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemModule,
		TeamsMenuComponentModule,
		ExpressTeamMenuItemsModule,
	],
	declarations: [
		ExpressTeamMenuComponent,
	],
	exports: [
		ExpressTeamMenuComponent,
	],
})
export class ExpressTeamMenuModule {

}
