## sc-progressbar

> Progressbar component.


### Basic Example

***Html:***

```html
<sc-progressbar max="100" value="50">50%</sc-progressbar>
```

***Result:***

![](docs/images/component_wiProgressbar_BasicExample.png)


### Properties

* **`max`** *{number}* - A number that specifies the total value of bars that is required. *(Default: 100)*
* **`value`**  *{number}* - The current value of progress completed. 
* **`type`** *{string}* - Chosen design. Possible values are `primary`, `info`, `success`, `warning`, `danger`, `inverse` *(Default: null)*
* **`animate`** *{boolean}* - Whether bars use transitions to achieve the width change. *(Default: true)*

#### Example Using All Properties

```html
<sc-progressbar 
	max="100" 
	value="50" 
	animate="true" 
	design="danger">50%
</sc-progressbar>
```

### Stacked Progressbar

If you want to add multiple bars into the same progressbar you can create a stacked progessbar:

***Html:***
```html
<sc-progressbar>
    <sc-progress>
        <sc-bar value="20" design="danger">20%</sc-bar>
        <sc-bar value="10" design="success">10%</sc-bar>
        <sc-bar value="60" design="info">60%</sc-bar>
    </sc-progress>
</sc-progressbar>
```

***Result:***


> ![](docs/images/component_wiProgressbar_StackedProgressbar.png)


### Design Types

Examples how a progressbar would look like depending on the chosen `design`:

> ![](docs/images/component_wiProgressbar_Types.png)



