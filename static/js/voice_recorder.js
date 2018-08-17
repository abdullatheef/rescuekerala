"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Audio recording
var audioToSend;
var audioBlob;
var recordAudio = function recordAudio() {
	return new Promise(async function (resolve) {
		var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		var mediaRecorder = new MediaRecorder(stream);
		var audioChunks = [];

		mediaRecorder.addEventListener("dataavailable", function (event) {
			audioChunks.push(event.data);
		});

		var start = function start() {
			audioChunks = [];
			mediaRecorder.start();
		};

		var stop = function stop() {
			return new Promise(function (resolve) {
				mediaRecorder.addEventListener("stop", function () {
					audioBlob = new Blob(audioChunks);
					var audioUrl = URL.createObjectURL(audioBlob);
					$('#recordedAudio').attr("src", audioUrl);
					var reader = new FileReader();
					reader.readAsDataURL(audioBlob);
					reader.onloadend = function () {
						audioToSend = reader.result;
					};
				});
				mediaRecorder.stop();
			});
		};

		resolve({ start: start, stop: stop });
	});
};
var recorder = recordAudio();

var AudioRecord = function () {
	function AudioRecord() {
		_classCallCheck(this, AudioRecord);
	}

	_createClass(AudioRecord, [{
		key: "getTextElem",
		value: function getTextElem(elem) {
			return this.getContent(elem).filter(function () {
				return this.nodeType == 3;
			});
		}
	}, {
		key: "getContent",
		value: function getContent(obj) {
			return $(obj).first().contents();
		}
	}, {
		key: "getTrimText",
		value: function getTrimText(obj) {
			return this.getTextElem(obj).text().trim();
		}
	}, {
		key: "toggleRecording",
		value: function toggleRecording(elem) {
			if (this.getTrimText(elem) == 'Record') {
				this.getTextElem(elem)[this.getContent(elem).length - 2].nodeValue = this.getTextElem(elem).text().replace("Record", "Stop");
				elem.style.background = '#f1595991';
				$('#recordedAudio').hide();
				recorder.then(function (obj) {
					obj.start();
				});
			} else {
				this.getTextElem(elem)[this.getContent(elem).length - 2].nodeValue = this.getTextElem(elem).text().replace("Stop", "Record");
				elem.style.background = '#fff';
				$('#recordedAudio').show();
				recorder.then(function (obj) {
					(async function () {
						var audio = await obj.stop();
					})();
				});
			}
		}
	}]);

	return AudioRecord;
}();
// End Audio recording