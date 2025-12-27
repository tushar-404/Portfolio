import { atom } from 'jotai';

export const chatbotOpenAtom = atom(false);
export const chatbotMessageAtom = atom<string | null>(null);
