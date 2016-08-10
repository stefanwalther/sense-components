## Slider (`sc-slider`)

### Basic Usage

```html
<sc-slider></sc-slider>
```

results into

![](docs/images/sc-slider--default.png)

The default slider is a slider to only manipulate one value, if you want to go for a range, change the slider as follows:

```
<sc-slider slider-type="range"></sc-slider>
```

which results into

![](docs/images/sc-slider-default-range.png)

### Properties

General properties:  

- **`slider-type`** *{string}* - The type of the Slider - `single` or `range`. *(Default: `single`)*
- **`min`** *{number}* - The minimum value of the Slider. *(Default: 0)*
- **`max`** *{number}* - The maximum value of the Slider.*(Default: 100)*
- **`init-from-qs`** *{boolean}* - Initialize the current position of the handle(s) based on the define QIX Engine variable(s). *(Default: `true`)*
- **`hideLabel`** *{boolean}* - Hide the label. *(Default: `false`)*
- **`tooltips`** *{boolean}* - Whether to show tooltips or not. *(Default: `false`)*
- **`step`** *{number}* - By default, the slider slides fluently. In order to make the handles jump between intervals, you can use this option. *(Default: 1)*

Properties for type `single`:  

- **`start`** *{number}* - The start position for the handle (if using type `single`). *(Default: ?)*
- **`qs-var`** *{string}* - The name of the Qlik Engine variable to bind the value to (if using type `single`). *(Default: null)*

Properties for type `range`:  

- **`start-lower`** *{number}* - The start position for the lower/left handle (if using type `range`). *(Default: 0)*
- **`start-upper`** *{number}* - The start position for the upper/right handle (if using type `range`). *(Default: 100)*
- **`qs-var-lower`** *{string}* - The name of the Qlik Engine variable to bind the lower value to (if using type `range`). *(Default: null)*
- **`qs-var-upper`** *{string}* - The name of the Qlik Engine variable to bind the upper value to (if using type `range`).*(Default: null)*

### Examples

#### Hide the label

#### Tooltips

You can enable tooltips for the single- and the range-slider (turned off by default):

```html
	<sc-slider tooltip="true" />
```


**Tooltip for single-slider**

![](docs/images/sc-slider--tooltip-single.png)

**Tooltip for range-slider**:

![](docs/images/sc-slider--tooltip-range.png)

### Limitations

The current version of `sc-slider`

- Does not accept decimal places, it will always ceil any input.
