const fileForm = document.getElementById("file-form");
const fileUpload = document.querySelector("[name='arquivo']");
const filenameSpan = document.getElementById("filename");

function handleUploadedFileName() {
  let formattedFileName = fileUpload.value.split("\\");
  formattedFileName = formattedFileName[formattedFileName.length - 1];
  filenameSpan.innerText = formattedFileName;
}
