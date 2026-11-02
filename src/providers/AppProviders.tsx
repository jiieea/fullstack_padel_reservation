'use client';

import type {ReactNode} from 'react';
import {AdminProvider} from './AdminProvider';
import {AuthProvider} from './AuthProvider';
import {BookingProvider} from './BookingProvider';
import {DataProvider} from './DataProvider';
import {ToastProvider} from "@/providers/ToastProvider";

export function AppProviders({children}: { children: ReactNode }) {
    return (
        <DataProvider>
            <ToastProvider>
                <AuthProvider>
                    <BookingProvider>
                        <AdminProvider>{children}</AdminProvider>
                    </BookingProvider>
                </AuthProvider>
            </ToastProvider>
        </DataProvider>
    );
}
