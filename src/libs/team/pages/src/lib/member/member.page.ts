import { Component, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberInfo, ITeamDto } from '@sneat/team/models';
import { IRecord } from '@sneat/data';
import { SneatUserService } from '@sneat/user';
import { TeamService } from '@sneat/team/services';

@Component({
	selector: 'sneat-member',
	templateUrl: './member.page.html',
	styleUrls: ['./member.page.scss'],
})
export class MemberPageComponent implements OnDestroy {
	public team?: IRecord<ITeamDto>;

	public userId?: string;
	public memberInfo?: IMemberInfo;
	public changing?: 'role';

	private memberId?: string;
	private teamSubscription?: Subscription;

	public get defaultBackUrl(): string {
		return this.team?.id ? `team?id=${this.team.id}` : 'teams';
	}

	constructor(
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly teamService: TeamService,
	) {
		console.log('MemberPage.constructor()');
		try {
			this.memberInfo = window.history.state.memberInfo as IMemberInfo;
			if (!this.memberId) {
				this.memberId = this?.memberInfo?.id;
			}
			if (this.memberId) {
				if (
					this.memberInfo &&
					this.memberId &&
					this.memberInfo.id !== this.memberId
				) {
					this.errorLogger.logError('this.memberInfo.id !== this.memberId');
					return;
				}
				this.onMemberIdChanged();
			}
			route.queryParamMap.subscribe(
				(params) => {
					this.processUrlParams(params);
				},
				(err) =>
					this.errorLogger.logError(
						err,
						'MemberPage.constructor() => failed to retrieve query parameters',
					),
			);
			this.userService.userChanged.subscribe({
				next: (userId) => {
					this.userId = userId;
				},
				error: (err) =>
					this.errorLogger.logError(
						err,
						'MemberPage.constructor() => userChanged',
					),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'MemberPage.constructor(): unhandled error');
		}
	}

	public removeMember() {
		if (
			!confirm(
				`Are you sure you want to remove ${
					this.memberInfo?.title || this.memberInfo?.id
				} from ${this.team?.dto?.title}?`,
			)
		) {
			return;
		}
		if (!this.team) {
			this.errorLogger.logError(
				'Can not remove team member without team context',
			);
			return;
		}
		if (!this.memberId) {
			this.errorLogger.logError(
				'Can not remove team member without knowing member ID',
			);
			return;
		}
		this.teamService.removeTeamMember(this.team, this.memberId).subscribe({
			next: () => {
				this.navController
					.pop()
					.catch((err) =>
						this.errorLogger.logError(err, 'Failed to pop navigator state'),
					);
			},
			error: (err) => this.errorLogger.logError(err, 'Failed to remove member'),
		});
	}

	public ngOnDestroy(): void {
		if (this.teamSubscription) {
			this.teamSubscription.unsubscribe();
		}
	}

	public changeRole(event: Event): void {
		console.log('changeRole():', event);
		if (!this.team) {
			this.errorLogger.logError('Can not change role without team context');
			return;
		}
		if (!this.memberId) {
			this.errorLogger.logError(
				'Can not change role without knowing member ID',
			);
			return;
		}
		this.changing = 'role';
		const { detail } = event as CustomEvent;
		this.teamService
			.changeMemberRole(this.team, this.memberId, detail.value)
			.subscribe({
				next: () => {
					this.changing = undefined;
				},
				error: (err) => {
					this.changing = undefined;
					this.errorLogger.logError(err, 'Failed to change team member role');
				},
			});
	}

	private processUrlParams(params: ParamMap): void {
		const id = params.get('id');
		if (!id) {
			return;
		}
		const ids = id.split(':');
		console.log('processUrlParams', id);
		if (ids.length === 2) {
			const [teamId, memberId] = ids;
			if (teamId && teamId !== this.team?.id) {
				this.team = { id: teamId };
				this.onTeamIdChanged();
			}
			if (memberId !== this.memberId) {
				this.memberId = memberId;
				this.memberId = memberId;
				this.onMemberIdChanged();
			}
		}
	}

	private onTeamIdChanged(): void {
		if (this.teamSubscription) {
			this.teamSubscription.unsubscribe();
		}
		this.memberId = undefined;
		const teamId = this.team?.id;
		if (teamId) {
			this.teamSubscription = this.teamService.watchTeam(teamId).subscribe({
				next: (team) => {
					console.log('MemberPage: teamService.watchTeam =>', team);

					if (this.team?.id !== teamId) {
						return;
					}
					this.team = { id: this.team.id, dto: team };
					if (this.memberId) {
						this.onMemberIdChanged();
					}
				},
				error: (err) =>
					this.errorLogger.logError(
						err,
						'MemberPage.onTeamIdChanged() => Failed to get team',
					),
			});
		}
	}

	private onMemberIdChanged(): void {
		if (this.team) {
			const memberId = this.memberId;
			this.memberInfo = this.team?.dto?.members?.find(
				(m) => m.id === memberId,
			);
		}
	}
}
