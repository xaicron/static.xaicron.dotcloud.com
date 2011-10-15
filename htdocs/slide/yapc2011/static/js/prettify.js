(function() {
    if (typeof prettyPrint === 'function') {
        var pre = document.getElementsByTagName('pre');
        for (var n = pre.length; n --> 0;) {
            pre[n].className = (pre[n].className || '').split(/[ \t\r\n]+/).concat('prettyprint').join(' ')
        }
        prettyPrint();
    }
})();
