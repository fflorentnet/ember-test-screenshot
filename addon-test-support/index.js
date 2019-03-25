// import html2canvas from 'npm:html2canvas';

const screenshot = function (selector) {
    console.log(...arguments);

    const dom = document.querySelector(selector);
    if (!dom) {
        return Promise.reject(new Error('element not found'));
    }
    return html2canvas(dom).then(function (canvas) {
        var request = new XMLHttpRequest();
        request.open('POST', '/image_generation');
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        return request.send(JSON.stringify({
            selector,
            image: canvas.toDataURL()
        }));        
    });
}

export {
    screenshot
};