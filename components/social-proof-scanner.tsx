"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, X, Loader2, Package, Users, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProductData {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  barcode: string;
  brand?: string;
  category?: string;
  description?: string;
  socialProof: {
    friendsPurchased: number;
    friendsRecommend: number;
    locationPopularity: number;
    trendingScore: number;
  };
}

const SocialProofScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<any>(null);

  // Mock product database with social proof data
  const mockProducts: ProductData[] = [
    {
      id: "honey123",
      name: "Great Value Organic Honey",
      price: "$4.98",
      rating: 4.8,
      reviews: 2847,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "123456789012",
      brand: "Great Value",
      category: "Pantry",
      description: "Pure organic honey sourced from local beekeepers",
      socialProof: {
        friendsPurchased: 12,
        friendsRecommend: 89,
        locationPopularity: 76,
        trendingScore: 85,
      },
    },
    {
      id: "detergent456",
      name: "Tide Ultra Concentrated Detergent",
      price: "$12.97",
      rating: 4.6,
      reviews: 5234,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "987654321098",
      brand: "Tide",
      category: "Laundry",
      description: "Ultra concentrated formula for powerful cleaning",
      socialProof: {
        friendsPurchased: 8,
        friendsRecommend: 94,
        locationPopularity: 82,
        trendingScore: 78,
      },
    },
    {
      id: "cereal789",
      name: "Cheerios Original Cereal",
      price: "$5.48",
      rating: 4.7,
      reviews: 3456,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "456789123456",
      brand: "General Mills",
      category: "Breakfast",
      description: "Heart-healthy whole grain oat cereal",
      socialProof: {
        friendsPurchased: 15,
        friendsRecommend: 91,
        locationPopularity: 88,
        trendingScore: 82,
      },
    },
    {
      id: "milk101",
      name: "Great Value 2% Milk",
      price: "$3.28",
      rating: 4.5,
      reviews: 1892,
      image: "/placeholder.svg?height=120&width=120",
      barcode: "789123456789",
      brand: "Great Value",
      category: "Dairy",
      description: "Fresh 2% reduced fat milk",
      socialProof: {
        friendsPurchased: 22,
        friendsRecommend: 87,
        locationPopularity: 94,
        trendingScore: 75,
      },
    },
  ];

  // Find product by barcode
  const findProductByBarcode = (code: string): ProductData | null => {
    // Try exact match first
    let product = mockProducts.find((p) => p.barcode === code);
    
    if (product) {
      return product;
    }

    // Try partial match (last 6 digits)
    const codeEnd = code.slice(-6);
    product = mockProducts.find((p) => p.barcode.includes(codeEnd));
    
    if (product) {
      return product;
    }

    // Generate mock product for unknown barcodes
    return {
      id: `unknown_${code}`,
      name: `Product ${code.slice(-6)}`,
      price: `$${(Math.random() * 20 + 2).toFixed(2)}`,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 5000 + 100),
      image: "/placeholder.svg?height=120&width=120",
      barcode: code,
      brand: "Unknown Brand",
      category: "General",
      description: "Product information not available",
      socialProof: {
        friendsPurchased: Math.floor(Math.random() * 5),
        friendsRecommend: Math.floor(Math.random() * 40 + 60),
        locationPopularity: Math.floor(Math.random() * 30 + 50),
        trendingScore: Math.floor(Math.random() * 50 + 30),
      },
    };
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setHasPermission(false);
      setError("Camera access denied. Please allow camera permissions and try again.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(null);
  };

  // Initialize barcode scanner
  const initializeBarcodeScanner = async () => {
    if (!videoRef.current) return;

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/library");
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      // Start continuous scanning
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) {
          const code = result.getText();
          console.log("Barcode detected:", code);
          handleBarcodeDetected(code);
        }
      });
    } catch (error) {
      console.error("Scanner error:", error);
      // Fallback - simulate detection after 3 seconds
      setTimeout(() => {
        const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        handleBarcodeDetected(randomProduct.barcode);
      }, 3000);
    }
  };

  // Handle barcode detection
  const handleBarcodeDetected = (code: string) => {
    setScanResult(code);
    stopScanner();
    lookupProduct(code);
  };

  // Start scanner
  const startScanner = async () => {
    if (!scannerActive) {
      setScannerActive(true);
      setError('');
      await initializeCamera();
      await initializeBarcodeScanner();
    }
  };

  // Stop scanner
  const stopScanner = () => {
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
      codeReaderRef.current = null;
    }
    stopCamera();
    setScannerActive(false);
  };

  // Lookup product by barcode
  const lookupProduct = async (barcode: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Try API first
      const response = await fetch(`/api/barcode-lookup?barcode=${barcode}`);
      
      if (response.ok) {
        const data = await response.json();
        setProductData(data.product);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('API lookup failed, using fallback:', error);
      // Fallback to mock data
      const product = findProductByBarcode(barcode);
      setProductData(product);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual barcode entry
  const handleManualLookup = () => {
    if (manualBarcode.trim()) {
      setScanResult(manualBarcode);
      lookupProduct(manualBarcode);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Users className="w-6 h-6" />
          <h2 className="text-xl font-bold">Social Proof Scanner</h2>
        </div>
        <p className="text-blue-100 text-sm text-center">
          Scan products to see what your community thinks
        </p>
      </div>

      {/* Scanner Section */}
      <div className="p-6">
        {!scannerActive ? (
          <div className="text-center">
            <Button
              onClick={startScanner}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto space-x-2"
              size="lg"
            >
              <Camera className="w-5 h-5" />
              <span>Start Camera Scanner</span>
            </Button>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg bg-black"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-blue-500 bg-blue-500/20 rounded-lg w-48 h-32 flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <Button
              onClick={stopScanner}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded">
              Point camera at product barcode
            </div>
          </div>
        )}

        {hasPermission === false && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Camera access denied. Please allow camera permissions and refresh the page.
          </div>
        )}
      </div>

      {/* Manual Entry Section */}
      <div className="px-6 pb-4">
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Or enter barcode manually:
          </h3>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Enter barcode number"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleManualLookup()}
            />
            <Button
              onClick={handleManualLookup}
              disabled={!manualBarcode.trim() || isLoading}
              variant="outline"
              size="icon"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {scanResult && (
        <div className="px-6 pb-4">
          <Card>
            <CardContent className="p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Scanned Barcode:
              </h3>
              <p className="text-lg font-mono bg-gray-100 p-2 rounded">{scanResult}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2 w-5 h-5" />
            <span>Looking up product...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 pb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Product Data with Social Proof */}
      {productData && (
        <div className="px-6 pb-4">
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Product Found!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Image */}
              <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{productData.name}</h3>
                <p className="text-2xl font-bold text-green-600">{productData.price}</p>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{productData.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({productData.reviews} reviews)</span>
                </div>
                
                {productData.brand && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Brand:</span> {productData.brand}
                  </p>
                )}
              </div>

              {/* Social Proof Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community Insights
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {productData.socialProof.friendsPurchased}
                    </div>
                    <div className="text-xs text-gray-600">Friends bought this</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {productData.socialProof.friendsRecommend}%
                    </div>
                    <div className="text-xs text-gray-600">Recommend rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {productData.socialProof.locationPopularity}%
                    </div>
                    <div className="text-xs text-gray-600">Popular locally</div>
                  </div>
                  
                  <div className="text-center flex flex-col items-center">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="text-lg font-bold text-orange-600">
                        {productData.socialProof.trendingScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Trending score</div>
                  </div>
                </div>
              </div>

              {/* Barcode Info */}
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <span className="font-medium">Barcode:</span> {productData.barcode}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reset Button */}
      {(scanResult || productData || error) && (
        <div className="px-6 pb-6">
          <Button
            onClick={() => {
              setScanResult('');
              setManualBarcode('');
              setProductData(null);
              setError('');
            }}
            variant="outline"
            className="w-full"
          >
            Scan Another Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialProofScanner;
