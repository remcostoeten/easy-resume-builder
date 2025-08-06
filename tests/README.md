# PDF Parser Integration Tests

This directory contains integration tests for the PDF parsing functionality.

## Overview

The integration tests verify that:
1. The `/api/parse-pdf` endpoint correctly parses resume PDFs
2. At least one work experience item is extracted from the PDF
3. The API correctly handles error cases (invalid files, missing files)
4. The response structure matches the expected schema

## Test Setup

### Prerequisites

- Node.js/Bun installed
- Dependencies installed: `bun install`

### Test Files

- `tests/fixtures/sample-resume.pdf` - Sample resume PDF for testing
- `tests/api/parse-pdf.test.ts` - Integration test suite

### Running Tests

1. **Start the development server:**
   ```bash
   bun dev
   # or
   npm run dev
   ```
   
   The server should be running on `http://localhost:3001`

2. **Run the integration tests:**
   ```bash
   bun test:run
   # or
   npm run test:run
   ```

3. **Run tests in watch mode:**
   ```bash
   bun test
   # or
   npm test
   ```

### Environment Variables

- `TEST_API_URL` - Base URL for the API (defaults to `http://localhost:3001`)

Example:
```bash
TEST_API_URL=http://localhost:3000 bun test:run
```

## Test Coverage

The integration tests cover:

### Success Cases
- ✅ Parsing a valid PDF resume
- ✅ Extracting work experience data
- ✅ Validating response structure
- ✅ Handling mock data fallback (development mode)

### Error Cases
- ✅ Rejecting non-PDF file uploads
- ✅ Rejecting requests without files
- ✅ Proper error response formats

### Data Validation
- ✅ Work experience items have required fields
- ✅ Personal information extraction
- ✅ Data types are correct
- ✅ Required fields are non-empty

## Regression Protection

These tests guard against:
- PDF parsing library breakage
- API endpoint changes
- Data extraction logic failures
- Response format changes

Run these tests before deploying to catch any regressions in the PDF parsing pipeline.
