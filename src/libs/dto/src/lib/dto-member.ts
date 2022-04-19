import { IAvatar } from '@sneat/auth-models';
import { EnumAsUnionOfKeys, excludeUndefined } from '@sneat/core';
import { ITeamMemberInfo } from './dto-commune';
import { IContact2Member } from './dto-contact2';
import { IPersonRecord, ITitledRecordInfo, ITotalsHolder, IVerification } from './dto-models';
import { DtoGroupTerms } from './dto-term';
import { AgeGroup, MembersVisibility, MemberType } from './types';

export const MemberRoleContributor = 'contributor';
export const MemberRoleSpectator = 'spectator';
export const MemberRoleParish = 'pastor';
export type MemberRoleEducation = 'administrator' | 'principal' | 'pupil' | 'teacher';
export type MemberRoleRealtor = 'administrator' | 'agent';

export type MemberRole =
	typeof MemberRoleContributor |
	typeof MemberRoleSpectator |
	MemberRoleEducation |
	MemberRoleRealtor |
	typeof MemberRoleParish;

export const enum FamilyMemberRelation {
	child = 'child',
	parent = 'parent',
	grandparent = 'grandparent',
	sibling = 'sibling',
	spouse = 'spouse',
	partner = 'partner',
}


export function familyRelationTitle(id: FamilyMemberRelation): string {
	const s = (id as string);
	return s ? s[0].toUpperCase() + s.substr(1) : '';
}

export type FamilyMemberRelations = EnumAsUnionOfKeys<typeof FamilyMemberRelation>;

export const MemberRelationshipOther = 'other';
export const MemberRelationshipUndisclosed = 'undisclosed';

export type MemberRelationship =
	FamilyMemberRelations
	| typeof MemberRelationshipOther
	| typeof MemberRelationshipUndisclosed;

export interface IMemberGroupBrief {
	id: string;
	title: string;
}

export interface IMemberBase extends IPersonRecord, IVerification, ITotalsHolder {
	readonly title: string;
	readonly groupIDs?: string[];
	readonly uid?: string; // User ID
	readonly type?: MemberType;
	readonly age?: AgeGroup;
	readonly roles?: readonly MemberRole[];
	readonly avatar?: IAvatar;
}

export interface IMemberBrief extends IMemberBase {
	id: string;
}

export interface IMemberDto extends IMemberBase {
	position?: string;
	groups?: IMemberGroupBrief[];
	contacts?: IContact2Member[];
}


export function newCommuneMemberInfo(id: string, m: IMemberDto): ITeamMemberInfo {
	return excludeUndefined({
		id: id,
		userID: m.userID,
		title: m.title && m.userID && m.title === m.userID ? undefined : m.title,
		age: m.ageGroup,
		roles: m.roles,
		gender: m.gender,
		groupIds: m.groupIDs,
	});
}

export function memberDtoFromMemberInfo(memberInfo: ITeamMemberInfo, communeId: string, title: string): IMemberDto {
	return excludeUndefined({
		...memberInfo,
		communeId,
		title,
		type: 'member',
	});
}

export interface IMemberGroupDtoCounts {
	members?: number;
}

export interface ICommuneDtoMemberGroupInfo extends ITitledRecordInfo {
	members: number;
}

export interface IMemberGroupDto {
	id: string;
	teamID: string;
	title: string;
	desc?: string;
	timetable?: string;
	membersVisibility: MembersVisibility;
	numberOf?: IMemberGroupDtoCounts;
	terms?: DtoGroupTerms;
}
