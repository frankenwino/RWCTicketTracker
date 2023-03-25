var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TeamBrainExternalApp = new ((function () {
    function TeamBrainExternal() {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start constructor");
        }
        var self = this;
        this.url = document.querySelector('#tb-ext-app').getAttribute('src');
        this.urlApp = document.querySelector('#tb-ext-app').getAttribute('data-proxy-url');
        this.extData = {};
        this.iframeButtonGoBackToDisplay = false;
        if (window.location.href.indexOf("teambrainLog") !== -1) {
            this.url = document.querySelector('#tb-ext-app').getAttribute('src') + "&teambrainLog=1";
        }
        if (document.querySelector('#tb-ext-data') != undefined) {
            this.extData = document.querySelector('#tb-ext-data').innerHTML;
        }
        this.asset = 'html/iconFlex.html';
        this.iconAsset = 'html/iconFlex.html';
        var tbExternalCss = document.createElement('link');
        tbExternalCss.setAttribute('rel', "stylesheet");
        tbExternalCss.setAttribute('href', this.urlApp + "front/extAccess/asset/css/tb-external-v1.css");
        document.head.appendChild(tbExternalCss);
        var params = TeamBrainExternal.getParams(this.url);
        this.paramsRaw = params;
        params = __assign(__assign(__assign({}, params), { urlApp: this.urlApp }), { extData: this.extData });
        this.params = params;
        TeamBrainExternal.postAjax(this.urlApp + "back/extAccess/getApp/", params, function (e) {
            try {
                var json = JSON.parse(e);
                if (json.status == undefined) {
                    var app = json.app;
                    self.json = json;
                    self.initApp(json);
                }
                else {
                    console.log(json);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    TeamBrainExternal.prototype.loadIcon = function () {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start loadIcon");
        }
        var self = this;
        TeamBrainExternal.postAjax(this.urlApp + "front/extAccess/asset/" + this.asset, { url: this.asset.replace('html/', '') }, function (e) {
            var icon = e.replace('.custom-style{}', "\n                body {\n                    --primary-color: " + self.json.primary_color + "; \n                    --primary-color-light: " + self.json.primary_color + "45;\n                }\n            ");
            icon = icon.replace('{{url_icon}}', self.json.custom_picto);
            self.iconBox.contentWindow.document.open();
            self.iconBox.contentWindow.document.write(icon);
            self.iconBox.contentWindow.document.close();
        });
    };
    TeamBrainExternal.prototype.initApp = function (param) {
        var _this = this;
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start initApp");
        }
        var self = this;
        if (param.primary_color == null) {
            param.primary_color = "#ee9327";
        }
        if (param.custom_css != "") {
            TeamBrainExternal.addCustomStyle(param.custom_css);
        }
        this.urlLogo = param.url_logo;
        this.iconContainer = TeamBrainExternal.createEl('div', ['tb-ae-iconBox', 'tb-ae-iconContainer'], document.querySelector('body'));
        this.iconBox = TeamBrainExternal.createEl('iframe', ['tb-ae-iconBox'], this.iconContainer, [
            { type: "style", value: "--primary-color: " + param.primary_color + "; --primary-color-light: " + param.primary_color + "45;" }
        ]);
        if (param.picto == "[[tb-custom-logo]]") {
            this.iconAsset = "html/iconFlexCustom.html";
            this.asset = "html/iconFlexCustom.html";
            this.iconBox.classList.add('tb-custom-logo');
        }
        self.loadIcon();
        this.asset = 'html/iconCloseFlex.html';
        setTimeout(function () {
            _this.iconBox.classList.add('tb-ae-on');
            _this.iconContainer.classList.add('tb-ae-on');
        }, param.time_before_display);
        this.appContainer = TeamBrainExternal.createEl('div', ['tb-ae-appContainer', 'tb-ae-opacity-animate'], document.querySelector('body'));
        this.closeButton = TeamBrainExternal.createEl('span', ['tb-ae-iconClose-button'], this.appContainer);
        TeamBrainExternal.postAjax(this.urlApp + "front/extAccess/asset/html/", { url: "iconCloseButton.html" }, function (e) {
            var icon = e.replace('.custom-style{}', "\n                .tb-ae-iconClose-button-span {\n                    --primary-color: " + self.json.primary_color + ";\n                    --primary-color-light: " + self.json.primary_color + "45;\n                }\n            ");
            self.closeButton.innerHTML = icon;
        });
        if (param.feature_sso_active) {
            var urlParams2 = new URLSearchParams(window.location.search);
            if (urlParams2.has('bubbleIframeUrl')) {
                var bubbleIframeUrl = decodeURI(urlParams2.get('bubbleIframeUrl'));
                var ssoTbfbName = urlParams2.get('ssoTbfbName');
                var ssoTbfbEmail = urlParams2.get('ssoTbfbEmail');
                this.appIframe = TeamBrainExternal.createEl('iframe', ['tb-ae-appIframe'], this.appContainer, [
                    { type: "src", value: bubbleIframeUrl + "&ssoTbfbName=" + ssoTbfbName + "&ssoTbfbEmail=" + ssoTbfbEmail },
                    { type: "id", value: "mvct-app" }
                ]);
                if (localStorage.getItem("bubbleScriptUrl") === null || localStorage.getItem("bubbleScriptUrl") !== this.url) {
                    self.toggleApp(param);
                }
                localStorage.setItem("bubbleIframeUrl", bubbleIframeUrl + "&ssoTbfbName=" + ssoTbfbName + "&ssoTbfbEmail=" + ssoTbfbEmail);
                localStorage.setItem("bubbleScriptUrl", this.url);
                if (ssoTbfbName) {
                    localStorage.setItem("ssoTbfbName", ssoTbfbName);
                }
                if (ssoTbfbEmail) {
                    localStorage.setItem("ssoTbfbEmail", ssoTbfbEmail);
                }
            }
        }
        this.iconContainer.addEventListener('click', function (e) {
            self.toggleApp();
        });
        this.iconBox.onload = function () {
            var urlParams = new URLSearchParams(window.location.search);
            self.iconBox.contentWindow.document.body.addEventListener('click', function (e) {
                if (param.feature_sso_active) {
                    if (!urlParams.has('bubbleIframeUrl') && (localStorage.getItem("bubbleScriptUrl") === null || localStorage.getItem("bubbleScriptUrl") !== self.url)) {
                        window.location.href = param.sso_url + "&bubbleSiteUrl=" + encodeURIComponent(document.location.href);
                    }
                    else {
                        self.toggleApp(param);
                    }
                }
                else {
                    if (self.iconBox.classList.contains('tb-ae-icon-close')) {
                        self.toggleApp();
                    }
                    else {
                        self.toggleApp(param);
                    }
                }
            });
        };
        this.closeButton.addEventListener('click', function (e) {
            self.toggleApp();
        });
        this.messagesContainer = TeamBrainExternal.createEl('div', ['tb-ae-messagesContainer'], document.querySelector('body'));
        if (param.activate_hello_message) {
            this.helloMessage = TeamBrainExternal.createEl('div', ['tb-ae-helloMessage', 'tb-ae-hide'], this.messagesContainer, [
                { type: "style", value: "--primary-color: " + param.primary_color + "; --primary-color-light: " + param.primary_color + "45;" }
            ]);
            this.helloMessage.innerHTML = param.content_hello_message;
            setTimeout(function () {
                _this.helloMessage.classList.remove('tb-ae-hide');
                setTimeout(function () {
                    _this.helloMessage.classList.add('tb-ae-hide');
                }, 10000);
            }, param.time_wait_hello_message);
            this.helloMessage.addEventListener('click', function (e) {
                self.toggleApp(param);
            });
        }
        if (param.lead_magnet_community.active === "1" && param.lead_magnet_community.at_startup === "1") {
            self.leadMagnetMessage = TeamBrainExternal.createEl('div', ['tb-ae-leadMagnetMessage', 'tb-ae-hide'], this.messagesContainer, [
                { type: "style", value: "border-color: " + param.lead_magnet_community.startup_color + "; --primary-color: " + param.primary_color + "; --primary-color-light: " + param.primary_color + "45;" }
            ]);
            if (param.lead_magnet_community.startup_blink === "1") {
                self.leadMagnetMessage.classList.add('tb-ae-blinking');
            }
            self.leadMagnetMessage.innerHTML = param.lead_magnet_community.message;
            var ctaLead_1 = TeamBrainExternal.createEl('a', ['tb-ae-leadMagnetMessage-button'], self.leadMagnetMessage, [
                { type: "href", value: param.lead_magnet_community.cta_url },
                { type: "target", value: "_blank" },
                { type: "style", value: "background-color: " + param.lead_magnet_community.cta_color + ";" }
            ]);
            ctaLead_1.addEventListener('click', function (e) {
                return self.clickOnUrl(ctaLead_1);
            });
            var ctaLeadName = TeamBrainExternal.createEl('span', ['name-clicktoaction'], ctaLead_1, [
                { type: "style", value: "display:none;" }
            ]);
            this.ctaLeadName = "[lead_community]" + param.lead_magnet_community.uid;
            ctaLeadName.innerHTML = this.ctaLeadName;
            var ctaLeadLabel = TeamBrainExternal.createEl('span', ['label-clicktoaction'], ctaLead_1, []);
            this.ctaLeadLabel = param.lead_magnet_community.cta_text;
            ctaLeadLabel.innerHTML = this.ctaLeadLabel;
            setTimeout(function () {
                self.leadMagnetMessage.classList.remove('tb-ae-hide');
                setTimeout(function () {
                    self.leadMagnetMessage.classList.add('tb-ae-hide');
                }, parseInt(param.lead_magnet_community.startup_time));
            }, param.activate_hello_message ? param.time_wait_hello_message : 1000);
            this.leadMagnetMessage.addEventListener('click', function (e) {
                self.leadMagnetMessage.classList.add('tb-ae-hide');
            });
        }
    };
    TeamBrainExternal.prototype.clickOnUrl = function (anchor) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start clickOnUrl");
        }
        var name = this.ctaLeadName;
        var label = this.ctaLeadLabel;
        var data = {
            "param": JSON.stringify(this.paramsRaw),
            "content": JSON.stringify({
                "href": anchor.href,
                "name": name,
                "label": label,
                "ref_user": "lightforwebsite",
                "ref_question": "",
                "ref_community": this.json.lead_magnet_community.ref_community,
                "login": "lightforwebsite",
                "space": ""
            })
        };
        var params = typeof data == 'string' ? data : Object.keys(data).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }).join('&');
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', this.urlApp + "/back/faqBubble/statButton/");
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    };
    TeamBrainExternal.prototype.toggleApp = function (param) {
        if (param === void 0) { param = null; }
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start toggleApp");
        }
        if (param !== null) {
            if (param.feature_sso_active) {
                if (localStorage.getItem("bubbleIframeUrl") !== null && this.url === localStorage.getItem("bubbleScriptUrl")) {
                    this.appIframe = TeamBrainExternal.createEl('iframe', ['tb-ae-appIframe'], this.appContainer, [
                        { type: "src", value: localStorage.getItem("bubbleIframeUrl") },
                        { type: "id", value: "mvct-app" }
                    ]);
                    TeamBrainExternalApp.toggleAppPart2();
                }
            }
            else {
                this.appIframe = TeamBrainExternal.createEl('iframe', ['tb-ae-appIframe'], this.appContainer, [
                    { type: "src", value: param.app },
                    { type: "id", value: "mvct-app" }
                ]);
                TeamBrainExternalApp.toggleAppPart2();
            }
        }
        else {
            TeamBrainExternalApp.toggleAppPart2();
        }
    };
    TeamBrainExternal.prototype.toggleAppPart2 = function () {
        var self = this;
        if (self.helloMessage != undefined) {
            self.helloMessage.classList.add('tb-ae-hide');
        }
        if (self.leadMagnetMessage != undefined) {
            self.leadMagnetMessage.classList.add('tb-ae-hide');
        }
        this.iconBox.classList.toggle('tb-ae-icon-close');
        self.loadIcon();
        if (self.asset == 'html/iconCloseFlex.html') {
            TeamBrainExternal.postAjax(this.urlApp + "back/extAccess/statConnexion/", this.params, function (e) { });
            self.asset = self.iconAsset;
        }
        else {
            self.asset = 'html/iconCloseFlex.html';
        }
        if (this.iconBox.classList.contains('tb-ae-icon-close')) {
            setTimeout(function () {
                self.appContainer.classList.remove('tb-ae-opacity-animate');
            }, 350);
        }
        else {
            self.appContainer.classList.add('tb-ae-opacity-animate');
            setTimeout(function () {
                self.appContainer.classList.add('tb-ae-hide');
            }, 100);
            setTimeout(function () {
                self.appContainer.classList.remove('tb-ae-hide');
            }, 500);
        }
        this.appContainer.classList.toggle('tb-ae-visible');
    };
    TeamBrainExternal.prototype.receiveMessagePing = function (e) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start receiveMessagePing");
        }
        var self = this;
        try {
            var json = JSON.parse(e.data);
            if (json.origin == "tb-transfert") {
                TeamBrainExternalApp.loadCom(json.param, json.com);
            }
            else if (json.origin == "tb-transfert-tbfb-back-button") {
                this.iframeButtonGoBackToDisplay = true;
            }
            else {
                console.log(json);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    TeamBrainExternal.prototype.loadCom = function (param, com) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start loadCom");
        }
        if (this.isOpen()) {
            if (param.picto == "[[tb-custom-logo]]") {
                this.iconAsset = "html/iconFlexCustom.html";
                this.asset = "html/iconFlexCustom.html";
                this.iconBox.classList.add('tb-custom-logo');
            }
            else {
                this.asset = 'html/iconFlex.html';
                this.iconAsset = 'html/iconFlex.html';
                this.iconBox.classList.remove('tb-custom-logo');
            }
            if (param.custom_css != "") {
                TeamBrainExternal.addCustomStyle(param.custom_css);
            }
            this.json.primary_color = param.select_primary_color;
            document.querySelector('iframe.tb-ae-on').setAttribute('style', "--primary-color: " + param.select_primary_color + "; --primary-color-light: " + param.select_primary_color + "45;");
            if (com != undefined && com != "undefined") {
                this.json.custom_picto = this.urlLogo + "/" + com + "/" + param.custom_picto;
            }
        }
    };
    TeamBrainExternal.prototype.isOpen = function () {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - Start isOpen");
        }
        var bool = false;
        if (document.querySelector('.tb-ae-appContainer.tb-ae-visible') != null) {
            bool = true;
        }
        return bool;
    };
    TeamBrainExternal.createEl = function (type, classes, append, attributes) {
        if (classes === void 0) { classes = []; }
        if (append === void 0) { append = null; }
        if (attributes === void 0) { attributes = []; }
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - createEl - type: " + type);
        }
        if (type === "iframe" && classes.includes("tb-ae-appIframe") && document.querySelector("#mvct-app") !== null) {
            var element_1 = document === null || document === void 0 ? void 0 : document.querySelector('#mvct-app');
            if (element_1) {
                attributes.forEach(function (v) {
                    if ((element_1.hasAttribute(v['type']) && v['value'] !== element_1.getAttribute(v['type'])) || !element_1.hasAttribute(v['type'])) {
                        element_1.setAttribute(v['type'], v['value']);
                    }
                    else if (this.iframeButtonGoBackToDisplay) {
                        element_1.setAttribute(v['type'], v['value']);
                        this.iframeButtonGoBackToDisplay = false;
                    }
                });
                return element_1;
            }
        }
        else {
            var element_2 = document.createElement(type);
            classes.forEach(function (v) {
                element_2.classList.add(v);
            });
            attributes.forEach(function (v) {
                element_2.setAttribute(v['type'], v['value']);
            });
            if (append != null)
                append.appendChild(element_2);
            return element_2;
        }
    };
    TeamBrainExternal.addCustomStyle = function (custom_css) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - addCustomStyle");
        }
        var customStyle = document.createElement('style');
        customStyle.innerHTML = custom_css;
        document.head.appendChild(customStyle);
    };
    TeamBrainExternal.getParams = function (url) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - getParams - url: " + url);
        }
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };
    TeamBrainExternal.postAjax = function (url, data, success) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - postAjax - url: " + url);
        }
        var params = typeof data == 'string' ? data : Object.keys(data).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }).join('&');
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                success(xhr.responseText);
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
        return xhr;
    };
    TeamBrainExternal.getAjax = function (url, data, success) {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("tb-external-v1 - getAjax - url: " + url);
        }
        var params = typeof data == 'string' ? data : Object.keys(data).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }).join('&');
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status == 200) {
                success(xhr.responseText);
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
        return xhr;
    };
    return TeamBrainExternal;
}()))();
window.addEventListener("message", TeamBrainExternalApp.receiveMessagePing, false);
