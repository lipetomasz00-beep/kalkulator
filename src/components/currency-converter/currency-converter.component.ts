import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ExchangeRates {
  rates: { [key: string]: number };
  base_code: string;
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent {
  private http = inject(HttpClient);

  amount = signal(100);
  fromCurrency = signal('USD');
  toCurrency = signal('EUR');
  
  rates = signal<{ [key: string]: number }>({});
  loading = signal(false);
  error = signal<string | null>(null);

  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'PLN', 'CHF', 'CAD', 'AUD', 'CNY'];

  constructor() {
    this.fetchRates();
    
    // Refresh rates when fromCurrency changes
    effect(() => {
      this.fetchRates();
    }, { allowSignalWrites: true });
  }

  async fetchRates() {
    this.loading.set(true);
    this.error.set(null);
    
    const base = this.fromCurrency();
    this.http.get<ExchangeRates>(`https://open.er-api.com/v6/latest/${base}`).subscribe({
      next: (data) => {
        this.rates.set(data.rates);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch rates:', err);
        this.error.set('Nie udało się pobrać kursów walut.');
        this.loading.set(false);
      }
    });
  }

  convertedAmount = computed(() => {
    const currentRates = this.rates();
    const target = this.toCurrency();
    const val = this.amount();
    
    if (!currentRates[target]) return 0;
    return val * currentRates[target];
  });

  swapCurrencies() {
    const from = this.fromCurrency();
    const to = this.toCurrency();
    this.fromCurrency.set(to);
    this.toCurrency.set(from);
  }
}
