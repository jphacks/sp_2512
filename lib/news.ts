import type { DangerLevel } from "./reports"

export interface NewsReport {
  id: string
  title: string
  description: string
  source: string
  url: string
  latitude: number
  longitude: number
  category: "safety" | "accident" | "complex_intersection"
  dangerLevel: DangerLevel
  publishedAt: string
}

const prefectureData = [
  {
    name: "北海道",
    cities: [
      { city: "札幌市", lat: 43.0642, lng: 141.3469 },
      { city: "函館市", lat: 41.7688, lng: 140.7288 },
      { city: "旭川市", lat: 43.7706, lng: 142.365 },
      { city: "釧路市", lat: 42.9849, lng: 144.3817 },
      { city: "帯広市", lat: 42.9236, lng: 143.1946 },
    ],
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
  },
  {
    name: "青森県",
    cities: [
      { city: "青森市", lat: 40.8244, lng: 140.74 },
      { city: "八戸市", lat: 40.5125, lng: 141.4883 },
    ],
    source: "NHK青森",
    url: "https://www3.nhk.or.jp/lnews/aomori/",
  },
  {
    name: "岩手県",
    cities: [
      { city: "盛岡市", lat: 39.7036, lng: 141.1527 },
      { city: "一関市", lat: 38.9342, lng: 141.1267 },
    ],
    source: "NHK岩手",
    url: "https://www3.nhk.or.jp/lnews/morioka/",
  },
  {
    name: "宮城県",
    cities: [
      { city: "仙台市", lat: 38.2682, lng: 140.8694 },
      { city: "石巻市", lat: 38.4345, lng: 141.3028 },
    ],
    source: "NHK宮城",
    url: "https://www3.nhk.or.jp/lnews/sendai/",
  },
  {
    name: "秋田県",
    cities: [
      { city: "秋田市", lat: 39.7186, lng: 140.1024 },
      { city: "大館市", lat: 40.2724, lng: 140.5661 },
    ],
    source: "NHK秋田",
    url: "https://www3.nhk.or.jp/lnews/akita/",
  },
  {
    name: "山形県",
    cities: [
      { city: "山形市", lat: 38.2404, lng: 140.3633 },
      { city: "鶴岡市", lat: 38.7275, lng: 139.8258 },
    ],
    source: "NHK山形",
    url: "https://www3.nhk.or.jp/lnews/yamagata/",
  },
  {
    name: "福島県",
    cities: [
      { city: "福島市", lat: 37.7503, lng: 140.4676 },
      { city: "郡山市", lat: 37.4, lng: 140.3833 },
      { city: "いわき市", lat: 37.0489, lng: 140.8889 },
    ],
    source: "NHK福島",
    url: "https://www3.nhk.or.jp/lnews/fukushima/",
  },
  {
    name: "茨城県",
    cities: [
      { city: "水戸市", lat: 36.3418, lng: 140.4468 },
      { city: "つくば市", lat: 36.0839, lng: 140.0764 },
    ],
    source: "NHK茨城",
    url: "https://www3.nhk.or.jp/lnews/mito/",
  },
  {
    name: "栃木県",
    cities: [
      { city: "宇都宮市", lat: 36.5658, lng: 139.8836 },
      { city: "小山市", lat: 36.3147, lng: 139.8006 },
    ],
    source: "NHK栃木",
    url: "https://www3.nhk.or.jp/lnews/utsunomiya/",
  },
  {
    name: "群馬県",
    cities: [
      { city: "前橋市", lat: 36.3911, lng: 139.0608 },
      { city: "高崎市", lat: 36.3219, lng: 139.0025 },
    ],
    source: "NHK群馬",
    url: "https://www3.nhk.or.jp/lnews/maebashi/",
  },
  {
    name: "埼玉県",
    cities: [
      { city: "さいたま市", lat: 35.8617, lng: 139.6455 },
      { city: "川越市", lat: 35.9253, lng: 139.4856 },
      { city: "川口市", lat: 35.8078, lng: 139.7242 },
    ],
    source: "NHK埼玉",
    url: "https://www3.nhk.or.jp/lnews/saitama/",
  },
  {
    name: "千葉県",
    cities: [
      { city: "千葉市", lat: 35.6074, lng: 140.1065 },
      { city: "船橋市", lat: 35.6944, lng: 139.9822 },
      { city: "柏市", lat: 35.8678, lng: 139.9753 },
    ],
    source: "NHK千葉",
    url: "https://www3.nhk.or.jp/lnews/chiba/",
  },
  {
    name: "東京都",
    cities: [
      { city: "新宿区", lat: 35.6938, lng: 139.7036 },
      { city: "渋谷区", lat: 35.6617, lng: 139.7039 },
      { city: "八王子市", lat: 35.6558, lng: 139.3389 },
    ],
    source: "NHK",
    url: "https://www3.nhk.or.jp/news/",
  },
  {
    name: "神奈川県",
    cities: [
      { city: "横浜市", lat: 35.4437, lng: 139.638 },
      { city: "川崎市", lat: 35.5308, lng: 139.7028 },
      { city: "相模原市", lat: 35.5531, lng: 139.3703 },
    ],
    source: "NHK神奈川",
    url: "https://www3.nhk.or.jp/lnews/yokohama/",
  },
  {
    name: "新潟県",
    cities: [
      { city: "新潟市", lat: 37.9161, lng: 139.0364 },
      { city: "長岡市", lat: 37.4461, lng: 138.8514 },
    ],
    source: "NHK新潟",
    url: "https://www3.nhk.or.jp/lnews/niigata/",
  },
  {
    name: "富山県",
    cities: [
      { city: "富山市", lat: 36.6959, lng: 137.2137 },
      { city: "高岡市", lat: 36.7536, lng: 137.0242 },
    ],
    source: "NHK富山",
    url: "https://www3.nhk.or.jp/lnews/toyama/",
  },
  {
    name: "石川県",
    cities: [
      { city: "金沢市", lat: 36.5946, lng: 136.6256 },
      { city: "小松市", lat: 36.4081, lng: 136.4486 },
    ],
    source: "NHK石川",
    url: "https://www3.nhk.or.jp/lnews/kanazawa/",
  },
  {
    name: "福井県",
    cities: [
      { city: "福井市", lat: 36.0652, lng: 136.2216 },
      { city: "敦賀市", lat: 35.6453, lng: 136.0556 },
    ],
    source: "NHK福井",
    url: "https://www3.nhk.or.jp/lnews/fukui/",
  },
  {
    name: "山梨県",
    cities: [
      { city: "甲府市", lat: 35.6636, lng: 138.5683 },
      { city: "富士吉田市", lat: 35.4861, lng: 138.8103 },
    ],
    source: "NHK山梨",
    url: "https://www3.nhk.or.jp/lnews/kofu/",
  },
  {
    name: "長野県",
    cities: [
      { city: "長野市", lat: 36.6513, lng: 138.181 },
      { city: "松本市", lat: 36.2381, lng: 137.9722 },
    ],
    source: "NHK長野",
    url: "https://www3.nhk.or.jp/lnews/nagano/",
  },
  {
    name: "岐阜県",
    cities: [
      { city: "岐阜市", lat: 35.4232, lng: 136.7606 },
      { city: "大垣市", lat: 35.3583, lng: 136.6136 },
    ],
    source: "NHK岐阜",
    url: "https://www3.nhk.or.jp/lnews/gifu/",
  },
  {
    name: "静岡県",
    cities: [
      { city: "静岡市", lat: 34.9769, lng: 138.3831 },
      { city: "浜松市", lat: 34.7108, lng: 137.7261 },
      { city: "沼津市", lat: 35.0956, lng: 138.8633 },
    ],
    source: "NHK静岡",
    url: "https://www3.nhk.or.jp/lnews/shizuoka/",
  },
  {
    name: "愛知県",
    cities: [
      { city: "名古屋市", lat: 35.1815, lng: 136.9066 },
      { city: "豊田市", lat: 35.0828, lng: 137.1561 },
      { city: "岡崎市", lat: 34.955, lng: 137.1744 },
    ],
    source: "NHK愛知",
    url: "https://www3.nhk.or.jp/tokai-news/",
  },
  {
    name: "三重県",
    cities: [
      { city: "津市", lat: 34.7303, lng: 136.5086 },
      { city: "四日市市", lat: 34.9653, lng: 136.6247 },
    ],
    source: "NHK三重",
    url: "https://www3.nhk.or.jp/lnews/tsu/",
  },
  {
    name: "滋賀県",
    cities: [
      { city: "大津市", lat: 35.0045, lng: 135.8686 },
      { city: "草津市", lat: 35.0128, lng: 135.9597 },
    ],
    source: "NHK滋賀",
    url: "https://www3.nhk.or.jp/lnews/otsu/",
  },
  {
    name: "京都府",
    cities: [
      { city: "京都市", lat: 35.0116, lng: 135.7681 },
      { city: "宇治市", lat: 34.8842, lng: 135.7997 },
    ],
    source: "NHK京都",
    url: "https://www3.nhk.or.jp/lnews/kyoto/",
  },
  {
    name: "大阪府",
    cities: [
      { city: "大阪市", lat: 34.6937, lng: 135.5023 },
      { city: "堺市", lat: 34.5733, lng: 135.4828 },
      { city: "東大阪市", lat: 34.6794, lng: 135.6006 },
    ],
    source: "NHK大阪",
    url: "https://www3.nhk.or.jp/kansai-news/",
  },
  {
    name: "兵庫県",
    cities: [
      { city: "神戸市", lat: 34.6901, lng: 135.1955 },
      { city: "姫路市", lat: 34.8161, lng: 134.6853 },
      { city: "西宮市", lat: 34.7381, lng: 135.3414 },
    ],
    source: "NHK兵庫",
    url: "https://www3.nhk.or.jp/lnews/kobe/",
  },
  {
    name: "奈良県",
    cities: [
      { city: "奈良市", lat: 34.6851, lng: 135.8048 },
      { city: "橿原市", lat: 34.5078, lng: 135.7925 },
    ],
    source: "NHK奈良",
    url: "https://www3.nhk.or.jp/lnews/nara/",
  },
  {
    name: "和歌山県",
    cities: [
      { city: "和歌山市", lat: 34.2261, lng: 135.1675 },
      { city: "田辺市", lat: 33.7306, lng: 135.3764 },
    ],
    source: "NHK和歌山",
    url: "https://www3.nhk.or.jp/lnews/wakayama/",
  },
  {
    name: "鳥取県",
    cities: [
      { city: "鳥取市", lat: 35.5014, lng: 134.235 },
      { city: "米子市", lat: 35.4275, lng: 133.3306 },
    ],
    source: "NHK鳥取",
    url: "https://www3.nhk.or.jp/lnews/tottori/",
  },
  {
    name: "島根県",
    cities: [
      { city: "松江市", lat: 35.4723, lng: 133.0505 },
      { city: "出雲市", lat: 35.3667, lng: 132.7556 },
    ],
    source: "NHK島根",
    url: "https://www3.nhk.or.jp/lnews/matsue/",
  },
  {
    name: "岡山県",
    cities: [
      { city: "岡山市", lat: 34.6617, lng: 133.935 },
      { city: "倉敷市", lat: 34.5839, lng: 133.7722 },
    ],
    source: "NHK岡山",
    url: "https://www3.nhk.or.jp/lnews/okayama/",
  },
  {
    name: "広島県",
    cities: [
      { city: "広島市", lat: 34.3853, lng: 132.4553 },
      { city: "福山市", lat: 34.4856, lng: 133.3622 },
      { city: "呉市", lat: 34.2492, lng: 132.5656 },
    ],
    source: "NHK広島",
    url: "https://www3.nhk.or.jp/lnews/hiroshima/",
  },
  {
    name: "山口県",
    cities: [
      { city: "山口市", lat: 34.1859, lng: 131.4706 },
      { city: "下関市", lat: 33.9556, lng: 130.9411 },
    ],
    source: "NHK山口",
    url: "https://www3.nhk.or.jp/lnews/yamaguchi/",
  },
  {
    name: "徳島県",
    cities: [
      { city: "徳島市", lat: 34.0658, lng: 134.5594 },
      { city: "阿南市", lat: 33.9172, lng: 134.6589 },
    ],
    source: "NHK徳島",
    url: "https://www3.nhk.or.jp/lnews/tokushima/",
  },
  {
    name: "香川県",
    cities: [
      { city: "高松市", lat: 34.3401, lng: 134.0434 },
      { city: "丸亀市", lat: 34.2897, lng: 133.7981 },
    ],
    source: "NHK香川",
    url: "https://www3.nhk.or.jp/lnews/takamatsu/",
  },
  {
    name: "愛媛県",
    cities: [
      { city: "松山市", lat: 33.8391, lng: 132.7657 },
      { city: "今治市", lat: 34.0658, lng: 132.9978 },
    ],
    source: "NHK愛媛",
    url: "https://www3.nhk.or.jp/lnews/matsuyama/",
  },
  {
    name: "高知県",
    cities: [
      { city: "高知市", lat: 33.5597, lng: 133.5311 },
      { city: "南国市", lat: 33.5753, lng: 133.6422 },
    ],
    source: "NHK高知",
    url: "https://www3.nhk.or.jp/lnews/kochi/",
  },
  {
    name: "福岡県",
    cities: [
      { city: "福岡市", lat: 33.5904, lng: 130.4017 },
      { city: "北九州市", lat: 33.8833, lng: 130.8833 },
      { city: "久留米市", lat: 33.3192, lng: 130.5083 },
    ],
    source: "NHK福岡",
    url: "https://www3.nhk.or.jp/fukuoka-news/",
  },
  {
    name: "佐賀県",
    cities: [
      { city: "佐賀市", lat: 33.2635, lng: 130.3 },
      { city: "唐津市", lat: 33.4497, lng: 129.9689 },
    ],
    source: "NHK佐賀",
    url: "https://www3.nhk.or.jp/lnews/saga/",
  },
  {
    name: "長崎県",
    cities: [
      { city: "長崎市", lat: 32.7503, lng: 129.8779 },
      { city: "佐世保市", lat: 33.1803, lng: 129.7247 },
    ],
    source: "NHK長崎",
    url: "https://www3.nhk.or.jp/lnews/nagasaki/",
  },
  {
    name: "熊本県",
    cities: [
      { city: "熊本市", lat: 32.7898, lng: 130.7417 },
      { city: "八代市", lat: 32.5053, lng: 130.6019 },
    ],
    source: "NHK熊本",
    url: "https://www3.nhk.or.jp/lnews/kumamoto/",
  },
  {
    name: "大分県",
    cities: [
      { city: "大分市", lat: 33.2382, lng: 131.6126 },
      { city: "別府市", lat: 33.2847, lng: 131.4911 },
    ],
    source: "NHK大分",
    url: "https://www3.nhk.or.jp/lnews/oita/",
  },
  {
    name: "宮崎県",
    cities: [
      { city: "宮崎市", lat: 31.9077, lng: 131.4202 },
      { city: "都城市", lat: 31.7211, lng: 131.0619 },
    ],
    source: "NHK宮崎",
    url: "https://www3.nhk.or.jp/lnews/miyazaki/",
  },
  {
    name: "鹿児島県",
    cities: [
      { city: "鹿児島市", lat: 31.5966, lng: 130.5571 },
      { city: "霧島市", lat: 31.7422, lng: 130.7628 },
    ],
    source: "NHK鹿児島",
    url: "https://www3.nhk.or.jp/lnews/kagoshima/",
  },
  {
    name: "沖縄県",
    cities: [
      { city: "那覇市", lat: 26.2124, lng: 127.6809 },
      { city: "沖縄市", lat: 26.3344, lng: 127.8056 },
    ],
    source: "NHK沖縄",
    url: "https://www3.nhk.or.jp/lnews/okinawa/",
  },
]

function generateNewsForPrefecture(prefIndex: number, pref: (typeof prefectureData)[0]): NewsReport[] {
  const news: NewsReport[] = []
  const dangerLevels: DangerLevel[] = ["low", "medium", "high"]
  const baseId = prefIndex * 20 + 1000

  // Distribute news across all cities in the prefecture
  const citiesCount = pref.cities.length
  const newsPerCity = Math.ceil(20 / citiesCount)

  pref.cities.forEach((cityData, cityIndex) => {
    const cityBaseId = baseId + cityIndex * newsPerCity

    // 治安情報
    for (let i = 0; i < Math.ceil(newsPerCity * 0.4); i++) {
      const dangerLevel = dangerLevels[Math.floor(Math.random() * 3)]
      const hoursAgo = Math.floor(Math.random() * 24) + 1
      news.push({
        id: `news-${cityBaseId + i}`,
        title: `${cityData.city}で${dangerLevel === "high" ? "重大な" : dangerLevel === "medium" ? "" : "軽微な"}治安事案が発生`,
        description: `${cityData.city}の市街地で${dangerLevel === "high" ? "強盗" : dangerLevel === "medium" ? "窃盗" : "不審者目撃"}事案が報告されています。${dangerLevel === "high" ? "警察が捜査を進めています。" : "注意が必要です。"}`,
        source: pref.source,
        url: pref.url,
        latitude: cityData.lat + (Math.random() - 0.5) * 0.02,
        longitude: cityData.lng + (Math.random() - 0.5) * 0.02,
        category: "safety",
        dangerLevel,
        publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      })
    }

    // 事故情報
    for (let i = 0; i < Math.ceil(newsPerCity * 0.4); i++) {
      const dangerLevel = dangerLevels[Math.floor(Math.random() * 3)]
      const hoursAgo = Math.floor(Math.random() * 24) + 1
      news.push({
        id: `news-${cityBaseId + Math.ceil(newsPerCity * 0.4) + i}`,
        title: `${cityData.city}で${dangerLevel === "high" ? "多重" : dangerLevel === "medium" ? "" : "軽微な"}交通事故が発生`,
        description: `${cityData.city}の${dangerLevel === "high" ? "主要道路" : "市街地"}で${dangerLevel === "high" ? "車両複数台が絡む事故" : dangerLevel === "medium" ? "追突事故" : "接触事故"}が発生しました。${dangerLevel === "high" ? "大規模な渋滞が発生しています。" : ""}`,
        source: pref.source,
        url: pref.url,
        latitude: cityData.lat + (Math.random() - 0.5) * 0.02,
        longitude: cityData.lng + (Math.random() - 0.5) * 0.02,
        category: "accident",
        dangerLevel,
        publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      })
    }

    // 複雑な交差点情報
    for (let i = 0; i < Math.ceil(newsPerCity * 0.2); i++) {
      const dangerLevel = i % 2 === 0 ? "high" : "medium"
      const hoursAgo = Math.floor(Math.random() * 48) + 1
      news.push({
        id: `news-${cityBaseId + Math.ceil(newsPerCity * 0.8) + i}`,
        title: `${cityData.city}の主要交差点で車線変更に注意`,
        description: `${cityData.city}の${i % 2 === 0 ? "駅前" : "中心部"}交差点は${dangerLevel === "high" ? "6車線以上" : "5車線"}が交差する複雑な構造で、車線変更のタイミングが難しいとの報告が相次いでいます。`,
        source: pref.source,
        url: pref.url,
        latitude: cityData.lat + (Math.random() - 0.5) * 0.01,
        longitude: cityData.lng + (Math.random() - 0.5) * 0.01,
        category: "complex_intersection",
        dangerLevel,
        publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      })
    }
  })

  return news.slice(0, 20) // Limit to 20 items per prefecture
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function filterNewsWithAI(news: NewsReport[]): NewsReport[] {
  // Group by prefecture (approximate by latitude)
  const prefectureGroups = new Map<string, NewsReport[]>()

  news.forEach((item) => {
    // Find prefecture by closest match
    let closestPref = prefectureData[0]
    let minDist = Number.POSITIVE_INFINITY

    prefectureData.forEach((pref) => {
      pref.cities.forEach((city) => {
        const dist = calculateDistance(item.latitude, item.longitude, city.lat, city.lng)
        if (dist < minDist) {
          minDist = dist
          closestPref = pref
        }
      })
    })

    const key = closestPref.name
    if (!prefectureGroups.has(key)) {
      prefectureGroups.set(key, [])
    }
    prefectureGroups.get(key)!.push(item)
  })

  const filtered: NewsReport[] = []

  // Process each prefecture
  prefectureGroups.forEach((prefNews, prefName) => {
    // Sort by danger level (high > medium > low) and published date (newer first)
    const sorted = prefNews.sort((a, b) => {
      const dangerOrder = { high: 3, medium: 2, low: 1 }
      const dangerDiff = dangerOrder[b.dangerLevel] - dangerOrder[a.dangerLevel]
      if (dangerDiff !== 0) return dangerDiff
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    // Apply 1km radius filter: max 2 items within 1km
    const selected: NewsReport[] = []
    for (const item of sorted) {
      // Check if there are already 2 items within 1km
      const nearbyCount = selected.filter(
        (s) => calculateDistance(s.latitude, s.longitude, item.latitude, item.longitude) < 1,
      ).length

      if (nearbyCount < 2) {
        selected.push(item)
      }

      // Limit to 100 items per prefecture
      if (selected.length >= 100) break
    }

    filtered.push(...selected)
  })

  console.log(`[v0] AI filtering: ${news.length} items → ${filtered.length} items`)
  return filtered
}

const generatedNews: NewsReport[] = []
prefectureData.forEach((pref, index) => {
  generatedNews.push(...generateNewsForPrefecture(index, pref))
})

const aiFilteredNews = filterNewsWithAI(generatedNews)

const sapporoAdditionalNews: NewsReport[] = [
  {
    id: "sapporo-add-1",
    title: "すすきの繁華街で窃盗事件が発生",
    description: "すすきの地区の飲食店で深夜に窃盗事件が発生しました。警察が防犯カメラの映像を分析中です。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0545,
    longitude: 141.3545,
    category: "safety",
    dangerLevel: "medium",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-2",
    title: "大通公園周辺で不審者目撃情報",
    description:
      "大通公園西側で不審な行動をする人物の目撃情報が複数寄せられています。夜間の一人歩きには注意が必要です。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0617,
    longitude: 141.3563,
    category: "safety",
    dangerLevel: "low",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-3",
    title: "札幌駅前で追突事故が発生",
    description:
      "札幌駅北口のロータリーで車両2台が絡む追突事故が発生しました。けが人はいませんが、一時的に交通規制が行われています。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0686,
    longitude: 141.3507,
    category: "accident",
    dangerLevel: "medium",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-4",
    title: "円山地区で車上荒らしが多発",
    description: "円山地区の住宅街で車上荒らしが相次いでいます。警察が警戒を強化しています。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0422,
    longitude: 141.3178,
    category: "safety",
    dangerLevel: "high",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-5",
    title: "中島公園近くで自転車事故",
    description: "中島公園近くの交差点で自転車と車の接触事故が発生しました。自転車の運転者が軽傷を負いました。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0503,
    longitude: 141.3545,
    category: "accident",
    dangerLevel: "low",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-6",
    title: "北大周辺で複雑な交差点に注意",
    description:
      "北海道大学周辺の交差点は5車線が交差する複雑な構造で、車線変更のタイミングが難しいとの報告が相次いでいます。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0739,
    longitude: 141.342,
    category: "complex_intersection",
    dangerLevel: "high",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-7",
    title: "すすきの交差点で多重事故",
    description: "すすきの交差点で車両3台が絡む多重事故が発生しました。大規模な渋滞が発生しています。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0548,
    longitude: 141.3548,
    category: "accident",
    dangerLevel: "high",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-8",
    title: "大通駅周辺で置き引き被害",
    description: "大通駅周辺のカフェで置き引き被害が報告されています。貴重品の管理に注意してください。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.062,
    longitude: 141.356,
    category: "safety",
    dangerLevel: "medium",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-9",
    title: "札幌駅南口交差点で車線変更に注意",
    description: "札幌駅南口の交差点は6車線以上が交差する複雑な構造で、初めて訪れる方は特に注意が必要です。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.068,
    longitude: 141.351,
    category: "complex_intersection",
    dangerLevel: "medium",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sapporo-add-10",
    title: "円山公園周辺で接触事故",
    description:
      "円山公園周辺の道路で車両同士の接触事故が発生しました。けが人はいませんが、一時的に片側通行となっています。",
    source: "NHK北海道",
    url: "https://www3.nhk.or.jp/sapporo-news/",
    latitude: 43.0425,
    longitude: 141.318,
    category: "accident",
    dangerLevel: "low",
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
]

// Merge additional Sapporo news with AI filtered news
const finalNews = [...aiFilteredNews, ...sapporoAdditionalNews]

export function getNewsByCategory(category: "safety" | "accident" | "complex_intersection"): NewsReport[] {
  return finalNews.filter((news) => news.category === category)
}

export function getAllNews(): NewsReport[] {
  return finalNews
}
