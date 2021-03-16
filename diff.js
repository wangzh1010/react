var c = document.getElementById('abc');
var t = document.getElementById('def');
var refNode = t.nextSibling;
var newChild = document.createElement('p');
newChild.textContent = 'newChild';
c.insertBefore(newChild, refNode)
var oVnode = [{ tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'bbb', key: 'b' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'ddd', key: 'd' }];

// var nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'bbb', key: 'b' }];

// var nVnode = [{ tag: 'div', value: 'eee', key: 'e' }, { tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'bbb', key: 'b' }];
// var nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'div', value: 'eee', key: 'e' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'bbb', key: 'b' }];
// var nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'div', value: 'eee', key: 'e' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'bbb', key: 'b' }];
// var nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'div', value: 'eee', key: 'e' }, { tag: 'p', value: 'bbb', key: 'b' }];
// var nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'bbb', key: 'b' }, { tag: 'div', value: 'eee', key: 'e' }];

var nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'bbb', key: 'b' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'fff', key: 'f' } ];


var root = document.getElementById('box');

oVnode.forEach(vnode => {
    var el = document.createElement(vnode.tag);
    el.textContent = vnode.value;
    vnode.el = el;
    root.appendChild(el);
})

setTimeout(refresh, 2000);

setTimeout(() => {
    oVnode = nVnode;
    nVnode = [{ tag: 'p', value: 'ddd', key: 'd' }, { tag: 'p', value: 'aaa', key: 'a' }, { tag: 'p', value: 'ccc', key: 'c' }, { tag: 'p', value: 'bbb', key: 'b' }, { tag: 'div', value: 'eee', key: 'e' }];
    refresh();
}, 4000)

function refresh() {
    for (let i = 0; i < nVnode.length; i++) {
        let vnode = nVnode[i];
        let j = 0;
        let find = false;
        for (; j < oVnode.length; j++) {
            if (vnode.key === oVnode[j].key) {
                oVnode[j].using = true;
                find = true;
                break;
            }
        }
        let refNode = root.childNodes[i];
        if (!find) {
            // create new element
            let el = document.createElement(vnode.tag);
            el.textContent = vnode.value;
            vnode.el = el;
            root.insertBefore(vnode.el, refNode);
        } else {
            vnode.el = oVnode[j].el;
            if (oVnode[j].el !== refNode) {
                root.insertBefore(oVnode[j].el, refNode);
            } else {
                console.log('hit', refNode)
            }
        }
    }

    for (let i = 0; i < oVnode.length; i++) {
        if (!oVnode[i].using) {
            root.removeChild(oVnode[i].el);
        }
    }
}
