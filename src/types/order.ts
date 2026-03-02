// src/types/order.ts

export interface OrderRequest {
  userId: number;
  sessionId: string;
  cartId: number;
  fullName: string;
  mobileNo: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderTrackResponse {
  master: {
    oM_OrderNo: string;
    oM_OrderStatus: string;
    oM_PaymentStatus: string;
    oM_SubTotal: number;
    oM_TaxAmount: number;
    oM_ShippingCharge: number;
    oM_GrandTotal: number;
    oM_CreatedOn: string;
  };
  items: Array<{
    oI_ProductName: string;
    oI_Qty: number;
    oI_UnitPrice: number;
    oI_TotalAmount: number;
     oI_ImagesUrl: string;

  }>;
  shippingAddress: {
    oA_FullName: string;
    oA_MobileNo: string;
    oA_AddressLine1: string;
    oA_AddressLine2: string;
    oA_City: string;
    oA_State: string;
    oA_Pincode: string;
  };
  history: Array<{
    oS_Status: string;
    oS_Remarks: string;
    oS_CreatedOn: string;
  }>;
}

export interface OrderHistoryItem {
  oM_OrderId: number;
  oM_OrderNo: string;
  oM_OrderStatus: string;
  oM_GrandTotal: number;
  oM_CreatedOn: string;
  productname: string;
  totqty: number;
}