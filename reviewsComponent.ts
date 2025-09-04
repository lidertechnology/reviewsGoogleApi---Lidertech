import { Component, OnInit, inject } from '@angular/core';
import { ReviewsService } from 'ruta/a/reviews.service';

@Component({
  // ...
})
export class ReviewsComponent implements OnInit {

  private readonly reviewsService = inject(ReviewsService);
  public reviews: any[] = [];
  placeId = 'TU_PLACE_ID'; // Reemplaza con tu ID de lugar

  constructor() { }

  ngOnInit(): void {
    this.reviewsService.getReviews(this.placeId).subscribe((data: any) => {
      if (data.result && data.result.reviews) {
        this.reviews = data.result.reviews;
      }
    });
  }
}
