const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { sequelize, User, Sale } = require('../models');

const SAMPLE_IMAGE_DIR = path.join(__dirname, '../sample-image');
const FILES_DIR = path.join(__dirname, '../public/images');

const users = [
  { email: 'seller1@example.com', name: '판매자1', password: '1234' },
  { email: 'seller2@example.com', name: '판매자2', password: '1234' },
  { email: 'seller3@example.com', name: '판매자3', password: '1234' },
];

const products = [
  {
    title: 'LG 이동식 에어컨',
    description: 'LG 이동식 에어컨 판매합니다. 2023년 구매했고 한 여름만 사용했습니다. 냉방 성능 뛰어나고 소음도 적습니다. 이사로 인해 급처분합니다. 직거래 선호하며 서울 강남역 근처에서 거래 가능합니다. 리모컨, 설명서 모두 포함입니다.',
    price: 350000,
    image: 'LG이동식에어컨.jpeg',
  },
  {
    title: 'LG 그램 노트북',
    description: 'LG 그램 17인치 2023년형 노트북입니다. i7 프로세서, 16GB RAM, 512GB SSD 사양입니다. 배터리 사이클 50회 미만으로 배터리 상태 최상급입니다. 충전기 포함이며 파우치도 함께 드립니다. 외관 기스 없이 깨끗합니다.',
    price: 800000,
    image: 'LG 그램.jpg',
  },
  {
    title: 'LG 모니터',
    description: 'LG 32인치 4K UHD 모니터 판매합니다. IPS 패널로 색감이 정확하고 시야각이 넓습니다. 게이밍과 작업용 모두 적합합니다. 스탠드 높이/기울기 조절 가능하며 HDMI, DP 케이블 모두 포함입니다. 데드픽셀 없습니다.',
    price: 250000,
    image: 'lg 모니터.jpeg',
  },
  {
    title: 'Boss 블루투스 스피커',
    description: 'Bose SoundLink Revolve+ II 블루투스 스피커입니다. 360도 사운드로 어느 방향에서든 풍부한 음질을 즐길 수 있습니다. 방수 기능 IPX4 지원하며 배터리 17시간 지속됩니다. 박스, 충전케이블 모두 있습니다.',
    price: 120000,
    image: 'Boss 블루투스 스피커.avif',
  },
  {
    title: '남성 지갑',
    description: '몽블랑 사토리얼 6cc 남성 지갑입니다. 정품이며 백화점에서 구매했습니다. 카드 6장, 지폐, 영수증 수납 가능합니다. 고급 이탈리안 가죽으로 제작되어 내구성이 뛰어납니다. 선물용 박스와 쇼핑백 포함입니다.',
    price: 45000,
    image: '남성지갑.jpg',
  },
  {
    title: '애플워치',
    description: '애플워치 SE 2세대 44mm GPS 모델입니다. 미드나이트 색상이며 애플케어+ 2025년 3월까지 남아있습니다. 충전기, 스포츠밴드 기본 구성품 모두 포함입니다. 액정 보호필름 부착되어 있어 기스 없습니다.',
    price: 280000,
    image: '애플워치.jpg',
  },
  {
    title: '청바지',
    description: '리바이스 501 오리지널 핏 청바지입니다. 사이즈 30x32이며 미디엄 워싱입니다. 2번 착용 후 세탁했고 상태 새것과 동일합니다. 클래식한 디자인으로 어떤 스타일에도 잘 어울립니다. 정품 택 그대로 있습니다.',
    price: 35000,
    image: '청바지.jpg',
  },
  {
    title: '맥북프로',
    description: '맥북프로 14인치 M3 Pro 칩셋 모델입니다. 18GB 통합 메모리, 512GB SSD 사양입니다. AppleCare+ 2026년까지 보장됩니다. 배터리 사이클 30회 미만이며 충전기, 박스 모두 포함입니다. 키스킨 사용으로 키보드 깨끗합니다.',
    price: 2500000,
    image: '맥북프로.jpeg',
  },
  {
    title: '선풍기',
    description: '다이슨 퓨어쿨 TP07 공기청정 선풍기입니다. 선풍기와 공기청정기 기능을 동시에 사용할 수 있습니다. HEPA 필터로 초미세먼지 99.95% 제거합니다. 다이슨 앱으로 원격 제어 가능하며 필터 교체한 지 3개월 됐습니다.',
    price: 150000,
    image: '선풍기.jpeg',
  },
  {
    title: '쿠쿠 밥솥',
    description: '쿠쿠 IH압력밥솥 6인용 CRP-CHXB0610FG 모델입니다. IH 인덕션 가열 방식으로 밥맛이 뛰어납니다. 음성안내 기능, 보온 기능 모두 정상 작동합니다. 내솥 코팅 상태 양호하며 설명서 포함입니다.',
    price: 80000,
    image: '쿠쿠밥솥.jpeg',
  },
  {
    title: '갤럭시 Z 폴드6',
    description: '삼성 갤럭시 Z 폴드6 256GB 실버 색상입니다. 개통 후 2개월 사용했으며 삼성케어+ 가입되어 있습니다. 힌지 상태 완벽하고 디스플레이 기스 없습니다. 정품 케이스, 충전기, 박스 모두 포함이며 액정보호필름 부착 상태입니다.',
    price: 1800000,
    image: '갤럭시 Z 폴드8.jpeg',
  },
  {
    title: '맥세이프 보조배터리',
    description: '애플 정품 맥세이프 배터리 팩입니다. 아이폰 12 이상 모델과 호환되며 무선으로 간편하게 충전할 수 있습니다. 가방이나 주머니에 쏙 들어가는 컴팩트한 사이즈입니다. 사용감 거의 없으며 박스, 케이블 포함입니다.',
    price: 85000,
    image: '맥세이프 보조배터리.jpg',
  },
  {
    title: '에어포스',
    description: '나이키 에어포스 1 07 화이트 270mm 사이즈입니다. 3번 정도 착용했으며 실착용감 좋습니다. 밑창 상태 깨끗하고 오염 없습니다. 정품이며 나이키 온라인 스토어에서 구매했습니다. 박스 포함이며 직거래 선호합니다.',
    price: 95000,
    image: '에어포스.avif',
  },
];

const copyImages = () => {
  if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SAMPLE_IMAGE_DIR);
  for (const file of files) {
    if (file.startsWith('.')) continue;
    const src = path.join(SAMPLE_IMAGE_DIR, file);
    const dest = path.join(FILES_DIR, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file}`);
  }
};

const seed = async () => {
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('DB 초기화 완료');

    copyImages();
    console.log('이미지 복사 완료');

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashedPassword });
    }
    console.log('사용자 생성 완료');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const user = users[i % users.length];
      await Sale.create({
        title: product.title,
        description: product.description,
        price: product.price,
        email: user.email,
        photo: product.image,
      });
    }
    console.log('상품 생성 완료');

    console.log('\nSeeding 완료!');
    console.log('테스트 계정: seller1@example.com / 1234');
    process.exit(0);
  } catch (error) {
    console.error('Seeding 실패:', error);
    process.exit(1);
  }
};

seed();
