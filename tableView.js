const side = 4;

const createTag = function(content, tag) {
  return `<${tag}> ${content} </${tag}>`;
};

const createTagWithID = function(content, tag, id) {
  return `<${tag} id = "${id}"> ${content} </${tag}>`;
};

const createTable = function(side) {
  let output = "";
  let dataID = 1;
  for (let coloumn = 0; coloumn < side; coloumn++) {
    let rows = "";
    for (let row = 0; row < side; row++) {
      let content = createTagWithID("", "td", dataID);
      dataID = dataID + 1;
      rows = rows + content;
    }
    output = output + createTag(rows, "tr");
  }
  return output;
};

const doPartition = function(array, length) {
  let result = [];
  let indexToStart = 0;
  for (let index = 0; index < length; index++) {
    let sampleArray = array.slice(0);
    result.push(sampleArray.splice(indexToStart, length));
    indexToStart += length;
  }
  return result;
};

const range = function(num1, num2) {
  let result = [];
  let max = Math.max(num1, num2);
  let min = Math.min(num1, num2);
  for (let count = min; count <= max; count++) {
    result.push(count);
  }
  return result;
};

const randomGenerator = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

const randomPath = function(twoDArray, side) {
  let firstElement = randomGenerator(twoDArray[0]);
  let result = [firstElement];
  for (let count = 1; count < side; count++) {
    let secondElement = randomGenerator(twoDArray[count]);
    result = result.concat(range(firstElement + side, secondElement));
    firstElement = secondElement;
  }
  return result;
};

const findNeighbours = function(side, count) {
  let result = [count - side, count + 1, count - 1, count + side];
  if (count % side == 0) result = [count - side, count - 1, count + side];
  if ((count - 1) % side == 0) result = [count - side, count + 1, count + side];
  return result;
};

const validateNeighbours = function(side, count) {
  let neighboursArray = findNeighbours(side, count);
  return neighboursArray.filter(x => x <= side * side && x > 0);
};

const allList = range(1, side * side);
const partitionArray = doPartition(allList, side);
const path = randomPath(partitionArray, side);
const userAlivesMove = [];

const validatePath = function() {
  let initialMoves = range(side * (side - 1) + 1, side * side);
  let move = userAlivesMove[0];
  return (move && validateNeighbours(side, move)) || initialMoves;
};

const wrongPath = function(cellID) {
  let bomb = document.getElementById(cellID);
  bomb.style.backgroundImage = "url('./images/bomb.png')";
  bomb.style.backgroundPosition = "center";
  bomb.style.backgroundSize = "cover";
  setTimeout(() => {
    bomb.style.backgroundImage = null;
  }, 700);
};

const drawMove = function(cellID, possibleMoves) {
  if (possibleMoves.includes(cellID)) {
    userAlivesMove.unshift(cellID);
    allList.map(element => (document.getElementById(element).innerHTML = ""));
    document.getElementById(cellID).innerHTML = "&#129497";
    checkWin(cellID);
    return (document.getElementById("msgType").innerText = "");
  }
  document.getElementById("msgType").innerText = "Invalid Move";
};

const checkWin = function(cellID) {
  let winningList = range(1, side);
  if (winningList.includes(cellID)) {
    document.getElementById("page").style.backgroundImage =
      "url('./images/giphy.webp')";
    document.getElementById("msgBox").innerText = "You Won";
    document.getElementById("table").onclick = null;
  }
};

const playGame = function(event) {
  let possibleMoves = validatePath();
  let cellID = +event.target.id;
  if (path.includes(cellID)) {
    return drawMove(cellID, possibleMoves);
  }
  if (!path.includes(cellID) && !possibleMoves.includes(cellID)) {
    return (document.getElementById("msgType").innerText = "Invalid Move");
  }
  wrongPath(cellID);
};

window.onload = () => {
  document.getElementById("table").innerHTML = createTable(side);
  document.getElementById("msgBox").innerText = "Lives Remains 3";
};
