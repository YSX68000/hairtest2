const apiKey = 'cm60r5hlt0001jo03gnjm1t7g'; // Magic APIキー
const apiUrl = 'https://api.magicapi.dev/api/v1/magicapi/hair/hair';
const gcsUploadUrl = 'https://storage.googleapis.com/hairtest68/'; // GCSバケットのURL（署名付きURLを生成して使う場合に置き換え）

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];
  if (!file) {
    alert('Please select an image!');
    return;
  }

  try {
    // Step 1: GCSに画像をアップロード
    const gcsImageUrl = await uploadImageToGCS(file);
    console.log(`Uploaded to GCS: ${gcsImageUrl}`);

    // Step 2: APIに画像URLを送信してrequest_idを取得
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: gcsImageUrl,
        editing_type: 'both',
        color_description: 'blonde',
        hairstyle_description: 'BuzzCut',
      }),
    });

    const data = await response.json();
    const requestId = data.request_id;

    if (requestId) {
      localStorage.setItem('request_id', requestId);
      alert(`Request ID saved: ${requestId}`);
      window.location.href = 'page2.html'; // 次のページへジャンプ
    } else {
      alert('Failed to get Request ID from API.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});

// Google Cloud Storageに画像をアップロードする関数
async function uploadImageToGCS(file) {
  const fileName = `${Date.now()}-${file.name}`; // 一意なファイル名を生成
  const uploadUrl = `${gcsUploadUrl}${fileName}`; // 完全なアップロードURL

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to GCS.');
  }

  return uploadUrl; // アップロードされた画像のURLを返す
}