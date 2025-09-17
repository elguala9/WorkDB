import { MessageData, MessageWithId } from "./WorkDB.spec.ts";

  /** 4) IdType = number */
  export function eqIdType(a: number, b: number): boolean {
    return a === b;
  }

  /** 6) MessageWithId */
  export function eqMessageWithId(a: MessageWithId, b: MessageWithId): boolean {
    return eqIdType(a.id, b.id);
  }

export function eqMessageData(a: MessageData, b: MessageData): boolean {
    if (!eqMessageWithId(a, b)) return notEqual(a, b);
    if (a.data.length !== b.data.length) return notEqual(a, b);
    for (let i = 0; i < a.data.length; i++) {
      if (a.data[i] !== b.data[i]) return notEqual(a, b);
    }
    return true;
}

function notEqual(a: any, b: any): boolean{
    console.log("First Object: --------- ");
    console.log(a);
    console.log("Second Object: --------- ");
    console.log(b);
    return false;
}