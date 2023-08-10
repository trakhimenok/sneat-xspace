import { Component, Inject, Input } from '@angular/core';
import { ContactRole, IContactBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { IBriefAndID, IContactContext, zipMapBriefsWithIDs } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';

@Component({
	selector: 'sneat-contacts-list-item',
	templateUrl: './contacts-list-item.component.html',
	styleUrls: ['./contacts-list-item.component.scss'],
})
export class ContactsListItemComponent {

	@Input() excludeRole?: ContactRole;
	@Input() contact?: IContactContext;
	@Input() showAddress = false;

	protected get relatedContacts(): readonly IBriefAndID<IContactBrief>[] {
		return zipMapBriefsWithIDs(this.contact?.dto?.relatedContacts);
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamNavService: TeamNavService,
		private readonly contactService: ContactService,
	) {
	}

	@Input() goContact = (contact?: IContactContext): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		this.teamNavService.navigateForwardToTeamPage(contact.team, `contact/${contact.id}`, {
			state: { contact },
		}).catch(this.errorLogger.logErrorHandler('failed to navigate to contact page'));
	};

	@Input() goMember: (memberId: string, event: Event) => void = () => void 0;

	archiveContact(): void {
		console.log('ContactListItemComponent.removeContact()');
		if (this.contact?.id) {
			this.contactService.setContactsStatus('archived', this.contact.team.id, [this.contact])
				.subscribe({
					next: () => {
						console.log('ContactListItemComponent.removeContact() => done');
					},
					error: this.errorLogger.logError,
				});
		}
	}

	id(i: number, record: { id: string }): string {
		return record.id;
	}
}
