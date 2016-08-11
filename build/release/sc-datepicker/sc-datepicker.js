/**
 * @todo
 * - allowInput: doesn't seem to work ...
 */
define(["angular","jquery","underscore","text!./sc-datepicker.ng.html","./external/flatpickr/flatpickr.min","css!./external/flatpickr/flatpickr.material_orange.min.css","css!./sc-flatpickr-style-override.css"],function(angular,$,_,ngTemplate){"use strict";return{name:"scDatepicker",restrict:"E",replace:!0,template:ngTemplate,scope:{width:"@",inline:"="},link:function(scope,element,attrs){var opts={allowInput:!1,weekNumbers:scope.$eval(attrs.weekNumbers),inline:scope.inline};element.css("width",scope.width);var e=angular.element(element)[0],datePickr=new Flatpickr(e,opts);datePickr.config.onChange=function(dateObj){scope.selectedDate=dateObj}}}});