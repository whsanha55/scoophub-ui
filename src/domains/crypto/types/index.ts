export interface CryptoPrice {
  id: number;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number | null;
  total_volume: number | null;
  image_url: string | null;
  fetched_at: string;
}

export interface CryptoPriceParams {
  sort?: "current_price" | "market_cap" | "price_change_percentage_24h";
  order?: "desc" | "asc";
  limit?: number;
  page?: number;
}
