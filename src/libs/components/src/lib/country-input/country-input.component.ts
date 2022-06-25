import { Component, EventEmitter, Input, Output } from '@angular/core';
import { of } from 'rxjs';
import { countries, ICountry } from '../country-selector/countries';
import { ISelectorOptions } from '../selector';


@Component({
	selector: 'sneat-country-input',
	templateUrl: './country-input.component.html',
})
export class CountryInputComponent {
	@Input() canReset = true;
	@Input() label = 'Country';
	@Input() countryID = '';
	@Output() countryIDChange = new EventEmitter<string>();

	readonly countries = countries;

	// constructor(
	// 	// private readonly countrySelectorService: CountrySelectorService,
	// ) {
	// }

	public onCountryChanged(event: Event): void {
		console.log('CountryInputComponent.onCountryChanged()', this.countryID);
		this.countryIDChange.emit(this.countryID);
	}

	reset(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.countryID = '';
		this.countryIDChange.emit('');
	}

	protected openCountrySelector(event: Event): void {
		const options: ISelectorOptions<ICountry> = {
			items: of(countries),
		};
		// this.countrySelectorService
		// 	.selectSingleInModal(options)
		// 	.then();
	}
}
