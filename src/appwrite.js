import { Client, Databases, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const endPoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client().setEndpoint(endPoint).setProject(PROJECT_ID);
const databse = new Databases(client);
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 1. Use appwrite sdk to check if the search term in the db
    const results = await databse.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    //2.If it does, update the count

    if (results.documents.length > 0) {
      const doc = results.documents[0];
      await databse.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    }
    //3.if not ,create a new document withtthe search ter and count as 1
    else {
      await databse.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`,
        movie_id: movie?.id,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getPopularMovies = async () => {
  try {
    const results = await databse.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return results.documents;
  } catch (err) {
    console.log(err);
  }
};
