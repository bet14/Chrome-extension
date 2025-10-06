function findVideos() {
  let videos = [];
  document.querySelectorAll("video").forEach(video => {
    if (video.src) {
      videos.push({ 
        element: video, 
        src: video.src
      });
    }
  });

  document.querySelectorAll("source").forEach(source => {
    if (source.src && !videos.some(v => v.src === source.src)) {
      videos.push({
        element: source.parentElement,
        src: source.src
      });
    }
  });

  return videos;
}

function addDownloadButtons() {
  // Tạo CSS cho nút tải xuống
  const style = document.createElement('style');
  style.textContent = `
    .video-download-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 14px;
      cursor: pointer;
      z-index: 9999;
      opacity: 0.8;
      transition: opacity 0.3s;
    }
    .video-download-btn:hover {
      opacity: 1;
    }
    .video-container {
      position: relative;
      display: inline-block;
    }
  `;
  document.head.appendChild(style);

  // Tìm và thêm nút cho mỗi video
  let videoElements = findVideos();
  videoElements.forEach(({ element, src }) => {
    // Kiểm tra video đã có container và nút tải chưa
    const existingButton = element.parentElement.querySelector('.video-download-btn');
    if (existingButton) return;

    // Bọc video trong một container nếu cần
    let container = element.parentElement;
    if (!container.classList.contains('video-container')) {
      // Tạo container mới chỉ khi cần thiết
      container = document.createElement('div');
      container.className = 'video-container';
      element.parentElement.insertBefore(container, element);
      container.appendChild(element);
    }

    // Tạo nút tải xuống
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'video-download-btn';
    downloadBtn.textContent = 'Download';
    downloadBtn.addEventListener('click', (event) => {
      // Ngăn chặn sự kiện lan truyền và hành vi mặc định
      event.preventDefault();
      event.stopPropagation();
      
      // Gửi yêu cầu tải xuống tới background script
      chrome.runtime.sendMessage({ 
        action: "download_video", 
        videoUrl: src 
      });
      
      return false; // Thêm để đảm bảo ngăn chặn các hành vi mặc định
    });

    // Thêm nút vào container
    container.appendChild(downloadBtn);
  });
}

// Chạy khi trang được tải
addDownloadButtons();

// Chạy lại khi DOM thay đổi để bắt video mới được thêm vào
const observer = new MutationObserver(() => {
  setTimeout(addDownloadButtons, 1000); // Trì hoãn để đảm bảo video đã tải xong
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Vẫn giữ phím tắt CTRL + Q để tải tất cả video
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "q") {
    let videos = findVideos();
    if (videos.length > 0) {
      videos.forEach(video => {
        chrome.runtime.sendMessage({ action: "download_video", videoUrl: video.src });
      });
    } else {
      alert("Không tìm thấy video nào trên trang!");
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_videos") {
    let videos = findVideos().map(video => video.src);
    sendResponse({ videos });
  }
});