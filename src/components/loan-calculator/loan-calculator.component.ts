
import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeminiService, LoanOffer } from '../../services/gemini.service';
import { StorageService, LoanCalculatorState } from '../../services/storage.service';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanCalculatorComponent {
  loanAmount = signal(50000);
  loanTerm = signal(60);
  interestRate = signal(8.5);

  // Validation signals
  amountError = computed(() => {
    const val = this.loanAmount();
    if (val < 1000) return 'Minimalna kwota to 1 000 PLN';
    if (val > 1000000) return 'Maksymalna kwota to 1 000 000 PLN';
    return null;
  });

  termError = computed(() => {
    const val = this.loanTerm();
    if (val < 1) return 'Minimalny okres to 1 miesiąc';
    if (val > 360) return 'Maksymalny okres to 360 miesięcy (30 lat)';
    return null;
  });

  rateError = computed(() => {
    const val = this.interestRate();
    if (val < 0.1) return 'Minimalne oprocentowanie to 0.1%';
    if (val > 50) return 'Maksymalne oprocentowanie to 50%';
    return null;
  });

  isInputValid = computed(() => !this.amountError() && !this.termError() && !this.rateError());

  isGenerating = signal(false);
  loanOffers = signal<LoanOffer[]>([]);
  error = signal<string | null>(null);

  private geminiService = inject(GeminiService);
  private storageService = inject(StorageService);

  hasSavedState = signal<boolean>(false);

  constructor() {
    this.hasSavedState.set(this.storageService.hasSavedState());

    effect(() => {
      const state: LoanCalculatorState = {
        loanAmount: this.loanAmount(),
        loanTerm: this.loanTerm(),
        interestRate: this.interestRate(),
        loanOffers: this.loanOffers(),
      };
      this.storageService.saveState(state);
      this.hasSavedState.set(true);
    });
  }

  monthlyPayment = computed(() => {
    const principal = this.loanAmount();
    const annualRate = this.interestRate() / 100;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = this.loanTerm();

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const payment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
    return payment;
  });

  minApr = computed(() => {
    const offers = this.loanOffers();
    if (!offers || offers.length === 0) {
      return null;
    }
    return Math.min(...offers.map(o => o.apr));
  });

  async getLoanOffers(): Promise<void> {
    this.isGenerating.set(true);
    this.error.set(null);
    this.loanOffers.set([]);

    try {
      const offers = await this.geminiService.generateLoanOffers(
        this.loanAmount(),
        this.loanTerm()
      );
      this.loanOffers.set(offers);
    } catch (err) {
      console.error('Error generating loan offers:', err);
      this.error.set('Nie udało się wygenerować ofert. Spróbuj ponownie później.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  loadState(): void {
    const state = this.storageService.loadState();
    if (state) {
      this.loanAmount.set(state.loanAmount);
      this.loanTerm.set(state.loanTerm);
      this.interestRate.set(state.interestRate);
      this.loanOffers.set(state.loanOffers);
    }
  }
}
