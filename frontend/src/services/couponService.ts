import api from './api';

export interface Coupon {
  id: string;
  name: string;
  discountRate: number;
  isActive: boolean;
  validUntil?: string;
}

export const getAllCoupons = async (page: number, size: number) => {
  const response = await api.get(`/coupons?page=${page}&size=${size}`);
  return response.data;
};

export const getCouponById = async (id: string): Promise<Coupon> => {
  const response = await api.get(`/coupons/${id}`);
  return response.data;
};

export const createCoupon = async (data: Partial<Coupon>): Promise<Coupon> => {
  const response = await api.post('/coupons', data);
  return response.data;
};

export const updateCoupon = async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
  const response = await api.put(`/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await api.delete(`/coupons/${id}`);
};

export const getActiveCouponByName = async (name: string): Promise<{ discountRate: number } | { message: string }> => {
  try {
    const response = await api.get(`/coupons/active/${name}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};