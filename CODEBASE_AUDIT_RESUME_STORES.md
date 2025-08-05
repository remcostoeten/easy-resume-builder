# Resume Store Codebase Audit

## Executive Summary

This audit documents all usages of `resumeDraftAtom` (Jotai) and `resumeStore` (Valtio) across the codebase to facilitate the migration to a single store solution using **Jotai** as the primary state management system.

**Decision**: Keep **Jotai** as the single source of truth for resume state management due to its simpler atom-based architecture and existing persistence setup.

---

## Store Analysis

### 1. Jotai Store (`resumeDraftAtom`)

**Location**: `src/store/resume-store.ts` (lines 250-299)

**Key Components**:
- `resumeDraftAtom`: Main atom holding draft state
- `setResumeDraft()`: Helper function for updating draft state
- `clearStore()`: Function to reset store
- `createStore()`: Factory function for isolated store instances

**Storage**: No automatic persistence (draft/temporary state)

**Usage Pattern**: Simple atomic updates with functional helpers

### 2. Valtio Store (`resumeStore`)

**Location**: `src/store/resume-store.ts` (lines 149-242)

**Key Components**:
- `resumeStore`: Proxy-based reactive store
- `resumeReducer()`: Action-based state updates
- Automatic localStorage persistence
- Complex nested state mutations

**Storage**: Automatic localStorage persistence with `resume-builder-data` key

**Usage Pattern**: Action/reducer pattern with automatic persistence

---

## File-by-File Usage Analysis

### Core Store Definition
**File**: `src/store/resume-store.ts`
- **Valtio**: Lines 149, 165, 250, 255, 257, 263, 283, 285, 290, 295
- **Jotai**: Lines 250, 253, 255, 257, 263, 282, 285, 290, 295
- **Role**: Defines both stores and their helper functions

### Layout Components

#### 1. `src/features/resume-builder/layout/professional-main-layout.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 16: `useSnapshot(resumeStore).data` - Read store state
  - Line 24: `resumeReducer({ type: 'TOGGLE_SECTION', sectionId })` - Write operation
  - Line 28: `resumeReducer({ type: 'REORDER_SECTIONS', sections })` - Write operation
- **Operations**: Toggle sections, reorder sections
- **Data Flow**: Store → UI components via snapshot conversion utilities

#### 2. `src/features/resume-builder/layout/modern-main-layout.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 17: `useSnapshot(resumeStore).data` - Read store state
  - Line 30: `resumeReducer({ type: 'TOGGLE_SECTION', sectionId })` - Write operation
  - Line 34: `resumeReducer({ type: 'REORDER_SECTIONS', sections })` - Write operation
- **Operations**: Toggle sections, reorder sections
- **Data Flow**: Store → UI components via snapshot conversion utilities

#### 3. `src/features/resume-builder/layout/main-layout.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 18: `useSnapshot(resumeStore).data` - Read store state
  - Line 30: `resumeReducer({ type: 'TOGGLE_SECTION', sectionId })` - Write operation
  - Line 34: `resumeReducer({ type: 'REORDER_SECTIONS', sections })` - Write operation
- **Operations**: Toggle sections, reorder sections, initialize sections
- **Data Flow**: Store → UI components via snapshot conversion utilities

#### 4. `src/views/home-view.tsx`
- **Store Used**: Jotai (`resumeDraftAtom`)
- **Usage**: 
  - Line 19: `useAtomValue(resumeDraftAtom) as TResumeData` - Read store state
  - Line 26: `setResumeDraft({ sections: updatedSections })` - Write operation
  - Line 30: `setResumeDraft({ sections })` - Write operation
- **Operations**: Toggle sections, reorder sections
- **Data Flow**: Direct atom access for draft state

### Section Components

#### 1. `src/features/resume-builder/sections/personal-info-section.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 48: `resumeReducer({ type: 'UPDATE_PERSONAL_INFO', data: formData })` - Write operation
- **Operations**: Update personal information via form submission
- **Data Flow**: Form → Reducer → Store → Persistence

#### 2. `src/features/resume-builder/sections/professional-personal-info.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 46: `resumeReducer({ type: 'UPDATE_PERSONAL_INFO', data: {...} })` - Write operation
- **Operations**: Auto-save personal information on form changes
- **Data Flow**: Form watch → Reducer → Store → Persistence

#### 3. `src/features/resume-builder/sections/work-experience-section.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 35: `resumeReducer({ type: 'UPDATE_WORK_EXPERIENCE', id, data })` - Write operation
  - Line 41: `resumeReducer({ type: 'ADD_WORK_EXPERIENCE', data })` - Write operation
  - Line 56: `resumeReducer({ type: 'REMOVE_WORK_EXPERIENCE', id })` - Write operation
- **Operations**: CRUD operations for work experience items
- **Data Flow**: Form → Reducer → Store → Persistence

#### 4. `src/features/resume-builder/sections/professional-work-experience.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 35: `resumeReducer({ type: 'UPDATE_WORK_EXPERIENCE', id, data })` - Write operation
  - Line 41: `resumeReducer({ type: 'ADD_WORK_EXPERIENCE', data })` - Write operation
  - Line 56: `resumeReducer({ type: 'REMOVE_WORK_EXPERIENCE', id })` - Write operation
- **Operations**: CRUD operations for work experience items
- **Data Flow**: Form → Reducer → Store → Persistence

#### 5. `src/features/resume-builder/sections/skills-section.tsx`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Line 36: `resumeReducer({ type: 'UPDATE_SKILL_CATEGORY', id, data })` - Write operation
  - Line 42: `resumeReducer({ type: 'ADD_SKILL_CATEGORY', data })` - Write operation
  - Line 57: `resumeReducer({ type: 'REMOVE_SKILL_CATEGORY', id })` - Write operation
- **Operations**: CRUD operations for skill categories
- **Data Flow**: Form → Reducer → Store → Persistence

### Utility Components

#### `src/utils/dev-utils.ts`
- **Store Used**: Valtio (`resumeStore`)
- **Usage**: 
  - Lines 9, 12, 21, 38-42: Development utilities for debugging store state
- **Operations**: Read-only debugging operations, localStorage management
- **Data Flow**: Direct store access for development/debugging

---

## Usage Patterns Summary

### Valtio Store (`resumeStore`) - 9 files
**Primary usage locations**:
- All main layout components (professional, modern, basic)
- All section form components (personal info, work experience, skills)
- Development utilities

**Common patterns**:
1. `useSnapshot(resumeStore).data` for reading state
2. `resumeReducer({ type: ACTION_TYPE, ...payload })` for updates
3. Automatic localStorage persistence
4. Type conversion utilities for readonly/mutable state

### Jotai Store (`resumeDraftAtom`) - 1 file
**Primary usage location**:
- `src/views/home-view.tsx` only

**Common patterns**:
1. `useAtomValue(resumeDraftAtom)` for reading state
2. `setResumeDraft({ ...updates })` for updates
3. No automatic persistence (draft state)
4. Direct object updates

---

## Migration Complexity Analysis

### Low Complexity
- ✅ `src/views/home-view.tsx` - Already using Jotai

### Medium Complexity
- 🟡 Layout components (3 files) - Simple read/write operations
- 🟡 `src/utils/dev-utils.ts` - Development utilities only

### High Complexity  
- 🔴 Section components (5 files) - Complex CRUD operations with forms
- 🔴 Store definition file - Major refactoring of reducer logic

---

## Recommended Migration Strategy

### Phase 1: Enhance Jotai Store
1. Add persistence layer to Jotai atoms
2. Create action-like helper functions to match current API
3. Add type conversion utilities

### Phase 2: Migrate Components by Complexity
1. **Start with**: Layout components (simpler operations)
2. **Then**: Section components (more complex CRUD)
3. **Finally**: Remove Valtio store and dependencies

### Phase 3: Cleanup
1. Remove Valtio imports and dependencies
2. Remove conversion utilities
3. Update type definitions
4. Clean up store file

---

## Benefits of Jotai as Single Source of Truth

1. **Simpler API**: Direct atom updates vs action/reducer pattern
2. **Better Performance**: Granular reactivity with atoms
3. **Type Safety**: Better TypeScript integration
4. **Smaller Bundle**: Remove Valtio dependency
5. **Consistency**: Single state management paradigm
6. **Flexibility**: Easy to add persistence when needed

---

## Deprecation Timeline

- **Week 1-2**: Enhance Jotai store with persistence and helper functions
- **Week 3-4**: Migrate layout components and dev utils
- **Week 5-7**: Migrate section components (most complex)
- **Week 8**: Final cleanup and testing
- **Week 9**: Remove Valtio dependencies

---

## Breaking Changes

### For Developers
- Replace `useSnapshot(resumeStore)` with `useAtomValue(resumeAtom)`
- Replace `resumeReducer({ type: 'ACTION' })` with direct atom updates
- Update imports from Valtio to Jotai

### For Users
- No user-facing changes expected
- Data persistence will be maintained during migration

---

This audit provides a complete picture of the current state management usage and a clear path forward for consolidating on Jotai as the single source of truth.
