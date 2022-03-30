import { Inject, Injectable, NgZone } from '@angular/core';
import { Params } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import { IUserTeamInfo } from '@sneat/auth-models';
import { IRecord } from '@sneat/data';
import { ITeamDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRetrospective, IScrum } from '@sneat/scrumspace/scrummodels';
import { IMemberContext } from '@sneat/team/models';

export type ScrumPageTab = 'team' | 'my' | 'risks' | 'qna';

@Injectable({
	providedIn: 'root',
})
export class TeamNavService {
	constructor(
		private readonly zone: NgZone,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
	) {
	}

	public navigateToTeams(animationDirection?: 'forward' | 'back'): void {
		console.log('navigateToTeams()');
		this.analyticsService.logEvent('navigateToTeams');
		this.navController
			.navigateRoot('teams', { animationDirection })
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to teams page'),
			);
	}

	public navigateToLogin(options?: {
		returnTo?: string;
		queryParams?: Params;
		fragment?: string;
	}): void {
		console.log('navigateToLogin()', options);
		this.analyticsService.logEvent('navigateToLogin', {
			returnTo: options?.returnTo,
		});
		if (options?.returnTo) {
			options.queryParams = options && {
				to: options.returnTo, // Make `to`first parameter for sake of URL readability
				...options.queryParams, // TODO: make sure query parameter `to` does not overrides returnTo passed above.
			};
		}
		this.navController
			.navigateRoot('login', { ...options, animationDirection: 'back' })
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to login page'),
			);
	}

	public navigateToScrum(
		date: 'today' | 'yesterday' | string,
		team: IRecord<ITeamDto>,
		scrum?: IRecord<IScrum>,
		tab?: ScrumPageTab,
	): void {
		console.log(
			`navigateToScrum(date=${date}, team=${team?.id}, tab=${tab}), scrum:`,
			scrum?.dto,
		);
		this.analyticsService.logEvent('navigateToScrum', { date, team: team.id });
		this.navController
			.navigateForward('scrum', {
				queryParams: { date, team: team.id },
				state: { team, scrum },
				fragment: tab && `tab=` + tab,
			})
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to scrum page'),
			);
	}

	public navigateToUserProfile(): void {
		this.analyticsService.logEvent('navigateToUserProfile');
		this.navController
			.navigateRoot('user-profile')
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to naviage to user profile'),
			);
	}

	public navigateToMember(
		navController: NavController,
		memberContext: IMemberContext,
	): void {
		console.log(
			`navigateToMember(team.id=${memberContext?.team?.id}, memberInfo.id=${memberContext?.id})`,
		);
		const id = `${memberContext?.team?.id}:${memberContext?.id}`;
		const { team } = memberContext;
		this.navForward(
			navController,
			`space/${team.type}/${memberContext.team?.id}/member/${memberContext.id}`,
			{
				state: {
					member: memberContext,
				},
			},
			{ name: '', params: { id, team: team.id, member: memberContext.id } },
		);
	}

	public navigateToTeam(
		id: string,
		teamInfo?: IUserTeamInfo,
		team?: ITeamDto,
		animationDirection?: 'forward' | 'back',
	): void {
		this.analyticsService.logEvent('navigateToTeam', { team: id });
		this.navController
			.navigateRoot('team', {
				queryParams: { id },
				state: {
					teamInfo,
					team,
				},
				animationDirection,
			})
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to team page'),
			);
	}

	public navigateToScrums = (
		navController: NavController,
		team: IRecord<ITeamDto>,
	): void =>
		this.navToTeamPage(navController, team, 'scrums', 'navigateToScrums');

	public navigateToAddMetric = (
		navController: NavController,
		team: IRecord<ITeamDto>,
	): void =>
		this.navToTeamPage(
			navController,
			team,
			'add-metric',
			'navigateToAddMetric',
		);

	public navigateToAddMember = (
		navController: NavController,
		team: IRecord<ITeamDto>,
	): void =>
		this.navToTeamPage(
			navController,
			team,
			'add-member',
			'navigateToAddMember',
		);

	public navigateToRetrospective = (
		navController: NavController,
		team: IRecord<ITeamDto>,
		id: string | 'upcoming',
	): void =>
		this.navToTeamPage(
			navController,
			team,
			'retrospective',
			'navigateToRetrospective',
			{ id },
		);

	public navigateToRetroTree(
		date: 'today' | 'yesterday' | string,
		team?: IRecord<ITeamDto>,
		retrospective?: IRecord<IRetrospective>,
	): void {
		console.log(
			`navigateToRetroReview(date=${date}, team=${team?.id}), scrum:`,
			retrospective?.dto,
		);
		if (!team) {
			return;
		}
		this.analyticsService.logEvent('navigateToRetroReview', {
			date,
			team: team.id,
		});
		this.navController
			.navigateForward('retro-tree', {
				queryParams: { date, team: team.id },
				state: { team, retrospective },
			})
			.catch((err) =>
				this.errorLogger.logError(
					err,
					'Failed to navigate to retro review page',
				),
			);
	}

	private navForward(
		navController: NavController,
		url: string,
		navOptions: NavigationOptions,
		analyticsEvent: { name: string; params?: any },
	): void {
		console.log('navForward()', url, analyticsEvent.name, analyticsEvent.params);
		navController = navController || this.navController;
		// this.analyticsService.logEvent(analyticsEvent.name, analyticsEvent.params);
		navController
			.navigateForward(url, navOptions)
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to: ' + url),
			);
	}

	private navToTeamPage = (
		navController: NavController,
		team: IRecord<ITeamDto>,
		url: string,
		eventName: string,
		params?: any,
	): void => {
		params = { ...(params || {}), team: team.id };
		this.navForward(
			navController,
			url,
			{ queryParams: params, state: { team } },
			{ name: eventName, params },
		);
	};
}
