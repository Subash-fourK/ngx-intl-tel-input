# International Telephone Input
[![Build Status](https://travis-ci.org/webcat12345/ngx-intl-tel-input.svg?branch=master)](https://travis-ci.org/webcat12345/ngx-intl-tel-input) [![npm version](https://badge.fury.io/js/ngx-intl-tel-input.svg)](https://badge.fury.io/js/ngx-intl-tel-input) [![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/ngx-intl-tel-input)

An Angular package for entering and validating international telephone numbers. It adds a flag dropdown to any input, detects the user's country, displays a relevant placeholder and provides formatting/validation methods.
## Installation

To install this library, run:

```bash
$ npm install ngx-intl-tel-input --save
```

## Consuming library

From your Angular `AppModule`:

```typescript
// Import your library
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  ...
  imports: [
      ...
    NgxIntlTelInputModule
      ...
  ],
  ...
})
export class AppModule { }
```

Once library is imported, you can use components in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{phone_number}}
</h1>
<ngx-intl-tel-input [(value)]="phone_number"></ngx-intl-tel-input>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [webcat12345](mailto:webcat91@gmail.com)