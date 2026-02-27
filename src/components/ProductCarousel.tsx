import { h } from 'preact';
import { ProductCard } from './ProductCard';
import type { ProductRecommendation } from '../types';

interface ProductCarouselProps {
  products: ProductRecommendation[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <div class="cai-products">
      <div class="cai-products-scroll">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
      {products.length > 2 && <div class="cai-products-fade" />}
    </div>
  );
}
