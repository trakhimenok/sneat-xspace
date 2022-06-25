import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderRouteCardModule } from '@sneat/extensions/express';
import { OrderContainersModule } from '../../components/order-containers-card';
import { FreightOrdersServiceModule } from '../../services/freight-orders.service';
import { NewExpressOrderPageComponent } from './new-express-order-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewExpressOrderPageComponent,
			},
		]),
		FreightOrdersServiceModule,
		OrderRouteCardModule,
		OrderContainersModule,
	],
	declarations: [
		NewExpressOrderPageComponent,
	],
})
export class NewExpressOrderPageModule {

}
