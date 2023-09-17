document.addEventListener("DOMContentLoaded", function() {
    const uploadForm = document.getElementById("upload-form");
    const pdfViewer = document.getElementById("pdf-viewer");
  
    uploadForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const formData = new FormData(uploadForm);
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        const pdfPath = jsonResponse.pdfPath;
        pdfViewer.setAttribute('src', pdfPath);
      } else {
        console.error("Failed to upload PDF");
      }
    });
  });
  