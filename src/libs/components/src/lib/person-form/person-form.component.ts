import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import {
	AgeGroup,
	emptyRelatedPerson,
	Gender,
	IEmail,
	IName,
	IPersonRequirements,
	IPhone,
	IRelatedPerson, isEmptyName,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { RequiredOptions } from 'prettier';
import { GenderFormComponent } from './gender-form/gender-form.component';
import { NamesFormComponent } from './names-form/names-form.component';


interface show {
	readonly name: boolean;
	readonly nameNext?: boolean;
	readonly gender?: boolean;
	readonly ageGroup?: boolean;
	readonly roles?: boolean;
	readonly relatedAs?: boolean;
	readonly phones?: boolean;
	readonly emails?: boolean;
	readonly submitButton?: boolean;
}

@Component({
	selector: 'sneat-person-form',
	templateUrl: 'person-form.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class PersonFormComponent {

	@Input() requires: IPersonRequirements = {};
	@Input() team?: ITeamContext;
	@Input() disabled = false;
	@Input() hideRelationship = false;

	@Input() relatedPerson: IRelatedPerson = emptyRelatedPerson;
	@Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

	public isReadyToSubmit = false;
	@Output() readonly isReadyToSubmitChange = new EventEmitter<boolean>();

	public show: show = { name: true };

	public wizardStep: keyof show = 'name';

	@ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
	@ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;

	private readonly formOrder: readonly (keyof show)[] = [
		'name',
		'gender',
		'ageGroup',
		'relatedAs',
		// 'roles',
		'emails',
		'phones',
		'submitButton',
	];


	private showRestOfTheForm(): boolean {
		const p = this.relatedPerson;
		return !!p.ageGroup && (this.hideRelationship || !!p.relationship);
	}


	private setRelatedPerson(relatedPerson: IRelatedPerson, changedProp: { name: keyof show; hasValue: boolean }): void {
		this.relatedPerson = relatedPerson;
		this.relatedPersonChange.emit(relatedPerson);
		if (changedProp.hasValue) {
			this.openNext(changedProp.name);
		}
	}

	onNameChanged(name: IName): void {
		console.log('PersonFormComponent.onNameChanged()', name);
		if (!this.show.nameNext && !isEmptyName(name)) {
			this.show = {...this.show, nameNext: true};
		}
		this.setRelatedPerson(
			{ ...this.relatedPerson, name },
			{ name: 'name', hasValue: false },
		);
	}

	onGenderChanged(gender?: Gender): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, gender },
			{ name: 'gender', hasValue: !!gender },
		);
	}


	onAgeGroupChanged(ageGroup?: AgeGroup): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, ageGroup },
			{ name: 'ageGroup', hasValue: !!ageGroup },
		);
	}

	onEmailsChanged(emails: IEmail[]): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, emails },
			{ name: 'emails', hasValue: !!emails?.length },
		);
	}

	onPhoneChanged(phones: IPhone[]): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, phones },
			{ name: 'phones', hasValue: !!phones?.length },
		);
	}

	onRelationshipChanged(relationship: string): void {
		console.log('onRelationshipChanged()', relationship);
		this.setRelatedPerson(
			{ ...this.relatedPerson, relationship },
			{ name: 'relatedAs', hasValue: !!relationship },
		);
		if (!this.relatedPerson.ageGroup) {
			const relationship = this.relatedPerson.relationship;
			if (relationship === 'parent' || relationship === 'spouse' || relationship === 'partner' || relationship === 'grandparent') {
				this.setRelatedPerson(
					{ ...this.relatedPerson, ageGroup: 'adult' },
					{ name: 'relatedAs', hasValue: true },
				);
			} else if (relationship === 'child') {
				this.setRelatedPerson(
					{ ...this.relatedPerson, ageGroup: 'child' },
					{ name: 'relatedAs', hasValue: true },
				);
			}
		}
	}

	public nextFromName(event: Event): void {
		event.stopPropagation();

		if (!this.namesFormComponent) {
			throw Error('!namesFormComponent');
		}
		if (!this.namesFormComponent.namesForm) {
			throw Error('!namesFormComponent.namesForm');
		}

		this.namesFormComponent.namesForm.markAllAsTouched();
		if (!this.namesFormComponent.namesForm.valid) {
			alert('Problem with names: ' + JSON.stringify(this.namesFormComponent?.namesForm.errors));
			return;
		}
		this.openNext('name');
	}

	public openNext(changedPropName: keyof show): void {
		for (;;) {
			console.log('openNext()', changedPropName);
			const i = this.formOrder.indexOf(changedPropName);
			if (i < 0) {
				console.log(`openNext have not found ${changedPropName} in this.formOrder=${this.formOrder.join(',')}`);
				return;
			}
			if (i === this.formOrder.length - 1) {  // last element
				console.log('openNext reached last element')
				return;
			}
			const nextName = this.formOrder[i+1];
			if (this.requires[nextName as keyof IPersonRequirements] !== 'excluded') {
				if (!this.show[nextName]) {
					this.show = {...this.show, [nextName]: true};
					this.wizardStep = nextName;
				}
				break;
			}
			changedPropName = nextName;
		}
		if (this.show.submitButton) {
			this.isReadyToSubmit = true;
			this.isReadyToSubmitChange.emit();
		}
	}
}
