## cc-progressbar

> Progressbar component.


### Basic Example

***Html:***

```html
<cc-progressbar max="100" value="50">50%</cc-progressbar>
```

***Result:***

> ![](docs/images/component_wiProgressbar_BasicExample.png)


### Properties

`cc-progressbar` is only available as an Html-element not as an attribute.

* **`max`** - A number that specifies the total value of bars that is required. *(Default: 100)*
* **`value`** - The current value of progress completed. 
* **`design`** - Chosen design. Possible values are `primary`, `info`, `success`, `warning`, `danger`, `inverse` *(Default: null)*
* **`animate`** - Whether bars use transitions to achieve the width change. *(Default: true)*

#### Example Using All Properties

```html
<cc-progressbar 
	max="100" 
	value="50" 
	animate="true" 
	design="danger">50%
</cc-progressbar>
```

### Stacked Progressbar

If you want to add multiple bars into the same progressbar you can create a stacked progessbar:

***Html:***
```html
<cc-progressbar>
    <cc-progress>
        <cc-bar value="20" design="danger">20%</cc-bar>
        <cc-bar value="10" design="success">10%</cc-bar>
        <cc-bar value="60" design="info">60%</cc-bar>
    </cc-progress>
</cc-progressbar>
```

***Result:***


> ![](docs/images/component_wiProgressbar_StackedProgressbar.png)


### Design Types

Examples how a progressbar would look like depending on the chosen `design`:

> ![](docs/images/component_wiProgressbar_Types.png)



