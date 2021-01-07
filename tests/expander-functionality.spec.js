jest.mock('@degjs/dom-event');
jest.mock('../src/utils', () => ({
    dispatchEvent: jest.fn(),
}));

import expander from '../src/expander.js';
import utils from '../src/utils';
import domEvent from '@degjs/dom-event';

describe('expander functionality', () => {
    describe('getElement', () => {
        it('should return container element', () => {
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;

            const containerEl = document.querySelector('[data-container]');
            const expanderInst = expander(containerEl);

            const returnedEl = expanderInst.getElement();

            expect(returnedEl).toBe(containerEl);
        });
    });

    describe('expand', () => {
        let containerEl;
        let expanderInst;

        beforeEach(() => {
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;

            containerEl = document.querySelector('[data-container]');
            expanderInst = expander(containerEl);
        });

        afterEach(() => {
            jest.clearAllMocks();
            expanderInst.destroy();
            expanderInst = null;
            containerEl = null;
        });

        it('should dispatch expand event', () => {
            expanderInst.expand();

            expect(utils.dispatchEvent).toHaveBeenCalled();
            expect(utils.dispatchEvent).toHaveBeenCalledWith(
                containerEl,
                'expand',
                expect.any(Object),
                expect.any(Object)
            );
        });

        it('should add expanded class', () => {
            expanderInst.expand();

            expect(containerEl.classList.contains('is-expanded')).toBe(true);
        });

        it('should remove collapsed class', () => {
            expanderInst.expand();

            expect(containerEl.classList.contains('is-collapsed')).toBe(false);
        });

        it('should remove animation classes', () => {
            expanderInst.expand();

            expect(containerEl.classList.contains('is-collapsing')).toBe(false);
            expect(containerEl.classList.contains('is-expanding')).toBe(false);
        });

        it('should set aria-expanded attribute', () => {
            const toggleEl = containerEl.querySelector('button');
            expanderInst.expand();
            const ariaAttr = toggleEl.getAttribute('aria-expanded');

            expect(ariaAttr).toEqual('true');
        });
    });

    describe('collapse', () => {
        let expanderInst;
        let containerEl;

        beforeEach(() => {
            // for each test initialize some markup,
            // the container element, and an expanded instance of the expander
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;
            containerEl = document.querySelector('[data-container]');
            expanderInst = expander(containerEl, {
                isExpanded: true,
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
            expanderInst.destroy();
            expanderInst = null;
            containerEl = null;
        });

        it('should dispatch collapse event', () => {
            expanderInst.collapse();

            expect(utils.dispatchEvent).toHaveBeenCalled();
            expect(utils.dispatchEvent).toHaveBeenCalledWith(
                containerEl,
                'collapse',
                expect.any(Object),
                expect.any(Object)
            );
        });

        it('should add collapsed class', () => {
            expanderInst.collapse();

            expect(containerEl.classList.contains('is-collapsed')).toBe(true);
        });

        it('should remove expanded class', () => {
            expanderInst.collapse();

            expect(containerEl.classList.contains('is-expanded')).toBe(false);
        });

        it('should remove animation classes', () => {
            expanderInst.collapse();

            expect(containerEl.classList.contains('is-collapsing')).toBe(false);
            expect(containerEl.classList.contains('is-expanding')).toBe(false);
        });

        it('should set aria-expanded attribute', () => {
            const toggleEl = containerEl.querySelector('button');
            expanderInst.collapse();
            const ariaAttr = toggleEl.getAttribute('aria-expanded');

            expect(ariaAttr).toEqual('false');
        });
    });

    describe('toggle on click', () => {
        let containerEl;
        let expanderInst;
        let toggleEl;

        beforeEach(() => {
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;
            containerEl = document.querySelector('[data-container]');
            toggleEl = containerEl.querySelector('button');
            expanderInst = expander(containerEl);
        });

        afterEach(() => {
            jest.clearAllMocks();
            expanderInst.destroy();
            expanderInst = null;
            containerEl = null;
            toggleEl = null;
        });

        it('should expand content', () => {
            toggleEl.click();
            expect(utils.dispatchEvent).toHaveBeenCalled();
            expect(utils.dispatchEvent).toHaveBeenCalledWith(
                containerEl,
                'expand',
                expect.any(Object),
                expect.any(Object)
            );
        });

        it('should collapse content if already open', () => {
            expanderInst.expand();
            toggleEl.click();
            expect(utils.dispatchEvent).toHaveBeenCalled();
            expect(utils.dispatchEvent).toHaveBeenCalledWith(
                containerEl,
                'collapse',
                expect.any(Object),
                expect.any(Object)
            );
        });
    });

    describe('animate action', () => {
        describe('expanding', () => {
            let containerEl;
            let expanderInst;

            beforeEach(() => {
                document.body.innerHTML = `
                    <div data-container>
                        <button></button>
                    </div>
                `;
                containerEl = document.querySelector('[data-container]');
                expanderInst = expander(containerEl, {
                    animationTargetEl: containerEl,
                });
            });

            afterEach(() => {
                jest.clearAllMocks();
                expanderInst.destroy();
                expanderInst = null;
                containerEl = null;
            });

            it('should fire expanding event', () => {
                expanderInst.expand();

                expect(utils.dispatchEvent).toHaveBeenCalled();
                expect(utils.dispatchEvent).toHaveBeenCalledWith(
                    containerEl,
                    'beforeExpand',
                    expect.any(Object),
                    expect.any(Object)
                );
            });

            it('should update classes', () => {
                expanderInst.expand();
                expect(containerEl.classList.contains('is-expanding')).toBe(
                    true
                );
                expect(containerEl.classList.contains('is-collapsed')).toBe(
                    false
                );
            });

            it('should fire add listener for animationend', () => {
                expanderInst.expand();
                expect(domEvent).toHaveBeenCalled();
            });

            it('should fire expand event when complete', async () => {
                expanderInst.expand();
                await domEvent();
                expect(utils.dispatchEvent).toHaveBeenCalled();
                expect(utils.dispatchEvent).toHaveBeenCalledWith(
                    containerEl,
                    'expand',
                    expect.any(Object),
                    expect.any(Object)
                );
            });

            it('should update element on expand', async () => {
                expanderInst.expand();
                await domEvent();

                expect(containerEl.classList.contains('is-expanding')).toBe(
                    false
                );
                expect(containerEl.classList.contains('is-collapsing')).toBe(
                    false
                );
                expect(containerEl.classList.contains('is-expanded')).toBe(
                    true
                );
                expect(containerEl.classList.contains('is-collapsed')).toBe(
                    false
                );
            });
        });

        describe('collapsing', () => {
            let containerEl;
            let expanderInst;

            beforeEach(() => {
                document.body.innerHTML = `
                    <div data-container>
                        <button></button>
                    </div>
                `;
                containerEl = document.querySelector('[data-container]');
                expanderInst = expander(containerEl, {
                    animationTargetEl: containerEl,
                    isExpanded: true,
                });
            });

            afterEach(() => {
                jest.clearAllMocks();
                expanderInst.destroy();
                expanderInst = null;
                containerEl = null;
            });

            it('should fire collapsing event', () => {
                expanderInst.collapse();

                expect(utils.dispatchEvent).toHaveBeenCalled();
                expect(utils.dispatchEvent).toHaveBeenCalledWith(
                    containerEl,
                    'beforeCollapse',
                    expect.any(Object),
                    expect.any(Object)
                );
            });

            it('should update classes', () => {
                expanderInst.collapse();

                expect(containerEl.classList.contains('is-collapsing')).toBe(
                    true
                );
                expect(containerEl.classList.contains('is-expanded')).toBe(
                    false
                );
            });

            it('should fire add listener for animationend', () => {
                expanderInst.collapse();
                expect(domEvent).toHaveBeenCalled();
            });

            it('should fire completed event on collapse', async () => {
                expanderInst.collapse();
                await domEvent();
                expect(utils.dispatchEvent).toHaveBeenCalled();
                expect(utils.dispatchEvent).toHaveBeenCalledWith(
                    containerEl,
                    'collapse',
                    expect.any(Object),
                    expect.any(Object)
                );
            });

            it('should update element on collapse', async () => {
                expanderInst.collapse();
                await domEvent();

                expect(containerEl.classList.contains('is-expanding')).toBe(
                    false
                );
                expect(containerEl.classList.contains('is-collapsing')).toBe(
                    false
                );
                expect(containerEl.classList.contains('is-expanded')).toBe(
                    false
                );
                expect(containerEl.classList.contains('is-collapsed')).toBe(
                    true
                );
            });
        });
    });

    describe('getOptions', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;
        });

        it('should return default opts if none set', () => {
            const expectedOpts = {
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

            const containerEl = document.querySelector('[data-container]');
            const expanderInst = expander(containerEl);

            const returnedOpts = expanderInst.getOptions();

            expect(returnedOpts).toEqual(expectedOpts);
        });

        it('should return opts if some set', () => {
            const expectedOpts = {
                isExpanded: false,
                toggleSelector: 'button',
                controlsId: 'mockEl',
                expandingCssClass: 'is-expanding',
                collapsingCssClass: 'is-collapsing',
                expandedCssClass: 'is-expanded',
                collapsedCssClass: 'collapsed',
                animationTargetEl: null,
                animationEvent: 'animationend',
            };

            const containerEl = document.querySelector('[data-container]');
            const expanderInst = expander(containerEl, {
                controlsId: 'mockEl',
                collapsedCssClass: 'collapsed',
            });

            const returnedOpts = expanderInst.getOptions();

            expect(returnedOpts).toEqual(expectedOpts);
        });
    });

    describe('setOptions', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;
        });

        it('should update single option', () => {
            const expectedOpts = {
                isExpanded: false,
                toggleSelector: 'button',
                controlsId: 'mockEl',
                expandingCssClass: 'is-expanding',
                collapsingCssClass: 'is-collapsing',
                expandedCssClass: 'is-expanded',
                collapsedCssClass: 'is-collapsed',
                animationTargetEl: null,
                animationEvent: 'animationend',
            };
            const containerEl = document.querySelector('[data-container]');
            const expanderInst = expander(containerEl);

            expanderInst.setOptions({ controlsId: 'mockEl' });
            const returnedOpts = expanderInst.getOptions();

            expect(returnedOpts).toEqual(expectedOpts);
        });

        it('should update multiple options', () => {
            const expectedOpts = {
                isExpanded: false,
                toggleSelector: 'button',
                controlsId: 'mockEl',
                expandingCssClass: 'is-expanding',
                collapsingCssClass: 'is-collapsing',
                expandedCssClass: 'is-expanded',
                collapsedCssClass: 'collapsed',
                animationTargetEl: null,
                animationEvent: 'animationend',
            };
            const containerEl = document.querySelector('[data-container]');
            const expanderInst = expander(containerEl);

            expanderInst.setOptions({
                controlsId: 'mockEl',
                collapsedCssClass: 'collapsed',
            });
            const returnedOpts = expanderInst.getOptions();

            expect(returnedOpts).toEqual(expectedOpts);
        });
    });

    describe('destroy', () => {
        let containerEl;
        let expanderInst;
        let toggleEl;

        beforeEach(() => {
            document.body.innerHTML = `
                <div data-container>
                    <button></button>
                </div>
            `;
            containerEl = document.querySelector('[data-container]');
            toggleEl = containerEl.querySelector('button');
            expanderInst = expander(containerEl, {
                animationTargetEl: containerEl,
                isExpanded: true,
            });
        });

        afterEach(() => {
            jest.clearAllMocks();
            expanderInst = null;
            containerEl = null;
            toggleEl = null;
        });

        it('should remove expanded class', () => {
            expanderInst.destroy();
            expect(containerEl.classList.contains('is-expanded')).toBe(false);
        });

        it('should remove collapsed class', () => {
            expanderInst.collapse();
            expanderInst.destroy();
            expect(containerEl.classList.contains('is-expanded')).toBe(false);
        });

        it('should remove aria-expanded', () => {
            expanderInst.destroy();
            const ariaAttr = toggleEl.getAttribute('aria-expanded');
            expect(ariaAttr).toBe(null);
        });

        it('should remove click listener', () => {
            expanderInst.destroy();
            toggleEl.click();
            expect(utils.dispatchEvent).not.toHaveBeenCalled();
        });
    });
});
