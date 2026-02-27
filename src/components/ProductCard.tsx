import { h } from 'preact';
import { useConfig } from '../hooks/useConfig';
import { formatPrice } from '../utils/currency';
import type { ProductRecommendation } from '../types';

interface ProductCardProps {
  product: ProductRecommendation;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const config = useConfig();

  const handleClick = (e: Event) => {
    if (config.onProductClick) {
      e.preventDefault();
      config.onProductClick(product);
    }
  };

  return (
    <a
      class="cai-product-card"
      href={product.product_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {product.image_url ? (
        <img class="cai-product-img" src={product.image_url} alt={product.name} loading="lazy" />
      ) : (
        <div class="cai-product-img-placeholder">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
      )}

      <div class="cai-product-body">
        {product.brand && (
          <div class="cai-product-brand">{product.brand}</div>
        )}
        <div class="cai-product-name">{product.name}</div>
        {product.description && (
          <div class="cai-product-desc">{product.description}</div>
        )}
        <div style={{ flex: 1 }} />
        <div class="cai-product-footer">
          {product.price ? (
            <span class="cai-product-price">{formatPrice(product.price, product.currency)}</span>
          ) : (
            <span />
          )}
          <span class="cai-product-cta">
            View
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
