//const DEFAULT_DISABLE_MAIL = true;
//const DEFAULT_REPLACE_URL = true;
const DEFAULT_USE_NEWTAB = true;

function safeGetValue(value, default_value) {
  return value === undefined ? default_value : value;
}

function saveOptions(e) {
  browser.storage.local.set({
    //disable_mail:document.getElementById("disable_mail").checked,
    //replace_url:document.getElementById("replace_url").checked,
    use_newtab:document.getElementById("use_newtab").checked,
  })
}

function setCurrentChoice(result) {
  //let disable_mail = document.getElementById("disable_mail");
  //let replace_url = document.getElementById("replace_url");
  let use_newtab = document.getElementById("use_newtab");

  //disable_mail.checked = safeGetValue(result.disable_mail, DEFAULT_DISABLE_MAIL);
  //replace_url.checked = safeGetValue(result.replace_url, DEFAULT_REPLACE_URL);
  use_newtab.checked = safeGetValue(result.use_newtab, DEFAULT_USE_NEWTAB);

  //disable_mail.addEventListener("change", saveOptions);
  //replace_url.addEventListener("change", saveOptions);
  use_newtab.addEventListener("change", saveOptions);
}

function onError(error) {
  //  console.log(`Error: ${error}`);
}

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get().then(setCurrentChoice, onError);
});