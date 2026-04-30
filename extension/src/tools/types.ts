export interface WorkspaceTool {
  /** Tool name — must be unique, snake_case */
  name: string;
  /** Human-readable description for the LM */
  description: string;
  /** JSON Schema for the tool's input object */
  schema: object;
  /** Execute the tool and return a string result */
  execute: (input: unknown) => Promise<string>;
}
