// app/lib/cookies.ts

'use client';

import { setCookie, deleteCookie, getCookie, CookieValueTypes } from 'cookies-next';

export const setAuthCookie = (token: string): void => {
  setCookie('auth-token', token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const removeAuthCookie = (): void => {
  deleteCookie('auth-token', { path: '/' });
};

export const getAuthCookie = async (): Promise<CookieValueTypes> => {
  return await getCookie('auth-token');
};