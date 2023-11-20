import { InterpreterStep } from "@nomicfoundation/ethereumjs-evm";

import { Item, TracerDependencies, AwaitedItem } from "../types";
import { colorSymbol, colorValue, hexPrefix, parseBytes32 } from "../utils";

export interface MATH {
  a: string;
  b: string;
  value: boolean
  symbol: string
}

const symbolMap: { [key: string]: string } = {
  "LT": "<",
  "GT": ">",
  "EQ": "==",
}
function parse(step: InterpreterStep): AwaitedItem<MATH> {
  const a = step.stack[step.stack.length - 1].toString();
  const b = step.stack[step.stack.length - 2].toString();

  const next = 1; // get stack just after this opcode

  return {
    isAwaitedItem: true,
    next,
    parse: (stepNext: InterpreterStep) => ({
      opcode: step.opcode.name,
      params: {
        a,
        b,
        symbol: symbolMap[step.opcode.name],
        value: Number(stepNext.stack[stepNext.stack.length - 1].toString()) == 1
      },
      format(): string {
        return format(this);
      },
    }),
  };
}

function format(item: Item<MATH>): string {
  return `${colorValue(item.params.a)} ${colorSymbol(item.params.symbol)} ${colorValue(item.params.b)} → ${colorValue(item.params.value)}`;
}

export default { parse, format };
