import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MemberRemovalPageComponent} from './member-removal-page.component';

const routes: Routes = [
	{
		path: '',
		component: MemberRemovalPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [MemberRemovalPageComponent]
})
export class MemberRemovalPageModule {
}
