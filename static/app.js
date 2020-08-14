// **************************
// QUESTIONS
// **************************
// 1. Why did I have to bind `this` to countdown?
// 2. Should I have put a context onto my jquery variables like they did in the solution?
//   a. if yes, why?  my solution works.
// 3. Why did `board` need to be in the session?  I didn't use it.
// 
// **************************
// OOP
// **************************

class BoggleGame {
  constructor() {
    // list the variables
    this.score = 0;
    this.guesses = new Set();
    this.plays = 0;
    this.secs = 10;
    this.timer = setInterval(this.countdown.bind(this), 1000);
    this.$form = $("#word-check-form");
    this.$messages = $("#messages");
    this.$wordsGuessed = $("#words-guessed");
    this.$highScore = $("#high-score")
    this.$plays = $("#plays")

    // submit event handler
    this.$form.on("submit", this.handleSubmit.bind(this));

    // verify that a word was submitted
    // check whether the word is valid & on the board
    // time the turn & limit it to 60 seconds
    // Give feedback on the word submitted.
    // update and display the score after every submission
  }

  // handle a submission
  async handleSubmit(evt) {
    evt.preventDefault();  // no page refresh

    this.$word = this.captureWord();

    // if no word was submitted, do nothing
    if (!this.$word) return;

    // Send the request to check the word
    this.resCheckWord = await this.checkWord();

    // Show messages
    this.showMessages();
  }

  async countdown() {
    this.secs -= 1;
    $("#timer").text(`Time Remaining: ${this.secs}`)
    if (!this.secs) {
      clearInterval(this.timer);
      this.$form.hide();
      this.$messages.hide();
      // debugger;
      await this.showScore(false, this.secs);
    }
  }

  captureWord() {
    // capture the word from the form & reset form
    const $word = $("#word").val();
    this.$form[0].reset();
    return $word;
  }

  async checkWord() {
    // Axios request to check whether the word counts in the scoring
    const url = "/word-check";
    const res = await axios({
      url: url,
      method: "GET",
      params: {
        word: this.$word
      }
    });
    return res;
  }

  showMessages() {
    // word is valid
    if (this.resCheckWord.data.result === "ok") {
      // word has NOT already been guessed
      if (!this.guesses.has(this.$word)) {
        this.$wordsGuessed.append(`<li>${this.$word}</li>`);
        this.showScore(true, this.secs);
        this.msg = "a valid word";
      } else {
        this.showScore(false, this.secs);
        this.msg = "already been guessed";
      }
      // add the word to the set of guesses
      this.guesses.add(this.$word);
      // word is not on the board
    } else if (this.resCheckWord.data.result === "not-on-board") {
      this.showScore(false, this.secs);
      this.msg = "not on the game board";
      // word is not a word
    } else {
      this.showScore(false, this.secs);
      this.msg = "not a word"
    }

    this.$messages.text(`That's ${this.msg}.`);
  }

  async showScore(update, secs = this.secs) {
    if (update) {
      this.score += this.$word.length;
    }
    $("#score").text(`Score: ${this.score}`);
    if (secs === 0) {
      const resPostScore = await this.postScore();
      console.log("print resPostScore:");
      console.log("resPostScore: ", resPostScore);
      const brokeRecord = resPostScore.data.broke_record;
      const highScore = resPostScore.data.high_score;
      if (brokeRecord) {
        this.$highScore.text(`New high score: ${highScore}`);
      }
    }
  }

  async postScore() {
    // Axios request to update the high score
    const url = "/post-score";
    const res = await axios({
      url: url,
      method: "POST",
      data: {
        score: this.score
      }
    });
    return res;
  }
}
