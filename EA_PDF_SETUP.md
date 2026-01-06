# Emirates Airlines Default PDF Setup

## Overview

The system now stores the default PDF file directly in the application, so it's always available for download without needing to upload it through the API.

## Quick Setup

1. **Place your PDF file** in the `assets/` directory with the exact filename:
   ```
   assets/2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf
   ```

2. **Restart the server**:
   ```bash
   npm run dev
   ```

3. **That's it!** The PDF will now be available for download whenever users search and click download.

## How It Works

- The PDF file is stored as a static asset in the `assets/` directory
- The system automatically finds and serves this PDF
- No database upload required
- No API upload endpoint needed
- The PDF is always available, regardless of search terms

## File Locations

The system will look for the PDF in these locations (in order):
1. `assets/2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`
2. `storage/pdfs/emirates/2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`
3. `public/2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`
4. Root directory: `2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`

## Behavior

- **Search**: Users can search for anything (random text, invoice numbers, etc.)
- **Results**: The default PDF always appears as the first result
- **Download**: Clicking download always downloads the default PDF
- **No Upload Needed**: The PDF is stored directly in the codebase

## File Requirements

- **Filename**: Must be exactly `2025-11-12_EK_176-212342123_Invoice_KAINMD55682 (1).pdf`
- **Location**: Place in `assets/` directory (or any of the alternative locations above)
- **Format**: Must be a valid PDF file

## Troubleshooting

### PDF not found error
- Verify the file exists in one of the locations listed above
- Check that the filename matches exactly (including spaces and parentheses)
- Ensure the file is a valid PDF
- Restart the server after placing the file

### Download not working
- Check server logs for errors
- Verify the file path is correct
- Ensure file permissions allow reading

## Technical Details

The PDF is served through:
- `GET /api/ea/download/:id` - Always serves the default PDF
- `GET /api/ea/download-default` - Explicitly serves the default PDF
- `GET /api/ea/search-document` - Always returns the default PDF as first result

The PDF file is read directly from the filesystem, not from the database.

