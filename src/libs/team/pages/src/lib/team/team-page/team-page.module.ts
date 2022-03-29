import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	TeamComponentBaseParams,
	TeamComponentsModule,
	TeamMenuComponentModule,
	TeamPageContextModule,
} from '@sneat/team/components';
import { MembersComponent } from '../members/members.component';
import { MetricsComponent } from '../metrics/metrics.component';
import { RetrospectivesComponent } from '../retrospectives/retrospectives.component';
import { ScrumsComponent } from '../scrums/scrums.component';
import { TeamPageRoutingModule } from './team-page-routing.module';
import { TeamPageComponent } from './team-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TeamPageRoutingModule,
		TeamPageContextModule,
		TeamMenuComponentModule,
		TeamComponentsModule,
	],
	declarations: [
		MembersComponent,
		MetricsComponent,
		RetrospectivesComponent,
		ScrumsComponent,
		TeamPageComponent,
	],
	providers: [
		TeamComponentBaseParams,
	]
})
export class TeamPageModule {
}
