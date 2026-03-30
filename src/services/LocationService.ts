import {LocationData} from '../models/expense.types';

interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
}

export class LocationService {
  private static instance: LocationService;
  private cache: LocationData[] = [];
  private currentRequest: AbortController | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;
  
  private constructor() {}
  
  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }
  
  async searchLocation(
    query: string,
    onSuccess: (locations: LocationData[]) => void,
    onError: (error: string) => void
  ): Promise<void> {
    // Clear previous debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Cancel previous request
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }
    
    // Debounce for 400ms
    this.debounceTimer = setTimeout(async () => {
      if (!query.trim()) {
        onSuccess([]);
        return;
      }
      
      try {
        this.currentRequest = new AbortController();
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
          {
            headers: {
              'User-Agent': 'SplitTab-Assignment/1.0',
            },
            signal: this.currentRequest.signal,
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        
        const data: NominatimResponse[] = await response.json();
        
        const locations: LocationData[] = data.map(item => ({
          name: item.display_name.split(',')[0],
          address: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));
        
        // Update cache
        this.cache = [...locations, ...this.cache].slice(0, 5);
        
        onSuccess(locations);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          onError(error.message);
        }
      } finally {
        this.currentRequest = null;
      }
    }, 400);
  }
  
  getCachedLocations(): LocationData[] {
    return this.cache;
  }
  
  openMaps(location: LocationData): void {
    // This would use Linking to open native maps
    // For now, just log
    console.log(`Open maps at: ${location.lat}, ${location.lng}`);
  }
  
  clearCache(): void {
    this.cache = [];
  }
}