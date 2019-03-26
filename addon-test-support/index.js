
const screenshot = function (selector = 'body', opts) {
    return new Promise((resolve, reject) => {
        const dom = document.querySelector(selector);
        if (!dom) {
            return Promise.reject(new Error('element not found'));
        }
        var request = new XMLHttpRequest();
        request.open('POST', '/image_generation');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        const data = {
            selector
        };
        Object.assign(data, opts, data);
        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject(request.statusText);
            }
        };
        request.send(JSON.stringify(data))
    });
}

export {
    screenshot
};