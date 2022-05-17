import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import { AgeGroup, emptyPersonBase, Gender, IMyPerson } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';


@Component({
	selector: 'sneat-person-form',
	templateUrl: 'person-form.component.html',
	animations: [
		formNexInAnimation,
	]
})
export class PersonFormComponent {

	@Input() team?: ITeamContext;
	@Input() disabled = false;

	@Input() myPerson: IMyPerson = emptyPersonBase;
	@Output() readonly myPersonChange = new EventEmitter<IMyPerson>();

	showGender = false;
	showPersonProps = false;
	showRoles = false;

	isReady = false;

	get showRelationship() {
		return this.myPerson.gender && this.myPerson.ageGroup;
	};

	get showPhones() {
		return this.myPerson.relationship;
	};
	get showEmails() {
		return this.myPerson.relationship;
	};


	private setMyPerson(myPerson: IMyPerson): void {
		this.myPerson = myPerson;
		this.myPersonChange.emit(myPerson);
	}

	onGenderChanged(gender?: Gender): void {
		this.setMyPerson({...this.myPerson, gender});
		this.showPersonProps = true;
	}

	onAgeGroupChanged(ageGroup?: AgeGroup): void {
		this.setMyPerson({...this.myPerson, ageGroup});
	}

	onRelationshipChanged(relationship: string): void {
		console.log('onRelationshipChanged()', relationship);
		this.setMyPerson({...this.myPerson, relationship});
		if (!this.myPerson.ageGroup) {
			const relationship = this.myPerson.relationship;
			if (relationship === 'parent' || relationship === 'spouse' || relationship === 'partner' || relationship === 'grandparent') {
				this.setMyPerson({...this.myPerson, ageGroup: 'adult'});
			} else if (relationship === 'child') {
				this.setMyPerson({...this.myPerson, ageGroup: 'child'});
			}
		}
	}

	// public nextFromName(event: Event): void {
	// 	if (!this.namesFormComponent?.namesForm.valid) {
	// 		alert('Problem with names: ' + JSON.stringify(this.namesFormComponent?.namesForm.errors));
	// 		return;
	// 	}
	// 	setTimeout(() => {
	// 		const setFocus = this.genderFirstInput?.setFocus;
	// 		if (setFocus) {
	// 			setFocus(event)
	// 				.catch(this.errorLogger.logErrorHandler('failed to set focus to gender'));
	// 		}
	// 	}, 500);
	// }

}
