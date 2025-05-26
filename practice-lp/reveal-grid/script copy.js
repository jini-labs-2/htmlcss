document.addEventListener('DOMContentLoaded', () => {
    const blueOverlay = document.getElementById('blueOverlay');
    const tileSize = 70; // 타일 크기 (20px * 20px)
    let columns;
    let rows;
    let tiles = [];

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
    }

    // 초기 타일 생성
    createTiles();

    // 윈도우 리사이즈 시 타일 재구성
    window.addEventListener('resize', createTiles);

    // 3초 후 파란색 타일을 랜덤하게 걷어내기
    setTimeout(() => {
        let revealedCount = 0;
        const totalTiles = tiles.length;
        const revealInterval = 20; // 각 타일이 걷어지는 간격 (밀리초)

        const revealTile = setInterval(() => {
            if (revealedCount >= totalTiles) {
                clearInterval(revealTile);
                blueOverlay.style.display = 'none'; // 모든 타일이 걷어졌으면 오버레이 숨기기
                return;
            }

            // 아직 걷어내지 않은 타일 중에서 무작위로 선택
            const unrevealedTiles = tiles.filter(tile => !tile.classList.contains('revealed'));
            if (unrevealedTiles.length === 0) {
                clearInterval(revealTile);
                blueOverlay.style.display = 'none';
                return;
            }

            const randomIndex = Math.floor(Math.random() * unrevealedTiles.length);
            const randomTile = unrevealedTiles[randomIndex];

            randomTile.classList.add('revealed');
            revealedCount++;
        }, revealInterval);
    }, 3000); // 3초 (3000 밀리초)
});