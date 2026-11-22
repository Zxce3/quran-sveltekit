import { describe, expect, it } from 'vitest';
import { normalizeSearch } from './text';

describe('normalizeSearch', () => {
	it('lower-cases and collapses whitespace', () => {
		expect(normalizeSearch('  Al-Fatiha   The  OPENING ')).toBe('al-fatiha the opening');
	});

	it('strips Arabic diacritics so plain letters match vowelled text', () => {
		expect(normalizeSearch('ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ')).toBe(normalizeSearch('الحمد لله رب العالمين'));
	});

	it('folds alef variants, alef maqsura and ta marbuta', () => {
		expect(normalizeSearch('إِيَّاكَ')).toBe(normalizeSearch('أياك'));
		expect(normalizeSearch('إِيَّاكَ')).toBe('يك');
		expect(normalizeSearch('الفاتحة')).toBe('لفتحه');
	});
});
