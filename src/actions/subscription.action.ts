import {SUBSCRIPTION_DAYS} from "@/constants";
import {fromIso, toIso} from "@/lib/format";
import {Subscription, SubscriptionStatus} from "@/types";

export const addDays = (iso: string, days: number): string => {
    const d = fromIso(iso);
    d.setDate(d.getDate() + days);
    return toIso(d);
}

export const subsStatus = (s: Subscription, todayIso: string): SubscriptionStatus =>
    todayIso < s.startDate ? "UPCOMING" : todayIso > s.endDate ? "EXPIRED" : "ACTIVE";


export interface MembershipStatus {
    current: Subscription | null,
    validUntil: string | null,
    daysLeft: number
}

const NONE: MembershipStatus = {
    current: null,
    validUntil: null,
    daysLeft: 0,
}

export const getMembershipStatus = (subs: Subscription[], userId: string | null, todayIso: string): MembershipStatus => {
    if (!todayIso || !userId) return NONE;
    const mine = subs.filter(s => s.userId === userId);
    const current = mine
        .filter(s => subsStatus(s, todayIso) === 'ACTIVE')
        .sort((a, b) => b.discPtc - a.discPtc || b.endDate.localeCompare(a.endDate))[0];
    if (!current) return NONE;
    const validUntil = subs.filter(s => s.planId === current.planId).map(s => s.endDate).sort().pop() ?? current.endDate;
    const daysLeft = Math.round((fromIso(validUntil).getTime() - fromIso(todayIso).getTime()) / 86_400_000) + 1;
    return {
        current,
        validUntil,
        daysLeft,
    }
}


