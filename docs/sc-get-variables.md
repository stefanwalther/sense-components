## Get Variable Values (`sc-get-variables`)

> A simple custom component to fetch the value of one or more variables.

**Status:** Experimental

### Usage

```html
<sc-get-variables content="vVar1,vVar2">
	
	// Now the value of the two variables are available in the scope's 
	// object `variables`
	
	<b>List of variable values:</b>
    <ul style="margin-left:20px;">
        <li ng-repeat="variable in variables">
            <b>{{variable.varName}}:</b> {{variable.qContent.qString}}
        </li>
    </ul>
	
</sc-get-variables>
```

### Properties

- **`content`** *{string}* - Comma separated list of variables to be loaded.
