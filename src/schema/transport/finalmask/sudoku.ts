import z from "zod";
import sudokuDescription from "./sudoku.md?raw";
import passwordDescription from "./password.md?raw";
import asciiDescription from "./ascii.md?raw";
import customTableDescription from "./customTable.md?raw";
import customTablesDescription from "./customTables.md?raw";
import paddingMinDescription from "./paddingMin.md?raw";
import paddingMaxDescription from "./paddingMax.md?raw";

export const sudoku = z
  .object({
    type: z.literal("sudoku"),
    settings: z
      .object({
        password: z.string().meta({
          markdownDescription: passwordDescription,
        }),
        ascii: z.string().meta({
          markdownDescription: asciiDescription,
        }),
        customTable: z.string().meta({
          markdownDescription: customTableDescription,
        }),
        customTables: z.array(z.string()).meta({
          markdownDescription: customTablesDescription,
        }),
        paddingMin: z.int().meta({
          markdownDescription: paddingMinDescription,
        }),
        paddingMax: z.int().meta({
          markdownDescription: paddingMaxDescription,
        }),
      })
      .meta({
        markdownDescription: sudokuDescription,
      }),
  })
  .meta({
    markdownDescription: sudokuDescription,
  });
