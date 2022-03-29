import { Component, Inject, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRecord } from '@sneat/data';
import { ITeamDto } from '@sneat/team/models';
import { SneatUserService } from '@sneat/user';
import { TeamNavService, TeamService } from '@sneat/team/services';
import { RetroItemType } from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-team-retrospectives',
	templateUrl: './retrospectives.component.html',
	styleUrls: ['./retrospectives.component.scss'],
})
export class RetrospectivesComponent {
	@Input() public team?: IRecord<ITeamDto>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamService: TeamService,
		private readonly userService: SneatUserService, // TODO: replace with user context service
		private readonly navController: NavController,
		public readonly navService: TeamNavService,
	) {
	}

	navigateToCurrentRetro(): void {
		console.log('navigateToCurrentRetro()');
		if (!this.team) {
			this.errorLogger.logError(
				'Can not navigate to retro without having team context',
			);
			return;
		}
		const activeRetroId = this.team?.dto?.active?.retrospective?.id;
		try {
			this.navService.navigateToRetrospective(
				this.navController,
				this.team,
				activeRetroId || 'upcoming',
			);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to navigate to retrospective page');
		}
	}

	retroCount(itemType: RetroItemType): number {
		const userId = this.userService.currentUserId;
		return (
			(userId
				? this.team?.dto?.upcomingRetro?.itemsByUserAndType?.[userId]?.[
					itemType
					]
				: 0) || 0
		);
	}
}
