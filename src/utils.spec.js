import { dispatchEvent } from './utils.js';

describe('dispatchEvent', () => {
    const eventName = 'mockEvent';

    it('should dispatch a custom event', () => {
        const mockDiv = document.createElement('div');
        const mockCallback = jest.fn(() => {});
        mockDiv.addEventListener(eventName, mockCallback);

        dispatchEvent(mockDiv, eventName);

        expect(mockCallback).toHaveBeenCalled();
    });
});
