// **************************
// JQUERY VARIABLES
// **************************
const $form = $("#word-check-form");
let $messages = $("#messages");

// **************************
// EVENT HANDLERS
// **************************

$form.on("submit", async function (evt) {
  evt.preventDefault();  // no page refresh
  const url = "/word-check";
  const $word = $("#word").val();
  const res = await axios({
    url: url,
    method: "GET",
    params: {
      word: $word
    }
  });

  let msg;
  if (res.data.result === "ok") {
    msg = "a valid word";
  } else if (res.data.result === "not-on-board") {
    msg = "not on the game board";
  } else {
    msg = "not a word";
  }
  $messages.text(`That's ${msg}.`);
});
