export class StoreTableListVo {
  storetablepkey: number;
  label: string;
  colstart: number;
  colend: number;
  rowstart: number;
  rowend: number;
  totalorderprice: number;
  regdate: string;
  orderlist: {
    foodname: string;
    ordercount: number;
  }[];
}
