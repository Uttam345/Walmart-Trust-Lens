import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get('barcode');

  if (!barcode) {
    return NextResponse.json(
      { error: 'Barcode parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Use the barcode lookup API
    const apiKey = process.env.NEXT_PUBLIC_BARCODE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.products && data.products.length > 0) {
      const product = data.products[0];
      
      // Transform the API response to match our expected format
      const transformedProduct = {
        id: product.barcode_number || barcode,
        name: product.title || 'Unknown Product',
        price: product.stores?.[0]?.store_price || 'Price not available',
        rating: 4.5, // Default rating since API doesn't provide this
        reviews: Math.floor(Math.random() * 5000 + 100), // Mock reviews
        image: product.images?.[0] || '/placeholder.svg?height=120&width=120',
        barcode: product.barcode_number || barcode,
        brand: product.brand || 'Unknown Brand',
        category: product.category || 'General',
        description: product.description || 'No description available',
        socialProof: {
          friendsPurchased: Math.floor(Math.random() * 25),
          friendsRecommend: Math.floor(Math.random() * 40 + 60),
          locationPopularity: Math.floor(Math.random() * 30 + 50),
          trendingScore: Math.floor(Math.random() * 50 + 30),
        },
      };

      return NextResponse.json({ product: transformedProduct });
    } else {
      // Return a mock product if not found in API
      const mockProduct = {
        id: `unknown_${barcode}`,
        name: `Product ${barcode.slice(-6)}`,
        price: `$${(Math.random() * 20 + 2).toFixed(2)}`,
        rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
        reviews: Math.floor(Math.random() * 5000 + 100),
        image: '/placeholder.svg?height=120&width=120',
        barcode: barcode,
        brand: 'Store Brand',
        category: 'General',
        description: 'Product information not available in database',
        socialProof: {
          friendsPurchased: Math.floor(Math.random() * 5),
          friendsRecommend: Math.floor(Math.random() * 40 + 60),
          locationPopularity: Math.floor(Math.random() * 30 + 50),
          trendingScore: Math.floor(Math.random() * 50 + 30),
        },
      };

      return NextResponse.json({ product: mockProduct });
    }
  } catch (error) {
    console.error('Barcode lookup error:', error);
    
    // Return a fallback product on error
    const fallbackProduct = {
      id: `error_${barcode}`,
      name: `Scanned Product ${barcode.slice(-6)}`,
      price: `$${(Math.random() * 20 + 2).toFixed(2)}`,
      rating: 4.0,
      reviews: Math.floor(Math.random() * 1000 + 50),
      image: '/placeholder.svg?height=120&width=120',
      barcode: barcode,
      brand: 'Unknown',
      category: 'General',
      description: 'Unable to retrieve product information',
      socialProof: {
        friendsPurchased: Math.floor(Math.random() * 3),
        friendsRecommend: Math.floor(Math.random() * 30 + 50),
        locationPopularity: Math.floor(Math.random() * 25 + 40),
        trendingScore: Math.floor(Math.random() * 40 + 20),
      },
    };

    return NextResponse.json({ product: fallbackProduct });
  }
}
