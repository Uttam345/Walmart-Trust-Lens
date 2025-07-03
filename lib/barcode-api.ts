/**
 * Barcode Lookup API Service
 * Documentation: https://api.barcodelookup.com/v3/products
 */

const BARCODE_API_KEY = process.env.NEXT_PUBLIC_BARCODE_API_KEY!;
const BASE_URL = "https://api.barcodelookup.com/v3/products";

export interface BarcodeProduct {
  barcode_number: string;
  barcode_formats: string;
  mpn?: string;
  model?: string;
  asin?: string;
  title: string;
  category?: string;
  manufacturer?: string;
  brand?: string;
  contributors?: Array<{
    role: string;
    name: string;
  }>;
  age_group?: string;
  ingredients?: string;
  nutrition_facts?: string;
  energy_efficiency_class?: string;
  color?: string;
  gender?: string;
  material?: string;
  pattern?: string;
  format?: string;
  multipack?: string;
  size?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  release_date?: string;
  description?: string;
  features?: string[];
  images?: string[];
  last_update: string;
  stores?: Array<{
    name: string;
    country: string;
    currency: string;
    currency_symbol: string;
    price: string;
    sale_price?: string;
    tax?: Array<{
      country: string;
      region: string;
      rate: string;
      tax_ship: string;
    }>;
    link: string;
    item_group_id?: string;
    availability: string;
    condition: string;
    shipping?: Array<{
      country: string;
      region: string;
      service: string;
      price: string;
    }>;
    last_update: string;
  }>;
  reviews?: Array<{
    name: string;
    rating: string;
    title: string;
    review: string;
    date: string;
  }>;
}

export interface BarcodeApiResponse {
  products: BarcodeProduct[];
}

export interface ProcessedProduct {
  id: string;
  name: string;
  price: string;
  rating?: number;
  reviews?: number;
  image?: string;
  barcode: string;
  brand?: string;
  manufacturer?: string;
  category?: string;
  description?: string;
  features?: string[];
  stores?: Array<{
    name: string;
    price: string;
    currency: string;
    availability: string;
    link: string;
  }>;
  socialProof?: {
    friendsPurchased?: number;
    friendsRecommend?: number;
    locationPopularity?: number;
    trendingScore?: number;
    recentActivity?: string;
  };
  isUnknown?: boolean;
  detectedCode?: string;
  scanTimestamp?: string;
}

/**
 * Lookup product by barcode using Barcode Lookup API
 * NOTE: This function should only be called from the server (API route or getServerSideProps).
 * Barcode Lookup API does NOT support CORS for client-side requests.
 */
export async function lookupBarcode(barcode: string): Promise<ProcessedProduct | null> {
  if (!BARCODE_API_KEY) {
    throw new Error('Barcode API key is missing. Set BARCODE_API_KEY in your environment.')
  }
  // Only run on server (Node.js), not in browser
  if (typeof window !== 'undefined') {
    throw new Error('lookupBarcode must be called from the server (API route or getServerSideProps).')
  }
  try {
    console.log(`Looking up barcode: ${barcode}`);
    // Validate barcode format (7, 8, 10, 11, 12, 13, or 14 digits)
    if (!/^[0-9]{7,14}$/.test(barcode)) {
      console.warn(`Invalid barcode format: ${barcode}`);
      return null;
    }
    const url = `${BASE_URL}?barcode=${barcode}&formatted=y&key=${BARCODE_API_KEY}`;
    // Add a timeout to fetch (10s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (response.status === 404) {
      console.log(`No product found for barcode: ${barcode}`);
      return null;
    }
    if (response.status === 403) {
      console.error('Invalid API key for Barcode Lookup API');
      throw new Error('Invalid API key');
    }
    if (response.status === 429) {
      console.error('Rate limit exceeded for Barcode Lookup API');
      throw new Error('Rate limit exceeded');
    }
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      throw new Error(`API request failed: ${response.status}`);
    }
    const data: BarcodeApiResponse = await response.json();
    if (!data.products || data.products.length === 0) {
      console.log(`No products found in API response for barcode: ${barcode}`);
      return null;
    }
    const product = data.products[0];
    console.log(`Found product: ${product.title}`);
    return processProduct(product);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Barcode API request timed out');
      throw new Error('Barcode API request timed out');
    }
    console.error('Error looking up barcode:', error);
    throw error;
  }
}

/**
 * Search products by title, brand, or other parameters
 */
export async function searchProducts(query: string, searchType: 'title' | 'brand' | 'search' = 'search'): Promise<ProcessedProduct[]> {
  try {
    console.log(`Searching products: ${query} (type: ${searchType})`);
    
    const params = new URLSearchParams({
      [searchType]: query,
      formatted: 'y',
      key: BARCODE_API_KEY,
    });

    const url = `${BASE_URL}?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: BarcodeApiResponse = await response.json();
    
    if (!data.products || data.products.length === 0) {
      return [];
    }

    return data.products.map(processProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Get API rate limit information
 */
export async function getRateLimits() {
  try {
    const url = `https://api.barcodelookup.com/v3/rate-limits?formatted=y&key=${BARCODE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting rate limits:', error);
    throw error;
  }
}

/**
 * Process raw API product data into our internal format
 */
function processProduct(product: BarcodeProduct): ProcessedProduct {
  // Calculate average rating from reviews
  const rating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / product.reviews.length
    : undefined;

  // Get the best price from available stores
  const bestPrice = product.stores && product.stores.length > 0
    ? product.stores.reduce((min, store) => {
        const price = parseFloat(store.sale_price || store.price);
        return price < min.price ? { price, store } : min;
      }, { price: Infinity, store: product.stores[0] })
    : null;

  // Process stores data
  const stores = product.stores?.map(store => ({
    name: store.name,
    price: store.sale_price ? `${store.currency_symbol}${store.sale_price}` : `${store.currency_symbol}${store.price}`,
    currency: store.currency,
    availability: store.availability,
    link: store.link,
  }));

  // Generate social proof data (since this isn't provided by the API)
  const socialProof = {
    friendsPurchased: Math.floor(Math.random() * 5),
    friendsRecommend: Math.floor(Math.random() * 30 + 70), // 70-100%
    locationPopularity: Math.floor(Math.random() * 40 + 60), // 60-100%
    trendingScore: Math.floor(Math.random() * 50 + 50), // 50-100%
    recentActivity: "Recently scanned by community",
  };

  return {
    id: product.barcode_number,
    name: product.title,
    price: bestPrice ? `${bestPrice.store.currency_symbol}${bestPrice.store.sale_price || bestPrice.store.price}` : 'Price not available',
    rating: rating ? Math.round(rating * 10) / 10 : undefined,
    reviews: product.reviews?.length,
    image: product.images?.[0] || '/placeholder.svg?height=200&width=200',
    barcode: product.barcode_number,
    brand: product.brand,
    manufacturer: product.manufacturer,
    category: product.category,
    description: product.description,
    features: product.features,
    stores,
    socialProof,
  };
}

/**
 * Generate a mock product for unknown barcodes
 */
export function generateMockProduct(barcode: string): ProcessedProduct {
  const productNames = [
    "Unknown Product",
    "Scanned Item", 
    "Store Brand Item",
    "Generic Product",
    "Unidentified Item"
  ];

  const randomName = productNames[Math.floor(Math.random() * productNames.length)];
  const randomPrice = (Math.random() * 20 + 2).toFixed(2);
  const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const randomReviews = Math.floor(Math.random() * 5000 + 100);

  return {
    id: `unknown_${barcode}`,
    name: `${randomName} (${barcode.slice(-6)})`,
    price: `$${randomPrice}`,
    rating: Number.parseFloat(randomRating),
    reviews: randomReviews,
    image: "/placeholder.svg?height=200&width=200",
    barcode: barcode,
    isUnknown: true,
    socialProof: {
      friendsPurchased: Math.floor(Math.random() * 3),
      friendsRecommend: Math.floor(Math.random() * 40 + 60),
      locationPopularity: Math.floor(Math.random() * 30 + 50),
      trendingScore: Math.floor(Math.random() * 50 + 30),
      recentActivity: "No community data available",
    },
  };
}
