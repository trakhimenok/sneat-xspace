import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { dateToIso } from '@sneat/core';
import {
	IHappeningSlotUiItem,
	jsDayToWeekday,
	NewHappeningParams,
	ScheduleNavService,
	sortSlotItems,
	WeekdayNumber,
} from '@sneat/extensions/schedulus/shared';
import { ITeamContext } from '@sneat/team-models';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
	emptyScheduleFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../schedule-slots';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-day',
	templateUrl: './calendar-day.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent implements OnChanges, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private slotsSubscription?: Subscription;
	private filter = emptyScheduleFilter;
	// @Input() filter?: ICalendarFilter;
	// @Input() showRegulars = true;
	@Input() team: ITeamContext = { id: '' };
	// @Input() showEvents = true;
	@Input() weekday?: Weekday;
	@Output() readonly slotClicked = new EventEmitter<{
		slot: IHappeningSlotUiItem;
		event: Event;
	}>();
	public allSlots?: IHappeningSlotUiItem[];
	public slots?: IHappeningSlotUiItem[];
	public slotsHiddenByFilter?: number;

	constructor(
		private readonly filterService: CalendarFilterService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		filterService.filter.subscribe({
			next: (filter) => {
				this.filter = filter;
				this.applyFilter();
			},
		});
	}

	protected readonly slotID = (_: number, o: IHappeningSlotUiItem) => o.slotID;

	resetFilter(event: Event): void {
		event.stopPropagation();
		this.filterService.resetScheduleFilter();
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(this.logPrefix() + '.ngOnChanges()', changes);
		if (changes['weekday']) {
			this.subscribeForSlots();
		}
	}

	readonly index = (i: number): number => i;

	private applyFilter(): void {
		if (this.allSlots?.length) {
			this.slots = this.allSlots
				.filter((slot) => isSlotVisible(this.team?.id, slot, this.filter))
				.sort(sortSlotItems);
			this.slotsHiddenByFilter = this.allSlots.length - this.slots.length;
			console.log(
				this.logPrefix() + '.applyFilter() =>',
				'slotsHiddenByFilter:',
				this.slotsHiddenByFilter,
				'filter:',
				this.filter,
				'slots before filter:',
				this.allSlots,
				'slots after filter:',
				this.slots,
			);
		} else {
			// console.log(this.logPrefix() + '.applyFilter() for empty slots');
			this.slots = this.allSlots;
			this.slotsHiddenByFilter = this.allSlots?.length;
		}
		this.changeDetectorRef.markForCheck();
	}

	private subscribeForSlots(): void {
		this.slotsSubscription?.unsubscribe();
		if (this.weekday?.day) {
			console.log(
				`ScheduleDayComponent[wd=${this.weekday?.id}, dateID=${this.weekday?.day?.dateID}].subscribeForSlots()`,
			);
			this.slotsSubscription = this.weekday.day.slots$
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: this.processSlots,
				});
		} else {
			this.slots = undefined;
			this.slotsHiddenByFilter = undefined;
		}
	}

	private readonly processSlots = (slots?: IHappeningSlotUiItem[]) => {
		console.log(this.logPrefix() + `.processSlots(), slots:`, slots);
		this.allSlots = slots;
		this.applyFilter();
	};

	private readonly logPrefix = () =>
		`ScheduleDayComponent[wd=${this.weekday?.id}, dateID=${this.weekday?.day?.dateID}]`;

	goNewHappening(params: NewHappeningParams): void {
		if (!this.team) {
			return;
		}
		const date = this.weekday?.day?.date;
		if (!date) {
			return;
		}
		params = {
			...params,
			wd: jsDayToWeekday(date.getDay() as WeekdayNumber),
			date: dateToIso(date),
		};
		console.log('ScheduleDayComponent.goNewHappening()', date, params);
		this.scheduleNavService.goNewHappening(this.team, params);
	}
}
