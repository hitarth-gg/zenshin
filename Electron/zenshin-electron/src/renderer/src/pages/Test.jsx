import { DividerHorizontalIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@radix-ui/themes'
import { useState } from 'react'

function Test() {
  const data = {
    id: 269,
    idMal: 269,
    title: { romaji: 'BLEACH', english: 'Bleach', native: 'BLEACH', userPreferred: 'Bleach' },
    description:
      "Ichigo Kurosaki is a rather normal high school student apart from the fact he has the ability to see ghosts. This ability never impacted his life in a major way until the day he encounters the Shinigami Kuchiki Rukia, who saves him and his family's lives from a Hollow, a corrupt spirit that devours human souls. \n<br><br>\nWounded during the fight against the Hollow, Rukia chooses the only option available to defeat the monster and passes her Shinigami powers to Ichigo. Now forced to act as a substitute until Rukia recovers, Ichigo hunts down the Hollows that plague his town. \n\n\n",
    season: 'FALL',
    seasonYear: 2004,
    format: 'TV',
    status: 'FINISHED',
    episodes: 366,
    duration: 24,
    averageScore: 78,
    popularity: 376359,
    genres: ['Action', 'Adventure', 'Supernatural'],
    isFavourite: false,
    coverImage: {
      extraLarge:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-wc062RMqud8B.png',
      medium:
        'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx269-wc062RMqud8B.png',
      color: '#f1a150'
    },
    source: 'MANGA',
    countryOfOrigin: 'JP',
    isAdult: false,
    bannerImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/269-08ar2HJOUAuL.jpg',
    synonyms: ['ブリーチ', "'בליץ", 'เทพมรณะ', 'بليتش'],
    nextAiringEpisode: null,
    startDate: { year: 2004, month: 10, day: 5 },
    trailer: { id: '0c4IoCA5fY0', site: 'youtube' },
    streamingEpisodes: [
      {
        title: 'Episode 1 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire3-tmb/3873f2dbcef91cf5919ec90176d4f7611279747858_full.jpg'
      },
      {
        title: 'Episode 2 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire1-tmb/e0ae548ed0fc96568a217e49d41dc4801279757208_full.jpg'
      },
      {
        title: 'Episode 3 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire3-tmb/0a1ea978f1279da4a07074420a77b7891279764550_full.jpg'
      },
      {
        title: 'Episode 4 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire2-tmb/7cd5fc1235f641294007b0b84765fd971279770807_full.jpg'
      },
      {
        title: 'Episode 5 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire1-tmb/f414fcce81a5735aca37b0db8e65a52f1279776673_full.jpg'
      },
      {
        title: 'Episode 6 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire3-tmb/4f2269e9d9829e0f8316e385dc1a7b2f1279782598_full.jpg'
      },
      {
        title: 'Episode 7 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire3-tmb/e2a93f5105ec79a675b597ab5860a3bb1279789747_full.jpg'
      },
      {
        title: 'Episode 8 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire1-tmb/b20f4aadcfb1f7821d4f47ab91432d3b1279794264_full.jpg'
      },
      {
        title: 'Episode 9 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire2-tmb/e111417107694e9b0bdb34ab5e6fc32c1279798939_full.jpg'
      },
      {
        title: 'Episode 10 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire2-tmb/92004cc0fa9f07bdce107ff0af762af41279741437_full.jpg'
      },
      {
        title: 'Episode 11 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire4-tmb/0c58299f9db287a925a428c64db90dcf1279741180_full.jpg'
      },
      {
        title: 'Episode 12 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire3-tmb/3822ad302d17b09643a83243762a1cfb1279741190_full.jpg'
      },
      {
        title: 'Episode 13 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire3-tmb/f0a948da54bd85354f08ccb57eaf20141279743393_full.jpg'
      },
      {
        title: 'Episode 14 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire2-tmb/4b5fdd73a9fc65302c8f21e29a9446d31279743219_full.jpg'
      },
      {
        title: 'Episode 15 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire1-tmb/4a7603eca3b0c5f3b7fb4bdb5a8c9f361279745510_full.jpg'
      },
      {
        title: 'Episode 16 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire4-tmb/9c5dd7f0e0b9596e939e21eb418442131279744481_full.jpg'
      },
      {
        title: 'Episode 17 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire2-tmb/a4c7fcdd501afccce947682f60d70bcb1279745630_full.jpg'
      },
      {
        title: 'Episode 18 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire4-tmb/058d765fbd994ac9ae76d098455dd6b91279744346_full.jpg'
      },
      {
        title: 'Episode 19 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire1-tmb/22fd939ffe605c413188dd2fb0e3099f1279747741_full.jpg'
      },
      {
        title: 'Episode 20 - Untitled',
        thumbnail:
          'https://img1.ak.crunchyroll.com/i/spire1-tmb/8724eab72832289570eb6dc1cb1ec5f51279748903_full.jpg'
      }
    ],
    mediaListEntry: {
      id: 421329431,
      progress: 3,
      repeat: 0,
      status: 'CURRENT',
      customLists: [{ name: 'Watched using Miru', enabled: false }],
      score: 0
    },
    studios: {
      nodes: [
        { name: 'Studio Pierrot' },
        { name: 'TV Tokyo' },
        { name: 'Dentsu' },
        { name: 'Viz Media' }
      ]
    },
    airingSchedule: { nodes: [] },
    relations: {
      edges: [
        {
          relationType: 'SOURCE',
          node: {
            id: 30012,
            title: { userPreferred: 'Bleach' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/manga/cover/small/bx30012-z7U138mUaPdN.png'
            },
            type: 'MANGA',
            status: 'FINISHED',
            format: 'MANGA',
            episodes: null,
            synonyms: ['ブリーチ', 'بلیچ', 'سفید کننده', '死神', '블리치'],
            season: null,
            seasonYear: null,
            startDate: { year: 2001, month: 8, day: 7 },
            endDate: { year: 2016, month: 8, day: 23 }
          }
        },
        {
          relationType: 'SIDE_STORY',
          node: {
            id: 834,
            title: { userPreferred: 'BLEACH: The Sealed Sword Frenzy' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx834-Wm0msxVlJnkT.png'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'SPECIAL',
            episodes: 1,
            synonyms: ['Bleach: Jump Festa 2005'],
            season: 'SPRING',
            seasonYear: 2006,
            startDate: { year: 2006, month: 3, day: 23 },
            endDate: { year: 2006, month: 3, day: 23 }
          }
        },
        {
          relationType: 'SIDE_STORY',
          node: {
            id: 1686,
            title: { userPreferred: 'Bleach the Movie: Memories of Nobody' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx1686-oZQepxP4SRQ2.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'MOVIE',
            episodes: 1,
            synonyms: ['Bleach Movie 1', 'بليتش: ذكريات اللا أحد'],
            season: 'FALL',
            seasonYear: 2006,
            startDate: { year: 2006, month: 12, day: 16 },
            endDate: { year: 2006, month: 12, day: 16 }
          }
        },
        {
          relationType: 'SIDE_STORY',
          node: {
            id: 2889,
            title: { userPreferred: 'Bleach the Movie: The DiamondDust Rebellion' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx2889-AmnSwChuAuGT.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'MOVIE',
            episodes: 1,
            synonyms: [
              'Bleach Movie 2',
              'Bleach: The Diamond Dust Rebellion - Another Hyourinmaru',
              'بليتش: تمرد غبار الماس',
              'Bleach: The Movie 2: The DiamondDust Rebellion '
            ],
            season: 'FALL',
            seasonYear: 2007,
            startDate: { year: 2007, month: 12, day: 22 },
            endDate: { year: 2007, month: 12, day: 22 }
          }
        },
        {
          relationType: 'SIDE_STORY',
          node: {
            id: 4835,
            title: { userPreferred: 'Bleach the Movie: Fade to Black' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx4835-UqbwERH407BB.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'MOVIE',
            episodes: 1,
            synonyms: [
              'Bleach Movie 3',
              'Bleach: Fade to Black - I Call Your Name',
              'بليتش: التلاشي إلى الأسود'
            ],
            season: 'FALL',
            seasonYear: 2008,
            startDate: { year: 2008, month: 12, day: 13 },
            endDate: { year: 2008, month: 12, day: 13 }
          }
        },
        {
          relationType: 'SIDE_STORY',
          node: {
            id: 8247,
            title: { userPreferred: 'Bleach the Movie: Hell Verse' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx8247-VppsQKlgXoXr.png'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'MOVIE',
            episodes: 1,
            synonyms: ['Bleach Movie 4', 'Bleach: The Hell Chapter', 'بليتش: قصيدة الجحيم'],
            season: 'FALL',
            seasonYear: 2010,
            startDate: { year: 2010, month: 12, day: 4 },
            endDate: { year: 2010, month: 12, day: 4 }
          }
        },
        {
          relationType: 'SIDE_STORY',
          node: {
            id: 100719,
            title: { userPreferred: 'BLEACH Colorful!: Gotei Juusan Yatai Daisakusen!' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx100719-zujHjeEBqmo7.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'OVA',
            episodes: 1,
            synonyms: [
              'Bleach: Jump Festa 2008',
              'Bleach KaraBuri!: Gotei Juusan Yatai Daisakusen!'
            ],
            season: 'FALL',
            seasonYear: 2008,
            startDate: { year: 2008, month: 9, day: 21 },
            endDate: { year: 2008, month: 9, day: 21 }
          }
        },
        {
          relationType: 'SEQUEL',
          node: {
            id: 116674,
            title: { userPreferred: 'BLEACH: Thousand-Year Blood War' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116674-p3zK4PUX2Aag.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'TV',
            episodes: 13,
            synonyms: ['بليتش: حرب الألف سنة الدموية', 'Bleach: La guerre sanglante de mille ans'],
            season: 'FALL',
            seasonYear: 2022,
            startDate: { year: 2022, month: 10, day: 11 },
            endDate: { year: 2022, month: 12, day: 27 }
          }
        },
        {
          relationType: 'OTHER',
          node: {
            id: 116673,
            title: { userPreferred: 'BURN THE WITCH' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx116673-cy4sgiliurpR.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'ONA',
            episodes: 3,
            synonyms: [],
            season: 'FALL',
            seasonYear: 2020,
            startDate: { year: 2020, month: 10, day: 2 },
            endDate: { year: 2020, month: 10, day: 2 }
          }
        },
        {
          relationType: 'ALTERNATIVE',
          node: {
            id: 154037,
            title: { userPreferred: 'BLEACH: memories in the rain' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/b154037-7VSs4aDUL2ZG.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'SPECIAL',
            episodes: 1,
            synonyms: ['Bleach: Jump Festa 2004', 'ブリーチ Memories in the Rain'],
            season: 'FALL',
            seasonYear: 2004,
            startDate: { year: 2004, month: 12, day: 18 },
            endDate: { year: 2004, month: 12, day: 18 }
          }
        },
        {
          relationType: 'OTHER',
          node: {
            id: 182561,
            title: { userPreferred: 'BLEACH 20th Anime Anniversary Official Trailer' },
            coverImage: {
              medium:
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx182561-lJDC9FT3jBhL.jpg'
            },
            type: 'ANIME',
            status: 'FINISHED',
            format: 'SPECIAL',
            episodes: 1,
            synonyms: [
              'BLEACH 𝟐𝟎𝐭𝐡 𝐀𝐧𝐧𝐢𝐯𝐞𝐫𝐬𝐚𝐫𝐲',
              'BLEACH 20周年 PV',
              'ブリーチ 20th PV',
              'BLEACH animation 20th'
            ],
            season: null,
            seasonYear: null,
            startDate: { year: 2024, month: 10, day: 5 },
            endDate: { year: 2024, month: 10, day: 5 }
          }
        }
      ]
    }
  }

  const [imageIsLoading, setImageIsLoading] = useState(true)

  return (
    <div className="grid animate-fade grid-cols-4">
      {[data, data, data, data].map((data) => (
        <div className="mx-auto" key={Math.random}>
          <div className="m-4 flex aspect-[10/5] w-fit animate-fade cursor-pointer flex-col items-center justify-center gap-y-2 font-space-mono">
            {/* <img src={data.coverImage.extraLarge} alt="" /> */}
            <div className="h-42 relative aspect-[10/5] overflow-hidden transition-all ease-in-out hover:scale-110">
              <div className="relative flex aspect-[10/5] h-full">
                {true && (
                  <Skeleton className="duration-400 absolute flex-grow rounded-sm transition-all ease-in-out" />
                )}
                <img
                  src={data.coverImage.extraLarge || data.coverImage.medium}
                  alt=""
                  className="duration-400 z-0 w-44 animate-fade rounded-sm object-cover transition-all ease-in-out"
                />
                <div className="relative">
                  <div className="absolute z-10 w-full px-2 py-1 tracking-wider">
                    <div className="line-clamp-1">
                      {data?.title?.romaji} • {data?.title?.native}
                    </div>
                    <div className="line-clamp-1 w-full border-b border-[#ffffff50] pb-1 text-sm opacity-80">
                      {data?.title?.english}
                    </div>
                    <div className="line-clamp-1 w-full border-b border-[#ffffff50] py-1 text-sm opacity-80">
                      Episode: {data?.mediaListEntry?.progress} / {data?.episodes}
                    </div>
                  </div>
                  <img
                    src={data.bannerImage || data.coverImage.extraLarge}
                    className="duration-400 aspect-[10/5] h-full w-max scale-105 animate-fade overflow-hidden rounded-sm object-cover blur-sm brightness-[0.2] transition-all ease-in-out"
                    onLoad={() => setImageIsLoading(false)}
                    onError={() => setImageIsLoading(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Test
