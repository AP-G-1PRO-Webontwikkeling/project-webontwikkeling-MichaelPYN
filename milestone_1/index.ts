import * as fs from 'fs';
import * as readline from 'readline';

interface Review {
    username: string;
    rating: number;
    comment: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    publicationYear: number;
    isAvailable: boolean;
    genre: string;
    imageUrl: string;
    rating: number;
    reviews: Review[];
}

// Function to read JSON data from the file
function readBooksFromFile(): Book[] {
    const rawData = fs.readFileSync('books.json');
    return JSON.parse(rawData.toString());
}

const books: Book[] = readBooksFromFile();

// Function to display all books
function viewAllBooks() {
    books.forEach((book) => {
        console.log(`Title: ${book.title}`);
        console.log(`Author: ${book.author}`);
        console.log(`Description: ${book.description}`);
        console.log(`Publication Year: ${book.publicationYear}`);
        console.log(`Genre: ${book.genre}`);
        console.log(`Image URL: ${book.imageUrl}`);
        console.log(`Rating: ${book.rating}`);

        console.log("Reviews:");
        book.reviews.forEach((review) => {
            console.log(`- ${review.username}: ${review.rating} stars - ${review.comment}`);
        });

        console.log("\n");
    });
}

// Function to display author and book
function viewAuthorAndBook() {
    books.forEach((book) => {
        console.log(`Author: ${book.author}`);
        console.log(`Title: ${book.title}`);
        console.log("\n");
    });
}

// Main menu
function mainMenu() {
    console.log("Main Menu:");
    console.log("1. View all books");
    console.log("2. View author and book");
    console.log("3. Exit");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Please enter your choice: ", (choice: string) => {
        switch (parseInt(choice)) {
            case 1:
                viewAllBooks();
                rl.close();
                mainMenu();
                break;
            case 2:
                viewAuthorAndBook();
                rl.close();
                mainMenu();
                break;
            case 3:
                console.log("Exiting...");
                rl.close();
                break;
            default:
                console.error("Invalid option. Please choose a valid option.");
                mainMenu();
        }
    });
}

mainMenu();
