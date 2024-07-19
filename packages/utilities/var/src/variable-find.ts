import { F, MutRef, O } from "@eslint-react/tools";
import type { Scope, Variable } from "@typescript-eslint/scope-manager";
import { ScopeType } from "@typescript-eslint/scope-manager";
import { findVariable as TSEFindVariable } from "@typescript-eslint/utils/ast-utils";

/**
 * Get all variables from the given scope up to the global scope
 * @param initialScope The scope to start from
 * @returns All variables from the given scope up to the global scope
 */
export function getVariables(initialScope: Scope): Variable[] {
  const scopeRef = MutRef.make(initialScope);
  const variablesRef = MutRef.make(MutRef.get(scopeRef).variables);
  while (MutRef.get(scopeRef).type !== ScopeType.global) {
    MutRef.set(scopeRef, MutRef.get(scopeRef).upper);
    MutRef.update(variablesRef, (variables) => variables.concat(MutRef.get(scopeRef).variables));
  }
  return MutRef.get(variablesRef).reverse();
}

export const findVariable: {
  (initialScope: Scope): (name: string) => O.Option<Variable>;
  (name: string, initialScope: Scope): O.Option<Variable>;
} = F.dual(2, (name: string, initialScope: Scope) => {
  return O.fromNullable(TSEFindVariable(initialScope, name));
});
