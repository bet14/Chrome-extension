chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download_video") {
    let url = new URL(request.videoUrl);

    // Trích xuất genid
    let genidMatch = url.pathname.match(/genid_([a-f0-9-]+)/);
    let genid = genidMatch ? genidMatch[1] : "unknown";

    // Trích xuất timestamp từ tham số `st` hoặc từ đường dẫn
    let timestampMatch = url.searchParams.get("st") || url.pathname.match(/(\d{2}_\d{2}_\d{2}_\d{2}_\d{2}_\d+)/);
    let timestamp = timestampMatch ? timestampMatch[1] : "no_timestamp";

    // Tạo tên file
    let filename = `video_${genid}_${timestamp}.mp4`;

    chrome.downloads.download({
      url: request.videoUrl,
      filename: filename
    });

    sendResponse({ status: "Downloading", filename: filename });
  }
});
