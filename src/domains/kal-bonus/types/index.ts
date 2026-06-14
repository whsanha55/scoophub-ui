// #43 — KAL 보너스 도메인 타입.
// 백엔드 스키마에 맞춰 점진 확장. 공통 필드만 명시, 나머지는 보존.
export interface KalBonusItem {
  id?: string | number;
  account?: string;
  member?: string;
  mileage?: number;
  bonus?: number;
  status?: string;
  updated_at?: string;
  [key: string]: unknown;
}
