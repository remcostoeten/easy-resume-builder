# Deprecation of Valtio Store

## Deprecation Reason
We have decided to unify our state management approach by switching entirely to Jotai for state management. This decision comes from the simpler structure, type safety, better performance, and consistency offered by Jotai.

## Replacement
The Valtio store state management approach will be deprecated in favor of Jotai.

## Deprecation Plan

- **Documentation**: Complete ([See details](CODEBASE_AUDIT_RESUME_STORES.md))
- **Timeline**:
  - **Weeks 1-2**: Extend Jotai with a persistence layer and helper functions.
  - **Weeks 3-4**: Migrate layout components and dev utilities.
  - **Weeks 5-7**: Transition section components to Jotai.
  - **Week 8**: Final cleanup and testing.
  - **Week 9**: Removal of Valtio dependencies.

## Action for Developers

1. **Replace Imports and Hooks**: Replace existing imports and Valtio hooks with Jotai's `useAtom` and `useAtomValue`.
2. **Action Handling**: Transition reducer pattern to use direct updates to atoms.

## Impact on Developers

No direct user-facing changes expected, as data persistence will be maintained during migration.

## Further Assistance
For any further assistance regarding the deprecation, reach out to the core development team.
