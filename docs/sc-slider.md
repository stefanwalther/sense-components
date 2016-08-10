## Slider (`sc-slider`)

### Basic Usage

### Properties

General properties:  

- **`slider-type`** *{string}* - The type of the Slider - `single` or `range`. *(Default: `single`)*
- **`min`** *{number}* - The minimum value of the Slider. *(Default: 0)*
- **`max`** *{number}* - The maximum value of the Slider.*(Default: 100)*
- **`init-from-qs`** *{boolean}* - Initialize the current position of the handle(s) based on the define QIX Engine variable(s). *(Default: `true`)*

Properties for type `single`:  

- **`start`** *{number}* - The start position for the handle (if using type `single`). *(Default: ?)*
- **`qs-var`** *{string}* - The name of the Qlik Engine variable to bind the value to (if using type `single`). *(Default: null)*

Properties for type `range`:  

- **`start-lower`** *{number}* - The start position for the lower/left handle (if using type `range`). *(Default: 0)*
- **`start-upper`** *{number}* - The start position for the upper/right handle (if using type `range`). *(Default: 100)*
- **`qs-var-lower`** *{string}* - The name of the Qlik Engine variable to bind the lower value to (if using type `range`). *(Default: null)*
- **`qs-var-upper`** *{string}* - The name of the Qlik Engine variable to bind the upper value to (if using type `range`).*(Default: null)*

### Examples


