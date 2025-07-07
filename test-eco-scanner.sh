#!/bin/bash

echo "Testing Real-Time Eco Scanner API..."

# Test with proper base64 image (small red square)
TEST_IMAGE="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58HAALKAXNJ6iHXAAAAAElFTkSuQmCC"

echo "Test 1: Basic eco scan..."
curl -s -X POST http://localhost:3000/api/realtime-scan \
  -H "Content-Type: application/json" \
  -d "{\"imageData\":\"$TEST_IMAGE\",\"mode\":\"eco\"}" | jq

echo -e "\nTest 2: Cache test (should return cached result)..."
curl -s -X POST http://localhost:3000/api/realtime-scan \
  -H "Content-Type: application/json" \
  -d "{\"imageData\":\"$TEST_IMAGE\",\"mode\":\"eco\"}" | jq

echo -e "\nTest 3: API status..."
curl -s -X GET http://localhost:3000/api/realtime-scan | jq

echo -e "\nAll tests completed!"
