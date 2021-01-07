jest.mock('@degjs/dom-event');

import expander from '../src/expander.js';

describe('expander inits', () => {
    global.console = {
        log: jest.fn(),
        error: jest.fn(),
    };

    afterEach(() => {
        global.console.log.mockReset();
        global.console.error.mockReset();
    });

    it('should handle no containerEl', () => {
        const expectedMsg = 'Error in expander. No container element provided.';
        const expanderInst = expander();

        expect(global.console.error).toHaveBeenCalled();
        expect(global.console.error).toHaveBeenCalledWith(expectedMsg);
        expect(expanderInst).toEqual({});
    });

    it('should handle no toggle element available', () => {
        document.body.innerHTML = `
            <div data-container></div>
        `;
        const containerEl = document.querySelector('[data-container]');
        const expectedMsg =
            'Error in expander. No toggle element found in container.';
        const expanderInst = expander(containerEl);

        expect(global.console.error).toHaveBeenCalled();
        expect(global.console.error).toHaveBeenCalledWith(expectedMsg);
        expect(expanderInst).toEqual({});
    });

    it('should set aria-controls', () => {
        document.body.innerHTML = `
            <div data-container>
                <button></button>
            </div>
        `;
        const containerEl = document.querySelector('[data-container]');
        const toggleEl = document.querySelector('button');
        expander(containerEl, { controlsId: 'mockEl' });

        const ariaAttr = toggleEl.getAttribute('aria-controls');
        expect(ariaAttr).toEqual('mockEl');
    });

    it('should return expander methods', () => {
        document.body.innerHTML = `
            <div data-container>
                <button></button>
            </div>
        `;
        const expectedReturn = {
            getElement: expect.any(Function),
            expand: expect.any(Function),
            collapse: expect.any(Function),
            getOptions: expect.any(Function),
            setOptions: expect.any(Function),
            destroy: expect.any(Function),
        };
        const containerEl = document.querySelector('[data-container]');
        const expanderInst = expander(containerEl, { controlsId: 'mockEl' });

        expect(expanderInst).toMatchObject(expectedReturn);
    });
});
