let countSpan = document.querySelector(".count span");
let bulletContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
let submitButton = document.querySelector(".submit-button");
function getQuestions() {
  let myReq = new XMLHttpRequest();

  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionCount = questionsObject.length;
      console.log(questionCount);
      createBullets(questionCount);
      countDown(3, questionCount);
      addQuestionData(questionsObject[currentIndex], questionCount);
      submitButton.addEventListener("click", () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        checkAnswer(theRightAnswer, questionCount);
        currentIndex++;
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        countSpan.innerHTML -= 1;
        addQuestionData(questionsObject[currentIndex], questionCount);
        handleBullets();
        clearInterval(countdownInterval);
        countDown(3, questionCount);
        showResults(questionCount);
      });
    }
  };

  myReq.open("GET", "htmlquestions.json", true);
  myReq.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    bulletContainer.appendChild(bullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      theLabel.appendChild(theLabelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(answer, count) {
  let answers = document.getElementsByName("question");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (answer === chosenAnswer) {
    rightAnswers++;
    console.log("Good answer");
  }
}

function handleBullets() {
  let bulletsSPan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSPan);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class = "good">Good</span>, ${rightAnswers} From ${count} is good`;
    } else if (rightAnswers === count) {
      theResults = `<span class = "perfect">Perfection</span>`;
    } else
      theResults = `<span class = "bad">Bad</span>, ${rightAnswers} from ${count} is really bad bro`;

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
