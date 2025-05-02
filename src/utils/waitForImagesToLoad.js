function waitForImagesToLoad(imageUrls) {
    return Promise.all(
      imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Still resolve on error to not hang
          img.src = url;
        });
      })
    );
  }
  