/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _app = __webpack_require__(1);

var _app2 = _interopRequireDefault(_app);

var _config = __webpack_require__(5);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = (0, _config2.default)("feedbackclear")['config'];
var parent = window.document.body;

if (config.hasOwnProperty('parent')) {
    parent = document.querySelector(config['parent']) || parent;
}

var app = new _app2.default(parent, config);
app.run();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dictaphone = __webpack_require__(2);

var _dictaphone2 = _interopRequireDefault(_dictaphone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dictaphone = null;
var parent = null;

var App = function () {
    function App(parentDom) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, App);

        this.options = options;
        parent = parentDom;
    }

    _createClass(App, [{
        key: "gotStream",
        value: function gotStream(stream) {
            dictaphone = new _dictaphone2.default(stream);
            parent.appendChild(dictaphone.el);
        }
    }, {
        key: "run",
        value: function run() {
            var _this = this;

            if (!navigator.getUserMedia) {
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            }

            navigator.getUserMedia({
                audio: {
                    mandatory: {
                        googEchoCancellation: "false",
                        googAutoGainControl: "false",
                        googNoiseSuppression: "false",
                        googHighpassFilter: "false"
                    },
                    optional: []
                }
            }, function (stream) {
                return _this.gotStream(stream);
            }, function (e) {
                alert("Error getting audio");
                console.log(e);
            });
        }
    }]);

    return App;
}();

exports.default = App;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _recorderjs = __webpack_require__(3);

var _recorderjs2 = _interopRequireDefault(_recorderjs);

var _wsclientWorker = __webpack_require__(4);

var _wsclientWorker2 = _interopRequireDefault(_wsclientWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var wsWorker = new _wsclientWorker2.default();
wsWorker.addEventListener("message", function (event) {
    console.log("Message from wsworker " + event);
});

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioRecorder = null;
var recordButton = void 0;
var container = void 0;
var timer = null;
var BATCH_INTERAVAL = 250;

function initDom() {
    var _this = this;

    container = document.createElement("div");
    container.classList.add("fcdictaphone");

    recordButton = document.createElement("button");
    recordButton.innerText = "Play";
    recordButton.classList.add("fcdictaphone__button", "fcdictaphone__button--play");
    container.appendChild(recordButton);
    recordButton.addEventListener("click", function (e) {
        if (recordButton.classList.contains("fcdictaphone__button--play")) {
            recordButton.innerText = "Stop";
            recordButton.classList.toggle("fcdictaphone__button--play");
            recordButton.classList.toggle("fcdictaphone__button--stop");
            // call  start recording
            _this.start();
            return;
        }

        recordButton.classList.toggle("fcdictaphone__button--play");
        recordButton.classList.toggle("fcdictaphone__button--stop");
        recordButton.innerText = "Play";
        // call stop recording
        _this.stop();
    });

    return container;
}

function initRecorder(stream) {
    var inputPoint = audioContext.createGain();
    // Create an AudioNode from the stream.
    var realAudioInput = audioContext.createMediaStreamSource(stream);
    var audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    audioRecorder = new _recorderjs2.default(inputPoint);

    var zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);
}

function sendVoiceBatch(buffer) {
    wsWorker.postMessage({
        command: "send",
        buffer: buffer
    });
}

var Dictaphone = function () {
    function Dictaphone(stream) {
        _classCallCheck(this, Dictaphone);

        initRecorder.call(this, stream);
        this.el = initDom.call(this);

        wsWorker.postMessage({
            command: "init",
            apikey: "123"
        });
    }

    _createClass(Dictaphone, [{
        key: "start",
        value: function start() {
            audioRecorder.clear();
            audioRecorder.record();
            timer = setInterval(function () {
                audioRecorder.getBuffer(function (buffer) {
                    sendVoiceBatch(buffer);
                });
                audioRecorder.clear();
            }, BATCH_INTERAVAL);
        }
    }, {
        key: "stop",
        value: function stop() {
            audioRecorder.getBuffer(function (buffer) {
                sendVoiceBatch(buffer);
            });
            wsWorker.postMessage({
                command: "stop"
            });
            audioRecorder.stop();
            clearInterval(timer);
        }
    }]);

    return Dictaphone;
}();

exports.default = Dictaphone;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var WORKER_PATH = './recorderWorker.js';

var Recorder = function(source, cfg){
  var config = cfg || {};
  var bufferLen = config.bufferLen || 4096;
  this.context = source.context;
  this.node = (this.context.createScriptProcessor ||
               this.context.createJavaScriptNode).call(this.context,
                                                       bufferLen, 2, 2);
  var worker = new Worker(WORKER_PATH);
  worker.onmessage = function(e){
    var blob = e.data;
    currCallback(blob);
  }

  worker.postMessage({
    command: 'init',
    config: {
      sampleRate: this.context.sampleRate
    }
  });
  var recording = false,
    currCallback;

  this.node.onaudioprocess = function(e){
    if (!recording) return;
    worker.postMessage({
      command: 'record',
      buffer: [
        e.inputBuffer.getChannelData(0),
        e.inputBuffer.getChannelData(1)
      ]
    });
  }

  this.configure = function(cfg){
    for (var prop in cfg){
      if (cfg.hasOwnProperty(prop)){
        config[prop] = cfg[prop];
      }
    }
  }

  this.record = function(){
    recording = true;
  }

  this.stop = function(){
    recording = false;
  }

  this.clear = function(){
    worker.postMessage({ command: 'clear' });
  }

  this.getBuffer = function(cb) {
    currCallback = cb || config.callback;
    worker.postMessage({ command: 'getBuffer' })
  }

  this.exportWAV = function(cb, type){
    currCallback = cb || config.callback;
    type = type || config.type || 'audio/wav';
    if (!currCallback) throw new Error('Callback not set');
    worker.postMessage({
      command: 'exportWAV',
      type: type
    });
  }

  source.connect(this.node);
  this.node.connect(this.context.destination);    //this should not be necessary
};

Recorder.forceDownload = function(blob, filename){
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var link = window.document.createElement('a');
  link.href = url;
  link.download = filename || 'output.wav';
  var click = document.createEvent("Event");
  click.initEvent("click", true, true);
  link.dispatchEvent(click);
}

module.exports = Recorder;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return new Worker(__webpack_require__.p + "81feeec91e3b39bfd99a.worker.js");
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (scope) {
    var configVarName = window[scope],
        params = [],
        options = {};

    if (configVarName == void 0) {
        throw new Error("Widget init with wrong config container");
    }

    params = window[configVarName].q || [];
    params.forEach(function (currentValue, index, array) {
        var name = Array.prototype.slice.call(currentValue, 0, 1)[0];
        options[name] = Array.prototype.slice.call(currentValue, 1)[0];
    });

    return options;
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map