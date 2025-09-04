// console.log("I am ready");
function pronounceWord(word) {
  // Create a new speech request with the given word
  const utterance = new SpeechSynthesisUtterance(word);

  // Set the language for pronunciation (English in this case)
  utterance.lang = "en-EN";

  // Tell the browser to speak it
  window.speechSynthesis.speak(utterance);
}

const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLession(json.data));
};
const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  //   console.log(lessonButtons);
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};
const loadLevelWord = (id) => {
  manageSpinner(true);
  // console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive("active");
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add("active");
      displyLevelWord(data.data);
      manageSpinner(false);
    });
};
const loadWordDetail = async (id) => {
  const url = `
  https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  console.log(details);
  displayWordDetails(details.data);
};
const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
             <div class="">
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Synonym</h2>
              <div class="">
            <h2 class="font-bold">${createElements(word.synonyms)}</h2>
            
          </div>
          </div>`;
  document.getElementById("my_modal_5").showModal();
};
const displyLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    wordContainer.innerHTML = `<div
        class="font-bangla text-center bg-sky-100 col-span-full rounded py-10 space-y-6"
      >
           <img class="mx-auto" src="./assets/alert-error.png" alt="" />
        <p class="text-xl font-medium text-gray-400">
         এই Lesson এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
      </div>`;
    manageSpinner(false);
    return;
  }
  // {
  //   "id": 82,
  //   "level": 1,
  //   "word": "car",
  //   "meaning": "গাড়ি",
  //  "pronunciation": "কার"
  // }
  words.forEach((word) => {
    // console.log(word);
    const card = document.createElement("div");
    card.innerHTML = ` <div
        class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4"
      >
        <h2 class="font-bold text-2xl">${
          word.word ? word.word : "শব্দ পাওয়া যায় নি"
        }</h2>
        <p class="font-semibold">Meaning and Pronunciation</p>
        <div class="text-2xl font-medium font-bangla">${
          word.meaning ? word.meaning : "অর্থ পাওযা যায় নি"
        } / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায় নি"
    }</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-[#1A9aFF10] hover:bg-[#1A9aFF90]">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick="pronounceWord(${
            word.word
          })" class="btn bg-[#1A9aFF10] hover:bg-[#1A9aFF90]">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>`;
    wordContainer.append(card);
  });
};
const displayLession = (lessons) => {
  /**
   * 1. get the container and empty
   * 2. get inro every elements
   * 3. create element
   * 4. append into containers
   * */
  //1. get the container and empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  //2. get into every elements
  for (let lesson of lessons) {
    // console.log(lesson);
    //3. create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `<button
  id="lesson-btn-${lesson.level_no}"
  onclick="loadLevelWord(${lesson.level_no})"
  class="lesson-btn btn btn-outline btn-primary"
>
  <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
</button>

    `;
    //4. append
    levelContainer.append(btnDiv);
  }
  manageSpinner(false);
};
loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displyLevelWord(filterWords);
    });
});
