# expander

A re-usable plugin to manage functionality and accessibility of expanding elements

## Install

`expander` is an ES6 module. Consequently, you'll need an ES^ transpiler ([Babel](https://bablejs.io) is a nice one) as part of your Javascript workflow.

If you're already using NPM for your project, you can install `expander` with the following command:

```
$ npm install @degjs/expander
```

## Usage

The `expander` plugin will handle listening and responding to click events on trigger button.
It will dispatch custom events that the application can listen and respond to.

_Note: the expander plugin exports a variable called `events` to help standardize event names that the app can listen for._

```js
import expander, {events} from "@degjs/expander";

let expanderInst;

const init = () => {
	expanderInst = expander(containerEl);

	containerEl.addEventListener(events.beforeExpand, onBeforeExpand);
};

const destroy = () => {
	expanderInst.destroy();
};
```

## Options

| Property Name      | Type      | Default           | Description                                                                                           |
| ------------------ | --------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| isExpanded         | `Boolean` | `false`           | Describes if the content is expanded on init                                                          |
| toggleSelector     | `String`  | `"button"`        | The selector string to find the toggle trigger element                                                |
| controlsId         | `String`  | `null`            | The id of the content element that is controlled by the toggle button                                 |
| expandingCssClass  | `String`  | `"is-expanding"`  | The css class to be added when and element is in the process of expanding                             |
| collapsingCssClass | `String`  | `"is-collapsing"` | The css class to be added when and element is in the process of collapsing                            |
| expandedCssClass   | `String`  | `"is-expanded"`   | The css class to be added when and element is fully expanded                                          |
| collapsedCssClass  | `String`  | `"is-collapsed"`  | The css class to be added when and element is fully collapsed                                         |
| animationTargetEl  | `Element` | `null`            | The element to add the animation classes to                                                           |
| animationEvent     | `String`  | `"animationend"`  | The animation event name to listen for. When it is fired, the expand or collapse action will commence |

## Methods

### getElement()

The getElement method returns the container element used by `expander`.

#### Returns

| Type    | Description                                                    |
| ------- | -------------------------------------------------------------- |
| Element | the element that contains the trigger and content for expander |

### expand()

A way to manually trigger the expand functionality of expander.

### collapse()

A way to manually trigger the collapse functionality of expander.

### getOptions()

The getOptions method returns the current expander settings.

#### Returns

| Type   | Description                                                                  |
| ------ | ---------------------------------------------------------------------------- |
| Object | the current settings for `expander` (defaults and user-set options combined) |

### setOptions(newOptions)

The setOptions method allows changes to the current `expander` settings. This method performs a merge of the original settings and the new ones.

#### Arguments

| Type   | Description                            |
| ------ | -------------------------------------- |
| Object | new settings for the `expander` plugin |

#### Returns

Nothing

### destroy()

This method removes any aria-attributes it created and cleans up any event listeners it created.

## Browser Support

`expander` depends on the following browser APIs:

-   Custom Event: [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill)
-   Element.classList.toggle: [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) | [Polyfill](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#Polyfill)

To support legacy browsers, you'll need to include polyfills for the above APIs.
