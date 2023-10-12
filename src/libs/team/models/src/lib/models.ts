import { TeamType } from '@sneat/core';
import {
	ContactType,
	IContact2Asset,
	IMemberBrief,
	IRelatedPerson,
	IAddress,
	IContact2ContactInRequest,
	MemberContactType, ICreatePeronRequest,
} from '@sneat/dto';
import { IMemberContext } from './team-context';


export interface ITeamRequest {
	readonly teamID: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	memberID: string;
}

export interface IAcceptInviteResponse {
	id: string;
}

export interface IInviteTeam {
	id: string;
	type: TeamType;
	title: string;
}

export interface IJoinTeamInfoResponse {
	team: IInviteTeam;
	invite: {
		id: string;
		pin: string;
		status: string;
		created: string;
		from: IInviteFromContact;
		to: IInviteToContact;
		message?: string;
	};
	member: IMemberBrief;
}

export interface IAcceptPersonalInviteRequest extends ITeamRequest {
	inviteID: string;
	pin: string; // Do not make number as we can lose leading 0's
	member?: IMemberBrief;
	// fullName?: string;
	// email?: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
	inviteID: string;
	pin: string;
}

export type TeamMemberStatus = 'active' | 'archived';

export interface ICreateTeamMemberRequest extends ITeamRequest, IRelatedPerson {
	type: MemberContactType;
	status: TeamMemberStatus;
	countryID: string;
	roles: string[];
	// memberType: MemberType;
	message?: string;
}

export interface ICreateContactBaseRequest extends ITeamRequest {
	status: 'active' | 'draft';
	type: ContactType;
	// countryID: string;
	parentContactID?: string;
	roles?: string[];
	relatedToAssets?: IContact2Asset[];
	relatedToContacts?: { [id: string]: IContact2ContactInRequest };
}

export interface ICreateContactPersonRequest extends ICreateContactBaseRequest {
	type: 'person';
	person?: ICreatePeronRequest;
}

export interface ICreateContactLocationRequest extends ICreateContactBaseRequest {
	type: 'location';
	location?: ICreateLocationRequest;
}

export interface IBasicContactRequest {
	// type: ContactType;
	// relationship?: string;
	// message?: string;
	title: string;
	// parentContactID?: string;
}

export interface ICreateContactBasicRequest extends ICreateContactBaseRequest {
	basic: IBasicContactRequest;
}

export interface ICreateLocationBaseRequest {
	title: string;
	address: IAddress;
}

export type ICreateLocationRequest = ICreateLocationBaseRequest;
export type ICreateCompanyRequest = ICreateLocationBaseRequest;

export interface ICreateContactCompanyRequest extends ICreateContactBaseRequest {
	company?: ICreateCompanyRequest;
}

export type ICreateContactRequest =
	ICreateContactPersonRequest |
	ICreateContactCompanyRequest |
	ICreateContactLocationRequest |
	ICreateContactBasicRequest;


export interface IBy {
	memberID?: string;
	userID?: string;
	title: string;
}


interface IInvite {
	message?: string;
}

export interface IInviteFromContact {
	memberID: string;
	userID?: string;
	title?: string;
}

export type InviteChannel = 'email' | 'sms' | 'link';

export interface IInviteToContact {
	channel: InviteChannel;
	address?: string;
	memberID?: string;
	title?: string;
}

export interface IPersonalInvite extends IInvite {
	team: { id: string; title: string };
	memberID: string;
	from: IInviteFromContact;
	to: IInviteToContact;
}

export interface IAddTeamMemberResponse {
	member: IMemberContext;
}

export interface ITaskRequest extends ITeamMemberRequest {
	type: string;
	task: string;
}

export interface IReorderTaskRequest extends ITaskRequest {
	len: number;
	from: number;
	to: number;
	after?: string;
	before?: string;
}
