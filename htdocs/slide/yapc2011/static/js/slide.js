(function() {
var width = 0;
var listView = false;
var imgTags = document.getElementsByTagName('img');
var fontTimer = setInterval(function(){
    if (!listView && width != document.documentElement.clientWidth) {
        width = document.documentElement.clientWidth;
        document.body.style.fontSize = width / 5 + '%';
        for (var i = 0, l = imgTags.length; i < l; i++) {
            imgTags[i].style.maxWidth = width * 0.8 + 'px';
        }
    }
}, 100);
var dateTimer = setInterval(function() {
    document.getElementById('date').innerHTML = (new Date()).toLocaleString();
}, 100);

var slides = [];
var stash  = {};
var NC = 'next';
var PC = 'prev';
var VC = 'view';
var LC = 'list';
var articles = document.querySelectorAll('body > section');
for (var i = 0, l = articles.length; i < l; i++) {
    var section = articles[i];
    section.id = i + 1;
    var name = section.className || '';
    addClass(section, NC);
    slides.push(section);
}

var current = 0;
var count = slides.length;

var KEYBORD = {
    Left  : 37,
    Up    : 38,
    Right : 39,
    Down  : 40,
    Enter : 13,
    H     : 72,
    J     : 74,
    K     : 75,
    L     : 76,
    O     : 79,
    Help  : 191, // ? or /
};
document.onkeydown = function(e) {
    if (!e) {
        e = window.event;
    }
    var key = e.keyCode;
    console.log(key);
    if ((key === KEYBORD.J || key === KEYBORD.Right) && slides[current+1]) {
        listView === false ? next() : nextlist();
    }
    else if ((key === KEYBORD.K || key === KEYBORD.Left) && slides[current-1]) {
        listView === false ? prev() : prevlist();
    }
    else if ((key === KEYBORD.H || key === KEYBORD.Up) && listView === false) {
        for (var i = 0, l = slides.length; i < l; i++) {
            stash[i] = {
                "class": slides[i].className,
                "click": (function(page) {
                    return function() {
                        location.hash = page + 1;
                        location.reload();
                    }
                })(i),
                "focused": i === current ? true : false,
            };
            replaceClass(slides[i], [NC, PC, VC, 'focus'], 'invisible');
        }
        document.getElementById('page').style.display = 'none';
        document.getElementById('date').style.display = 'none';
        setTimeout(function() {
            width = null;
            document.body.style.fontSize = '3%';
            for (var i = 0, l = imgTags.length; i < l; i++) {
                imgTags[i].style.maxWidth = width * 0.15 * 0.8 + 'px';
            }
            listView = true;
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].addEventListener('click', stash[i].click, false);
                replaceClass(slides[i], ['invisible'], LC);
                if (stash[i].focused) {
                    addClass(slides[i], 'focus');
                }
            }
        }, 500);
    }
    else if ((key === KEYBORD.L || key === KEYBORD.Down) && listView === true) {
        for (var i = 0, l = slides.length; i < l; i++) {
            replaceClass(slides[i], [LC, 'focus'], 'invisible');
            replaceClass(slides[i], ['focus'], 'up');
        }
        listView = false;
        setTimeout(function() {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].removeEventListener('click', stash[i].click, false);
                var className = stash[i].class;
                replaceClass(slides[i], ['invisible', 'up'], className);
            }
        }, 500);
    }
    else if ((key === KEYBORD.O || key === KEYBORD.Enter) && listView === true) {
        listView = false;
        stash[current].click();
    }
    else if (key === KEYBORD.Help) {
        toggleHelp();
    }
};

setTimeout(function(){
    var matched;
    document.getElementById('page').style.display = 'block';
    document.getElementById('date').style.display = 'block';
    if (matched = location.hash.match(/^#(\d+)$/)){
        current = +matched[1] - 1;
        for (var i = 0; i < current && slides[i]; i++){
            replaceClass(slides[i], [NC, VC], PC);
        }
        replaceClass(slides[current], [PC, NC], VC);
    }
    else {
        replaceClass(slides[0], [PC, NC], VC);
    }
}, 500);

/* utility functions */
function next() {
    replaceClass(slides[current++], [NC, VC], PC);
    replaceClass(slides[current], [PC, NC], VC);
    location.hash = current + 1;
}
function prev() {
    replaceClass(slides[current--], [PC, VC], NC);
    replaceClass(slides[current], [PC, NC], VC);
    location.hash = current + 1;
}
function nextlist() {
    removeClass(slides[current], 'focus');
    stash[current++].class = PC;
    addClass(slides[current], 'focus');
    stash[current].class = VC;
    location.hash = current + 1;
}
function prevlist() {
    removeClass(slides[current], 'focus');
    stash[current--].class = NC;
    addClass(slides[current], 'focus');
    stash[current].class = VC;
    location.hash = current + 1;
}
function removeClass(elem, targets) {
    if (typeof targets !== "object") { // non-array
        targets = [targets];
    }
    var targetMap = {};
    for (var i = 0, l = targets.length; i < l; i++) {
        targetMap[targets[i]] = 1;
    }

    var classes = elem.className.split(/ /);
    var result = [];
    for (var i = 0, l = classes.length; i < l; i++) {
        var name = classes[i];
        if (!targetMap[name]) {
            result.push(name);
        }
    }
    elem.className = result.join(' ');
}
function addClass(elem, target) {
    if (elem.className !== '') {
        elem.className += ' ' + target;
    }
    else {
        elem.className = target;
    }
}
function replaceClass(elem, from, to) {
    removeClass(elem, from);
    addClass(elem, to);
}

var helpElem = document.getElementById('help');
function toggleHelp() {
    helpElem.style.display = (helpElem.style.display !== 'block') ? 'block' : 'none';
}

var pageElem = document.getElementById('page');
var countTimer = setInterval(function(){
    pageElem.innerHTML = current + 1;
}, 100);

})();
