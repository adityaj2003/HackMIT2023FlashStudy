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
        generateFlashCards();
      } else {
        console.error("Failed to upload PDF");
      }
    });
  });

  async function generateFlashCards() {
    console.log("Generating flash cards...");
    // Step 1: Fetch questions and answers from API
    var apiResponse;
    try {
      const response = await fetch('/get-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        apiResponse = data.summary;
        console.log(apiResponse);
      } else {
        console.log('Server responded with status:', response.status);
      }
    } catch (error) {
      console.log('There was a problem with the fetch operation:', error);
    }
  
    const lines = apiResponse ? apiResponse.split('\n') : [];
    const qaPairs = apiResponse.split(/\n\n/);
    function createFlashCard(question, answer) {
      const card = document.createElement("div");
      card.className = "flashcard";
  
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.textContent = question;
  
      const answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      answerDiv.textContent = answer;
      answerDiv.style.display = "none";
  
      const showAnswerBtn = document.createElement("button");
      showAnswerBtn.textContent = "Show Answer";
      showAnswerBtn.onclick = function () {
        answerDiv.style.display = "block";
        showAnswerBtn.style.display = "none";
      };
  
      card.appendChild(questionDiv);
      card.appendChild(answerDiv);
      card.appendChild(showAnswerBtn);
  
      return card;
    }
  
    // Step 4: Append the flashcards to container
    const container = document.getElementById("flashcard-container");
    const formattedQAPairs = [];
    qaPairs.forEach(qaPair => {
      const lines = qaPair.split('\n');
      const question = lines[0].replace(/^\d+\. /, ''); // Remove numbering
      const answer = lines[1];
      formattedQAPairs.push({ "question":question,"answer": answer });
  });
  console.log(formattedQAPairs)
    formattedQAPairs.forEach((data) => {
      const card = createFlashCard(data.question, data.answer);
      container.appendChild(card);
    });
  }