import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {allCountries} from './resource/country-code';
import * as lpn from 'google-libphonenumber';
import {Country} from './model/country.model';
import {ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {phoneNumberValidator} from './intl-tel-input.validator';

@Component({
  selector: 'intl-tel-input',
  templateUrl: './intl-tel-input.component.html',
  styles: [
    'li.country:hover { background-color: rgba(0, 0, 0, 0.05); }',
    '.selected-flag.dropdown-toggle:after { content: none; }',
    '.flag-container.disabled {cursor: default !important; }',
    '.intl-tel-input.allow-dropdown .flag-container.disabled:hover .selected-flag { background: none; }'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IntlTelInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useValue: phoneNumberValidator,
      multi: true,
    }
  ],
})
export class IntlTelInputComponent implements OnInit, ControlValueAccessor {
  @Input() value = '';
  @Input() preferredCountries: Array<string> = [];
  @Input() enablePlaceholder = true;

  phoneNumber = '';
  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  selectedCountry: Country = new Country();
  phoneUtil = lpn.PhoneNumberUtil.getInstance();
  disabled = false;

  propagateChange = (_: any) => {};

  constructor() {
    this.fetchCountryData();
  }

  ngOnInit() {
    if (this.preferredCountries.length) {
      this.preferredCountries.forEach(iso2 => {
        const preferredCountry = this.allCountries.filter((c) => {
          return c.iso2 === iso2;
        });

        this.preferredCountriesInDropDown.push(preferredCountry[0]);
      });
    }

    if (this.preferredCountriesInDropDown.length) {
      this.selectedCountry = this.preferredCountriesInDropDown[0];
    } else {
      this.selectedCountry = this.allCountries[0];
    }
  }

  public onPhoneNumberChange(): void {
    this.value = this.phoneNumber;

    let number = '';
    try {
      number = this.phoneUtil.parse(this.phoneNumber, this.selectedCountry.iso2.toUpperCase());
    } catch (e) {
    }

    this.propagateChange({
      number: this.value,
      internationalNumber: number === '' ? '' : this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL),
      nationalNumber: number === '' ? '' : this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL),
      countryCode: this.selectedCountry.iso2.toUpperCase()
    });
  }

  public onCountrySelect(country: Country, el): void {
    this.selectedCountry = country;

    if (this.phoneNumber.length > 0) {
      this.value = this.phoneNumber;

      let number = '';
      try {
        number = this.phoneUtil.parse(this.phoneNumber, this.selectedCountry.iso2.toUpperCase());
      } catch (e) {
      }

      this.propagateChange({
        number: this.value,
        internationalNumber: number === '' ? '' : this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL),
        nationalNumber: number === '' ? '' : this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL),
        countryCode: this.selectedCountry.iso2.toUpperCase()
      });
    }

    el.focus();
  }

  public onInputKeyPress(event): void {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  protected fetchCountryData(): void {
    allCountries.forEach(c => {
      const country = new Country();

      country.name = c[0].toString();
      country.iso2 = c[1].toString();
      country.dialCode = c[2].toString();
      country.priority = +c[3] || 0;
      country.areaCode = +c[4] || null;
      country.flagClass = country.iso2.toLocaleLowerCase();

      if (this.enablePlaceholder) {
        country.placeHolder = this.getPhoneNumberPlaceHolder(country.iso2.toUpperCase());
      }

      this.allCountries.push(country);
    });
  }

  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(this.phoneUtil.getExampleNumber(countryCode), lpn.PhoneNumberFormat.INTERNATIONAL);
    } catch (e) {
      console.log('CountryCode: "' + countryCode + '" ' + e);
      return e;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.phoneNumber = obj;
      setTimeout(() => {
        this.onPhoneNumberChange();
      }, 1);
    }
  }
}
