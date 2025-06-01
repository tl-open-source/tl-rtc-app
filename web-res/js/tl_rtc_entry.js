window.subModule = new Vue();

layui.use([
    'layedit', 'form', 'layer', 'laytpl', 'upload',
    'dropdown', 'carousel', 'util', 'colorpicker',
    'slider', 'carousel', 'element', 'laydate',
], function () {
    window.layer = layui.layer;
    window.form = layui.form;
    window.laydate = layui.laydate;
    window.$ = layui.$;
    window.layedit = layui.layedit;
    window.laytpl = layui.laytpl;
    window.upload = layui.upload;
    window.dropdown = layui.dropdown;
    window.carousel = layui.carousel;
    window.util = layui.util;
    window.colorpicker = layui.colorpicker;
    window.slider = layui.slider;
    window.element = layui.element;

    const loadJs = function (url, callback) {
        let script = document.createElement('script'),
            fn = callback || function () { };
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    loadJs('lib-basic-sdk.min.js', function () {
        loadJs('lib-component-sdk.min.js', function () {
            loadJs('lib-module-sdk.min.js', function () { });
        });
    });
});