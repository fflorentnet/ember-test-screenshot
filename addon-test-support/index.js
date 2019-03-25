const screenshot = function (selector, opts) {
    const dom = document.querySelector(selector);
    if (!dom) {
        return Promise.reject(new Error('element not found'));
    }
    return html2canvas(dom).then(function (canvas) {
        var request = new XMLHttpRequest();
        request.open('POST', '/image_generation');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        const data = {
            selector,
            image: canvas.toDataURL()
        };
        Object.assign(data, opts, data);
        return request.send(JSON.stringify(data));
    });
}

export {
    screenshot
};