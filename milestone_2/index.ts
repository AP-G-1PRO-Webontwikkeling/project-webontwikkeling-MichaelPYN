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


// Set EJS as view engine and configure views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Lees boeken uit JSON-bestand
import books from './books.json';

// Definieer een type voor de veldnamen van Book
type BookField = keyof Book;

// Route voor het weergeven van de boekenpagina
app.get('/', (req, res) => {
  // Bepaal het sorteerveld en de sorteerrichting op basis van de queryparameters
  const sortField = req.query.sortField || 'title';
  const sortOrder = req.query.sortOrder || 'asc';

  // Sorteer de boeken op basis van het geselecteerde veld en de sorteerrichting
  let sortedBooks = [...books].sort((a, b) => {
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

  // Render de boekenpagina met de gesorteerde boeken en sorteerinformatie
  res.render('books', {
      books: sortedBooks,
      sortFields, // Doorgeven van sortFields aan de EJS-template
      sortField,
      sortOrder
  });
});


//
// Detailpagina voor elk boek
app.get('/books/:id', (req, res) => {
  const book = books.find(book => book.id === req.params.id);
  res.render('book-details', { book });
});

app.listen(PORT, () => {
  console.log(`The application is listening on http://localhost:3000`);
});
