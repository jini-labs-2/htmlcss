document.addEventListener('DOMContentLoaded', () => {
    const backgroundImage = document.querySelector('.background-image');
    const blueOverlay = document.getElementById('blueOverlay');
    const tileSize = 70; // 타일 크기 (70px * 70px)
    let columns;
    let rows;
    let tiles = [];
    let revealIntervalId; // setInterval ID를 저장할 변수

    // 배경 이미지 배열
    const backgroundImages = ['./images/323-800x800.jpg', './images/451-800x800.jpg', './images/551-800x800.jpg'];
    let currentImageIndex = 0; // 현재 표시할 이미지 인덱스

    // 배경 이미지를 변경하는 함수
    function changeBackgroundImage() {
        // 현재 이미지 비활성화 (페이드 아웃)
        backgroundImage.classList.remove('active');

        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
            backgroundImage.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
            // 새 이미지 로드 후 활성화 (페이드 인)
            backgroundImage.classList.add('active');
        }, 1000); // CSS transition 시간(1s)과 맞춰 페이드 아웃 후 이미지 변경
    }

    // 화면 크기에 따라 타일 그리드 계산 및 생성
    function createTiles() {
        // 기존 타일 제거 (리사이즈 시 호출될 수 있으므로)
        while (blueOverlay.firstChild) {
            blueOverlay.removeChild(blueOverlay.firstChild);
        }
        tiles = []; // 타일 배열 초기화

        columns = Math.ceil(window.innerWidth / tileSize);
        rows = Math.ceil(window.innerHeight / tileSize);

        blueOverlay.style.gridTemplateColumns = `repeat(${columns}, ${tileSize}px)`;
        blueOverlay.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;

        for (let i = 0; i < columns * rows; i++) {
            const tile = document.createElement('div');
            tile.classList.add('blue-tile');
            blueOverlay.appendChild(tile);
            tiles.push(tile);
        }

        // 모든 타일을 다시 파란색으로 보이게 설정 (반복을 위해)
        tiles.forEach(tile => {
            tile.classList.remove('revealed');
            tile.style.transition = 'none'; // 전환 효과 일시적으로 제거
            tile.style.opacity = '1';
        });
        
        // DOM 변경 후 짧은 지연(0ms)을 두어 브라우저가 스타일을 적용할 시간을 줍니다.
        // 이는 transition이 다시 제대로 작동하게 하는 중요한 단계입니다.
        setTimeout(() => {
            tiles.forEach(tile => {
                tile.style.transition = 'opacity 0.4s ease-out'; // 원래 전환 효과 복원
            });
        }, 0); 
        
        blueOverlay.style.display = 'grid'; // 오버레이 다시 보이게
    }

    // 단일 타일을 걷어내는 함수
    function revealSingleTile() {
        const unrevealedTiles = tiles.filter(tile => !tile.classList.contains('revealed'));

        if (unrevealedTiles.length === 0) {
            clearInterval(revealIntervalId); // 모든 타일이 걷어졌으면 인터벌 중지
            blueOverlay.style.display = 'none'; // 오버레이 숨기기
            console.log('모든 타일이 걷어졌습니다. 다음 주기를 기다립니다.');

            // 걷어낸 후 잠시 대기 (예: 2초) 후 다음 이미지로 전환
            setTimeout(() => {
                changeBackgroundImage(); // 다음 배경 이미지로 변경
                setTimeout(() => {
                    createTiles(); // 타일 다시 생성 (초기 상태로 되돌림)
                    setTimeout(startRevealAnimation, 500); // 타일 생성 후 잠시 후 애니메이션 시작
                }, 1000); // 배경 이미지 전환이 끝난 후 (1초) 타일 재생성 시작
            }, 2000); // 2초 대기 후 반복
            return;
        }

        const randomIndex = Math.floor(Math.random() * unrevealedTiles.length);
        const randomTile = unrevealedTiles[randomIndex]; 
        
        if (randomTile) {
            randomTile.classList.add('revealed');
        }
    }

    // 타일을 걷어내는 애니메이션을 시작하는 함수
    function startRevealAnimation() {
        const revealInterval = 20; // 각 타일이 걷어지는 간격 (밀리초)
        revealIntervalId = setInterval(revealSingleTile, revealInterval);
    }

    // 초기 설정: 첫 번째 배경 이미지 로드
    backgroundImage.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
    backgroundImage.classList.add('active'); // 초기 이미지 페이드인

    // 초기 타일 생성
    createTiles();

    // 윈도우 리사이즈 시 타일 재구성
    window.addEventListener('resize', createTiles);

    // 3초 후 첫 번째 애니메이션 시작
    setTimeout(() => {
        startRevealAnimation();
    }, 3000); // 3초 (3000 밀리초)
});