import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private readonly http = inject(HttpClient);
  private readonly apiKey = environment.googleMapsApiKey;
  private readonly apiUrl = '/api/maps/api/place/details/json'; // URL del proxy para pruebas en desarrolo.

  getReviews(placeId: string) {
    const url = `${this.apiUrl}?place_id=${placeId}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
