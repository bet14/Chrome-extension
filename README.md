# Video Downloader Chrome Extension

A Chrome extension that allows users to download videos from web pages by adding a "Download" button to each video element and providing a keyboard shortcut (Ctrl+Q) to download all videos on the page.

## Features

- Automatically detects and adds a "Download" button to all video elements on a webpage
- Supports both `<video>` tags and `<source>` elements within video tags
- Adds a styled, non-intrusive download button with hover effects
- Monitors dynamic content changes to detect newly added videos
- Keyboard shortcut (Ctrl+Q) to download all videos on the page
- Communicates with a background script to handle video downloads
- Prevents duplicate buttons on the same video
- Responsive and user-friendly design

## How It Works

1. **Video Detection**:
   - Scans the webpage for `<video>` elements with a `src` attribute and `<source>` elements within video tags.
   - Collects unique video sources to avoid duplicates.

2. **Download Button**:
   - Dynamically adds a styled "Download" button to each video's container.
   - Buttons are positioned in the top-right corner of the video with a smooth hover effect.
   - Prevents default click behavior to ensure seamless interaction.

3. **Dynamic Content Handling**:
   - Uses a `MutationObserver` to monitor DOM changes and add download buttons to newly loaded videos.
   - Includes a 1-second delay to ensure videos are fully loaded before processing.

4. **Keyboard Shortcut**:
   - Pressing **Ctrl+Q** triggers the download of all detected videos on the page.
   - Displays an alert if no videos are found.

5. **Background Communication**:
   - Sends video URLs to the background script for download processing.
   - Responds to background script requests to retrieve the list of video URLs on the page.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the folder containing the extension files.
5. Ensure the background script and manifest file are properly configured (see below).

## Files

- **content.js**: Main script that handles video detection, button creation, and user interactions.
- **background.js** (not included here): Handles the actual download process when receiving messages from `content.js`.
- **manifest.json** (not included here): Defines the extension's permissions and scripts.

## Usage

1. **Automatic Download Buttons**:
   - Visit any webpage with video content.
   - A "Download" button will appear in the top-right corner of each video.
   - Click the button to initiate the download of that specific video.

2. **Download All Videos**:
   - Press **Ctrl+Q** to download all videos on the current page.
   - If no videos are found, an alert will notify you.

3. **Dynamic Content**:
   - The extension automatically detects videos added to the page after the initial load (e.g., in single-page applications or infinite scroll websites).

## Example Code Breakdown

### `findVideos()`
- Iterates through all `<video>` and `<source>` elements on the page.
- Collects video sources and their corresponding DOM elements.
- Ensures no duplicate sources are included in the returned array.

### `addDownloadButtons()`
- Injects CSS styles for the download button and video container.
- Wraps each video in a `div.video-container` for proper button positioning.
- Creates a "Download" button for each video and attaches a click event listener.
- Sends a message to the background script with the video URL when the button is clicked.
- Prevents adding duplicate buttons to the same video.

### DOM Mutation Observer
- Observes changes to the DOM to detect newly added videos.
- Re-runs `addDownloadButtons()` with a 1-second delay to ensure new videos are fully loaded.

### Keyboard Shortcut (Ctrl+Q)
- Listens for the **Ctrl+Q** key combination.
- Triggers downloads for all detected videos or shows an alert if none are found.

### Chrome Runtime Listener
- Responds to messages from the background script with the list of video URLs when requested.

## Requirements

- Chrome browser with support for Chrome Extensions API.
- A `background.js` script to handle the `chrome.runtime.sendMessage` download requests.
- A `manifest.json` file with appropriate permissions (e.g., `activeTab`, `downloads`, `scripting`).

## Example `manifest.json`
```json
{
  "manifest_version": 3,
  "name": "Video Downloader",
  "version": "1.0",
  "description": "Download videos from web pages with a single click or Ctrl+Q shortcut.",
  "permissions": ["activeTab", "downloads", "scripting"],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}
