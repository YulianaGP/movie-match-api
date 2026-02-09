import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const movies = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    genre: ["Drama"],
    rating: 9.3,
    director: "Frank Darabont",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  },
  {
    title: "The Godfather",
    year: 1972,
    genre: ["Crime", "Drama"],
    rating: 9.2,
    director: "Francis Ford Coppola",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
  },
  {
    title: "The Dark Knight",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    director: "Christopher Nolan",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    genre: ["Crime", "Drama"],
    rating: 8.9,
    director: "Quentin Tarantino",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."
  },
  {
    title: "Forrest Gump",
    year: 1994,
    genre: ["Drama", "Romance"],
    rating: 8.8,
    director: "Robert Zemeckis",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man."
  },
  {
    title: "Inception",
    year: 2010,
    genre: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.8,
    director: "Christopher Nolan",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea."
  },
  {
    title: "The Matrix",
    year: 1999,
    genre: ["Action", "Sci-Fi"],
    rating: 8.7,
    director: "Lana Wachowski, Lilly Wachowski",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
  },
  {
    title: "Goodfellas",
    year: 1990,
    genre: ["Crime", "Drama"],
    rating: 8.7,
    director: "Martin Scorsese",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime."
  },
  {
    title: "Interstellar",
    year: 2014,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.6,
    director: "Christopher Nolan",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    title: "Parasite",
    year: 2019,
    genre: ["Drama", "Thriller"],
    rating: 8.6,
    director: "Bong Joon Ho",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
  },
  {
    title: "The Lion King",
    year: 1994,
    genre: ["Animation", "Adventure", "Drama"],
    rating: 8.5,
    director: "Roger Allers, Rob Minkoff",
    description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself."
  },
  {
    title: "The Pianist",
    year: 2002,
    genre: ["Biography", "Drama", "Music"],
    rating: 8.5,
    director: "Roman Polanski",
    description: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II."
  },
  {
    title: "Gladiator",
    year: 2000,
    genre: ["Action", "Adventure", "Drama"],
    rating: 8.5,
    director: "Ridley Scott",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery."
  },
  {
    title: "The Departed",
    year: 2006,
    genre: ["Crime", "Drama", "Thriller"],
    rating: 8.5,
    director: "Martin Scorsese",
    description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston."
  },
  {
    title: "Whiplash",
    year: 2014,
    genre: ["Drama", "Music"],
    rating: 8.5,
    director: "Damien Chazelle",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing."
  },
  {
    title: "The Green Mile",
    year: 1999,
    genre: ["Crime", "Drama", "Fantasy"],
    rating: 8.6,
    director: "Frank Darabont",
    description: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift."
  },
  {
    title: "Schindler's List",
    year: 1993,
    genre: ["Biography", "Drama", "History"],
    rating: 9.0,
    director: "Steven Spielberg",
    description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce."
  },
  {
    title: "Fight Club",
    year: 1999,
    genre: ["Drama"],
    rating: 8.8,
    director: "David Fincher",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more."
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    genre: ["Action", "Adventure", "Drama"],
    rating: 9.0,
    director: "Peter Jackson",
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring."
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 8.7,
    director: "Irvin Kershner",
    description: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda."
  },
  {
    title: "The Silence of the Lambs",
    year: 1991,
    genre: ["Crime", "Drama", "Thriller"],
    rating: 8.6,
    director: "Jonathan Demme",
    description: "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer."
  },
  {
    title: "Saving Private Ryan",
    year: 1998,
    genre: ["Drama", "War"],
    rating: 8.6,
    director: "Steven Spielberg",
    description: "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action."
  },
  {
    title: "Se7en",
    year: 1995,
    genre: ["Crime", "Drama", "Mystery"],
    rating: 8.6,
    director: "David Fincher",
    description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives."
  },
  {
    title: "City of God",
    year: 2002,
    genre: ["Crime", "Drama"],
    rating: 8.6,
    director: "Fernando Meirelles, Kátia Lund",
    description: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin."
  },
  {
    title: "Spirited Away",
    year: 2001,
    genre: ["Animation", "Adventure", "Family"],
    rating: 8.6,
    director: "Hayao Miyazaki",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits."
  },
  {
    title: "Back to the Future",
    year: 1985,
    genre: ["Adventure", "Comedy", "Sci-Fi"],
    rating: 8.5,
    director: "Robert Zemeckis",
    description: "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean."
  },
  {
    title: "The Prestige",
    year: 2006,
    genre: ["Drama", "Mystery", "Sci-Fi"],
    rating: 8.5,
    director: "Christopher Nolan",
    description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have."
  },
  {
    title: "The Intouchables",
    year: 2011,
    genre: ["Biography", "Comedy", "Drama"],
    rating: 8.5,
    director: "Olivier Nakache, Éric Toledano",
    description: "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver."
  },
  {
    title: "The Usual Suspects",
    year: 1995,
    genre: ["Crime", "Drama", "Mystery"],
    rating: 8.5,
    director: "Bryan Singer",
    description: "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup."
  },
  {
    title: "Memento",
    year: 2000,
    genre: ["Mystery", "Thriller"],
    rating: 8.4,
    director: "Christopher Nolan",
    description: "A man with short-term memory loss attempts to track down his wife's murderer."
  }
];

async function main() {
  console.log('Seeding database...');

  // Delete existing movies to avoid duplicates
  await prisma.movie.deleteMany();
  console.log('Cleared existing movies.');

  // Insert all movies
  const result = await prisma.movie.createMany({
    data: movies,
  });

  console.log(`Seeded ${result.count} movies successfully.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
