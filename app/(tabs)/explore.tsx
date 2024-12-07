import { StyleSheet, Image, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { convertToRGBA } from 'react-native-reanimated';

export default function ExploreScreen() {
  const [isbnSearch, setIsbnSearch] = useState('');
  const [book, setBook] = useState<Book|null>(null);

  interface BookApiResponse {
    kind?: string;
    totalItems?: number;
    items?: any[];
  }

  type Book = {
    title: string;
    authors: string[];
    description: string;
    image: {
      smallThumbnail: string;
      thumbnail: string;
    };
    link: string;
  } | null;

  useEffect(() => {

    if (!isbnSearch.trim()) {
      setBook(null);
      return;
    }

    const fetchBook = () => {
      const query   = encodeURIComponent(`isbn:${isbnSearch}`);
      const request = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
      console.log(request)
      fetch(request)
        .then((response) => response.json())
        .then((json) => {
          parseBook(json);
        })
        .catch((error) => {
          console.error('Encountered an error attempting to fetch book from google books api:',error);
        }
      );
    }
    fetchBook();
  }, [isbnSearch]);

  const parseBook = (json: BookApiResponse) => {
    if ( !json?.kind || json?.kind !== 'books#volumes' || json?.totalItems === 0 || !json?.items ) {
      setBook(null);
      return null;
    }

    const item = json.items[0];
    const volumeInfo = item.volumeInfo || null;
    if (!volumeInfo) {
      setBook(null);
    }
    const bookReponse: Book = {
      title: volumeInfo?.title || 'No title',
      authors: Array.isArray(volumeInfo?.authors) ? volumeInfo.authors : ['No authors'],
      description: volumeInfo?.description || 'No description',
      image: {
        smallThumbnail: volumeInfo?.imageLinks?.smallThumbnail || '',
        thumbnail: volumeInfo?.imageLinks?.thumbnail || '',
      },
      link: volumeInfo?.previewLink || '#',
    };

    setBook(bookReponse);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        dark: Colors.dark.background,
        light: Colors.light.background
      }}
      headerImage={
        <Image
          source={require('@/assets/images/cozy-fire-banner-right.png')}
          style={styles.cozyBannerRight}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Search ISBN:</ThemedText>
          <TextInput
            placeholder="Search"
            value={isbnSearch}
            onChangeText={(value) => setIsbnSearch(value)}
          />
      </ThemedView>
      { book ? (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="title">{book.title}</ThemedText>
          <Collapsible title="Book Information">
            <ThemedView style={styles.flexRow}>
              <Image
                source={{ uri: book.image.smallThumbnail }}
                style={styles.bookThumbnail}
              />
              <ThemedText>{book.description}</ThemedText>
            </ThemedView>
            <ThemedText>Authors: {book.authors}</ThemedText>
            <ExternalLink href={book.link}>View on Google Books</ExternalLink>
          </Collapsible>
        </ThemedView>
      ):(
        <ThemedText>No book selected.</ThemedText>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  bookThumbnail: {
    width: 64,
    height: 103,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cozyBannerRight: {
    height: 200,
    width: 400,
    top: -20,
    right: 0,
    position: 'absolute',
  },
});
