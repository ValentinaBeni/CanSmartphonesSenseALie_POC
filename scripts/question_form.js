import questions from '../data/questions.json'  with { type: 'json' };

// Data structure
var sessionData = {
	"activityStartTimeMs": null,
	"activityEndTimeMs": null,
	"studyMode": null,
	"selectedProfile": null,
	"detectedLayout": null,
	"detectedOneHanded": null,
	"userAgent": null,
	"platform": null,
	"userAgentPlatform": null,
	"isMobile": null,
	"deviceMemory": null,
	"online": null,
	"devicePostureType": null,
	"languages": null,
	"questionsData": []
}

var questionData = {
	"startTimeMs": null,
	"endTimeMs": null,
	"questionId": null,
	"questionText": null,
	"questionType": null,
	"cancellationCount": null,
	"suggestionCount": null,
	"focusCount": null,
	"accelerometer": { x: [], y: [], z: [], timestamp: [] },
	"gyroscope": { alpha: [], beta: [], gamma: [], timestamp: [] },
	"questionAnswerTimestamp": null,
	"keyboard": []
}

var keyboardData = {
	"index": null,
	"composedValue": null
}

var currentQuestionIndex = 0;
var lastTimestampGyroMs = 0;
var lastTimestampAccelMs = 0;
var samplingIntervalMs = 5;


export function setupQuestionForm(studyMode, selectedProfile) {
	const buttonSubmitAnswer = document.getElementById('buttonSubmitAnswer');
	buttonSubmitAnswer.addEventListener('click', () => {
		submitAnswer()
	})

	window.addEventListener('orientationchange', () => {
		window.location.reload();
	});

	const inputField = document.getElementById('inputField');
	inputField.addEventListener('focus', () => {
		recordFocusEvent(inputField.value);
	});

	window.addEventListener('deviceorientation', (e) => {
		recordDeviceOrientationEvent(e);
	});

	window.addEventListener('devicemotion', (e) => {
		recordDeviceMotionEvent(e);
	});

	inputField.addEventListener('keydown', (e) => {
		recordKeyDownEvent(e, inputField.value);
	});

	inputField.addEventListener('input', (e) => {
		recordInputEvent(e, inputField.value);
	});

	inputField.addEventListener('keyup', (e) => {
		recordKeyupEvent(e, inputField.value);
	});

	questions.sort(() => Math.random() - 0.5); // Shuffle questions

	sessionData.activityStartTimeMs = performance.now();
	sessionData.studyMode = studyMode;
	sessionData.selectedProfile = selectedProfile;

	updateDeviceInfo();
	displayQuestion(currentQuestionIndex);
}

function displayQuestion(currentQuestionIndex) {
	if (currentQuestionIndex >= questions.length) {
		completeStudy();
		return;
	}

	cleanQuestionData()
	const question = questions[currentQuestionIndex];

	document.getElementById('questionText').textContent = question.text;

	questionData.startTimeMs = performance.now();
	questionData.questionId = question.id;
	questionData.questionText = question.text;
	questionData.questionType = question.type;

	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
	document.getElementById('progressFill').style.width = progress + '%';
	document.getElementById('progressText').textContent = Math.floor(progress) + '%';
	document.getElementById('questionCounter').textContent = `Domanda ${currentQuestionIndex + 1} di ${questions.length}`;

	const inputField = document.getElementById('inputField');
	inputField.value = '';
	inputField.focus();
}

function updateDeviceInfo() {
	const orientation = window.screen?.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
	const layout = orientation.startsWith('landscape') ? 'horizontal' : 'vertical';
	sessionData.detectedLayout = layout;

	if (window.visualViewport) {
		const ratio = window.visualViewport.width / window.innerWidth;
		sessionData.detectedOneHanded = ratio < 0.75 || Math.abs(window.visualViewport.offsetLeft) > 0;
	}

	sessionData.userAgent = navigator.userAgent;
	sessionData.userAgentPlatform = navigator.userAgentData.platform;
	sessionData.isMobile = navigator.userAgentData.mobile;
	sessionData.platform = navigator.platform;
	sessionData.deviceMemory = navigator.deviceMemory || 'N/A';
	sessionData.online = navigator.onLine;
	sessionData.devicePostureType = navigator.devicePosture.type;
	sessionData.languages = navigator.languages;
}

function submitAnswer() {
	const inputField = document.getElementById('inputField');
	const answer = inputField.value.trim();

	if (!answer) {
		alert('Si prega di fornire una risposta prima di continuare.');
		return;
	}

	questionData.endTimeMs = performance.now();
	questionData.questionAnswerTimestamp = new Date().toISOString();
	questionData.answer = answer;

	sessionData.questionsData.push({ ...questionData })

	currentQuestionIndex++;
	displayQuestion(currentQuestionIndex);
}

async function completeStudy() {
	console.log("Form completed")
	const questionForm = document.getElementById('questionForm');
	questionForm.classList.add('hidden');

	const waitingPage = document.getElementById('waitingPage');
	waitingPage.classList.remove('hidden');

	sessionData['activityEndTimeMs'] = performance.now();


	const content = JSON.stringify(sessionData, null, 2);
	const blob = new Blob([content], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "data.json"; 
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	waitingPage.classList.add('hidden');

	const finalPage = document.getElementById('finalPage');
	finalPage.classList.remove('hidden');
}


function cleanQuestionData() {
	questionData = {
		"startTimeMs": null,
		"endTimeMs": null,
		"questionId": null,
		"questionText": null,
		"questionType": null,
		"cancellationCount": 0,
		"suggestionCount": 0,
		"focusCount": 0,
		"accelerometer": { x: [], y: [], z: [], timestamp: [] },
		"gyroscope": { alpha: [], beta: [], gamma: [], timestamp: [] },
		"questionAnswerTimestamp": null,
		"keyboard": []
	}
	keyboardData.eventType = null;
	keyboardData.composedValue = null;
	keyboardData.index = 0;
	keyboardData.eventTimeStamp = null;
	keyboardData.inputType = null;
	keyboardData.key = null;
}

function recordFocusEvent(inputFieldValue) {
	keyboardData.composedValue = inputFieldValue;  // Aggiorna il valore composto all'apertura della tastiera
	questionData.focusCount += 1;
}

function recordDeviceOrientationEvent(event) {
	if (event.timestamp - lastTimestampGyroMs >= samplingIntervalMs && event.alpha) {
		questionData.gyroscope.alpha.push(event.alpha)
		questionData.gyroscope.beta.push(event.beta)
		questionData.gyroscope.gamma.push(event.gamma)
		questionData.gyroscope.timestamp.push(event.timestamp)
		lastTimestampGyroMs = event.timestamp;
	}
}

function recordDeviceMotionEvent(event) {
	if (event.timestamp - lastTimestampAccelMs >= samplingIntervalMs && event.acceleration.x) {
		const acceleration = event.acceleration;
		questionData.accelerometer.x.push(acceleration.x);
		questionData.accelerometer.y.push(acceleration.y);
		questionData.accelerometer.z.push(acceleration.z);
		questionData.accelerometer.timestamp.push(event.timestamp);
		lastTimestampAccelMs = event.timestamp;
	}
}

function recordKeyDownEvent(event, inputFieldValue) {
	// L'invio causa il submit del form: non fa parte del testo della risposta.
	if (event.key === "Enter" || event.key === "Return") {
		return;
	}
	keyboardData.eventType = event.type;
	keyboardData.composedValue = inputFieldValue;
	keyboardData.index += 1;
	keyboardData.eventTimeStamp = event.timeStamp;
	keyboardData.inputType = event.inputType;
	keyboardData.key = event.key;

	questionData.keyboard.push({ ...keyboardData })
}

function recordInputEvent(event, inputFieldValue) {
	keyboardData.eventType = event.type;
	keyboardData.composedValue = inputFieldValue;
	keyboardData.index += 1;
	keyboardData.eventTimeStamp = event.timeStamp;
	keyboardData.inputType = event.inputType;
	keyboardData.key = event.key;

	if ((inputFieldValue.length > keyboardData.composedValue.length + 1)
		|| (event.inputType === 'insertFromSuggestion')
		|| (event.inputType === 'insertReplacementText')
		|| (inputFieldValue.trim().length === keyboardData.composedValue.trim().length
			&& inputFieldValue.trim() !== keyboardData.composedValue.trim()
		)
	) {
		keyboardData.inputType = 'suggestion';
		questionData.suggestionCount += 1;
	}

	if (event.inputType === "deleteContentBackward"
		|| event.inputType === "deleteContentForward"
		|| !event.data
		|| inputFieldValue.length < keyboardData.composedValue.length
	) {
		questionData.cancellationCount += 1;
	}

	questionData.keyboard.push({ ...keyboardData })
}

function recordKeyupEvent(event, inputFieldValue) {
	// Il keyup di Invio arriva dopo il submit e, quindi, potenzialmente dopo
	// che la domanda successiva e' gia' stata mostrata.
	if (event.key === "Enter" || event.key === "Return") {
		return;
	}

	keyboardData.eventType = event.type;
	keyboardData.composedValue = inputFieldValue;
	keyboardData.index += 1;
	keyboardData.eventTimeStamp = event.timeStamp;
	keyboardData.inputType = event.inputType;
	keyboardData.key = event.key;

	questionData.keyboard.push({ ...keyboardData })

}