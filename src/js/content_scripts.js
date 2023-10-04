init();
bindClickEvet();
bindTableChangeEvent()

function bindClickEvet() {
  var issueRows = document.querySelectorAll("#jira #issuetable tbody tr");
  if (typeof(issueRows) === "undefined" || issueRows == null) {
    return;
  }
  issueRows.forEach(issueRow => {
    var summary = issueRow.querySelector("td.summary");
    var issueId = issueRow.getAttribute("rel");
    summary.ondblclick = () => onSummaryDblclick(summary, issueId);
  })
}

function onSummaryDblclick(summary, issueId) {
  var linkEle = summary.querySelector("a");
  var pEle = summary.querySelector("p");
  var summaryText = linkEle.innerText;
  var inputHtml = String.format('<input style="width: 100%;" type="text" value="{0}" id="edit_summary_{1}" >', summaryText, issueId)
  
  pEle.innerHTML = inputHtml;
  var inputEle = document.getElementById("edit_summary_" + issueId);
  inputEle.onblur = () => saveSummary(issueId, summaryText, linkEle, pEle)
  inputEle.focus();
  inputEle.setSelectionRange(summaryText.length, summaryText.length);
}

function saveSummary(issueId, oldValue, linkEle, pEle) {
  var summaryInput = document.getElementById("edit_summary_" + issueId);
  var newValue = summaryInput.value;
  if (oldValue === newValue) {
    pEle.innerHTML = linkEle.outerHTML;
    return;
  }
  if (newValue == null || newValue.trim() ==="") {
    alert("summary can not be empty");
    summaryInput.value = oldValue;
    return;
  }

  var baseUrl = document.location.origin;
  var token = getCookie("atlassian.xsrf.token");
  var formData = String.format("summary={0}&issueId={1}&atl_token={2}&singleFieldEdit=true&fieldsToForcePresent=summary",
    encodeURI(newValue), issueId, token)

  $.ajax({
    type: "post",
    dataType: "json", 
    url: baseUrl + "/secure/AjaxIssueAction.jspa?decorator=none",
    data: formData,
    success: function(result) {
      linkEle.innerText = newValue;
      pEle.innerHTML = linkEle.outerHTML;
    },
    error: function(result, status) {
      alert("status: " + status + ", save data error: \n" + result);
    }
  });
}

function init() {
  if (String.format) {
    return;
  }
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

function getCookie(cookieName) {
  var strCookie = document.cookie
  var cookieList = strCookie.split(';')
  for (var i = 0; i < cookieList.length; i++) {
    var arr = cookieList[i].split('=')
    if (cookieName === arr[0].trim()) {
      return arr[1]
    }
  }
  return '';
}

function bindTableChangeEvent() {
  var targetNode = document.querySelector("#jira #main");
  if (targetNode == null) {
    return;
  }
  var config = { attributes: true, attributeFilter:['class'], childList: true, subtree: true, attributeOldValue: true };

  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.target.className.includes("issue-table-wrapper")) {
        checkIssueTableAndRebindClickEvent();
      } else if (mutation.type === 'childList' && mutation.target.className === "issue-container" 
          && mutation.removedNodes != null && mutation.removedNodes.length > 0) {
        checkIssueTableAndRebindClickEvent();
      }
    }
  };
  new MutationObserver(callback).observe(targetNode, config);
}

function checkIssueTableAndRebindClickEvent() {
  var checkCount = 0;
  var maxCheckTimes = 10;
  var intervalId = setInterval(function () {
    if (checkCount++ > maxCheckTimes) {
      clearInterval(intervalId);
      return;
    }
    var issuetable = document.querySelectorAll("#jira #issuetable");
    if (typeof(issuetable) === "undefined" || issuetable == null) {
      return;
    }
    bindClickEvet();
    clearInterval(intervalId);
  }, 500);
}