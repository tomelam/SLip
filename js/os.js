var $slice = Array.prototype.slice;
var $concat = Array.prototype.concat;
function slice(obj, from) { return $slice.call(obj, from || 0) };

var $HOP = Object.prototype.hasOwnProperty;
function HOP(obj, prop) { return $HOP.call(obj, prop) };

function defaults(args, defs) {
        var ret = {};
        if (args === true || !args)
                args = {};
        for (var i in defs) if (HOP(defs, i)) {
                ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
        }
        return ret;
};

function defmerge(target, args, defs) {
        var ret = {};
        if (args === true || !args)
                args = {};
        for (var i in defs) if (HOP(defs, i)) {
                target[i] = ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
        }
        return ret;
};

function compose(a, rest) {
    if (rest == null) return a;
    rest = compose.apply(null, [].slice.call(arguments, 1));
    return function() { return a(rest.apply(this, arguments)) };
};

function curry(f, args) {
        return function() { return f.apply(this, args.concat($slice.apply(arguments))); };
};

function pushnew(a, el) {
        if (a.indexOf(el) < 0)
                a.push(el);
        return a;
};

function member(a, el) {
        return a.indexOf(el) >= 0;
};

function noop(){};

function repeat_string(str, i) {
        if (i <= 0) return "";
        if (i == 1) return str;
        var d = repeat_string(str, i >> 1);
        d += d;
        if (i & 1) d += str;
        return d;
};

function pad_string(str, width) {
        str += "";
        return str + repeat_string(" ", width - str.length);
};

var DEFCLASS = this.DEFCLASS = (function(NOINIT){
        return function(name, BASE, func) {
                var code;
                code = "return function " + (name || "D") + " (args){\n\
if (args !== NOINIT) {\n\
args = slice(arguments);\n\
args = this.BEFORE_BASE && this.BEFORE_BASE(args) || args;\n\
if (BASE) BASE.apply(this, args);\n\
" + (name || "D") + ".INIT.apply(this, args);\n\
}}";
                var D = new Function("BASE", "NOINIT", "slice", code)(BASE, NOINIT, slice);
                D.INIT = noop;
                if (BASE) {
                        D.BASE = BASE;
                        D.prototype = new BASE(NOINIT);
                }
                var P = D.prototype;
                if (name) P.$objectType = name;
                P.constructor = D;
                func(D, P, BASE);
                return D;
        };
})({});