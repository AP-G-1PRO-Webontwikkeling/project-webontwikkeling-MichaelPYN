"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.set('views', path_1.default.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);
const WORDS = ["water", "bread", "frenzy", "tower", "creepy", "donkey", "fruit", "bloom", "music", "pause", "sport", "market", "floor", "walking", "prize", "chant", "swoop", "quill", "plume", "crisp", "sweep", "grace"];
let randomWord = "water";
app.get("/words", (req, res) => {
});
app.get("/guess", (req, res) => {
});
app.get("/restart", (req, res) => {
});
app.get("/", (req, res) => {
    res.render("index", {});
});
function createNewWord() {
}
function checkWord(guess, target) {
    guess = guess.toUpperCase();
    target = target.toUpperCase();
    let result = ['X', 'X', 'X', 'X', 'X']; // Initially set all to 'X' for gray
    let targetCopy = target.split('');
    // First pass for correct positions (Green)
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = 'G'; // Green for correct position
            targetCopy[i] = '_'; // Mark as used
        }
    }
    // Second pass for correct letters in the wrong position (Yellow)
    for (let i = 0; i < 5; i++) {
        if (result[i] !== 'G' && targetCopy.includes(guess[i])) {
            result[i] = 'Y'; // Yellow for correct letter in wrong position
            targetCopy[targetCopy.indexOf(guess[i])] = '_'; // Mark as used
        }
    }
    return result.map(value => value === 'X' ? 'gray' : value === 'G' ? 'green' : 'yellow');
}
app.listen(app.get("port"), () => {
    createNewWord();
    console.log("Server started on http://localhost:" + app.get('port'));
});
