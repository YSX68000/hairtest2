// Firebase設定の初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFSiyBdYVduIfCLknn4ppQFl1uSPF38iM",
  authDomain: "hairtest-18780.firebaseapp.com",
  projectId: "hairtest-18780",
  storageBucket: "hairtest-18780.firebasestorage.app",
  messagingSenderId: "721724464874",
  appId: "1:721724464874:web:d6451fc814377c2e2b0193"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const statusUrl = 'https://api.magicapi.dev/api/v1/magicapi/hair/predictions/';

document.getElementById('getResultButton').addEventListener('click', async () => {
  const requestId = localStorage.getItem('request_id');
  if (!requestId) {
    alert('No request ID found!');
    return;
  }

  let status = 'processing';
  let imageUrl = '';

  while (status === 'processing') {
    const response = await fetch(`${statusUrl}${requestId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-magicapi-key': 'cm60r5hlt0001jo03gnjm1t7g',
      },
    });

    const data = await response.json();
    status = data.status;

    if (status === 'succeeded') {
      imageUrl = data.result;
      break;
    } else if (status === 'failed') {
      alert('Processing failed!');
      return;
    } else {
      console.log('Processing... retrying in 5 seconds');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (imageUrl) {
    const resultImage = document.getElementById('resultImage');
    resultImage.src = imageUrl; // 取得した画像URLを表示
  }
});
