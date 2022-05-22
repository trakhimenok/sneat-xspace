import { Component, Inject, Input, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TeamType } from '@sneat/auth-models';
import { getMemberTitle } from '@sneat/components';
import { excludeEmpty, excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreatePersonalInviteRequest,
	ICreatePersonalInviteResponse,
	IMemberContext, InviteChannel,
	ITeamContext,
} from '@sneat/team/models';
import { InviteService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

@Pipe({ name: 'encodeSmsText' })
export class EncodeSmsText implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(text: string): string | undefined {
		return encodeURIComponent(text);
	}
}

@Component({
	selector: 'sneat-invite-modal',
	templateUrl: 'invite-modal.component.html',
})
export class InviteModalComponent {
	@Input() team?: ITeamContext;
	@Input() member?: IMemberContext;

	tab: InviteChannel = 'email';
	link?: string;
	error?: string;

	creatingInvite = false;

	readonly email = new FormControl('', Validators.required);
	readonly phone = new FormControl('', Validators.required);
	readonly message = new FormControl('');

	readonly emailForm = new FormGroup({
		email: this.email,
		message: this.message,
	});

	readonly smsForm = new FormGroup({
		phone: this.phone,
		message: this.message,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly toastController: ToastController,
		private readonly inviteService: InviteService,
	) {

	}

	async close(): Promise<void> {
		await this.modalController.dismiss();
	}

	getInviteText(invite: { id: string; pin?: string }): string {
		if (!this.member) {
			throw new Error('!this.member');
		}
		const receiver = getMemberTitle(this.member);
		let m = `Hi ${receiver}, please join our family @ Sneat.app - https://sneat.app/join/family?id=${invite.id}#pin=${invite.pin}`;
		if (this.message.value) {
			m += '\n\n' + this.message.value;
		}
		return m;
	}

	private composeInvite(channel: InviteChannel, protocol: 'sms' | 'mailto', address: string): void {
		this.creatingInvite = true;
		this.createInvite({ channel, address })
			.subscribe({
				next: response => {
					const m = this.getInviteText(response.invite);
					const body = encodeURIComponent(m);
					const url = protocol + `:${address}?subject=You+are+invited+to+join+${this.team?.type}&body=${body}`;
					this.creatingInvite = false;
					window.open(url);
				},
				error: err => {
					this.creatingInvite = false;
					this.errorLogger.logError(err, 'failed to create an invite for SMS channel');
				},
			});
	}

	composeEmail(): void {
		this.composeInvite('email', 'mailto', this.email.value);
	}

	composeSMS(): void {
		this.composeInvite('sms', 'sms', this.phone.value);
	}

	sendInvite(): void {
		if (!this.team) {
			this.errorLogger.logError('can not send invite without team context');
			return;
		}
		if (!this.member) {
			this.errorLogger.logError('can not send invite without member context');
			return;
		}
		switch (this.tab) {
			case 'email':
				this.emailForm.markAllAsTouched();
				break;
			case 'sms':
				this.smsForm.markAllAsTouched();
				break;
		}

		if (this.tab === 'email' && !this.email.value) {
			this.error = 'Email address is required';
			return;
		}
		if (this.tab === 'sms' && !this.phone.value) {
			this.error = 'Phone number is required';
			return;
		}
		const address = this.tab === 'email' ? this.email.value : this.phone.value;

		this.createInvite({ channel: this.tab, address, send: true }).subscribe({
			next: async response => {
				console.log('personal invite created:', response);
				await this.showToast('Invite has been created and will be sent shortly', 2000);
				await this.modalController.dismiss();
			},
			error: this.errorLogger.logErrorHandler('failed to create an invite for a member'),
		});

	}

	createInvite(to: { channel: InviteChannel; address?: string, send?: boolean }): Observable<ICreatePersonalInviteResponse> {
		if (!this.team) {
			return throwError(() => 'can not create invite without team context');
		}
		if (!this.member) {
			return throwError(() => 'can not create invite without member context');
		}
		const request: ICreatePersonalInviteRequest = excludeEmpty({
			teamID: this.team.id,
			to: {
				...to,
				memberID: this.member.id,
			},
			message: this.message.value,
		});
		return this.inviteService.createInviteForMember(request);
	}

	async copyLinkToClipboard() {
		if (!this.link) {
			return;
		}
		await navigator.clipboard.writeText(this.link);
		await this.showToast('Invite link has been copied to your clipboard');
	}

	async copyLinkWithInviteTextToClipboard() {
		if (!this.link) {
			return;
		}
		await navigator.clipboard.writeText(this.link);
		await this.showToast('Invite text with a link has been copied to your clipboard');
	}

	private async showToast(message: string, duration = 1500): Promise<void> {
		await this.modalController.dismiss();
		const toast = await this.toastController.create({
			message,
			duration,
			position: 'middle',
			keyboardClose: true,
			color: 'tertiary',
			buttons: [{ role: 'cancel', icon: 'close' }],
		});
		await toast.present();
	}

	onTabChanged(event: Event): void {
		if (this.tab === 'link' && !this.link && !this.creatingInvite) {
			this.generateLink();
		}
	}

	private generateLink(): void {
		if (!this.team) {
			return;
		}
		if (!this.member) {
			return;
		}
		this.creatingInvite = true;
		const request: ICreatePersonalInviteRequest = excludeEmpty({
			teamID: this.team.id,
			to: {
				channel: 'link',
				memberID: this.member.id,
			},
			message: this.message.value,
		});
		this.inviteService.getInviteLinkForMember(request).subscribe({
			next: response => {
				console.log('response', response);
				const { id, pin } = response.invite;
				this.link = `https://sneat.app/pwa/join/${this.team?.brief?.type}?id=${id}#pin=${pin}`;
				this.creatingInvite = false;
			},
			error: this.errorLogger.logErrorHandler('failed to generate an invite link'),
		});
	}
}
