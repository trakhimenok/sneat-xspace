import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { IUserTeamInfo } from '@sneat/auth-models';
import { ISneatUserState } from '@sneat/user';
import { TeamBasePage, TeamComponentBaseParams } from '../team-base.page';
import { TeamContextComponent } from '../team-page-context';

@Component({
	selector: 'sneat-team-menu',
	templateUrl: './team-menu.component.html',
	styleUrls: ['./team-menu.component.scss'],
})
export class TeamMenuComponent extends TeamBasePage implements AfterViewInit {

	@ViewChild('teamContextComponent') teamContextComponent?: TeamContextComponent;

	// public team?: ITeamContext;
	public teamId?: string = undefined;
	// public teamType?: string = undefined;
	public teams?: IUserTeamInfo[];

	constructor(
		params: TeamComponentBaseParams,
		private readonly menuCtrl: MenuController,
	) {
		super('TeamMenuComponent', params);
		params.userService.userState.subscribe({
			next: this.trackUserState,
			error: this.errorLogger.logErrorHandler('failed to get user stage'),
		});
	}

	public closeMenu(): void {
		this.menuCtrl.close();
	}

	ngAfterViewInit(): void {
		this.setTeamPageContext(this.teamContextComponent);
	}

	override onTeamDtoChanged(): void {
		super.onTeamDtoChanged();
		console.log('TeamMenuComponent.onTeamDtoChanged()', this.team?.dto);
	}

	spaceLabelClicked(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
	}

	isCurrentPage(page: string): boolean {
		if (!this.team) {
			return false;
		}
		const { id } = this.team;
		const idp = '/' + id;
		const { pathname } = location;
		if (page === 'overview') {
			return pathname.endsWith(idp);
		}
		return pathname.endsWith(idp + '/' + page) || pathname.indexOf(idp + '/' + page) > 0;
	}

	onTeamSelected(event: Event): void {
		const teamID = (event as CustomEvent).detail.value as string;

		console.log('onTeamSelected', teamID);
		if (teamID === this.team?.id) {
			return;
		}
		const team = this.teams?.find(t => t.id === teamID);
		if (team) {
			this.teamParams.navController.navigateRoot(`/space/${team.type}/${team.id}`).catch(console.error);
		}
		this.menuCtrl.close().catch(console.error);
		return;
	}

	private trackUserState = (userState: ISneatUserState): void => {
		console.log('trackUserState =>', userState);
		// setTimeout(() => {
		// }, 100);
		if (userState?.record) {
			this.teams = userState.record.teams || [];
		} else {
			this.teams = undefined;
		}
		console.log('teams:', this.teams);
	};
}
