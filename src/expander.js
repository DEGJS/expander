import { dispatchEvent } from './utils';
import domEvent from '@degjs/dom-event';

export const events = {
    expand: 'expand',
    collapse: 'collapse',
    beforeExpand: 'beforeExpand',
    beforeCollapse: 'beforeCollapse',
};

const defaults = {
    isExpanded: false,
    toggleSelector: 'button',
    controlsId: null,
    expandingCssClass: 'is-expanding',
    collapsingCssClass: 'is-collapsing',
    expandedCssClass: 'is-expanded',
    collapsedCssClass: 'is-collapsed',
    animationTargetEl: null,
    animationEvent: 'animationend',
};

/**
    Hooks up a trigger element to control expand/collapse of a target element. Adds and updates necessary aria attributes.
    @param {Element} containerEl - the element that contains both the trigger and target elements
    @param {Object} options - additional options
	@return {Object} API methods
*/

function expander(containerEl, options = {}) {
    if (!containerEl) {
        console.error('Error in expander. No container element provided.');
        return {};
    }

    const settings = { ...defaults, ...options };

    const context = init(containerEl, settings);

    // if no toggle element found, throw error and don't return methods
    if (Object.keys(context).length === 0) {
        console.error(
            'Error in expander. No toggle element found in container.'
        );
        return {};
    }

    return {
        getElement: () => containerEl,
        expand: () => expand(context, settings),
        collapse: () => collapse(context, settings),
        getOptions: () => settings,
        setOptions: (options) => setOptions(options, settings),
        destroy: () => destroy(context, settings),
    };
}

function init(containerEl, settings) {
    const toggleEl = containerEl.querySelector(settings.toggleSelector);

    if (toggleEl) {
        const context = {
            containerEl,
            toggleEl,
        };

        if (settings.controlsId) {
            toggleEl.setAttribute('aria-controls', settings.controlsId);
        }

        context.onToggleClick = (e) => onToggleClick(e, context, settings);
        toggleEl.addEventListener('click', context.onToggleClick);

        updateElements(settings.isExpanded, context, settings);

        return context;
    }

    return {};
}

function onToggleClick(e, context, settings) {
    e.preventDefault();

    toggleExpand(context, settings);
}

function isExpanded(toggleEl) {
    return toggleEl.getAttribute('aria-expanded') === 'true';
}

function toggleExpand(context, settings, force) {
    const { containerEl, toggleEl } = context;
    const { animationTargetEl } = settings;

    const shouldExpand = force !== undefined ? force : !isExpanded(toggleEl);

    if (animationTargetEl) {
        animateToggleExpand(shouldExpand, context, settings);
    } else {
        updateElements(shouldExpand, context, settings);
        const eventName = shouldExpand ? events.expand : events.collapse;
        fireEvent(eventName, containerEl);
    }
}

function animateToggleExpand(shouldExpand, context, settings) {
    const { containerEl } = context;
    const {
        animationTargetEl,
        expandedCssClass,
        collapsedCssClass,
        expandingCssClass,
        collapsingCssClass,
    } = settings;

    const eventName = shouldExpand
        ? events.beforeExpand
        : events.beforeCollapse;
    fireEvent(eventName, containerEl);

    if (shouldExpand) {
        containerEl.classList.remove(collapsedCssClass);
        containerEl.classList.add(expandingCssClass);
    } else {
        containerEl.classList.remove(expandedCssClass);
        containerEl.classList.add(collapsingCssClass);
    }

    domEvent(animationTargetEl, settings.animationEvent).then(() => {
        updateElements(shouldExpand, context, settings);
        const eventName = shouldExpand ? events.expand : events.collapse;
        fireEvent(eventName, containerEl);
    });
}

function updateElements(
    shouldExpand,
    { containerEl, toggleEl },
    {
        expandedCssClass,
        collapsedCssClass,
        expandingCssClass,
        collapsingCssClass,
    }
) {
    containerEl.classList.remove(expandingCssClass, collapsingCssClass);
    containerEl.classList.toggle(expandedCssClass, shouldExpand);
    containerEl.classList.toggle(collapsedCssClass, !shouldExpand);
    toggleEl.setAttribute('aria-expanded', shouldExpand);
}

function fireEvent(eventName, containerEl) {
    dispatchEvent(containerEl, eventName, {}, { bubbles: true });
}

function expand(context, settings) {
    if (!isExpanded(context.toggleEl)) {
        toggleExpand(context, settings, true);
    }
}

function collapse(context, settings) {
    if (isExpanded(context.toggleEl)) {
        toggleExpand(context, settings, false);
    }
}

function setOptions(options, settings) {
    /* Need to do a manual merge rather than a reassignment of settings 
        so that we don't lose the reference elsewhere */
    Object.keys(options).forEach((key) => (settings[key] = options[key]));
}

function destroy(
    { containerEl, toggleEl, onToggleClick },
    { expandedCssClass }
) {
    if (toggleEl) {
        containerEl.classList.remove(expandedCssClass);
        toggleEl.removeAttribute('aria-expanded');
        toggleEl.removeEventListener('click', onToggleClick);
    }
}

export default expander;
