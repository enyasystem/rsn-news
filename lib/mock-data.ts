// Mock data for development purposes
// In a real application, this would come from an API or database

export const mockLatestNews = [
  {
    id: 1,
    title: "Federal Government Announces New Economic Policy to Boost Growth",
    slug: "federal-government-announces-new-economic-policy",
    excerpt:
      "The Federal Government has unveiled a comprehensive economic policy aimed at stimulating growth and creating jobs across various sectors.",
    content: "",
    imageUrl: "/placeholder.svg?height=450&width=800",
    category: "Politics",
    source: "Punch",
    publishedAt: "2025-05-04T10:30:00Z",
    tags: ["economy", "federal government", "policy"],
  },
  {
    id: 2,
    title: "Super Eagles Prepare for World Cup Qualifier Against Ghana",
    slug: "super-eagles-prepare-for-world-cup-qualifier",
    excerpt:
      "Nigeria's national football team, the Super Eagles, are intensifying preparations ahead of their crucial World Cup qualifier against Ghana.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Sports",
    source: "Vanguard",
    publishedAt: "2025-05-04T08:15:00Z",
    tags: ["super eagles", "football", "world cup"],
  },
  {
    id: 3,
    title: "Lagos State Launches New Transportation Initiative",
    slug: "lagos-state-launches-new-transportation-initiative",
    excerpt:
      "Lagos State Government has launched a new transportation initiative aimed at easing traffic congestion in the metropolitan area.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Politics",
    source: "Guardian",
    publishedAt: "2025-05-03T16:45:00Z",
    tags: ["lagos", "transportation", "traffic"],
  },
  {
    id: 4,
    title: "Nigerian Tech Startup Secures $10 Million in Funding",
    slug: "nigerian-tech-startup-secures-funding",
    excerpt:
      "A Lagos-based fintech startup has secured $10 million in Series A funding to expand its operations across Africa.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Technology",
    source: "TechCabal",
    publishedAt: "2025-05-03T14:20:00Z",
    tags: ["tech", "startup", "funding"],
  },
  {
    id: 5,
    title: "Nollywood Film Wins Award at International Festival",
    slug: "nollywood-film-wins-award-at-international-festival",
    excerpt:
      "A Nigerian film has won the Best Feature Film award at a prestigious international film festival, putting Nollywood in the global spotlight.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Entertainment",
    source: "Channels TV",
    publishedAt: "2025-05-02T19:10:00Z",
    tags: ["nollywood", "film", "award"],
  },
]

export const mockCategoryNews = [
  // Politics
  {
    id: 101,
    title: "President to Address Nation on Security Challenges",
    slug: "president-to-address-nation-on-security",
    excerpt:
      "The President is scheduled to address the nation tonight on the current security challenges facing the country.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Politics",
    source: "Guardian",
    publishedAt: "2025-05-04T12:00:00Z",
    tags: ["president", "security", "address"],
  },
  {
    id: 102,
    title: "National Assembly Passes New Electoral Reform Bill",
    slug: "national-assembly-passes-electoral-reform-bill",
    excerpt:
      "The National Assembly has passed a new electoral reform bill aimed at improving the electoral process in the country.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Politics",
    source: "Punch",
    publishedAt: "2025-05-03T09:30:00Z",
    tags: ["national assembly", "electoral reform", "bill"],
  },
  {
    id: 103,
    title: "Opposition Party Criticizes Government's Economic Policies",
    slug: "opposition-party-criticizes-government-economic-policies",
    excerpt:
      "The main opposition party has criticized the government's economic policies, calling them ineffective and detrimental to the country's growth.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Politics",
    source: "Vanguard",
    publishedAt: "2025-05-02T14:45:00Z",
    tags: ["opposition", "economic policy", "criticism"],
  },

  // Sports
  {
    id: 201,
    title: "Nigerian Athlete Breaks Olympic Record",
    slug: "nigerian-athlete-breaks-olympic-record",
    excerpt: "A Nigerian athlete has broken the Olympic record in the 100m sprint, bringing glory to the nation.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Sports",
    source: "Channels TV",
    publishedAt: "2025-05-04T11:15:00Z",
    tags: ["olympics", "athletics", "record"],
  },
  {
    id: 202,
    title: "Local Football League Announces New Season Schedule",
    slug: "local-football-league-announces-new-season",
    excerpt:
      "The Nigerian Professional Football League has announced the schedule for the upcoming season, with matches set to begin next month.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Sports",
    source: "Guardian",
    publishedAt: "2025-05-03T10:20:00Z",
    tags: ["football", "league", "schedule"],
  },
  {
    id: 203,
    title: "Basketball Star Signs with International Team",
    slug: "basketball-star-signs-with-international-team",
    excerpt:
      "A Nigerian basketball star has signed a lucrative contract with a top international team, marking a significant milestone in their career.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Sports",
    source: "Punch",
    publishedAt: "2025-05-02T16:30:00Z",
    tags: ["basketball", "contract", "international"],
  },

  // Entertainment
  {
    id: 301,
    title: "Popular Nigerian Artist Announces World Tour",
    slug: "popular-nigerian-artist-announces-world-tour",
    excerpt:
      "A chart-topping Nigerian artist has announced a world tour, with performances scheduled across Africa, Europe, and North America.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Entertainment",
    source: "Vanguard",
    publishedAt: "2025-05-04T13:45:00Z",
    tags: ["music", "tour", "artist"],
  },
  {
    id: 302,
    title: "New Nollywood Movie Breaks Box Office Records",
    slug: "new-nollywood-movie-breaks-box-office-records",
    excerpt:
      "A newly released Nollywood movie has broken box office records, becoming the highest-grossing Nigerian film of all time.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Entertainment",
    source: "Channels TV",
    publishedAt: "2025-05-03T15:10:00Z",
    tags: ["nollywood", "box office", "film"],
  },
  {
    id: 303,
    title: "Celebrity Couple Announces Engagement",
    slug: "celebrity-couple-announces-engagement",
    excerpt:
      "A popular Nigerian celebrity couple has announced their engagement, with the wedding expected to be one of the biggest events of the year.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Entertainment",
    source: "Punch",
    publishedAt: "2025-05-02T18:20:00Z",
    tags: ["celebrity", "engagement", "wedding"],
  },
]

export const mockTrendingNews = [
  {
    id: 401,
    title: "Fuel Prices to Decrease Following Government Intervention",
    slug: "fuel-prices-to-decrease-following-government-intervention",
    excerpt:
      "The government has announced measures to reduce fuel prices, bringing relief to citizens across the country.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Business",
    source: "Guardian",
    publishedAt: "2025-05-04T09:00:00Z",
    tags: ["fuel", "prices", "government"],
  },
  {
    id: 402,
    title: "Major Bank Announces Merger with International Financial Institution",
    slug: "major-bank-announces-merger-with-international-institution",
    excerpt:
      "One of Nigeria's largest banks has announced a merger with an international financial institution, creating a banking powerhouse.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Business",
    source: "Vanguard",
    publishedAt: "2025-05-03T11:30:00Z",
    tags: ["bank", "merger", "finance"],
  },
  {
    id: 403,
    title: "Health Ministry Issues Advisory on New Virus Strain",
    slug: "health-ministry-issues-advisory-on-new-virus-strain",
    excerpt:
      "The Ministry of Health has issued an advisory regarding a new virus strain, urging citizens to take necessary precautions.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Health",
    source: "Punch",
    publishedAt: "2025-05-03T08:45:00Z",
    tags: ["health", "virus", "advisory"],
  },
  {
    id: 404,
    title: "Education Reform: New Curriculum to be Implemented in Schools",
    slug: "education-reform-new-curriculum-to-be-implemented",
    excerpt:
      "The Ministry of Education has announced a new curriculum to be implemented in schools nationwide, focusing on digital skills and critical thinking.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Education",
    source: "Channels TV",
    publishedAt: "2025-05-02T13:15:00Z",
    tags: ["education", "curriculum", "reform"],
  },
  {
    id: 405,
    title: "Weather Alert: Heavy Rainfall Expected in Southern States",
    slug: "weather-alert-heavy-rainfall-expected-in-southern-states",
    excerpt:
      "The Meteorological Agency has issued a weather alert, warning of heavy rainfall in southern states over the coming days.",
    content: "",
    imageUrl: "/placeholder.svg?height=225&width=400",
    category: "Weather",
    source: "Guardian",
    publishedAt: "2025-05-02T10:00:00Z",
    tags: ["weather", "rainfall", "alert"],
  },
]
