const domEvent = jest.fn(() => {
    return new Promise((resolve) => {
        process.nextTick(() => resolve());
    });
});

module.exports = domEvent;
