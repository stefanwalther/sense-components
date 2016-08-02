## Alert Component (sc-alert)

> The official example to render a simple alert.


### Usage

```html
<sc-alert closable="true" auto-close-after="10">This is the alert message</sc-alert>
<sc-alert closable="true" design="warning">This is the alert message</sc-alert>
```

### Properties

- **`closable`** *{boolean}* - Whether the alert should be closable or not. *(Default: false)*
- **`auto-close-after`** *{numeric}* - Define the amount of milliseconds after which the alert should be automatically hidden.
- **`design`** *{string}* - Defines the style of the component using Leonardo UI classes. 
Possible values: `info`, `success`, `warning`, `danger`

### Screenshots

![](docs/images/qw-alert--screenshot.png)
