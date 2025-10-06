document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "get_videos" }, (response) => {
      if (response && response.videos.length > 0) {
        let list = document.getElementById("video-list");
        response.videos.forEach((videoUrl) => {
          let li = document.createElement("li");
          let a = document.createElement("a");
          a.href = "#";
          a.textContent = videoUrl;
          a.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "download_video", videoUrl });
          });
          li.appendChild(a);
          list.appendChild(li);
        });

        // Thêm sự kiện cho nút Download All
        document.getElementById("download-all").addEventListener("click", () => {
          response.videos.forEach((videoUrl) => {
            chrome.runtime.sendMessage({ action: "download_video", videoUrl });
          });
        });

      } else {
        document.getElementById("video-list").textContent = "Không tìm thấy video nào.";
      }
    });
  });
});
