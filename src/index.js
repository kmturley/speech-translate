/* Speech Translate */

var SpeechTranslate = (function () {
  if (!window.webkitSpeechRecognition || !window.speechSynthesis) {
    demo.classList.add('disable');
    return;
  }
  var langs = [
    ['Afrikaans', ['af-ZA']],
    ['አማርኛ', ['am-ET']],
    ['Azərbaycanca', ['az-AZ']],
    ['বাংলা', ['bn-BD', 'বাংলাদেশ'],
    ['bn-IN', 'ভারত']],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Dansk', ['da-DK']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
    ['en-CA', 'Canada'],
    ['en-IN', 'India'],
    ['en-KE', 'Kenya'],
    ['en-TZ', 'Tanzania'],
    ['en-GH', 'Ghana'],
    ['en-NZ', 'New Zealand'],
    ['en-NG', 'Nigeria'],
    ['en-ZA', 'South Africa'],
    ['en-PH', 'Philippines'],
    ['en-GB', 'United Kingdom'],
    ['en-US', 'United States']],
    ['Español', ['es-AR', 'Argentina'],
    ['es-BO', 'Bolivia'],
    ['es-CL', 'Chile'],
    ['es-CO', 'Colombia'],
    ['es-CR', 'Costa Rica'],
    ['es-EC', 'Ecuador'],
    ['es-SV', 'El Salvador'],
    ['es-ES', 'España'],
    ['es-US', 'Estados Unidos'],
    ['es-GT', 'Guatemala'],
    ['es-HN', 'Honduras'],
    ['es-MX', 'México'],
    ['es-NI', 'Nicaragua'],
    ['es-PA', 'Panamá'],
    ['es-PY', 'Paraguay'],
    ['es-PE', 'Perú'],
    ['es-PR', 'Puerto Rico'],
    ['es-DO', 'República Dominicana'],
    ['es-UY', 'Uruguay'],
    ['es-VE', 'Venezuela']],
    ['Euskara', ['eu-ES']],
    ['Filipino', ['fil-PH']],
    ['Français', ['fr-FR']],
    ['Basa Jawa', ['jv-ID']],
    ['Galego', ['gl-ES']],
    ['ગુજરાતી', ['gu-IN']],
    ['Hrvatski', ['hr-HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
    ['it-CH', 'Svizzera']],
    ['ಕನ್ನಡ', ['kn-IN']],
    ['ភាសាខ្មែរ', ['km-KH']],
    ['Latviešu', ['lv-LV']],
    ['Lietuvių', ['lt-LT']],
    ['മലയാളം', ['ml-IN']],
    ['मराठी', ['mr-IN']],
    ['Magyar', ['hu-HU']],
    ['ລາວ', ['lo-LA']],
    ['Nederlands', ['nl-NL']],
    ['नेपाली भाषा', ['ne-NP']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
    ['pt-PT', 'Portugal']],
    ['Română', ['ro-RO']],
    ['සිංහල', ['si-LK']],
    ['Slovenščina', ['sl-SI']],
    ['Basa Sunda', ['su-ID']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Kiswahili', ['sw-TZ', 'Tanzania'],
    ['sw-KE', 'Kenya']],
    ['ქართული', ['ka-GE']],
    ['Հայերեն', ['hy-AM']],
    ['தமிழ்', ['ta-IN', 'இந்தியா'],
    ['ta-SG', 'சிங்கப்பூர்'],
    ['ta-LK', 'இலங்கை'],
    ['ta-MY', 'மலேசியா']],
    ['తెలుగు', ['te-IN']],
    ['Tiếng Việt', ['vi-VN']],
    ['Türkçe', ['tr-TR']],
    ['اُردُو', ['ur-PK', 'پاکستان'],
    ['ur-IN', 'بھارت']],
    ['Ελληνικά', ['el-GR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['Українська', ['uk-UA']],
    ['한국어', ['ko-KR']],
    ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
    ['cmn-Hans-HK', '普通话 (香港)'],
    ['cmn-Hant-TW', '中文 (台灣)'],
    ['yue-Hant-HK', '粵語 (香港)']],
    ['日本語', ['ja-JP']],
    ['हिन्दी', ['hi-IN']],
    ['ภาษาไทย', ['th-TH']]
  ];
  var ignore_onend = false;
  var recognition = new webkitSpeechRecognition();
  var recognizing = false;
  var synth = window.speechSynthesis;



  var module = {
    init: function () {
      console.log('init', this);
      this.updateLanguages();
      this.updateDialects();
      this.updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = function() {
          this.updateVoices();
        }.bind(this);
      }
      this.setup();
    },
    setup: function() {
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = function() {
        recognizing = true;
        this.showInfo('info_speak_now');
      }.bind(this);
    
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          this.showInfo('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          this.showInfo('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            this.showInfo('info_blocked');
          } else {
            this.showInfo('info_denied');
          }
          ignore_onend = true;
        }
      }.bind(this);
    
      recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
          return;
        }
        if (!final_transcript) {
          this.showInfo('info_start');
          return;
        }
        this.showInfo('');
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('final_span'));
          window.getSelection().addRange(range);
        }
      }.bind(this);
    
      recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
          recognition.onend = null;
          recognition.stop();
          return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
            this.translate(event.results[i][0].transcript);
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = this.capitalize(final_transcript);
        final_span.innerHTML = this.linebreak(final_transcript);
        interim_span.innerHTML = this.linebreak(interim_transcript);
      }.bind(this);
    },
    updateLanguages: function () {
      for (var i = 0; i < langs.length; i++) {
        selectLanguage.options[i] = new Option(langs[i][0], i);
      }
      selectLanguage.selectedIndex = 10; // en
    },
    updateDialects: function () {
      for (var i = selectDialect.options.length - 1; i >= 0; i--) {
        selectDialect.remove(i);
      }
      var list = langs[selectLanguage.selectedIndex];
      for (var i = 1; i < list.length; i++) {
        selectDialect.options.add(new Option(list[i][1], list[i][0]));
      }
      selectDialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
      if (selectLanguage.selectedIndex === 10) {
        selectDialect.selectedIndex = 11; // US
      }
    },
    updateVoices: function() {
      voices = synth.getVoices();
      voices.sort(function(a, b) {
        var nameA = a.lang.toUpperCase();
        var nameB = b.lang.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      console.log('voices', voices.length);
      for (var i = 0; i < voices.length; i++) {
        selectVoice.options[i] = new Option(`${voices[i].lang} (${voices[i].name})`, voices[i].lang);
      }
      selectVoice.selectedIndex = 3; // de
    },
    start: function(event) {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = selectDialect.value;
      recognition.start();
      ignore_onend = false;
      final_span.innerHTML = '';
      interim_span.innerHTML = '';
      final_voice.innerHTML = '';
      interim_voice.innerHTML = '';
      this.showInfo('info_allow');
    },
    translate: function(text) {
      var langInput = selectDialect.value.split('-')[0];
      var langOutput = selectVoice.value.split('-')[0];
      console.log('translate', langInput, langOutput, text);
      this.load(`https://translation.googleapis.com/language/translate/v2/?q=${window.encodeURI(text)}?&source=${langInput}&target=${langOutput}&key=AIzaSyDhNr-mW5O7ygdAvW3GEiyPPmsfFwOvZe4`, function(response) {
        console.log('translate.success', response);
        var translation = response.data.translations[0].translatedText;
        final_voice.innerHTML += ' ' + translation;
        this.speak(translation);
      }.bind(this));
    },
    load: function(url, callback) {
      console.log('load', url);
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(JSON.parse(xmlHttp.responseText));
        }
      }
      xmlHttp.open('GET', url, true);
      xmlHttp.send(null);
    },
    speak: function(text) {
      console.log('speak', text);
      var utterThis = new SpeechSynthesisUtterance(text);
      utterThis.voice = voices[selectVoice.selectedIndex];
      utterThis.pitch = 1;
      utterThis.rate = 1;
      synth.speak(utterThis);
      utterThis.onpause = function(event) {
        var char = event.utterance.text.charAt(event.charIndex);
        console.log('Speech paused at character ' + event.charIndex + ' of "' +
        event.utterance.text + '", which is "' + char + '".');
      }
    },
    showInfo: function(message) {
      console.log('showInfo', message);
    },
    capitalize: function(s) {
      var first_char = /\S/;
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    },
    linebreak: function(s) {
      var two_line = /\n\n/g;
      var one_line = /\n/g;
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
  };
  module.init();
  return module;
})();