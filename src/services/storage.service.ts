
import { Injectable } from '@angular/core';
import { LoanOffer } from './gemini.service';

export interface LoanCalculatorState {
  loanAmount: number;
  loanTerm: number;
  interestRate: number;
  loanOffers: LoanOffer[];
}

const STORAGE_KEY = 'loanCalculatorState';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  saveState(state: LoanCalculatorState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }

  loadState(): LoanCalculatorState | null {
    try {
      const stateJson = localStorage.getItem(STORAGE_KEY);
      if (stateJson) {
        return JSON.parse(stateJson) as LoanCalculatorState;
      }
      return null;
    } catch (e) {
      console.error('Error reading state from localStorage', e);
      return null;
    }
  }

  hasSavedState(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
}
