const domain = document.location.origin;
const token = utils.getCookie("atlassian.xsrf.token");

bindClickEvet();
bindTableChangeEvent()

function bindClickEvet() {
  var issuetable = document.querySelector("#jira #issuetable tbody");
  if (typeof(issuetable) === "undefined" || issuetable == null) {
    return;
  }
  console.debug(issuetable);

  issuetable.ondblclick = event => {
    // double click <a>***</a> tag
    if (event.target.nodeName.toLowerCase() === "a") {
      return;
    }
    // find td element
    var td = event.target;
    while (true) {
      if (td.nodeName.toLowerCase() === "td") {
        break;
      }
      td = td.parentNode;
      if (td == null || typeof(td) === "undefined" || td.nodeName.toLowerCase() === "tr") {
        console.error("It is impossible to come here");
        console.error(event);
        return;
      }
    }
    var issueId = td.parentNode.getAttribute("rel");
    onTdDoubleClick(td, issueId);
  }
}

function onTdDoubleClick(td, issueId) {
  var editFieldDom = getEditFieldDom(td, issueId);
  if (editFieldDom == null) {
    return;
  }
  // remove unused html
  purifyDom(editFieldDom);
  console.debug(editFieldDom);

  if (td.className === "assignee") {
    handleAssigneeTd(td, issueId, editFieldDom);

  } else if (editFieldDom.querySelector("select") != null) {
    handleSingleSelectTd(td, issueId, editFieldDom);

  } else if (editFieldDom.querySelector(".radio") != null) {
    handleRadioTd(td, issueId, editFieldDom)

  } else if (editFieldDom.querySelector("input") != null) {
    handleInputTd(td, issueId, editFieldDom);
  }
}

function purifyDom(editFieldDom) {
  var legends = editFieldDom.querySelectorAll("legend");
  if (legends != null) {
    legends.forEach(legend => legend.parentNode.removeChild(legend));
  }

  var labels = editFieldDom.querySelectorAll("div:not(.radio) label");
  if (labels != null) {
    labels.forEach(label => label.parentNode.removeChild(label));
  }

  var descriptions = editFieldDom.querySelectorAll(".description");
  if (descriptions != null) {
    descriptions.forEach(description => {
      description.parentNode.removeChild(description);
    });
  }
}

function getEditFieldDom(td, issueId) {
  // build edit dom object from local, in order to speed up the double click event
  var className = td.className;
  if (className === "summary" 
      || className === "timeoriginalestimate") {

    var editHtml = utils.format('<p><input style="width: 100%;" type="text" value="{0}" id="{1}" ></p>', td.innerText, className);
    return new DOMParser().parseFromString(editHtml, 'text/html').body.firstChild;
  }

  // load edit dom from jira server
  var issueEditDataUrl = utils.format("{0}/secure/AjaxIssueEditAction!default.jspa?decorator=none&issueId={1}&_={2}", domain, issueId, new Date().getTime());
  var editDataMap = new Map();
  $.ajax({
    type: "get",
    url: issueEditDataUrl,
    async: false,
    success: function (result) {
      result.fields.forEach(field => {
        editDataMap.set(field.id, field);
      });
      console.log(result);
    },
    error: function(result, status) {
      alert("unexpect error!!, please press[F12] then open console to see more error information");
      console.error(result);
    }
  });
  var editField = editDataMap.get(td.className);
  if (editField == null || typeof(editField) === "undefined") {
    return null;
  }
  console.debug(editField);

  var editFieldDom = new DOMParser().parseFromString(editField.editHtml, 'text/html').body.firstChild;
  return editFieldDom;
}

function handleAssigneeTd(td, issueId, editFieldDom) {
  var select = editFieldDom.querySelector("#" + td.className);
  if (select == null || typeof (select) === "undefined") {
    return;
  }
  var oldInnerHtml = td.innerHTML;
  var oldValue = select.value;
  select.id = "edit_" + td.className + "_" + issueId;

  td.innerHTML = editFieldDom.outerHTML;

  var newSelect = document.getElementById(select.id);
  var newInnerHtmlTemplate = '<span class="tinylink"><a class="user-hover" rel="{0}" id="assignee_{1}" href="/secure/ViewProfile.jspa?name={2}">{3}</a></span>';
  var callback = (mutationsList, observer)  => {
    for (var mutation of mutationsList) {
      var username = null;
      var displayname = null;
      if (mutation.target.options != null) {
        for (var option of mutation.target.options) {
          if (option.selected != true) {
            continue;
          }
          displayname = option.text;
          username = option.value;
          if (username === oldValue) {
            continue;
          }
          break;
        }
      } else if (mutation.target.tagName === "OPTION" && mutation.target.selected === true) {
        displayname = mutation.target.text;
        username = mutation.target.value;
      }
      if (username != null && username != oldValue) {
        var newInnerHtml = utils.format(newInnerHtmlTemplate, username, username, username, displayname);
        saveTd(issueId, td, oldInnerHtml, newInnerHtml, oldValue, username);
        observer.disconnect();
      }
    }
  };
  new MutationObserver(callback).observe(newSelect, {attributes: true, childList: true, subtree: true});

  var assignToMeBtn = document.getElementById("assign-to-me-trigger");
  if (assignToMeBtn != null) {
    assignToMeBtn.onclick = () => {
      var currentUser = document.getElementById("header-details-user-fullname");
      var username = currentUser.getAttribute("data-username");
      var displayname = currentUser.getAttribute("data-displayname");
      var newInnerHtml = utils.format(newInnerHtmlTemplate, username, username, username, displayname);
  
      saveTd(issueId, td, oldInnerHtml, newInnerHtml, oldValue, username);
    }
  }
}

function handleSingleSelectTd(td, issueId, editFieldDom) {
  var select = editFieldDom.querySelector("#" + td.className);
  if (select == null || typeof (select) === "undefined") {
    return;
  }
  var oldInnerHtml = td.innerHTML;
  var oldValue = select.value;
  select.id = "edit_" + td.className + "_" + issueId;
  
  td.innerHTML = editFieldDom.outerHTML;

  var newSelect = document.getElementById(select.id);
  newSelect.onchange = event => {
    var selectedOption = event.target.selectedOptions[0];
    var newValue = selectedOption.value;
    var newInnerHtml = selectedOption.text;
    saveTd(issueId, td, oldInnerHtml, newInnerHtml, oldValue, newValue);
  }
}

function handleRadioTd(td, issueId, editFieldDom) {
  var newTdInnerHtml = editFieldDom;
  newTdInnerHtml.id = "edit_" + td.className + "_" + issueId;
  
  var oldInnerHtml = td.innerHTML;
  var oldValue = newTdInnerHtml.value;
  
  var radioIdDisplaynameMap = new Map();
  var radios = editFieldDom.querySelectorAll("div.radio");
  radios.forEach(radio => {
    var radioId = radio.querySelector("input").value;
    var displayname = radio.querySelector("label").innerText;
    if (radio.querySelector("input").checked === true) {
      oldValue = radioId;
      oldInnerHtml = displayname;
    }
    radioIdDisplaynameMap.set(radioId, displayname);
  });
  
  td.innerHTML = editFieldDom.outerHTML;

  var newSelect = document.getElementById(newTdInnerHtml.id);
  newSelect.onchange = event => {
    var newValue = event.target.value;
    var newInnerHtml = radioIdDisplaynameMap.get(newValue);
    saveTd(issueId, td, oldInnerHtml, newInnerHtml, oldValue, newValue);
  }
}

function handleInputTd(td, issueId, editFieldDom) {
  var input = editFieldDom.querySelector("#" + td.className);
  if (input == null || typeof (input) === "undefined") {
    return;
  }
  var oldInnerHtml = td.innerHTML;
  var oldValue = input.value;

  input.style.width = "100%";

  // replace td inner html to an editable html
  td.innerHTML = editFieldDom.outerHTML;
  
  var newInput = document.getElementById(input.id);
  newInput.onblur = () => {
    var newValue = newInput.value;
    var newInnerHtml = oldInnerHtml.replace(oldValue, newValue);
    saveTd(issueId, td, oldInnerHtml, newInnerHtml, oldValue, newValue);
  };
  newInput.focus();
  newInput.setSelectionRange(oldValue.length, oldValue.length);
}

function saveTd(issueId, td, oldInnerHtml, newInnerHtml, oldValue, newValue) {
  if (oldValue === newValue) {
    td.innerHTML = oldInnerHtml;
    return;
  }
  if (newValue == null || newValue.trim() === "") {
    alert("value can not be empty");
    td.innerHTML = oldInnerHtml;
    return;
  }
  var editFieldName = td.className;
  if (editFieldName === "timeoriginalestimate") {
    editFieldName = "timetracking";
  }

  var formData = encodeURI(utils.format("{0}={1}&issueId={2}&atl_token={3}&singleFieldEdit=true&fieldsToForcePresent={4}", editFieldName, newValue, issueId, token, editFieldName));
  $.ajax({
    type: "post",
    dataType: "json", 
    url: domain + "/secure/AjaxIssueAction.jspa?decorator=none",
    data: formData,
    success: function(result) {
      console.info("update td:%s success, issueId:%s, oldValue:%s, newValue:%s", td.className, issueId, oldValue, newValue)
      console.debug(result)
      td.innerHTML = newInnerHtml;
    },
    error: function(result, status) {
      alert("unexpect error!!, please press[F12] then open console to see more error information");
      console.error(result)
      td.innerHTML = oldInnerHtml;
    }
  });
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