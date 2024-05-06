// index.ts

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';


const app = express();
const PORT = process.env.PORT || 3000;

// Definieer het type voor Book
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
  reviews: { username: string; rating: number; comment: string; }[];
}
interface Review {
  username: string;
  rating: number;
  comment: string;
  book: {
    title: string;
    author: string;
  };
}

let books: Book[]= [];

// Array of different comments
const comments = [
  'A great book!',
  'Highly recommended!',
  'Couldn\'t put it down!',
  'Amazing storyline!',
  'Well-written and engaging!',
  'Not my cup of tea, but others might enjoy it!',
  'Could be better, but still worth a read.',
  'Disappointing. Expected more from this author.'
];



// Set EJS as view engine and configure views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Lees boeken uit JSON-bestand
//import books from './books.json';

// Definieer een type voor de veldnamen van Book
type BookField = keyof Book;

// Route voor het weergeven van de boekenpagina
app.get('/', (req, res) => {
  // Bepaal het sorteerveld en de sorteerrichting op basis van de queryparameters
  const sortField = req.query.sortField || 'title';
  const sortOrder = req.query.sortOrder || 'asc';

  let q = (typeof req.query.q === 'string') ? req.query.q : '';
  // Filter de boeken op basis van de zoekquery 'q'
  let filteredBooks = [...books];
  if (req.query.q) {
    q = q.toLowerCase();
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q) || book.publicationYear.toString().includes(q)
    );
  }

  // Sorteer de gefilterde boeken op basis van het geselecteerde veld en de sorteerrichting
  let sortedBooks = filteredBooks.sort((a, b) => {
      if (sortField === 'title') {
          return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      } else if (sortField === 'author') {
          return sortOrder === 'asc' ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author);
      } else if (sortField === 'publicationYear') {
          return sortOrder === 'asc' ? a.publicationYear - b.publicationYear : b.publicationYear - a.publicationYear;
      } else if (sortField === 'rating') {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortField === 'description') {
      return sortOrder === 'asc' ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
      } else {
          return 0;
      }
  });

  // Definieer de beschikbare sorteervelden
  const sortFields = [
      { value: 'title', text: 'Title' },
      { value: 'author', text: 'Author' },
      { value: 'publicationYear', text: 'Publication Year' },
      { value: 'rating', text: 'Rating' },
      { value: 'description', text: 'Description' }
  ];

 

  // Render de boekenpagina met de gesorteerde en gefilterde boeken en sorteerinformatie
  res.render('books', {
      books: sortedBooks,
      sortFields,
      sortField,
      sortOrder,
      q: q
  });
});


// Definieer een route voor het weergeven van een specifiek boek op basis van de ID
app.get('/book/:id', (req, res) => {
    const bookId = req.params.id;

    // Zoek het boek op basis van de ID
    const book = books.find(book => book.id === bookId);

    if (book) {
        // Render de boekpagina met de gevonden boekgegevens
        res.render('book', { book });
    } else {
        // Als het boek niet is gevonden, rendeer een foutmelding
        res.render('error', { message: 'Book not found' });
    }
});

app.get('/book/:id/reviews', (req, res) => {
  const bookId = req.params.id;
  // Fetch reviews for the book with the given ID
  const reviewsForBook = getReviewsForBook(bookId);
  res.render('review', { reviews: reviewsForBook });
});


// Route for all reviews
app.get('/reviews', (req, res) => {
  // Get all reviews for all books
  const allReviews = getAllReviews();
  // Render EJS template with all comments data
  res.render('reviews', { reviews: allReviews });
});


// Function to get all reviews for all books
function getAllReviews() {
  let allReviews: Review[] = [];
  // Iterate over each book
  books.forEach(book => {
    // Iterate over each review in the book's reviews array
    book.reviews.forEach((review: any) => { // Cast review to 'any'
      // Check if 'book' property exists on the review
      if (review.book) {
        allReviews.push(review);
      }
    });
  });
  return allReviews ? allReviews : [];
}


function getReviewsForBook(bookId:string) {
  // Find the book with the specified ID
  const book = books.find(book => book.id === bookId);
  // If the book is found, return its comments, otherwise return an empty array
  return book ? book.reviews : [];
}


app.listen(PORT, async () => {

    fetchBooks();
    console.log(`The application is listening on http://localhost:${PORT}`);
 
  
});



// Function to generate random integer within a range
function getRandomInt(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function fetchBooks() {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:"Ernest Hemingway"+inauthor:"George Orwell"+inauthor:"John Steinbeck"+inauthor:"J.D. Salinger"+inauthor:"Harper Lee"+inauthor:"F. Scott Fitzgerald"+inauthor:"Jane Austen"+inauthor:"Herman Melville"+inauthor:"J.R.R. Tolkien"&maxResults=40`;
    const response = await fetch(url);
    const data = await response.json();
    const items = data.items;

    if (items) {
      books = items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
        description: item.volumeInfo.description || 'No description available',
        publicationYear: item.volumeInfo.publishedDate ? parseInt(item.volumeInfo.publishedDate.slice(0, 4)) : 0,
        isAvailable: true, // Assuming all fetched books are available
        genre: item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : 'Unknown Genre',
        imageUrl: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
        rating: getRandomInt(1, 5), // Generate a random rating between 1 and 5
        reviews: Array.from({ length: getRandomInt(1, 5) }, () => ({ // Generate random reviews
          username: 'Anonymous',
          rating: getRandomInt(1, 5),
          comment: comments[getRandomInt(0, comments.length - 1)] // Select a random comment from the array
        }))
      }));
      
      // Assign book information to each review
      books.forEach(book => {
        book.reviews.forEach((review: any) => {
          review.book = {
            title: book.title,
            author: book.author
          };
        });
      });
    } else {
      console.log('No books found.');
    }
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

fetchBooks();