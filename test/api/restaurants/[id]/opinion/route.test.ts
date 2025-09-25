import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/restaurants/[id]/opinion/route';
import { RestaurantService } from '@/src/lib/restaurant-service';
import { AIClient } from '@/src/lib/ai-client';
import { NextResponse } from 'next/server';

vi.mock('@/src/lib/restaurant-service');
vi.mock('@/src/lib/ai-client');

describe('POST /api/restaurants/[id]/opinion', () => {
  const mockRestaurant = {
    id: 'test-restaurant-id',
    name: 'Test Restaurant',
    description: 'A place to test things.',
    cuisine: 'Test Cuisine',
    menu: [],
    chatbotContext: {
      welcomeMessage: 'Welcome to Test Restaurant!',
      businessHours: '24/7',
      specialInstructions: 'None',
      orderingEnabled: true,
      deliveryInfo: 'Everywhere',
    },
  };

  const mockAiResponse = {
    response: 'This is a test response from the AI.',
  };

  it('should return a successful response with a valid API key and query', async () => {
    // Arrange
    vi.mocked(RestaurantService.getRestaurantByApiKey).mockResolvedValue(mockRestaurant as any);
    vi.mocked(AIClient.generateResponse).mockResolvedValue(mockAiResponse as any);

    const request = new Request('http://localhost/api/restaurants/test-restaurant-id/opinion', {
      method: 'POST',
      headers: {
        'x-api-key': 'valid-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'What are your specials?' }),
    });

    const params = { params: { id: 'test-restaurant-id' } };

    // Act
    const response = await POST(request, params);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(json).toEqual(mockAiResponse);
  });

  it('should return 401 if API key is missing', async () => {
    // Arrange
    const request = new Request('http://localhost/api/restaurants/test-restaurant-id/opinion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'What are your specials?' }),
    });

    const params = { params: { id: 'test-restaurant-id' } };

    // Act
    const response = await POST(request, params);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(json).toEqual({ error: 'API key is required' });
  });

  it('should return 401 if API key is invalid', async () => {
    // Arrange
    vi.mocked(RestaurantService.getRestaurantByApiKey).mockResolvedValue(null);

    const request = new Request('http://localhost/api/restaurants/test-restaurant-id/opinion', {
      method: 'POST',
      headers: {
        'x-api-key': 'invalid-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'What are your specials?' }),
    });

    const params = { params: { id: 'test-restaurant-id' } };

    // Act
    const response = await POST(request, params);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(json).toEqual({ error: 'Invalid API key or restaurant ID' });
  });

  it('should return 400 if query is missing', async () => {
    // Arrange
    const request = new Request('http://localhost/api/restaurants/test-restaurant-id/opinion', {
      method: 'POST',
      headers: {
        'x-api-key': 'valid-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const params = { params: { id: 'test-restaurant-id' } };

    // Act
    const response = await POST(request, params);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Query is required' });
  });
});