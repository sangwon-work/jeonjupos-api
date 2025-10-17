export class OrderInfoVo {
  orderinfopkey: number;
  orderstatus: 'PAID' | 'UNPAID' | 'DINING';
  servicetype: 'DINEIN' | 'TAKEOUT' | 'DELIVERY';
  address: string;
  orderprice: number;
  cardprice: number;
  payprice: number;
  regdate: string;
}
