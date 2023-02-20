import { Directive, Inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import {
	IContainerPoint,
	IContainerSegment,
	IExpressOrderContext,
	IFreightLoad,
	IOrderContainer,
	IOrderShippingPoint,
} from '../dto';
import { ExpressOrderService } from '../services';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPageBaseComponent extends TeamBaseComponent {
	protected order?: IExpressOrderContext;
	numberOfDispatchers?: number;

	constructor(
		@Inject(new InjectionToken('className')) className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly orderService: ExpressOrderService,
	) {
		super(className, route, teamParams);
		route.paramMap
			// .pipe(
			// 	takeUntil(this.destroyed),
			// )
			.subscribe(params => {
				this.order = { id: params.get('orderID') || '', team: { id: params.get('teamID') || '' } };
				if (this.team?.id && this.order?.id) {
					this.orderService
						.watchOrderByID(this.team.id, this.order.id)
						.subscribe({
							next: order => {
								this.setOrder(order);
								this.order = order;
							},
							error: this.errorLogger.logErrorHandler('failed to load order'),
						});
				}
			});
	}

	private setOrder(order: IExpressOrderContext): void {
		this.order = order;
		console.log('setOrder', order);
		this.numberOfDispatchers = order?.dto?.counterparties?.filter(c => c.role === 'dispatcher').length;
		this.onOrderChanged(order);
	}

	protected onOrderChanged(order: IExpressOrderContext): void {
		// override this method to handle order changes
	}
}
