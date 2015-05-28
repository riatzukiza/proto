Math.randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min ) + min);
};
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    //hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
Object.convertToString = function convertToText(obj,depth,objectList) {
  //create an array that will later be joined into a string.
  var string = [];
  if(is.not("defined",objectList))var objectList = [];
  if(is.not("defined",depth))var depth = 100;
  //is object
  //    Both arrays and objects seem to return "object"
  //    when typeof(obj) is applied to them. So instead
  //    I am checking to see if they have the property
  //    join, which normal objects don't have but
  //    arrays do.
  if(objectList.indexOf(obj) == -1 && depth-- > 0)  {
    //console.log("not circular",obj);
    if (typeof(obj) == "object" && !(Array.isArray(obj)) && obj != null) {
      objectList.push(obj);
      string.push("{");
      obj.forIn(function(prop)  {
      //objectList.push(obj[prop]);
        string.push("\"",prop, "\": ", convertToText(obj[prop],depth,objectList), ",");
      });
      string.push("}");

      //is array
    } else if (typeof(obj) == "object" && (Array.isArray(obj))) {
      objectList.push(obj);
      string.push("[")
      obj.forIn(function(prop)  {
        //objectList.push(obj[prop]);
        string.push(convertToText(obj[prop],depth,objectList), ",");
      });
      string.push("]")

      //is function
    } else if (typeof(obj) == "function") {
      string.push(obj.toString())

      //all other values can be done with JSON.stringify
    } else {
      string.push(JSON.stringify(obj));
      //string.push("\"",obj.toString(),"\"")
    }
  } else if(depth <= 0) {
    console.log("depth limit reached");
    string.push("\"["+typeof obj+"]\"");
  } else {
    string.push("\"[circular reference]\"");
  }

  return string.join("")
};
Object.evaluateString = function evaluateLitteral(litteral)  {
  return eval("("+litteral+")");
};
String.prototype.parse = function()  {
  return Object.evaluateString(this);
};
Object.defineProperty(Object.prototype,"stringify",{value: function(depth)  {
  return Object.convertToString(this,depth);
}});
Object.defineProperty(Object.prototype,"forIn",{
  value:function(callback)  {
    Object.keys(this).forEach(callback,this);
  }
});
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
//global.reqDir = require("./core/reqDir.js");
Object.defineProperty(Array.prototype,"last",{get:function(){return this[this.length-1]}});
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);
global.parseArgumentObject = function(args)  {
  return slice(args,0);
};
