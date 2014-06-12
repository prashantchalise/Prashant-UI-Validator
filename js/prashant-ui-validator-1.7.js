/*! 
* First: Prashant-UI-Validator 1.0 - 07/15/2012
* Second: Prashant-UI-Validator 1.1 - 07/20/2012
* Second: Prashant-UI-Validator 1.2 - 07/21/2012
* Third: Prashant-UI-Validator 1.3 - 08/07/2012 --Loading Effect
* Fourth: Prashant-UI-Validator 1.4 - 09/03/2012 --Added option for Blank.
* Fifth: Prashant-UI-Validator 1.5 - 09/05/2012 --Added option for DATE, On succesful validation added option for showing Loader and executing more string statement.
* Sixth: Prashant-UI-Validator 1.6 - 5/10/2014 --Added option for INTEGER Value :: Added option for displaying LEN inside message for [MIN] validation. eg:"Insert at-least {len} characters({len} gets replaced by length)"
* Seventh: Prashant-UI-Validator 1.7 - 6/11/2014 --Modified passing function method 

* http://www.prasant.com.np
* Includes: jquery.UI 1.8.21 + Jquery

* Copyright (c) 2012-2014 Prashant Chalise 

 This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
*/

function Message(len) {
    this.NUMERIC = '[Numeric error]';
    this.MIN = '[Minimum length of ' + len + '.]';
    this.STRING = '[Missing value.]';
    this.EMAIL = '[Please enter valid email address.]';
    this.CHECK = '[checkbox error]';
    this.SELECT = '[Select box error]';
    this.DATE = '[Date Error]';
}

function ErrorClasses() {
    this.CUSTOMERROR_TEXT = "ui-state-error";
    this.CUSTOMERROR_DIV = "custom_div";
    this.CUSTOMERROR = "custom_error";
    this.CUSTOMOK = "alert alert-success";
}

function LOADING() {
    this.SRC = "../img/loading.gif";
    this.MSG = "Loading..";
}

function Misc() {
    this.DATE_STR = "MM/DD/YYYY"; // Month = MM,mm Day = DD,dd  Year: yyyy, YYYY, YY, yy
}


var x = {
    Validate: function (obj, group, divElm, showLoader, fnOnValidCall) {
        var elms = [];
        if (group) {
            elms = $('[Group=' + group + '] [req]');
        } else {
            elms = $('[req]');
        }
        $(obj).unbind("click");
        $(obj).click(function (e) {
            var hasError = false;
            x.RemoveValidation(divElm);
            var firstElm = null;
            $.each(elms, function (index, elm) {
                var itm = new y(elm, divElm);
                if (itm.PerformValidation()) {
                    hasError = hasError || true;
                    if (!firstElm) { firstElm = elm; }
                    $(elm).focus(function () { x.RemoveValidationByElement(this); });
                }
            });
            if (hasError) { $(firstElm).focus(); e.preventDefault(); } else { if (fnOnValidCall) { try { return eval(fnOnValidCall); } catch (err) { alert(err);return false; } } else { if (showLoader) { L.ShowLoader(); } } }
            if (divElm) { $(divElm).show('1000'); }
        });
        $.each(elms, function (index, elm) {
            var rules = x.Rules(x.PJSON($(elm).attr('req')).R);
            if ((x.HasRule('INTEGER', rules) != -1) || (x.HasRule('INT', rules) != -1)){
					$(elm).keydown(function (event) {
                    /*// Allow: backspace, delete, tab, escape, and enter*/
                    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                    /*// Allow: Ctrl+A*/
						(event.keyCode == 65 && event.ctrlKey === true) ||
                    /*// Allow: home, end, left, right*/
						(event.keyCode >= 35 && event.keyCode <= 39)) {
                        /*// let it happen, don't do anything*/
                        return;
                    }
                    else {
                        /*// Ensure that it is a number and stop the keypress*/
                        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            event.preventDefault();
                        }
                    }
                });
            }
            var maxVal = x.HasRule('MAX', rules);
            if (maxVal != -1) {
                $(elm).attr('maxlength', rules[maxVal].LEN);
            }
        });
    },
    RemoveValidationByElement: function (elm) {
        var errorCss = new ErrorClasses();
        $(elm).removeClass(errorCss.CUSTOMERROR_TEXT);
        /*//$(elm).next("div[elmsrc=ONERROR]").remove();*/
    },
    RemoveValidation: function (divElm) {
        var errorCss = new ErrorClasses();
        $('[req]').removeClass(errorCss.CUSTOMERROR_TEXT);
        if (divElm) {
            $('ul[msg_ul=MsgList]').remove();
            $(divElm).hide();
        } else {
            $('[elmsrc=ONERROR]').remove();
        }

    },
    PJSON: function (str) {
        var obj = { 'R': '', 'M': '' };
        if (str) { if (str != '') { obj = $.parseJSON(str); } }
        return obj;
    },
    Between: function (str, left, right) {
        if (!str || !left || !right) return null;
        var left_loc = str.indexOf(left);
        var right_loc = str.indexOf(right);
        if (left_loc == -1 || right_loc == -1) return null;
        return str.substring(left_loc + left.length, right_loc);
    },
    /*Error by elment*/
    Err: function (elm, message, divElm) {
        x.ShowError($('#' + elm), message, $('#' + divElm));
        if (divElm) { $('#' + divElm).show('1000'); }
    },
    Message: function (message, divElm) {
        var clsCss = new ErrorClasses();
        $('#' + divElm).html('');
        $('#' + divElm).html('<ul msg_ul="MsgList" class="' + clsCss.CUSTOMOK + '"></ul>');
        $('ul[msg_ul=MsgList]').append('<li>' + message + '</li>');
        $('#' + divElm).show('1000');
    },
    HideErr: function (divElm) { if (divElm) { x.RemoveValidation($('#' + divElm)); } else { x.RemoveValidation(null); } },
    ShowError: function (elm, message, divElm) {
        var errorCss = new ErrorClasses();
        if ($(elm).get(0).tagName.toUpperCase() != 'SPAN') {
            $(elm).addClass(errorCss.CUSTOMERROR_TEXT);
        }
        if (divElm) {

            if ((divElm).html() == '') {
                divElm.html('<ul msg_ul="MsgList" class="ui-widget ' + errorCss.CUSTOMERROR + '"></ul>');
            }
            $('ul[msg_ul=MsgList]').append('<li>' + message + '</li>');
        } else {
            $(elm).after('<div class="ui-widget ' + errorCss.CUSTOMERROR_DIV + ' ui-state-error" elmsrc="ONERROR"><div class="" style="padding: 0 .7em;"><span class="ui-icon ui-icon-alert" style="margin-right: .3em;"></span>' + message + '</div></div>');
        }
        /*//alert(message);*/
    },
    Rules: function (ruleStr) {
        var rules = [];
        var ruleName = '';
        var ruleLength = 0;
        $.each(ruleStr.split(','), function (index, val1) {
            ruleName = val1.toUpperCase();
            ruleLength = 0;
            if (/MIN/i.test(val1)) {
                ruleName = 'MIN';
                ruleLength = x.Between(val1, '[', ']');
            }
            if (/MAX/i.test(val1)) {
                ruleName = 'MAX';
                ruleLength = x.Between(val1, '[', ']');
            }
            rules.push({ NAME: ruleName, LEN: ruleLength });
        });
        return rules;
    },
    HasRule: function (ruleName, objRule) {
        var ruleIndex = -1;
        $.each(objRule, function (index, val1) {
            if (val1.NAME == ruleName) {
                ruleIndex = index;
            }
        });
        return ruleIndex;
    },

    MessageFormat: function (ruleName, len) {
        var message = '';
        var objMsg = new Message(len);
        switch (ruleName) {
            case 'NUMERIC':
                message = objMsg.NUMERIC;
                break;
            case 'MIN':
                message = objMsg.MIN;
                break;
            case 'STRING', '':
                message = objMsg.STRING;
                break;
            case 'EMAIL':
                message = objMsg.EMAIL;
                break;
            case 'CHECK':
                message = objMsg.CHECK;
                break;
            case 'SELECT':
                message = objMsg.SELECT;
                break;
            case 'DATE':
                message = objMsg.DATE;
                break;

        }
        return message;
    },
    ShowDialog: function (divByID, title) {
        $('#' + divByID).dialog(
				{
				    modal: true,
				    disabled: false,
				    title: title,
				    closeOnEscape: true,
				    hide: { effect: 'transfer' },
				    show: { effect: 'explode' },
				    resizable: false,
				    open: function (type, data) {
				        $(this).parent().appendTo("form");
				    },
				    autoOpen: false
				});
        $('#' + divByID).dialog("open");
        if ($('#' + divByID + ' :input:not(:disabled):first')) {
            $('#' + divByID + ' :input:not(:disabled):first').focus();
        }
    },
    HideDialog: function (divByID, divElm) {
        x.RemoveValidation(divElm);
        $('#' + divByID).dialog("close");
    }
};

function y(elm, divElm) {
    this.PerformValidation = function () {
        var hasError = false;
        var attr = x.PJSON($(elm).attr('req'));
        var rules = x.Rules(attr.R);

        var elmVal = $(elm).val();
        var hasBlank = false;
        if ($(elm).get(0).tagName.toUpperCase() == 'SELECT') { if ($(elm)[0].selectedIndex == 0 || $(elm)[0].selectedIndex == -1) { elmVal = ''; } }
        if ($(elm).attr('type') == 'checkbox') { if (!$(elm)[0].checked) { elmVal = ''; } }

        if (x.HasRule('BLANK', rules) != -1) {
            hasBlank = true;
        }

        for (ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
            if (!(hasBlank && elmVal == '')) {
                if (this.ValidateByRule(rules[ruleIndex], attr.M)) {
                    hasError = hasError || true;
                    break;
                }
            }
        }
        return hasError;
    };

    this.ValidateByRule = function (rule, message) {
        var hasError = false;
        this.HideError();
        var val = $(elm).val();
        if ($(elm).get(0).tagName.toUpperCase() == 'SELECT') { if ($(elm)[0].selectedIndex == 0 || $(elm)[0].selectedIndex == -1) { message = x.MessageFormat($(elm).get(0).tagName.toUpperCase()); val = ''; } }
        if ($(elm).attr('type') == 'checkbox') { if (!$(elm)[0].checked) { message = x.MessageFormat('CHECK'); val = ''; } }
        if ($(elm).get(0).tagName.toUpperCase() == 'SPAN') { rule.NAME = 'CHECK'; }
        switch (rule.NAME) {
            case 'NUMERIC':
                if (!$.isNumeric(val)) {
                    hasError = true;
                    this.ShowError((message) ? message : x.MessageFormat(rule.NAME));
                }
                break;
            case 'MIN':
                if (val.length < rule.LEN) {
                    hasError = true;
                    //this.ShowError(x.MessageFormat(rule.NAME, rule.LEN));
					this.ShowError((message) ? message.replace("{len}",rule.LEN) : x.MessageFormat(rule.NAME,rule.LEN ));
                }
                break;
            case 'STRING':
                if (val.length == 0) {
                    hasError = true;
                    this.ShowError((message) ? message : x.MessageFormat((rule.NAME == 'MAX') ? '' : rule.NAME));
                }
                break;
            case 'EMAIL':
                var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                if (!filter.test(val)) { this.ShowError((message) ? message : x.MessageFormat(rule.NAME)); hasError = true; }
                break;
            case 'DATE':
                if (!this.IsDate(val)) { this.ShowError((message) ? message : x.MessageFormat(rule.NAME)); hasError = true; }
                break;
            case 'CHECK':
                var childElms = $(elm).children(':input');
                hasError = true;
                $.each(childElms, function (index, childElm) {
                    if ($(childElm).attr('type').toUpperCase() == 'RADIO' || $(childElm).attr('type').toUpperCase() == 'CHECKBOX') {
                        if ($(childElm).attr('checked')) { hasError = false && hasError; }
                    }
                });
                if (hasError) { this.ShowError((message) ? message : x.MessageFormat(rule.NAME)); }
                break;
            default:
                if (val.length == 0) {
                    hasError = true;
                    this.ShowError((message) ? message : x.MessageFormat(''));
                }
                break;
        }
        return hasError;
    };
    this.HideError = function () { $(elm).removeClass('ui-state-error'); };
    this.ShowError = function (message) {
        x.ShowError(elm, message, divElm);
    };
    this.IsDate = function (txtDate) {
        var currVal = txtDate;
        if (currVal == '')
            return false;
        //Declare Regex 
        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern); // is format OK?
        if (dtArray == null)
            return false;

        //Checks for mm/dd/yyyy format.
        var settings = new Misc();
        var dtParts = '';
        var dtMonth = 0;
        var dtYear = 0;
        var dtDay = 0;
		var txtDate_Arr = txtDate.split('/');
        $.each(settings.DATE_STR.split('/'), function (index, val1) {
            if (/MM/i.test(val1)) {
                dtMonth = txtDate_Arr[index];
            }
            if (/DD/i.test(val1)) {
                dtDay = txtDate_Arr[index];
            }
            if ((/YY/i.test(val1)) || (/YYYY/i.test(val1))) {
                dtYear = txtDate_Arr[index];
            }
        });
	
        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2) {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    }
};

var L = {};
L.ShowLoader = function () {
    var load_Terms = new LOADING();
    $('body').append('<div id="topLayer"></div>');
    $("#topLayer").css({ position: 'absolute', 'z-index': '100002', background: "#FFF", top: "0px", height: this.getDocHeight(), width: $(window).width(), opacity: 0.6 });
    $('body').append('<div id="imgLoader" class="well"><div style="width:100%;text-align:center;font-size:16px;letter-spacing:0.5em;">' + load_Terms.MSG + '</div><img src="' + load_Terms.SRC + '"/></div>');
    $("#imgLoader").css({ position: 'fixed', 'z-index': '100003', top: 250, left: (($(window).width() / 2) - 100) });
};
L.HideLoader = function () {

    $("#topLayer").remove();
    $("#imgLoader").remove();
};

L.getDocHeight = function () {
    var D = document;
    return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
};
