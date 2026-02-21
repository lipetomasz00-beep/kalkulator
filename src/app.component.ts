
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanCalculatorComponent } from './components/loan-calculator/loan-calculator.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoanCalculatorComponent, CurrencyConverterComponent],
})
export class AppComponent {
  activeTab = signal<'loan' | 'currency'>('loan');
}
