export function isFiveLetterWord(word:string):boolean {
    return word.length===5;
}

export function getFiveLetterWords(words:string[]):string[]{
    return words.filter(e=> isFiveLetterWord(e));
}
export function toUpperCase(words:string[]):string[] {
    return words.map(e=>e.toUpperCase());
}
export function getRandomWord(words:string[]):string {
    return words[(Math.floor(Math.random()*words.length))]
}